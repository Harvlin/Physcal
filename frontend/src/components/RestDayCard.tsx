import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Battery } from "lucide-react";
import { useColors } from "@/hooks/useColors";

export function RestDayCard() {
  const c = useColors();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="card-frosted p-8 flex flex-col items-center text-center"
      style={{
        background: c.isDark
          ? "radial-gradient(circle at top, rgba(214,232,0,0.05), transparent 60%), rgba(30,30,27,0.5)"
          : "radial-gradient(circle at top, rgba(168,184,0,0.08), transparent 60%), rgba(255,255,255,0.7)",
      }}
    >
      <div
        className="w-16 h-16 rounded-2xl grid place-items-center mb-5"
        style={{ background: c.sunGlareBg, color: c.sunGlare }}
      >
        <Battery size={28} strokeWidth={2} />
      </div>

      <h3 className="font-black text-xl mb-2" style={{ color: c.textPrimary }}>
        Scheduled Rest Day
      </h3>
      <p
        className="text-[15px] font-medium max-w-sm mb-6 leading-relaxed"
        style={{ color: c.textSecondary }}
      >
        Your body grows while you rest — this is a critical part of your plan. Enjoy the downtime.
      </p>

      <div className="text-sm font-semibold mb-3" style={{ color: c.textTertiary }}>
        Still want to move?
      </div>
      <div className="flex justify-center">
        <button
          className="h-10 px-6 rounded-full text-[13px] font-bold transition-all hover:opacity-90 active:scale-95"
          style={{
            background: c.exuberantBg,
            color: c.exuberant,
            border: `1px solid ${c.exuberant}33`,
          }}
          onClick={() => {
            // Future implementation could open the recovery flow
            console.log("Opening gentle recovery...");
          }}
        >
          Try a Gentle Recovery Session
        </button>
      </div>
    </motion.div>
  );
}
