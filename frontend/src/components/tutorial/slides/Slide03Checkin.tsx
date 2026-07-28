import { useState } from "react";
import { CheckinDot } from "@/components/CheckinDot";
import { Zap } from "lucide-react";
import { useColors } from "@/hooks/useColors";
import { motion, AnimatePresence } from "framer-motion";

const captions: Record<number, string> = {
  1: "That low? We'd dial today's session right back — lighter weights, shorter sets, more rest.",
  2: "Running on empty. We'd go easier today — enough to stay consistent without digging deeper.",
  3: "Middle of the road. We'd keep today's plan roughly as written, with an eye on how you feel mid-session.",
  4: "Feeling solid. We'd run the session as planned — you're in a good place.",
  5: "Full tank! We might nudge volume or intensity slightly upward to match where you're at.",
};

function useReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduce-motion: reduce)").matches;
}

export function Slide03Checkin() {
  const [value, setValue] = useState(0);
  const c = useColors();
  const reduced = useReducedMotion();

  return (
    <div className="px-5 py-8 max-w-lg mx-auto">
      <p className="text-xs font-bold uppercase tracking-[0.18em] mb-2" style={{ color: c.sunGlare }}>
        Daily Check-in
      </p>
      <h2 className="text-2xl font-black mb-1" style={{ color: c.textPrimary }}>
        Five taps that reshape your day.
      </h2>
      <p className="text-sm font-medium mb-6 leading-relaxed" style={{ color: c.textSecondary }}>
        Every morning, Physcal asks how you're feeling across five dimensions: energy, soreness, 
        mood, motivation, and sleep. Your answers genuinely change the session — not just its label.
      </p>

      {/* Live interactive demo */}
      <div className="card-frosted p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-7 h-7 rounded-lg grid place-items-center"
            style={{ background: c.sunGlareBg, color: c.sunGlare }}
          >
            <Zap size={14} />
          </div>
          <span className="font-bold text-sm" style={{ color: c.textPrimary }}>Try it — rate your energy right now</span>
        </div>

        <CheckinDot
          label="Energy"
          icon={<Zap size={14} />}
          value={value}
          onChange={setValue}
        />

        <AnimatePresence mode="wait">
          {value > 0 && (
            <motion.div
              key={value}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0.1 : 0.22 }}
              className="mt-4 p-3 rounded-xl text-sm font-medium leading-relaxed"
              style={{ background: c.chipBg, border: `1px solid ${c.chipBorder}`, color: c.textSecondary }}
            >
              {captions[value]}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-xs font-medium leading-relaxed" style={{ color: c.textTertiary }}>
        The real check-in covers all five dimensions at once. Each one contributes to how 
        the coach recalibrates volume, intensity, and rest periods for that session.
      </p>
    </div>
  );
}
