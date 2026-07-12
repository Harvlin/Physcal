import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Check } from "lucide-react";
import { useApp } from "@/lib/store";
import { useColors } from "@/hooks/useColors";
import type { Exercise } from "@/lib/mock-data";

type HoldTimerProps = {
  exercise: Exercise;
  onDone: () => void;
};

export function HoldTimer({ exercise, onDone }: HoldTimerProps) {
  const c = useColors();
  const { holdSecondsRemaining } = useApp((s) => s.workoutSession);
  const startHold = useApp((s) => s.startHold);
  const tickHoldTimer = useApp((s) => s.tickHoldTimer);

  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<number | null>(null);

  const totalSeconds = exercise.reps; // Using reps field conceptually as seconds per hold

  useEffect(() => {
    startHold(exercise.id, totalSeconds);
    setIsActive(false);
  }, [exercise.id, totalSeconds, startHold]);

  useEffect(() => {
    if (isActive && holdSecondsRemaining > 0) {
      timerRef.current = window.setInterval(() => {
        tickHoldTimer();
      }, 1000);
    } else if (holdSecondsRemaining === 0 && isActive) {
      setIsActive(false);
      if ("vibrate" in navigator) navigator.vibrate([200, 100, 200]);
    }

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [isActive, holdSecondsRemaining, tickHoldTimer]);

  const toggle = () => {
    if (holdSecondsRemaining > 0) {
      setIsActive(!isActive);
    }
  };

  const svgSize = 160;
  const r = 70;
  const circ = 2 * Math.PI * r;
  const progress = totalSeconds > 0 ? holdSecondsRemaining / totalSeconds : 0;
  const dashoffset = circ * (1 - progress);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m > 0 ? m + ":" : ""}${m > 0 ? s.toString().padStart(2, "0") : s}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center py-4"
    >
      {/* Ring + countdown */}
      <div
        className="relative grid place-items-center mb-6"
        style={{ width: svgSize, height: svgSize }}
      >
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
            stroke={c.chipBorder}
            strokeWidth={8}
            fill="none"
          />
          {/* Progress */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={r}
            stroke={c.violet}
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
          {formatTime(holdSecondsRemaining)}
        </span>
      </div>

      <div className="flex items-center gap-3 w-full max-w-[260px]">
        <button
          onClick={toggle}
          className="flex-1 h-12 rounded-full flex items-center justify-center gap-2 text-sm font-bold transition-all active:scale-95"
          style={{
            background: c.chipBg,
            border: `1px solid ${c.chipBorder}`,
            color: c.textPrimary,
          }}
        >
          {isActive ? (
            <>
              <Pause size={16} /> Pause
            </>
          ) : (
            <>
              <Play size={16} />{" "}
              {holdSecondsRemaining < totalSeconds && holdSecondsRemaining > 0 ? "Resume" : "Start"}
            </>
          )}
        </button>
        <button
          onClick={onDone}
          className="flex-1 h-12 rounded-full flex items-center justify-center gap-2 text-sm font-bold transition-all active:scale-95"
          style={{ background: c.violet, color: "#F2F0E9" }}
        >
          <Check size={16} strokeWidth={2.5} /> Done
        </button>
      </div>
    </motion.div>
  );
}
