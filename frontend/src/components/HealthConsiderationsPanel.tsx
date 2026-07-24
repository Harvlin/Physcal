import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { ShieldAlert, ChevronDown, CheckCircle, AlertTriangle } from "lucide-react";
import { useApp } from "@/lib/store";
import { useColors } from "@/hooks/useColors";
import { PhyscalAlert } from "@/components/PhyscalAlert";

import { adaptWorkoutForHealthProfile, todayWorkout } from "@/lib/mock-data";

export function HealthConsiderationsPanel() {
  const profile = useApp((s) => s.healthProfile);
  const expanded = useApp((s) => s.healthPanelExpanded);
  const toggle = useApp((s) => s.toggleHealthPanel);
  const c = useColors();
  const { adaptationNotes } = useMemo(
    () => adaptWorkoutForHealthProfile(todayWorkout, profile),
    [profile],
  );

  if (!profile.hasConditions || profile.conditions.length === 0) return null;

  return (
    <div
      className="rounded-2xl overflow-hidden mb-4"
      style={{
        background: c.exuberantBg,
        border: `1px solid ${c.exuberant}26`,
      }}
    >
      <button
        onClick={toggle}
        className="w-full px-5 py-3.5 flex items-center justify-between transition-colors"
        onMouseEnter={(e) => (e.currentTarget.style.background = c.exuberantBg)}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <div className="flex items-center gap-2.5">
          <ShieldAlert size={15} style={{ color: c.exuberant }} />
          <span className="text-sm font-bold" style={{ color: c.exuberant }}>
            Health considerations for today
          </span>
        </div>
        <ChevronDown
          size={14}
          className={`transition-transform ${expanded ? "rotate-180" : ""}`}
          style={{ color: `${c.exuberant}99` }}
        />
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4" style={{ borderTop: `1px solid ${c.exuberant}1A` }}>
              {adaptationNotes.some((n) => n.type === "manual_review") && (
                <PhyscalAlert
                  variant="warning"
                  icon={AlertTriangle}
                  title="Manual review needed"
                  className="my-3"
                >
                  One of your conditions isn't automatically adapted yet. Please exercise with care.
                </PhyscalAlert>
              )}
              {adaptationNotes.filter((n) => n.type !== "manual_review").length > 0 && (
                <>
                  <div
                    className="text-[10px] uppercase tracking-wider font-bold mt-3 mb-2"
                    style={{ color: c.textTertiary }}
                  >
                    Exercise adjustments
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {adaptationNotes
                      .filter((n) => n.type !== "manual_review")
                      .map((n, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          {n.type === "substituted" ? (
                            <CheckCircle
                              size={13}
                              className="flex-shrink-0 mt-0.5"
                              style={{ color: c.sunGlare }}
                            />
                          ) : (
                            <AlertTriangle
                              size={13}
                              className="flex-shrink-0 mt-0.5"
                              style={{ color: c.exuberant }}
                            />
                          )}
                          <span style={{ color: c.textSecondary }}>
                            <strong style={{ color: c.textPrimary }}>{n.exerciseName}:</strong>{" "}
                            {n.reason}
                          </span>
                        </li>
                      ))}
                  </ul>
                </>
              )}
              {adaptationNotes.filter((n) => n.type !== "manual_review").length === 0 &&
                !adaptationNotes.some((n) => n.type === "manual_review") && (
                  <p className="text-sm py-2" style={{ color: c.textSecondary }}>
                    Your health profile looks good for today's workout!
                  </p>
                )}
              <div
                className="mt-4 pt-3 text-xs italic"
                style={{ borderTop: `1px solid ${c.exuberant}1A`, color: c.textTertiary }}
              >
                These are AI suggestions, not medical advice. Always follow your doctor's guidance.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
