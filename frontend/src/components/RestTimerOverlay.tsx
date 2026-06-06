import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SkipForward, Plus, Timer } from "lucide-react";
import { useApp } from "@/lib/store";
import { useColors } from "@/hooks/useColors";
import type { Exercise } from "@/lib/mock-data";

function playRestDoneSound() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  } catch {
    // Audio context may fail silently
  }
}

type RestTimerOverlayProps = {
  nextExercise?: Exercise | null;
  nextSetInfo?: string;
};

export function RestTimerOverlay({ nextExercise, nextSetInfo }: RestTimerOverlayProps) {
  const c = useColors();
  const { isResting, restSecondsRemaining, restTotalSeconds } = useApp((s) => s.workoutSession);
  const tickRestTimer = useApp((s) => s.tickRestTimer);
  const endRest = useApp((s) => s.endRest);
  const setRestTimer = useApp((s) => s.setRestTimer);
  const timerRef = useRef<number | null>(null);
  const hasPlayedSound = useRef(false);

  useEffect(() => {
    if (!isResting) {
      hasPlayedSound.current = false;
      return;
    }

    timerRef.current = window.setInterval(() => {
      tickRestTimer();
    }, 1000);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [isResting, tickRestTimer]);

  // Play sound & vibrate when timer reaches 0
  useEffect(() => {
    if (restSecondsRemaining === 0 && isResting === false && !hasPlayedSound.current) {
      hasPlayedSound.current = true;
      playRestDoneSound();
      if ("vibrate" in navigator) navigator.vibrate([200, 100, 200]);
    }
  }, [restSecondsRemaining, isResting]);

  const handleSkip = useCallback(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    endRest();
  }, [endRest]);

  const handleAdd30 = useCallback(() => {
    const newTotal = restSecondsRemaining + 30;
    // We need to set the timer with increased seconds
    // But we don't want to reset total — let's manually update
    setRestTimer(newTotal);
  }, [restSecondsRemaining, setRestTimer]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Ring specs
  const svgSize = 160;
  const r = 70;
  const circ = 2 * Math.PI * r;
  const progress = restTotalSeconds > 0 ? restSecondsRemaining / restTotalSeconds : 0;
  const dashoffset = circ * (1 - progress);

  return (
    <AnimatePresence>
      {isResting && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
          style={{
            background: c.isDark
              ? "oklch(0.32 0.072 175 / 0.92)"
              : "oklch(0.55 0.06 175 / 0.92)",
            backdropFilter: "blur(32px) saturate(150%)",
            WebkitBackdropFilter: "blur(32px) saturate(150%)",
          }}
        >
          {/* Header */}
          <div className="w-full max-w-sm flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Timer size={18} style={{ color: "rgba(255,255,255,0.7)" }} />
              <span
                className="text-sm font-bold uppercase tracking-wider"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                Rest
              </span>
            </div>
            <button
              onClick={handleSkip}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all active:scale-95"
              style={{
                color: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              Skip <SkipForward size={14} />
            </button>
          </div>

          {/* Ring + countdown */}
          <div className="relative grid place-items-center mb-8" style={{ width: svgSize, height: svgSize }}>
            <svg
              className="-rotate-90 absolute inset-0"
              viewBox={`0 0 ${svgSize} ${svgSize}`}
              width={svgSize}
              height={svgSize}
            >
              {/* Track */}
              <circle
                cx={svgSize / 2}
                cy={svgSize / 2}
                r={r}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={8}
                fill="none"
              />
              {/* Progress */}
              <circle
                cx={svgSize / 2}
                cy={svgSize / 2}
                r={r}
                stroke="white"
                strokeWidth={8}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={dashoffset}
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <span
              className="text-[52px] font-extrabold tabular-nums tracking-tight"
              style={{ color: "white", fontFamily: "var(--font-sans)" }}
            >
              {formatTime(restSecondsRemaining)}
            </span>
          </div>

          {/* Next up info */}
          {(nextExercise || nextSetInfo) && (
            <div className="text-center mb-8">
              <div
                className="text-xs uppercase tracking-widest font-bold mb-1"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Next up
              </div>
              <div className="text-xl font-extrabold" style={{ color: "white" }}>
                {nextSetInfo || nextExercise?.name || "Finish"}
              </div>
              {nextExercise && !nextSetInfo && (
                <div className="text-sm font-medium mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {nextExercise.sets} sets × {nextExercise.reps} reps
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 w-full max-w-sm">
            <button
              onClick={handleAdd30}
              className="flex-1 h-12 rounded-full flex items-center justify-center gap-2 text-sm font-bold transition-all active:scale-95"
              style={{
                color: "rgba(255,255,255,0.85)",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              <Plus size={16} /> Add 30s
            </button>
            <button
              onClick={handleSkip}
              className="flex-1 h-12 rounded-full flex items-center justify-center gap-2 text-sm font-bold transition-all active:scale-95"
              style={{
                color: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              Skip rest <SkipForward size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
