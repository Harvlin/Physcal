import { motion, AnimatePresence } from "framer-motion";
import { useState, type ComponentType } from "react";
import {
  HeartPulse,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  Activity,
  Accessibility,
  ShieldAlert,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { useColors } from "@/hooks/useColors";

const conditionIcons: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  "Joint issues": Accessibility,
  "Back pain": Activity,
  "Post-injury": ShieldAlert,
  "Chronic condition": HeartPulse,
};

export function HealthProfileCard() {
  const profile = useApp((s) => s.healthProfile);
  const [open, setOpen] = useState(false);
  const count = profile.conditions.length;
  const c = useColors();

  return (
    <div className="card-frosted overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center justify-between transition-colors"
        onMouseEnter={(e) => (e.currentTarget.style.background = c.hoverBg)}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <div className="flex items-center gap-2.5">
          <HeartPulse size={16} style={{ color: c.violet }} />
          <span className="text-sm font-bold" style={{ color: c.textPrimary }}>
            Health Profile
          </span>
        </div>
        <div className="flex items-center gap-2">
          {count > 0 && (
            <span
              className="text-[11px] font-bold px-2 h-5 inline-flex items-center rounded-full"
              style={{ background: c.violetBg, color: c.violet, border: `1px solid ${c.violet}33` }}
            >
              {count} condition{count > 1 ? "s" : ""}
            </span>
          )}
          <ChevronDown
            size={14}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
            style={{ color: c.textTertiary }}
          />
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div style={{ borderTop: `1px solid ${c.divider}` }}>
              {!profile.hasConditions || count === 0 ? (
                <div className="px-5 py-4 text-sm italic" style={{ color: c.textTertiary }}>
                  No conditions added. Physcal will give general recommendations.
                </div>
              ) : (
                <div>
                  {profile.conditions.map((condition, i) => {
                    const detailParts: string[] = [];
                    const Icon = conditionIcons[condition.type];
                    for (const v of Object.values(condition.details)) {
                      if (Array.isArray(v)) detailParts.push(v.join(", "));
                      else if (v) detailParts.push(String(v));
                    }
                    detailParts.push(
                      condition.severity.charAt(0).toUpperCase() + condition.severity.slice(1),
                    );
                    return (
                      <div
                        key={i}
                        className="px-5 py-3.5"
                        style={{ borderBottom: `1px solid ${c.divider}` }}
                      >
                        <div className="flex items-start gap-3">
                          {Icon ? (
                            <span className="mt-0.5" style={{ color: c.violet }}>
                              <Icon size={16} />
                            </span>
                          ) : (
                            <span className="mt-0.5" style={{ color: c.violet }}>
                              •
                            </span>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold" style={{ color: c.textPrimary }}>
                              {condition.type}
                            </div>
                            <div className="text-xs mt-0.5" style={{ color: c.textSecondary }}>
                              {detailParts.join(" · ")}
                            </div>
                            {condition.avoidances && (
                              <div
                                className="rounded-xl px-3 py-2 text-xs mt-2 flex items-start gap-2"
                                style={{
                                  background: c.exuberantBg,
                                  border: `1px solid ${c.exuberant}22`,
                                }}
                              >
                                <AlertTriangle
                                  size={13}
                                  className="mt-0.5 flex-shrink-0"
                                  style={{ color: c.exuberant }}
                                />
                                <span className="font-medium" style={{ color: c.textPrimary }}>
                                  {condition.avoidances}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <Link
                to="/onboarding/reassess"
                className="px-5 py-3 text-sm flex items-center justify-between transition-colors"
                style={{
                  borderTop: `1px solid ${c.divider}`,
                  color: c.sunGlare,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = c.sunGlareBg)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span className="font-semibold">Update health profile</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
