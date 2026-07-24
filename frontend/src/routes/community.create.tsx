import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Minus, Plus, GraduationCap, Check } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppShell } from "@/components/layout/AppShell";
import { cn } from "@/lib/utils";
import { useColors } from "@/hooks/useColors";
import { checkAndUnlockBadges } from "@/lib/progress";
import { weekOverview } from "@/lib/mock-data";

export const Route = createFileRoute("/community/create")({
  component: CreateEvent,
});

const sports = ["Badminton", "Running", "Yoga", "Cycling", "Swimming", "Football"];
const tagOptions = ["beginner-friendly", "women-only", "adaptive access", "free", "casual"];

const safetyOptions = [
  {
    value: "beginner_friendly" as const,
    emoji: "🟢",
    label: "Beginner Friendly",
    description: "Low intensity · Suitable for injuries & limitations",
  },
  {
    value: "general_fitness" as const,
    emoji: "🟠",
    label: "General Fitness",
    description: "Moderate intensity · Basic fitness level recommended",
  },
  {
    value: "advanced" as const,
    emoji: "🔴",
    label: "Advanced / High Intensity",
    description: "Not recommended for injuries or beginners",
  },
];

function CreateEvent() {
  const [name, setName] = useState("");
  const [sport, setSport] = useState("Badminton");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [cap, setCap] = useState(10);
  const [tags, setTags] = useState<string[]>([]);
  const [desc, setDesc] = useState("");
  const [generating, setGenerating] = useState(false);
  const [safetyLevel, setSafetyLevel] = useState<
    "beginner_friendly" | "general_fitness" | "advanced"
  >("general_fitness");
  const [instructorPresent, setInstructorPresent] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const navigate = useNavigate();
  const c = useColors();

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      setDesc(
        `A ${tags.includes("beginner-friendly") ? "beginner-friendly " : ""}${sport.toLowerCase()} session at ${location || "a comfortable venue"}. ${tags.includes("women-only") ? "Women only. " : ""}${tags.includes("adaptive access") ? "Adaptive access for all abilities. " : ""}${tags.includes("casual") ? "Casual and relaxed vibes" : "Friendly atmosphere"} — come solo or bring a friend.`,
      );
      setGenerating(false);
    }, 1200);
  };

  const getAccentColor = (level: string) => {
    if (level === "beginner_friendly") return c.sunGlare;
    if (level === "general_fitness") return c.exuberant;
    return "#E53E3E";
  };

  const inputStyle = {
    width: "100%",
    background: c.inputBg,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: `1px solid ${c.inputBorder}`,
    borderRadius: "14px",
    padding: "12px 16px",
    fontSize: "14px",
    fontWeight: 500,
    outline: "none",
    color: c.textPrimary,
  };

  return (
    <AppShell>
      <PageHeader title="Create event" back="/community" />
      <div className="px-4 lg:px-8 py-6 max-w-2xl mx-auto pb-12 space-y-6">
        <Section label="Basics" c={c}>
          <Field label="Event name" c={c}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Saturday Morning Run"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = `${c.sunGlare}66`)}
              onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
            />
          </Field>
          <Field label="Sport" c={c}>
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              style={{ ...inputStyle, appearance: "none" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = `${c.sunGlare}66`)}
              onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
            >
              {sports.map((s) => (
                <option key={s} style={{ background: c.appBg }}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Date &amp; time" c={c}>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ ...inputStyle, colorScheme: c.isDark ? "dark" : "light" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = `${c.sunGlare}66`)}
              onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
            />
          </Field>
          <Field label="Location" c={c}>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="GBK, Jakarta"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = `${c.sunGlare}66`)}
              onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
            />
          </Field>
          <Field label="Max participants" c={c}>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCap(Math.max(2, cap - 1))}
                className="w-11 h-11 rounded-xl grid place-items-center transition-all active:scale-90"
                style={{
                  background: c.chipBg,
                  border: `1px solid ${c.chipBorder}`,
                  color: c.textSecondary,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={(e) => (e.currentTarget.style.background = c.chipBg)}
              >
                <Minus size={14} />
              </button>
              <div
                className="flex-1 text-center text-[24px] font-black tabular"
                style={{ color: c.textPrimary }}
              >
                {cap}
              </div>
              <button
                onClick={() => setCap(cap + 1)}
                className="w-11 h-11 rounded-xl grid place-items-center transition-all active:scale-90"
                style={{
                  background: c.chipBg,
                  border: `1px solid ${c.chipBorder}`,
                  color: c.textSecondary,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={(e) => (e.currentTarget.style.background = c.chipBg)}
              >
                <Plus size={14} />
              </button>
            </div>
          </Field>
        </Section>

        <Section label="Inclusivity tags" c={c}>
          <div className="flex flex-wrap gap-2">
            {tagOptions.map((t) => {
              const active = tags.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => setTags(active ? tags.filter((x) => x !== t) : [...tags, t])}
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-all active:scale-95"
                  style={
                    active
                      ? { background: c.sunGlare, color: "#1C1C1A", border: "none" }
                      : {
                          background: c.chipBg,
                          border: `1px solid ${c.chipBorder}`,
                          color: c.textSecondary,
                        }
                  }
                >
                  {t}
                </button>
              );
            })}
          </div>
        </Section>

        {/* Safety Level */}
        <div>
          <h2
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: c.textTertiary }}
          >
            Event Safety Level <span style={{ color: c.exuberant }}>*</span>
          </h2>
          <div className="space-y-2">
            {safetyOptions.map((opt) => {
              const selected = safetyLevel === opt.value;
              const accent = getAccentColor(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => setSafetyLevel(opt.value)}
                  className="card-frosted w-full text-left p-4 transition-all active:scale-[0.98]"
                  style={{
                    borderLeft: selected ? `3px solid ${accent}` : undefined,
                    opacity: selected ? 1 : 0.6,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{opt.emoji}</span>
                    <div>
                      <div className="font-bold text-[14px]" style={{ color: c.textPrimary }}>
                        {opt.label}
                      </div>
                      <div
                        className="text-[12px] font-medium mt-0.5"
                        style={{ color: c.textTertiary }}
                      >
                        {opt.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Instructor Present toggle */}
          <div className="card-frosted p-4 mt-3">
            <button
              onClick={() => setInstructorPresent(!instructorPresent)}
              className="w-full flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <GraduationCap size={20} style={{ color: c.textSecondary, flexShrink: 0 }} />
                <div className="text-left">
                  <div className="font-semibold text-[14px]" style={{ color: c.textPrimary }}>
                    Certified instructor will be present
                  </div>
                  <div className="text-[12px] font-medium mt-0.5" style={{ color: c.textTertiary }}>
                    Participants will see this as a trust badge on your event
                  </div>
                </div>
              </div>
              <div
                className="shrink-0 relative transition-colors"
                style={{
                  width: 44,
                  height: 24,
                  borderRadius: 9999,
                  background: instructorPresent ? c.sunGlare : c.chipBg,
                  border: `1px solid ${instructorPresent ? `${c.sunGlare}66` : c.chipBorder}`,
                }}
              >
                <div
                  className="absolute top-[2px] rounded-full transition-all"
                  style={{
                    width: 18,
                    height: 18,
                    left: instructorPresent ? 22 : 2,
                    background: instructorPresent ? "#1C1C1A" : c.textTertiary,
                  }}
                />
              </div>
            </button>
          </div>
        </div>

        <Section label="Description" c={c}>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={5}
            placeholder="What can attendees expect?"
            style={{ ...inputStyle, resize: "none" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = `${c.sunGlare}66`)}
            onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
          />
          <button
            onClick={generate}
            disabled={generating}
            className="mt-2 inline-flex items-center gap-2 text-sm font-bold transition-colors disabled:opacity-50"
            style={{ color: c.violet }}
            onMouseEnter={(e) => (e.currentTarget.style.color = c.violetLight)}
            onMouseLeave={(e) => (e.currentTarget.style.color = c.violet)}
          >
            {generating && <Loader2 className="animate-spin" size={14} />}
            {generating ? "Generating..." : "Generate with AI"}
          </button>
        </Section>

        <div className="space-y-3 pt-4">
          {/* Acknowledgement checkbox */}
          <button
            onClick={() => setAcknowledged(!acknowledged)}
            className="flex items-start gap-3 text-left w-full"
          >
            <div
              className="shrink-0 w-5 h-5 rounded grid place-items-center mt-0.5 transition-colors"
              style={{
                background: acknowledged ? c.sunGlare : "transparent",
                border: `2px solid ${acknowledged ? c.sunGlare : c.chipBorder}`,
              }}
            >
              {acknowledged && <Check size={12} style={{ color: "#1C1C1A" }} strokeWidth={3} />}
            </div>
            <span
              className="text-[13px] font-medium leading-relaxed"
              style={{ color: c.textSecondary }}
            >
              I understand that I am responsible for communicating the physical requirements and
              risks of this event to all participants.
            </span>
          </button>

          <button
            onClick={() => {
              checkAndUnlockBadges("event_created", {
                totalSessions: 0, // Mock
                days: weekOverview,
                recoveryDates: [],
                joinedAt: "2025-04-12",
                today: new Date(),
                eventsCreatedCount: 1, // At least 1 now
                chatActionAppliedCount: 0,
              });
              navigate({ to: "/community" });
            }}
            disabled={!name || !date || !location || !acknowledged}
            className="w-full h-[52px] rounded-full font-bold text-[15px] transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-30"
            style={{
              background: c.sunGlare,
              color: "#1C1C1A",
              boxShadow: `0 0 24px ${c.sunGlareBg}`,
            }}
          >
            Publish event
          </button>
          <button
            className="w-full text-center text-sm font-semibold transition-opacity hover:opacity-100"
            style={{ color: c.textTertiary }}
          >
            Save as draft
          </button>
        </div>
      </div>
    </AppShell>
  );
}

function Section({
  label,
  children,
  c,
}: {
  label: string;
  children: React.ReactNode;
  c: ReturnType<typeof useColors>;
}) {
  return (
    <div>
      <h2
        className="text-xs font-bold uppercase tracking-widest mb-3"
        style={{ color: c.textTertiary }}
      >
        {label}
      </h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
  c,
}: {
  label: string;
  children: React.ReactNode;
  c: ReturnType<typeof useColors>;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5" style={{ color: c.textSecondary }}>
        {label}
      </label>
      {children}
    </div>
  );
}
