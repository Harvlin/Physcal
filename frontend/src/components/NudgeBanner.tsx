import { motion, AnimatePresence } from "framer-motion";
import { Zap, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  activeNudge,
  weekOverview,
  currentUser,
  shouldShowStreakNudge,
  shouldShowMilestoneNudge,
} from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import { useColors } from "@/hooks/useColors";
import { calculateStreak } from "@/lib/utils";

export function NudgeBanner() {
  const dismissed = useApp((s) => s.nudgeDismissed);
  const enabled = useApp((s) => s.smartReminders);
  const dismiss = useApp((s) => s.dismissNudge);
  const checkinDoneToday = useApp((s) => s.checkinDoneToday);
  const c = useColors();

  // Determine which nudge to show
  let displayNudge = activeNudge;
  const currentStreak = calculateStreak(weekOverview);

  if (shouldShowMilestoneNudge(currentUser.joinedAt)) {
    displayNudge = {
      id: "n_milestone",
      headline: "You hit a milestone!",
      message: "Check your profile to see your new badge and progress.",
      cta: "View profile",
      ctaLink: "/profile",
      ts: "Just now",
    };
  } else if (shouldShowStreakNudge(currentStreak, checkinDoneToday)) {
    displayNudge = {
      id: "n_streak",
      headline: "Keep your streak alive",
      message: `You're on a ${currentStreak}-day streak. One check-in keeps it alive.`,
      cta: "Check in now",
      ctaLink: "/coach",
      ts: "Just now",
    };
  }

  return (
    <AnimatePresence>
      {!dismissed && enabled && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="card-frosted p-4 flex gap-3 items-start"
          style={{ borderColor: `rgba(${c.isDark ? "214,232,0" : "168,184,0"},0.15)` }}
        >
          <div
            className="w-9 h-9 rounded-xl grid place-items-center shrink-0"
            style={{ background: c.sunGlareBg, color: c.sunGlare }}
          >
            <Zap size={16} aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm" style={{ color: c.textPrimary }}>
              {displayNudge.headline}
            </div>
            <div className="text-[13px] mt-0.5" style={{ color: c.textSecondary }}>
              {displayNudge.message}
            </div>
            <Link
              to={displayNudge.ctaLink}
              className="inline-flex items-center gap-1 mt-3 text-[13px] font-bold transition-all"
              style={{ color: c.sunGlare }}
            >
              {displayNudge.cta} →
            </Link>
          </div>
          <button
            onClick={dismiss}
            aria-label="Dismiss"
            className="w-7 h-7 grid place-items-center rounded-lg transition-colors shrink-0 -mt-0.5 -mr-0.5"
            style={{ color: c.textTertiary }}
            onMouseEnter={(e) => (e.currentTarget.style.background = c.hoverBg)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
