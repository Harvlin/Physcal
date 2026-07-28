import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useColors } from "@/hooks/useColors";
import { Timer, RotateCcw } from "lucide-react";

function useReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const REP_TARGET = 6;

function RepDemo({ c }: { c: ReturnType<typeof useColors> }) {
  const [count, setCount] = useState(0);
  const done = count >= REP_TARGET;
  const reduced = useReducedMotion();

  return (
    <div className="flex flex-col items-center">
      {/* Tap counter */}
      <motion.button
        whileTap={reduced ? {} : { scale: 0.92 }}
        onClick={() => !done && setCount((n) => n + 1)}
        className="w-32 h-32 rounded-full grid place-items-center border-4 relative mb-3 transition-colors select-none"
        style={{
          borderColor: done ? c.sunGlare : c.chipBorder,
          background: done ? c.sunGlareBg : c.chipBg,
          cursor: done ? "default" : "pointer",
        }}
        aria-label="Tap to count rep"
      >
        {/* Pulse ring on done */}
        {done && !reduced && (
          <motion.div
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: c.sunGlare }}
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1.35, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        )}
        <div className="text-center">
          <div
            className="font-black leading-none tabular-nums"
            style={{ fontSize: 52, color: done ? c.sunGlare : c.textPrimary }}
          >
            {count}
          </div>
          <div className="text-xs font-bold mt-1 uppercase tracking-wider" style={{ color: c.textTertiary }}>
            / {REP_TARGET} reps
          </div>
        </div>
      </motion.button>

      <AnimatePresence>
        {!done ? (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-xs font-medium" style={{ color: c.textTertiary }}
          >
            Tap the circle to count each rep
          </motion.p>
        ) : (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-2"
          >
            <p className="text-sm font-bold" style={{ color: c.sunGlare }}>Set complete! 🎉</p>
            <button
              onClick={() => setCount(0)}
              className="flex items-center gap-1.5 text-xs font-medium transition-colors"
              style={{ color: c.textTertiary }}
              onMouseEnter={(e) => (e.currentTarget.style.color = c.textPrimary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = c.textTertiary)}
            >
              <RotateCcw size={11} /> Try again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function IntervalPreview({ c }: { c: ReturnType<typeof useColors> }) {
  return (
    <div
      className="rounded-2xl p-4 flex items-center gap-4"
      style={{ background: c.chipBg, border: `1px solid ${c.chipBorder}` }}
    >
      <div
        className="w-12 h-12 rounded-full grid place-items-center shrink-0"
        style={{ background: c.exuberantBg, border: `2px solid ${c.exuberant}44` }}
      >
        <Timer size={20} style={{ color: c.exuberant }} />
      </div>
      <div>
        <div className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: c.exuberant }}>
          Work · 0:30
        </div>
        <div className="font-bold text-sm" style={{ color: c.textPrimary }}>Lateral Shuttle Run</div>
        <div className="text-xs font-medium" style={{ color: c.textTertiary }}>2 rounds · 30s on / 30s rest</div>
      </div>
    </div>
  );
}

export function Slide04FocusMode() {
  const c = useColors();

  return (
    <div className="px-5 py-8 max-w-lg mx-auto">
      <p className="text-xs font-bold uppercase tracking-[0.18em] mb-2" style={{ color: c.sunGlare }}>
        Focus Mode
      </p>
      <h2 className="text-2xl font-black mb-1" style={{ color: c.textPrimary }}>
        Train however the exercise fits.
      </h2>
      <p className="text-sm font-medium mb-6 leading-relaxed" style={{ color: c.textSecondary }}>
        Not everything is sets-and-reps. Physcal supports rep counting, timed holds, work/rest 
        intervals, and distance — each tracked exactly the right way.
      </p>

      {/* Rep counter demo */}
      <div className="card-frosted p-5 mb-4">
        <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: c.textTertiary }}>
          Rep mode — Goblet Squat · Set 1 of 3
        </p>
        <RepDemo c={c} />
      </div>

      {/* Interval preview */}
      <div className="mb-2">
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: c.textTertiary }}>
          Interval mode — also built in
        </p>
        <IntervalPreview c={c} />
      </div>

      <p className="text-xs font-medium mt-3 leading-relaxed" style={{ color: c.textTertiary }}>
        Hold mode and distance mode also exist — for planks, jogs, and other time-or-space-based exercises.
      </p>
    </div>
  );
}
