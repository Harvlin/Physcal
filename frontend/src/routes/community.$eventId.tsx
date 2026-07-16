import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, MapPin, Users, ChevronLeft, Sparkles, GraduationCap } from "lucide-react";
import { events } from "@/lib/mock-data";
import { getInitials } from "@/lib/utils";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/lib/store";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";

export const Route = createFileRoute("/community/$eventId")({
  component: EventDetail,
});

function EventDetail() {
  const { eventId } = Route.useParams();
  const event = events.find((e) => e.id === eventId) || events[0];
  const full = event.joined >= event.capacity;
  const ratio = Math.min(1, event.joined / event.capacity);
  const c = useColors();
  const navigate = useNavigate();

  const [showSafetyWarning, setShowSafetyWarning] = useState(false);
  const [isJoined, setIsJoined] = useState(event.isJoined ?? false);
  const [isWaitlisted, setIsWaitlisted] = useState(event.isUserWaitlisted ?? false);

  const healthProfile = useApp((s) => s.healthProfile);

  const handleJoinAttempt = () => {
    const hasHealthConditions = healthProfile?.hasConditions;
    const isRiskyForConditions =
      event.safetyLevel === "advanced" || event.safetyLevel === "general_fitness";

    if (hasHealthConditions && isRiskyForConditions) {
      setShowSafetyWarning(true);
    } else {
      handleConfirmJoin();
    }
  };

  const handleConfirmJoin = () => {
    if (full) {
      setIsWaitlisted(true);
    } else {
      setIsJoined(true);
    }
    setShowSafetyWarning(false);
    // API call will replace this in backend integration phase
  };

  const safetyLevelLabel =
    event.safetyLevel === "general_fitness"
      ? "moderate"
      : event.safetyLevel === "advanced"
        ? "high"
        : "low";

  const getSafetyBadge = () => {
    if (!event.safetyLevel) return null;
    if (event.safetyLevel === "beginner_friendly") {
      return {
        bg: c.sunGlareBg,
        color: c.sunGlare,
        border: `1px solid ${c.sunGlare}33`,
        label: "🟢 Beginner Friendly",
      };
    }
    if (event.safetyLevel === "general_fitness") {
      return {
        bg: c.chipBg,
        color: c.textSecondary,
        border: `1px solid ${c.inputBorder}`,
        label: "🟠 General Fitness",
      };
    }
    return {
      bg: "rgba(229, 62, 62, 0.1)",
      color: "#E53E3E",
      border: "1px solid rgba(229, 62, 62, 0.3)",
      label: "🔴 Advanced",
    };
  };

  const safetyBadge = getSafetyBadge();

  const avatarColors = [
    { bg: c.sunGlareBg, color: c.sunGlare },
    { bg: c.violetBg, color: c.violet },
    { bg: c.exuberantBg, color: c.exuberant },
    { bg: c.chipBg, color: c.textSecondary },
  ];

  // Determine CTA button state
  const ctaDisabled = isJoined || isWaitlisted;
  const ctaLabel = isJoined
    ? "✓ Joined"
    : isWaitlisted
      ? "✓ Waitlisted"
      : full
        ? "Join Waitlist"
        : "Join event";

  const ctaStyle =
    isJoined || isWaitlisted
      ? {
          background: c.chipBg,
          color: c.textSecondary,
          border: `1px solid ${c.chipBorder}`,
          boxShadow: "none",
        }
      : {
          background: c.sunGlare,
          color: "#1C1C1A",
          border: "none",
          boxShadow: `0 0 28px ${c.sunGlareBg}`,
        };

  return (
    <div className="min-h-dvh" style={{ background: c.appBg }}>
      {/* Hero area */}
      <div
        className="h-48 lg:h-64 flex items-end p-5 relative"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 30% 60%, ${c.sunGlareBg} 0%, transparent 70%), linear-gradient(175deg, ${c.isDark ? "#242420" : "#E6E3D8"} 0%, ${c.isDark ? "#1C1C1A" : "#F4F3EE"} 100%)`,
          borderBottom: `1px solid ${c.divider}`,
        }}
      >
        <Link
          to="/community"
          className="absolute top-4 left-4 w-10 h-10 grid place-items-center rounded-xl transition-colors"
          style={{
            background: c.chipBg,
            backdropFilter: "blur(12px)",
            border: `1px solid ${c.chipBorder}`,
            color: c.textSecondary,
          }}
          aria-label="Back"
        >
          <ChevronLeft size={20} />
        </Link>
        <div className="absolute right-6 top-1/2 -translate-y-1/2" aria-hidden>
          <div
            className="w-20 h-20 lg:w-24 lg:h-24 rounded-full font-black grid place-items-center"
            style={{
              background: c.sunGlareBg,
              color: c.sunGlare,
              fontSize: "24px",
              border: `2px solid ${c.sunGlare}33`,
              boxShadow: `0 0 40px ${c.sunGlareBg}`,
            }}
          >
            {getInitials(event.sport)}
          </div>
        </div>
        <div>
          <div
            className="text-xs uppercase tracking-widest font-bold mb-1"
            style={{ color: c.sunGlare }}
          >
            {event.sport}
          </div>
          <h1 className="text-3xl font-black max-w-md" style={{ color: c.textPrimary }}>
            {event.title}
          </h1>
        </div>
      </div>

      <div className="px-5 lg:px-8 py-6 max-w-2xl mx-auto pb-32">
        {/* Safety badge + Instructor badge */}
        {(safetyBadge || event.instructorPresent) && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {safetyBadge && (
              <span
                className="text-xs font-semibold px-3 py-1.5 rounded-full inline-flex items-center"
                style={{
                  background: safetyBadge.bg,
                  color: safetyBadge.color,
                  border: safetyBadge.border,
                }}
              >
                {safetyBadge.label}
              </span>
            )}
            {event.instructorPresent && (
              <span
                className="text-xs font-semibold px-3 py-1.5 rounded-full inline-flex items-center gap-1"
                style={{
                  background: c.chipBg,
                  color: c.textSecondary,
                  border: `1px solid ${c.inputBorder}`,
                }}
              >
                <GraduationCap size={12} /> Instructor present
              </span>
            )}
          </div>
        )}

        {/* Info rows */}
        <div className="space-y-2.5 mb-6">
          <Row icon={<Calendar size={15} />} label={`${event.date} · ${event.time}`} c={c} />
          <Row icon={<MapPin size={15} />} label={event.location} c={c} />
          <Row
            icon={<Users size={15} />}
            label={`${event.joined} of ${event.capacity} joined · hosted by ${event.host}`}
            c={c}
          />
          {event.waitlistCount > 0 && (
            <Row
              icon={<Users size={15} />}
              label={`${event.waitlistCount} ${event.waitlistCount === 1 ? "person" : "people"} on waitlist`}
              c={c}
            />
          )}
        </div>

        {/* Capacity progress */}
        <div className="mb-6">
          <div
            className="flex justify-between text-xs font-semibold mb-1.5"
            style={{ color: c.textTertiary }}
          >
            <span>Capacity</span>
            <span>{Math.round(ratio * 100)}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: c.divider }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${ratio * 100}%`,
                background: ratio > 0.8 ? c.exuberant : c.sunGlare,
                boxShadow: ratio > 0.8 ? `0 0 8px ${c.exuberantBg}` : `0 0 8px ${c.sunGlareBg}`,
              }}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {event.tags.map((t) => (
            <span
              key={t}
              className="text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{
                background: c.chipBg,
                color: c.textSecondary,
                border: `1px solid ${c.chipBorder}`,
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* About */}
        <div className="card-frosted p-5 mb-6">
          <h2
            className="font-bold mb-2 text-sm uppercase tracking-widest"
            style={{ color: c.textTertiary }}
          >
            About
          </h2>
          <p className="text-sm leading-relaxed font-medium" style={{ color: c.textSecondary }}>
            {event.description}
          </p>
        </div>

        {/* Who's coming */}
        <div className="mb-6">
          <h2 className="font-bold mb-3" style={{ color: c.textPrimary }}>
            Who&apos;s coming
          </h2>
          <div className="flex -space-x-2">
            {Array.from({ length: Math.min(8, event.joined) }).map((_, i) => {
              const style = avatarColors[i % avatarColors.length];
              return (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full text-xs font-bold grid place-items-center"
                  style={{
                    background: style.bg,
                    color: style.color,
                    outline: `2px solid ${c.appBg}`,
                  }}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              );
            })}
            {event.joined > 8 && (
              <div
                className="w-9 h-9 rounded-full text-xs font-bold grid place-items-center"
                style={{
                  background: c.chipBg,
                  color: c.textSecondary,
                  outline: `2px solid ${c.appBg}`,
                  border: `1px solid ${c.chipBorder}`,
                }}
              >
                +{event.joined - 8}
              </div>
            )}
          </div>
        </div>

        {/* Safety Disclaimer Footer */}
        <div
          className="text-center"
          style={{
            fontSize: "12px",
            color: c.textTertiary,
            lineHeight: 1.6,
            padding: "16px 24px",
          }}
        >
          ℹ️ Community events are organized by Physcal members, not Physcal staff. Always consult
          your doctor before joining physical activities if you have existing health conditions.
        </div>
      </div>

      {/* CTA bar */}
      <div
        className="fixed bottom-0 inset-x-0 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
        style={{
          background: c.isDark ? "rgba(24,24,22,0.9)" : "rgba(244,243,238,0.9)",
          backdropFilter: "blur(20px)",
          borderTop: `1px solid ${c.divider}`,
        }}
      >
        <div className="max-w-2xl mx-auto">
          <button
            disabled={ctaDisabled}
            onClick={!ctaDisabled ? handleJoinAttempt : undefined}
            className="w-full h-[52px] rounded-full font-bold text-[15px] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-70"
            style={ctaStyle}
          >
            {ctaLabel}
          </button>
        </div>
      </div>

      {/* Athena Smart Warning — Bottom Sheet */}
      <Drawer open={showSafetyWarning} onOpenChange={setShowSafetyWarning}>
        <DrawerContent
          className="pb-8"
          style={{
            background: c.isDark
              ? "linear-gradient(160deg, rgba(40,38,35,0.98), rgba(30,28,26,0.98))"
              : "linear-gradient(160deg, rgba(255,255,255,0.98), rgba(244,243,238,0.98))",
            borderColor: c.chipBorder,
          }}
        >
          <DrawerHeader className="text-center pt-6 pb-2">
            <DrawerTitle
              className="flex items-center justify-center gap-2"
              style={{ color: c.textPrimary }}
            >
              <Sparkles size={20} style={{ color: c.sunGlare }} />
              <span className="text-[18px] font-bold">Athena Notice</span>
            </DrawerTitle>
            <DrawerDescription className="sr-only">
              Safety warning for health conditions
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-5 space-y-4 mt-2">
            {/* Warning message block */}
            <div className="card-frosted p-5">
              <h3 className="font-semibold text-[15px] mb-2" style={{ color: c.textPrimary }}>
                This event may not match your health profile
              </h3>
              <p
                className="text-[13px] font-medium leading-relaxed"
                style={{ color: c.textSecondary, lineHeight: 1.6 }}
              >
                Based on your health profile, you have conditions that may be affected by{" "}
                {safetyLevelLabel} intensity activities.
              </p>

              {/* Avoidances pills */}
              {healthProfile?.conditions?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {healthProfile.conditions.map((cond, i) =>
                    cond.avoidances ? (
                      <span
                        key={i}
                        className="text-[12px] font-semibold inline-flex items-center"
                        style={{
                          background: "rgba(245, 82, 42, 0.1)",
                          color: c.exuberant,
                          border: `1px solid ${c.exuberant}33`,
                          borderRadius: "9999px",
                          padding: "3px 10px",
                        }}
                      >
                        ⚠️ {cond.avoidances}
                      </span>
                    ) : null,
                  )}
                </div>
              )}
            </div>

            {/* Recommendation line */}
            <p
              className="text-[13px] font-medium text-center px-2"
              style={{ color: c.textTertiary, lineHeight: 1.6 }}
            >
              We recommend consulting your doctor or Athena coach before joining activities outside
              your comfort zone.
            </p>

            {/* Action buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleConfirmJoin}
                className="w-full h-14 rounded-full font-bold text-[15px] transition-all active:scale-[0.98]"
                style={{
                  background: c.sunGlare,
                  color: "#1C1C1A",
                  boxShadow: `0 0 20px ${c.sunGlareBg}`,
                }}
              >
                Join Anyway
              </button>
              <button
                onClick={() => {
                  setShowSafetyWarning(false);
                  navigate({ to: "/community" });
                }}
                className="w-full h-12 rounded-full font-semibold text-[14px] transition-all active:scale-[0.98]"
                style={{ color: c.textSecondary }}
              >
                Find Safer Events
              </button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

function Row({
  icon,
  label,
  c,
}: {
  icon: React.ReactNode;
  label: string;
  c: ReturnType<typeof useColors>;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div
        className="w-8 h-8 rounded-lg grid place-items-center"
        style={{ background: c.chipBg, color: c.textSecondary }}
      >
        {icon}
      </div>
      <span className="font-medium" style={{ color: c.textSecondary }}>
        {label}
      </span>
    </div>
  );
}
