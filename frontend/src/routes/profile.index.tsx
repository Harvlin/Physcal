import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Bell, RefreshCw, Scale, Target, History } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from "recharts";
import { AppShell } from "@/components/layout/AppShell";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { BadgeCard } from "@/components/BadgeCard";
import { currentUser, badges, weeklySessions } from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import { HealthProfileCard } from "@/components/HealthProfileCard";
import { useColors } from "@/hooks/useColors";

export const Route = createFileRoute("/profile/")({
  head: () => ({ meta: [{ title: "Profile — Physcal" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const reminders = useApp((s) => s.smartReminders);
  const toggle = useApp((s) => s.toggleSmartReminders);
  const unlocked = badges.filter((b) => b.unlockedAt);
  const c = useColors();

  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-6 lg:py-8 max-w-3xl mx-auto space-y-5">

        {/* Profile header */}
        <div className="flex items-start gap-4">
          <div
            className="w-20 h-20 rounded-3xl grid place-items-center text-[26px] font-black"
            style={{ background: c.violet, color: "#F2F0E9" }}
          >
            {currentUser.initials}
          </div>
          <div className="flex-1 pt-2">
            <h1 className="text-[24px] font-black" style={{ color: c.textPrimary }}>
              {currentUser.name}
            </h1>
            <p className="text-xs mt-0.5 font-medium" style={{ color: c.textTertiary }}>
              Member since April 2025 · {unlocked.length} achievements
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <Stat c={c} label="Sessions" value={String(currentUser.totalSessions)} accent={c.sunGlare} />
          <Stat c={c} label="Best streak" value={`${currentUser.bestStreak}d`} accent={c.exuberant} />
          <Stat c={c} label="Analyses" value={String(currentUser.analysesDone)} accent={c.violet} />
        </div>

        {/* Weekly sessions chart */}
        <Card c={c} title="Weekly sessions">
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySessions}>
                <XAxis
                  dataKey="week"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: c.textTertiary, fontSize: 11 }}
                />
                <Tooltip
                  cursor={{ fill: c.chipBg }}
                  contentStyle={{
                    background: c.isDark ? "rgba(30,30,27,0.95)" : "rgba(255,255,255,0.95)",
                    border: `1px solid ${c.inputBorder}`,
                    borderRadius: 12,
                    fontSize: 12,
                    color: c.textPrimary,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                  }}
                />
                <Bar dataKey="sessions" radius={[8, 8, 0, 0]}>
                  {weeklySessions.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === weeklySessions.length - 1
                          ? c.exuberant
                          : c.exuberantBg
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <HealthProfileCard />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card
            c={c}
            title="Achievements"
            right={
              <Link
                to="/profile/achievements"
                className="text-xs flex items-center gap-1 hover:opacity-100 font-semibold transition-opacity"
                style={{ color: c.textTertiary }}
              >
                See all <ChevronRight size={12} />
              </Link>
            }
          >
            <div className="grid grid-cols-3 gap-3">
              {unlocked.slice(0, 3).map((b) => (
                <BadgeCard key={b.id} badge={b} size="sm" />
              ))}
            </div>
          </Card>

          <Card c={c} title="My sports">
            <div className="flex flex-wrap gap-2">
              {currentUser.sports.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1.5 rounded-full text-sm font-semibold"
                  style={{ background: c.violetBg, border: `1px solid ${c.violet}44`, color: c.violet }}
                >
                  {s}
                </span>
              ))}
              <button
                className="px-3 py-1.5 rounded-full border-dashed text-sm font-medium transition-colors"
                style={{ border: `1px dashed ${c.inputBorder}`, color: c.textDisabled }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = `${c.textTertiary}88`)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = c.inputBorder)}
              >
                + Add
              </button>
            </div>
            <div
              className="mt-4 pt-4 flex items-center justify-between"
              style={{ borderTop: `1px solid ${c.divider}` }}
            >
              <div>
                <div className="text-sm font-semibold" style={{ color: c.textPrimary }}>Sport profile</div>
                <div className="text-xs mt-0.5" style={{ color: c.textTertiary }}>Last assessed April 12</div>
              </div>
              <Link
                to="/onboarding/reassess"
                className="inline-flex items-center gap-1.5 text-sm font-bold hover:underline"
                style={{ color: c.exuberant }}
              >
                <RefreshCw size={12} /> Update
              </Link>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card c={c} title="Tracking">
            <div className="space-y-1 text-sm" style={{ color: c.textPrimary }}>
              <Link
                to="/profile/goals"
                className="flex items-center justify-between py-2 font-medium -mx-2 px-2 rounded-lg transition-colors"
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <span className="flex items-center gap-2">
                  <Target size={14} /> Goals & Targets
                </span>
                <ChevronRight size={14} style={{ color: c.textTertiary }} />
              </Link>
              <Link
                to="/profile/history"
                className="flex items-center justify-between py-2 font-medium -mx-2 px-2 rounded-lg transition-colors"
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <span className="flex items-center gap-2">
                  <History size={14} /> History
                </span>
                <ChevronRight size={14} style={{ color: c.textTertiary }} />
              </Link>
              <Link
                to="/profile/weight"
                className="flex items-center justify-between py-2 font-medium -mx-2 px-2 rounded-lg transition-colors"
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <span className="flex items-center gap-2">
                  <Scale size={14} /> Weight
                </span>
                <ChevronRight size={14} style={{ color: c.textTertiary }} />
              </Link>
            </div>
          </Card>

          <Card c={c} title="Notifications">
            <Toggle
              c={c}
              label="Smart reminders"
              desc="Context-aware nudges from your coach"
              value={reminders}
              onChange={toggle}
            />
            <Link
              to="/profile/nudges"
              className="flex items-center justify-between text-sm py-2 -mx-2 px-2 rounded-lg transition-colors"
              style={{ color: c.textPrimary }}
              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <span className="flex items-center gap-2 font-medium">
                <Bell size={14} /> Nudge history
              </span>
              <ChevronRight size={14} style={{ color: c.textTertiary }} />
            </Link>
          </Card>

          <Card c={c} title="Account">
            <div className="space-y-1 text-sm" style={{ color: c.textPrimary }}>
              <Row c={c} label="Email" value="sarah@athena.app" />
              <button
                className="w-full text-left py-2 font-medium -mx-2 px-2 rounded-lg transition-colors"
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                Change password
              </button>
              <button
                className="w-full text-left py-2 font-medium -mx-2 px-2 rounded-lg transition-colors"
                style={{ color: c.exuberant }}
                onMouseEnter={e => (e.currentTarget.style.background = c.exuberantBg)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                Delete account
              </button>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ c, label, value, accent }: { c: ReturnType<typeof useColors>; label: string; value: string; accent: string }) {
  return (
    <div className="card-frosted p-4 text-center">
      <div className="tabular font-black" style={{ fontSize: "28px", color: accent }}>
        {value}
      </div>
      <div className="uppercase tracking-[0.1em] mt-1 font-semibold" style={{ fontSize: "10px", color: c.textTertiary }}>
        {label}
      </div>
    </div>
  );
}

function Card({
  c,
  title,
  right,
  children,
}: {
  c: ReturnType<typeof useColors>;
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="card-frosted p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-[13px] uppercase tracking-[0.1em]" style={{ color: c.textTertiary }}>
          {title}
        </h2>
        {right}
      </div>
      {children}
    </div>
  );
}

function Row({ c, label, value }: { c: ReturnType<typeof useColors>; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2" style={{ color: c.textPrimary }}>
      <span className="font-medium" style={{ color: c.textSecondary }}>{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function Toggle({
  c,
  label,
  desc,
  value,
  onChange,
}: {
  c: ReturnType<typeof useColors>;
  label: string;
  desc?: string;
  value: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-2" style={{ color: c.textPrimary }}>
      <div>
        <div className="text-sm font-semibold">{label}</div>
        {desc && <div className="text-xs mt-0.5" style={{ color: c.textTertiary }}>{desc}</div>}
      </div>
      <button
        onClick={onChange}
        role="switch"
        aria-checked={value}
        className="w-11 h-6 rounded-full transition-all relative"
        style={{ background: value ? c.sunGlare : c.chipBg }}
      >
        <span
          className="absolute top-0.5 w-5 h-5 rounded-full shadow transition-all"
          style={{
            background: value ? "#1C1C1A" : c.textSecondary,
            left: value ? "22px" : "2px",
          }}
        />
      </button>
    </div>
  );
}
