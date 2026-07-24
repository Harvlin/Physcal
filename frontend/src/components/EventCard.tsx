import type { EventItem } from "@/lib/mock-data";
import { Link } from "@tanstack/react-router";
import { MapPin, Calendar, GraduationCap } from "lucide-react";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useColors } from "@/hooks/useColors";

const tagStylesDark: Record<string, { bg: string; color: string }> = {
  "beginner-friendly": { bg: "rgba(214,232,0,0.12)", color: "#D6E800" },
  "women-only": { bg: "rgba(107,95,195,0.15)", color: "#8B80D4" },
  "adaptive access": { bg: "rgba(245,82,42,0.15)", color: "#F5522A" },
  "adaptive-access": { bg: "rgba(245,82,42,0.15)", color: "#F5522A" },
  free: { bg: "rgba(214,232,0,0.08)", color: "#A8B800" },
  casual: { bg: "rgba(242,240,233,0.08)", color: "rgba(242,240,233,0.6)" },
};

const tagStylesLight: Record<string, { bg: string; color: string }> = {
  "beginner-friendly": { bg: "rgba(168,184,0,0.12)", color: "#5C6400" },
  "women-only": { bg: "rgba(107,95,195,0.12)", color: "#5248A0" },
  "adaptive access": { bg: "rgba(245,82,42,0.12)", color: "#C03A14" },
  "adaptive-access": { bg: "rgba(245,82,42,0.12)", color: "#C03A14" },
  free: { bg: "rgba(168,184,0,0.1)", color: "#5C6400" },
  casual: { bg: "rgba(28,28,26,0.06)", color: "rgba(28,28,26,0.55)" },
};

function TagPill({ tag, isDark }: { tag: string; isDark: boolean }) {
  const styles = isDark ? tagStylesDark : tagStylesLight;
  const style =
    styles[tag] ||
    (isDark
      ? { bg: "rgba(242,240,233,0.08)", color: "rgba(242,240,233,0.6)" }
      : { bg: "rgba(28,28,26,0.06)", color: "rgba(28,28,26,0.55)" });
  return (
    <span
      className="text-[11px] font-semibold inline-flex items-center"
      style={{
        background: style.bg,
        color: style.color,
        borderRadius: "9999px",
        padding: "2px 10px",
        border: `1px solid ${style.color}33`,
      }}
    >
      {tag}
    </span>
  );
}

function getSafetyBadgeStyle(level: string, c: ReturnType<typeof useColors>) {
  if (level === "beginner_friendly") {
    return {
      background: c.sunGlareBg,
      color: c.sunGlare,
      border: `1px solid ${c.sunGlare}33`,
      label: "🟢 Beginner Friendly",
    };
  }
  if (level === "general_fitness") {
    return {
      background: c.chipBg,
      color: c.textSecondary,
      border: `1px solid ${c.inputBorder}`,
      label: "🟠 General Fitness",
    };
  }
  return {
    background: "rgba(229, 62, 62, 0.1)",
    color: "#E53E3E",
    border: "1px solid rgba(229, 62, 62, 0.3)",
    label: "🔴 Advanced",
  };
}

export function EventCard({ event, compact = false }: { event: EventItem; compact?: boolean }) {
  const full = event.joined >= event.capacity;
  const ratio = Math.min(1, event.joined / event.capacity);
  const avatars = ["A", "B", "C"];
  const c = useColors();
  const profile = useApp((s) => s.trainingProfile);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isPerfectMatch = profile && event.socialFit?.includes(profile.socialPreference as any);

  return (
    <Link
      to="/community/$eventId"
      params={{ eventId: event.id }}
      className={cn(
        "card-frosted block transition-all hover:border-white/15 group",
        compact ? "w-[260px] shrink-0 p-3" : "w-full p-4",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className="text-[11px] font-bold grid place-items-center shrink-0"
          aria-hidden
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: c.sunGlareBg,
            color: c.sunGlare,
            border: `1px solid ${c.sunGlare}33`,
          }}
        >
          {event.sport.slice(0, 2).toUpperCase()}
        </span>
        <div className="flex-1 min-w-0">
          <h3
            className="font-semibold leading-tight truncate"
            style={{ fontSize: "15px", color: c.textPrimary }}
          >
            {event.title}
          </h3>

          {!compact && (
            <>
              <div className="flex items-center gap-1.5 mt-1.5">
                <Calendar size={13} style={{ color: c.textTertiary, flexShrink: 0 }} />
                <span style={{ fontSize: "12px", color: c.textSecondary }}>
                  {event.date} · {event.time}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin size={13} style={{ color: c.textTertiary, flexShrink: 0 }} />
                <span className="truncate" style={{ fontSize: "12px", color: c.textSecondary }}>
                  {event.location}
                </span>
              </div>
            </>
          )}

          {compact && (
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin size={11} style={{ color: c.textTertiary, flexShrink: 0 }} />
              <span className="truncate" style={{ fontSize: "11px", color: c.textSecondary }}>
                {event.location}
              </span>
            </div>
          )}
        </div>

        {/* Safety & Instructor badges — non-compact only */}
        {!compact && (
          <div className="flex flex-col items-end gap-1 shrink-0">
            {isPerfectMatch && (
              <span
                className="text-[11px] font-semibold inline-flex items-center gap-1 whitespace-nowrap"
                style={{
                  background: c.exuberantBg,
                  color: c.exuberant,
                  border: `1px solid ${c.exuberant}33`,
                  borderRadius: "9999px",
                  padding: "2px 8px",
                }}
              >
                Perfect Match
              </span>
            )}
            {event.safetyLevel &&
              (() => {
                const badge = getSafetyBadgeStyle(event.safetyLevel, c);
                return (
                  <span
                    className="text-[11px] font-semibold inline-flex items-center whitespace-nowrap"
                    style={{
                      background: badge.background,
                      color: badge.color,
                      border: badge.border,
                      borderRadius: "9999px",
                      padding: "2px 8px",
                    }}
                  >
                    {badge.label}
                  </span>
                );
              })()}
            {event.instructorPresent && (
              <span
                className="text-[11px] font-semibold inline-flex items-center gap-1 whitespace-nowrap"
                style={{
                  background: c.chipBg,
                  color: c.textSecondary,
                  border: `1px solid ${c.inputBorder}`,
                  borderRadius: "9999px",
                  padding: "2px 8px",
                }}
              >
                <GraduationCap size={10} /> Instructor
              </span>
            )}
          </div>
        )}
      </div>

      <div className={cn("flex flex-wrap gap-1.5", compact ? "mt-2" : "mt-3")}>
        {event.tags.map((t) => (
          <TagPill key={t} tag={t} isDark={c.isDark} />
        ))}
      </div>

      <div className={cn("flex items-center justify-between", compact ? "mt-2" : "mt-3")}>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1.5">
            {avatars.slice(0, 3).map((a, i) => (
              <span
                key={i}
                className="grid place-items-center font-bold"
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "9999px",
                  background: i === 0 ? c.sunGlareBg : i === 1 ? c.exuberantBg : c.violetBg,
                  color: i === 0 ? c.sunGlare : i === 1 ? c.exuberant : c.violet,
                  fontSize: "9px",
                  outline: `2px solid ${c.isDark ? "rgba(30,30,27,0.9)" : "rgba(244,243,238,0.9)"}`,
                }}
              >
                {a}
              </span>
            ))}
          </div>
          <span style={{ fontSize: "11px", color: c.textTertiary }}>
            {event.joined} / {event.capacity}
          </span>
          <div
            className="overflow-hidden"
            style={{ height: "2px", width: "48px", borderRadius: "9999px", background: c.divider }}
          >
            <div
              style={{
                height: "100%",
                width: `${ratio * 100}%`,
                background: ratio > 0.8 ? c.exuberant : c.sunGlare,
                borderRadius: "9999px",
              }}
            />
          </div>
        </div>
        {!compact && (
          <span
            className="font-semibold flex items-center justify-center whitespace-nowrap"
            style={{
              fontSize: "12px",
              height: "30px",
              padding: "0 12px",
              borderRadius: "9999px",
              background: event.isJoined
                ? c.chipBg
                : event.isUserWaitlisted
                  ? c.violetBg
                  : full
                    ? c.chipBg
                    : c.sunGlareBg,
              border: `1px solid ${event.isJoined
                  ? c.inputBorder
                  : event.isUserWaitlisted
                    ? `${c.violet}44`
                    : full
                      ? c.inputBorder
                      : `${c.sunGlare}44`
                }`,
              color: event.isJoined
                ? c.textPrimary
                : event.isUserWaitlisted
                  ? c.violet
                  : full
                    ? c.textSecondary
                    : c.sunGlare,
            }}
          >
            {event.isJoined
              ? "Joined"
              : event.isUserWaitlisted
                ? "Waitlisted"
                : full
                  ? "Join Waitlist"
                  : "Join"}
          </span>
        )}
      </div>
    </Link>
  );
}
