import { useState } from "react";
import { CircularScore } from "@/components/CircularScore";
import { motion, AnimatePresence } from "framer-motion";
import { useColors } from "@/hooks/useColors";
import { Video, CheckCircle, AlertCircle } from "lucide-react";

function useReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const METRICS = [
  { label: "Knee depth", value: "94°", status: "good" as const, note: "Good depth achieved" },
  { label: "Knee tracking", value: "Mostly aligned", status: "improve" as const, note: "Slight collapse on rep 8–10" },
  { label: "Tempo", value: "2.1s down / 1.4s up", status: "good" as const, note: "Controlled descent" },
];

export function Slide06Analysis() {
  const c = useColors();
  const [revealed, setRevealed] = useState(false);
  const reduced = useReducedMotion();

  return (
    <div className="px-5 py-8 max-w-lg mx-auto">
      <p className="text-xs font-bold uppercase tracking-[0.18em] mb-2" style={{ color: c.violet }}>
        Movement Analysis
      </p>
      <h2 className="text-2xl font-black mb-1" style={{ color: c.textPrimary }}>
        See exactly how you move.
      </h2>
      <p className="text-sm font-medium mb-6 leading-relaxed" style={{ color: c.textSecondary }}>
        Upload a short clip of any exercise — squat, push-up, lunge, bridge — and get an 
        instant form score with a breakdown of what's working and what to improve.
      </p>

      {!revealed ? (
        <motion.button
          whileTap={reduced ? {} : { scale: 0.97 }}
          onClick={() => setRevealed(true)}
          className="w-full card-frosted p-6 flex flex-col items-center gap-3 border-2 border-dashed transition-colors"
          style={{ borderColor: c.violet + "66" }}
        >
          <div
            className="w-14 h-14 rounded-2xl grid place-items-center"
            style={{ background: c.violetBg, color: c.violetLight }}
          >
            <Video size={24} />
          </div>
          <div className="text-center">
            <div className="font-bold text-sm mb-0.5" style={{ color: c.textPrimary }}>See a sample analysis</div>
            <div className="text-xs font-medium" style={{ color: c.textTertiary }}>Tap to reveal a real result</div>
          </div>
        </motion.button>
      ) : (
        <AnimatePresence>
          <motion.div
            key="result"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="card-frosted p-5"
          >
            {/* Score ring */}
            <div className="flex items-center gap-5 mb-5">
              <CircularScore value={78} size={100} label="Form score" />
              <div>
                <div className="font-black text-lg mb-0.5" style={{ color: c.textPrimary }}>Goblet Squat</div>
                <div className="text-xs font-medium mb-2" style={{ color: c.textTertiary }}>May 14 · +6 from last week</div>
                <div
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{ background: c.sunGlareBg, color: c.sunGlare, border: `1px solid ${c.sunGlare}33` }}
                >
                  Good progress
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-2">
              {METRICS.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: reduced ? 0 : 0.1 + i * 0.08, duration: 0.22 }}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: c.chipBg, border: `1px solid ${c.chipBorder}` }}
                >
                  {m.status === "good" ? (
                    <CheckCircle size={15} style={{ color: c.sunGlare, flexShrink: 0 }} />
                  ) : (
                    <AlertCircle size={15} style={{ color: c.exuberant, flexShrink: 0 }} />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold" style={{ color: c.textPrimary }}>{m.label}</div>
                    <div className="text-xs font-medium" style={{ color: c.textTertiary }}>{m.note}</div>
                  </div>
                  <div className="text-xs font-semibold shrink-0" style={{ color: m.status === "good" ? c.sunGlare : c.exuberant }}>
                    {m.value}
                  </div>
                </motion.div>
              ))}
            </div>

            <div
              className="mt-3 p-3 rounded-xl text-xs font-medium leading-relaxed"
              style={{ background: c.violetBg, color: c.violetLight, border: `1px solid ${c.violet}22` }}
            >
              Drill added to your plan: <strong>Banded Squat</strong> — 3×12 to fix knee tracking
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
