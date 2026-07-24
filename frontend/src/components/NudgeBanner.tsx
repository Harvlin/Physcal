import { motion, AnimatePresence } from "framer-motion";
import { Flame, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  activeNudge,
  currentUser,
  shouldShowStreakNudge,
  shouldShowMilestoneNudge,
  Nudge,
} from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import { useColors } from "@/hooks/useColors";

export function NudgeBanner({ streak }: { streak: number }) {
  const dismissed = useApp((s) => s.nudgeDismissed);
  const enabled = useApp((s) => s.smartReminders);
  const dismiss = useApp((s) => s.dismissNudge);
  const checkinDoneToday = useApp((s) => s.checkinDoneToday);
  const c = useColors();

  // Determine which nudge to show
  // priority order: health/safety (10) > streak-at-risk (20) > milestone/celebratory (30) > informational (40)
  const candidates: { nudge: Nudge; priority: number }[] = [];

  if (shouldShowStreakNudge(streak, checkinDoneToday, enabled)) {
    candidates.push({
      priority: 20,
      nudge: {
        id: "n_streak",
        headline: "Keep your streak alive",
        message: `You're on a ${streak}-day streak. One check-in keeps it alive.`,
        cta: "Check in now",
        ctaLink: "/coach",
        ts: "Just now",
      },
    });
  }

  if (shouldShowMilestoneNudge(currentUser.joinedAt, new Date(), enabled)) {
    candidates.push({
      priority: 30,
      nudge: {
        id: "n_milestone",
        headline: "You hit a milestone!",
        message: "Check your profile to see your new badge and progress.",
        cta: "View profile",
        ctaLink: "/profile",
        ts: "Just now",
      },
    });
  }

  candidates.push({ priority: 40, nudge: activeNudge });

  // Sort by priority (lowest number first)
  candidates.sort((a, b) => a.priority - b.priority);
  const displayNudge = candidates[0].nudge;

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
            style={{ background: c.exuberantBg, color: c.exuberant }}
          >
            <Flame size={18} aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm" style={{ color: c.textPrimary }}>
              {displayNudge.headline}
            </div>
            <div className="text-[13px] mt-0.5" style={{ color: c.textSecondary }}>
              {displayNudge.message}
            </div>
            <Link
              to={displayNudge.ctaLink as any}
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
