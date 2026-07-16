import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useColors } from "@/hooks/useColors";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  const c = useColors();

  return (
    <button
      onClick={toggle}
      className="w-9 h-9 grid place-items-center rounded-xl transition-all relative overflow-hidden"
      style={{
        color: c.textTertiary,
        border: `1px solid ${c.inputBorder}`,
        background: c.chipBg,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = c.hoverBg;
        e.currentTarget.style.color = c.textPrimary;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = c.chipBg;
        e.currentTarget.style.color = c.textTertiary;
      }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="sun"
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            <Sun size={15} />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            <Moon size={15} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
