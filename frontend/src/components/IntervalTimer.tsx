import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { useApp } from "@/lib/store";
import { useColors } from "@/hooks/useColors";
import type { Exercise } from "@/lib/mock-data";

type IntervalTimerProps = {
  exercise: Exercise;
  onComplete: () => void;
};

export function IntervalTimer({ exercise, onComplete }: IntervalTimerProps) {
  const c = useColors();
  const { intervalPhase, intervalSecondsRemaining, intervalCurrentRound } = useApp(
    (s) => s.workoutSession,
  );
  const startIntervalRound = useApp((s) => s.startIntervalRound);
  const setIntervalPhase = useApp((s) => s.setIntervalPhase);
  const tickIntervalTimer = useApp((s) => s.tickIntervalTimer);
  const logRpe = useApp((s) => s.logRpe);

  const [isActive, setIsActive] = useState(false);
  const [showRpe, setShowRpe] = useState(false);
  const timerRef = useRef<number | null>(null);

  const totalRounds = exercise.intervalRounds || 1;
  const workSec = exercise.workSeconds || 30;
  const restSec = exercise.restSeconds || 15;

  useEffect(() => {
    startIntervalRound(exercise.id, workSec);
    setIsActive(false);
    setShowRpe(false);
  }, [exercise.id, workSec, startIntervalRound]);

  useEffect(() => {
    if (isActive && intervalPhase && intervalSecondsRemaining > 0) {
      timerRef.current = window.setInterval(() => {
        tickIntervalTimer();
      }, 1000);
    } else if (intervalSecondsRemaining === 0 && isActive && intervalPhase) {
      if ("vibrate" in navigator) navigator.vibrate([200, 100, 200]);

      if (intervalPhase === "work") {
        if (intervalCurrentRound >= totalRounds) {
          // Done with all rounds
          setIsActive(false);
          setShowRpe(true);
        } else {
          // Move to rest
          setIntervalPhase("rest", restSec, intervalCurrentRound);
        }
      } else {
        // Move to next work round
        setIntervalPhase("work", workSec, intervalCurrentRound + 1);
      }
    }

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [
    isActive,
    intervalPhase,
    intervalSecondsRemaining,
    tickIntervalTimer,
    intervalCurrentRound,
    totalRounds,
    workSec,
    restSec,
    setIntervalPhase,
  ]);

  const toggle = () => {
    if (!showRpe) setIsActive(!isActive);
  };

  const currentTotal = intervalPhase === "work" ? workSec : restSec;
  const progress = currentTotal > 0 ? intervalSecondsRemaining / currentTotal : 0;

  const svgSize = 160;
  const r = 70;
  const circ = 2 * Math.PI * r;
  const dashoffset = circ * (1 - progress);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m > 0 ? m + ":" : ""}${m > 0 ? s.toString().padStart(2, "0") : s}`;
  };

  const handleRpeSelect = (rpe: number) => {
    logRpe(exercise.id, rpe);
    onComplete();
  };

  return (
    <div className="flex flex-col items-center py-2">
      <AnimatePresence mode="wait">
        {!showRpe ? (
          <motion.div
            key="timer"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className="flex flex-col items-center w-full"
          >
            {/* Phase Badge */}
            <div className="h-8 mb-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={intervalPhase || "none"}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="tag-pill-dark uppercase tracking-wider shadow-md"
                  style={{
                    background: intervalPhase === "work" ? c.sunGlareBg : c.exuberantBg,
                    color: intervalPhase === "work" ? c.sunGlare : c.exuberant,
                    border: `1px solid ${intervalPhase === "work" ? c.sunGlare : c.exuberant}40`,
                  }}
                >
                  {intervalPhase === "work" ? "WORK" : intervalPhase === "rest" ? "REST" : "READY"}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Ring + countdown */}
            <div
              className="relative grid place-items-center mb-5"
              style={{ width: svgSize, height: svgSize }}
            >
              <svg
                className="-rotate-90 absolute inset-0"
                viewBox={`0 0 ${svgSize} ${svgSize}`}
                width={svgSize}
                height={svgSize}
              >
                <circle
                  cx={svgSize / 2}
                  cy={svgSize / 2}
                  r={r}
                  stroke={c.chipBorder}
                  strokeWidth={8}
                  fill="none"
                />
                <circle
                  cx={svgSize / 2}
                  cy={svgSize / 2}
                  r={r}
                  stroke={intervalPhase === "work" ? c.sunGlare : c.exuberant}
                  strokeWidth={8}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circ}
                  strokeDashoffset={dashoffset}
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
              </svg>
              <span
                className="text-[48px] font-extrabold tabular-nums tracking-tight"
                style={{ color: c.textPrimary, fontFamily: "var(--font-sans)" }}
              >
                {formatTime(intervalSecondsRemaining)}
              </span>
            </div>

            <div className="text-sm font-bold mb-6" style={{ color: c.textTertiary }}>
              Round {intervalCurrentRound} / {totalRounds}
            </div>

            <button
              onClick={toggle}
              className="w-full max-w-[200px] h-14 rounded-full flex items-center justify-center gap-2 text-[15px] font-bold transition-all active:scale-95"
              style={{
                background: isActive ? c.chipBg : c.sunGlare,
                color: isActive ? c.textPrimary : "#1C1C1A",
                border: isActive ? `1px solid ${c.chipBorder}` : "none",
                boxShadow: isActive ? "none" : `0 0 24px ${c.sunGlareBg}`,
              }}
            >
              {isActive ? (
                <>
                  <Pause size={18} /> Pause
                </>
              ) : (
                <>
                  <Play size={18} /> Start
                </>
              )}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="rpe"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center w-full py-4"
          >
            <h3 className="text-xl font-extrabold mb-1 text-center">How did that feel?</h3>
            <p className="text-sm font-medium mb-6 text-center" style={{ color: c.textSecondary }}>
              Rate your exertion
            </p>

            <div className="flex gap-2 w-full max-w-[280px] mb-8">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => handleRpeSelect(val)}
                  className="flex-1 aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-90"
                  style={{
                    background: c.chipBg,
                    border: `1px solid ${c.chipBorder}`,
                    color: c.textPrimary,
                  }}
                >
                  <span className="text-lg font-bold">{val}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
