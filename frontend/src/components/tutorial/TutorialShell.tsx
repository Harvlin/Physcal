import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useEffect } from "react";
import { useColors } from "@/hooks/useColors";

const TOTAL = 11;

function useReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function slideVariants(reduced: boolean) {
  if (reduced) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2 },
    };
  }
  return {
    initial: (dir: number) => ({ x: dir * 36, opacity: 0, scale: 0.98 }),
    animate: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir * -36, opacity: 0, scale: 0.98 }),
    transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] },
  };
}

interface TutorialShellProps {
  step: number;
  direction: number;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  nextLabel?: string;
  children: React.ReactNode;
}

export function TutorialShell({
  step,
  direction,
  onNext,
  onBack,
  onSkip,
  nextLabel = "Next",
  children,
}: TutorialShellProps) {
  const c = useColors();
  const reduced = useReducedMotion();
  const variants = slideVariants(reduced);

  // Arrow key navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft" && step > 0) onBack();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [step, onNext, onBack]);

  // Swipe gesture
  let touchStartX = 0;
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50) onNext();
    else if (diff < -50 && step > 0) onBack();
  };

  return (
    <div
      className="app-stage min-h-dvh flex flex-col"
      style={{ background: c.appBg, color: c.textPrimary }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
        {/* Back button */}
        {step > 0 ? (
          <button
            onClick={onBack}
            className="w-9 h-9 grid place-items-center rounded-xl transition-colors"
            style={{ color: c.textSecondary }}
            onMouseEnter={(e) => (e.currentTarget.style.background = c.hoverBg)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            aria-label="Back"
          >
            <ChevronLeft size={20} />
          </button>
        ) : (
          <div className="w-9" />
        )}

        {/* Progress dots */}
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Tutorial progress">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <motion.div
              key={i}
              role="tab"
              aria-selected={i === step}
              animate={{
                width: i === step ? 20 : 6,
                opacity: i < step ? 1 : i === step ? 1 : 0.3,
              }}
              transition={{ duration: reduced ? 0 : 0.25 }}
              className="h-1.5 rounded-full"
              style={{
                background: i <= step ? c.sunGlare : c.chipBorder,
              }}
            />
          ))}
        </div>

        {/* Skip */}
        <button
          onClick={onSkip}
          className="text-sm font-medium transition-colors"
          style={{ color: c.textTertiary }}
          onMouseEnter={(e) => (e.currentTarget.style.color = c.textPrimary)}
          onMouseLeave={(e) => (e.currentTarget.style.color = c.textTertiary)}
        >
          Skip
        </button>
      </div>

      {/* Slide content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants as Parameters<typeof motion.div>[0]["variants"]}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      <div
        className="shrink-0 sticky bottom-0 backdrop-blur-xl px-5 py-4"
        style={{
          background: c.isDark ? "rgba(28,28,26,0.88)" : "rgba(244,243,238,0.88)",
          borderTop: `1px solid ${c.divider}`,
        }}
      >
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          {step > 0 && (
            <button
              onClick={onBack}
              className="h-12 px-5 rounded-full font-semibold text-sm transition-colors"
              style={{ color: c.textSecondary }}
              onMouseEnter={(e) => (e.currentTarget.style.color = c.textPrimary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = c.textSecondary)}
            >
              Back
            </button>
          )}
          <button
            onClick={onNext}
            className="btn-pill-primary flex-1 h-12"
          >
            {nextLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
