import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MessageCircle,
  ChevronDown,
  Check,
  Play,
  Dumbbell,
  Smile,
  Target,
  Moon,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { CheckinDot } from "@/components/CheckinDot";
import { todayWorkout, weekOverview, adaptWorkoutForHealthProfile } from "@/lib/mock-data";
import { formatTrackingModeSummary } from "@/lib/format";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { WorkoutCalendar, type CalendarDay } from "@/components/WorkoutCalendar";
import { HealthConsiderationsPanel } from "@/components/HealthConsiderationsPanel";
import { RestDayCard } from "@/components/RestDayCard";
import { useColors } from "@/hooks/useColors";
import { checkAndUnlockBadges } from "@/lib/progress";

const calendarData: CalendarDay[] = weekOverview.map((d) => ({
  date: d.date,
  status:
    d.status === "completed"
      ? "done"
      : d.status === "today"
        ? "today"
        : (d.status as CalendarDay["status"]),
  workout:
    d.status !== "rest" && d.status !== "skipped"
      ? { title: "Lower Body", duration: 35, intensity: "medium", sessionId: "w_today" }
      : undefined,
}));

export const Route = createFileRoute("/coach/")({
  head: () => ({
    meta: [
      { title: "Coach — Physcal" },
      { name: "description", content: "Adaptive workout plan and daily check-in." },
    ],
  }),
  component: CoachPage,
});

function CoachPage() {
  const checkinDone = useApp((s) => s.checkinDoneToday);
  const setCheckinDone = useApp((s) => s.setCheckinDone);
  const [c_state, setC] = useState({ energy: 0, soreness: 0, mood: 0, motivation: 0, sleep: 0 });
  const [collapsed, setCollapsed] = useState(false);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const completed = Object.values(done).filter(Boolean).length;
  const showCheckin = !checkinDone && !collapsed;
  const allFilled = !Object.values(c_state).some((v) => v === 0);
  const c = useColors();

  const plan = useApp((s) => s.todaysPlan) || todayWorkout;
  const profile = useApp((s) => s.healthProfile);
  const hasManualReview = adaptWorkoutForHealthProfile(todayWorkout, profile).adaptationNotes.some(
    (n) => n.type === "manual_review",
  );

  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-6 lg:py-8 max-w-4xl mx-auto pb-44 lg:pb-8">
        <div className="mb-6">
          <p
            className="text-xs font-bold uppercase tracking-[0.18em] mb-2"
            style={{ color: c.violet }}
          >
            Today's session
          </p>
          <h1
            className="font-display font-black"
            style={{ fontSize: "clamp(28px,6vw,40px)", color: c.textPrimary }}
          >
            Coach
          </h1>
        </div>

        <AnimatePresence>
          {showCheckin && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="card p-5 mb-5 relative"
              style={{
                border: `1px solid ${c.divider}`,
                borderRadius: 24,
                background: c.isDark ? "rgba(255,255,255,0.065)" : "rgba(255,255,255,0.7)",
              }}
            >
              <button
                onClick={() => setCollapsed(true)}
                className="absolute top-3 right-3 w-8 h-8 grid place-items-center rounded-xl transition-colors"
                style={{ color: c.textTertiary }}
                onMouseEnter={(e) => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                aria-label="Dismiss"
              >
                <X size={15} />
              </button>
              <h2 className="font-black text-[20px] mb-1" style={{ color: c.textPrimary }}>
                Daily check-in
              </h2>
              <p className="text-[13px] mb-5 font-medium" style={{ color: c.textSecondary }}>
                5 quick taps. Your plan adapts to your answers.
              </p>
              <div className="space-y-4">
                <CheckinDot
                  label="Energy"
                  value={c_state.energy}
                  onChange={(v) => setC({ ...c_state, energy: v })}
                />
                <CheckinDot
                  label="Soreness"
                  icon={<Dumbbell size={14} />}
                  value={c_state.soreness}
                  onChange={(v) => setC({ ...c_state, soreness: v })}
                />
                <CheckinDot
                  label="Mood"
                  icon={<Smile size={14} />}
                  value={c_state.mood}
                  onChange={(v) => setC({ ...c_state, mood: v })}
                />
                <CheckinDot
                  label="Motivation"
                  icon={<Target size={14} />}
                  value={c_state.motivation}
                  onChange={(v) => setC({ ...c_state, motivation: v })}
                />
                <CheckinDot
                  label="Sleep"
                  icon={<Moon size={14} />}
                  value={c_state.sleep}
                  onChange={(v) => setC({ ...c_state, sleep: v })}
                />
              </div>
              <button
                onClick={() => {
                  setCheckinDone(true);
                  checkAndUnlockBadges("checkin_submitted", {
                    totalSessions: useApp.getState().trainingProfile ? 5 : 0, // Mock
                    days: weekOverview,
                    recoveryDates: [], // Mock
                    joinedAt: "2025-04-12",
                    today: new Date(),
                    eventsCreatedCount: 0,
                    chatActionAppliedCount: 0,
                  });
                }}
                disabled={!allFilled}
                className="w-full mt-5 h-12 rounded-full font-bold text-[15px] transition-all hover:opacity-90 active:scale-[0.97]"
                style={
                  allFilled
                    ? {
                        background: c.violet,
                        color: "#F2F0E9",
                        boxShadow: `0 0 28px ${c.violetBg}`,
                      }
                    : { background: c.chipBg, color: c.textDisabled, cursor: "not-allowed" }
                }
              >
                Submit check-in
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <HealthConsiderationsPanel />

        {/* Today's plan */}
        <div className="mb-5">
          {!plan || plan.isRestDay ? (
            <RestDayCard />
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-[17px]" style={{ color: c.textPrimary }}>
                  Today's workout
                </h2>
                <span
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest"
                  style={{
                    background: c.exuberantBg,
                    color: c.exuberant,
                    border: `1px solid ${c.exuberant}33`,
                  }}
                >
                  {plan.difficulty}
                </span>
              </div>

              {hasManualReview && (
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold mb-3"
                  style={{
                    background: c.sunGlareBg,
                    border: `1px solid ${c.sunGlare}33`,
                    color: c.sunGlare,
                  }}
                >
                  ⚠ See health notes ↑
                </div>
              )}

              {plan.adapted && (
                <div
                  className="rounded-xl px-4 py-3 flex flex-col gap-2 mb-3 text-[13px] font-medium"
                  style={{
                    background: c.violetBg,
                    border: `1px solid ${c.violet}33`,
                    color: c.violet,
                  }}
                >
                  <div className="flex items-center gap-2">
                    Plan adjusted for you
                  </div>
                  {plan.appliedAdjustments && plan.appliedAdjustments.length > 0 && (
                    <ul className="list-disc pl-8 space-y-0.5 opacity-90">
                      {plan.appliedAdjustments.map((adj, i) => (
                        <li key={i}>{adj}</li>
                      ))}
                    </ul>
                  )}
                  {plan.planningNotes && plan.planningNotes.length > 0 && (
                    <ul className="list-disc pl-8 space-y-0.5 opacity-90">
                      {plan.planningNotes.map((note, i) => (
                        <li key={`note-${i}`}>{note}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <div className="space-y-2">
                {plan.exercises.map((ex) => {
                  const isDone = !!done[ex.id];
                  const isOpen = expanded === ex.id;
                  return (
                    <div
                      key={ex.id}
                      className="card-frosted-light overflow-hidden transition-all relative"
                      style={isDone ? { borderColor: c.divider } : {}}
                    >
                      {ex.fromAnalysis && (
                        <div
                          className="absolute top-0 right-0 rounded-bl-xl px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider"
                          style={{ background: c.violetBg, color: c.violet }}
                        >
                          From your analysis
                        </div>
                      )}
                      <div className="p-4 flex items-center gap-3">
                        <button
                          onClick={() => setDone({ ...done, [ex.id]: !isDone })}
                          className="w-[22px] h-[22px] rounded-lg grid place-items-center shrink-0 transition-all"
                          style={
                            isDone
                              ? { background: c.exuberant, color: "#F2F0E9" }
                              : {
                                  background: "transparent",
                                  border: `1.5px solid ${c.chipBorder}`,
                                  color: "transparent",
                                }
                          }
                          aria-label="Mark done"
                        >
                          {isDone && <Check size={13} strokeWidth={3} />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: "14px",
                              color: isDone ? c.textDisabled : c.textPrimary,
                              textDecoration: isDone ? "line-through" : "none",
                            }}
                          >
                            {ex.name}
                          </div>
                          <div
                            style={{ fontSize: "12px", color: c.textSecondary, fontWeight: 500 }}
                          >
                            {formatTrackingModeSummary(ex)}
                          </div>
                        </div>
                        <button
                          onClick={() => setExpanded(isOpen ? null : ex.id)}
                          className="w-8 h-8 grid place-items-center rounded-lg transition-colors"
                          style={{ color: c.textTertiary }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = c.hoverBg)}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          aria-label="Details"
                        >
                          <ChevronDown
                            size={15}
                            className={cn("transition-transform", isOpen && "rotate-180")}
                          />
                        </button>
                      </div>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            <div
                              className="px-4 pb-4 pl-[52px] text-[13px] space-y-1"
                              style={{ color: c.textSecondary }}
                            >
                              <p className="italic">{ex.tip}</p>
                              <p>{ex.instructions}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Progress bar */}
              <div className="mt-4 flex items-center gap-3">
                <div
                  className="flex-1 h-[3px] rounded-full overflow-hidden"
                  style={{ background: c.divider }}
                >
                  <motion.div
                    style={{
                      height: "100%",
                      background: c.exuberant,
                      borderRadius: "9999px",
                      boxShadow: `0 0 8px ${c.exuberantBg}`,
                    }}
                    animate={{ width: `${(completed / plan.exercises.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs tabular font-semibold" style={{ color: c.textSecondary }}>
                  {completed}/{plan.exercises.length}
                </span>
              </div>

              <Link
                to="/coach/workout/$sessionId"
                params={{ sessionId: plan.id }}
                className="mt-5 w-full h-12 flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.97] transition-all font-bold"
                style={{
                  background: c.sunGlare,
                  color: "#1C1C1A",
                  borderRadius: "9999px",
                  fontSize: "15px",
                  boxShadow: `0 0 28px ${c.sunGlareBg}`,
                }}
              >
                <Play size={16} fill="currentColor" /> Enter focus mode
              </Link>
            </>
          )}
        </div>

        <section className="mb-5">
          <WorkoutCalendar
            data={calendarData}
            defaultMode="week"
            currentDate={new Date("2025-05-15")}
          />
        </section>
      </div>

      <Link
        to="/coach/chat"
        className="fixed bottom-[88px] lg:bottom-8 right-4 lg:right-8 z-30 h-14 px-6 rounded-full font-bold text-[15px] flex items-center gap-2 hover:opacity-90 active:scale-[0.97] transition-all"
        style={{
          background: c.exuberant,
          color: "#F2F0E9",
          boxShadow: `0 4px 24px ${c.exuberantBg}`,
        }}
      >
        <MessageCircle size={16} /> Ask coach
      </Link>
    </AppShell>
  );
}
