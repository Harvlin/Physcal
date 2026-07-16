import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { History as HistoryIcon, Search } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { useColors } from "@/hooks/useColors";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile/history")({
  head: () => ({ meta: [{ title: "Workout History — Physcal" }] }),
  component: HistoryPage,
});

const mockHistory = [
  {
    id: "h1",
    title: "Upper Body Strength",
    date: "2025-06-18",
    duration: 45,
    exercises: 6,
    calories: 320,
    focus: "strength",
    hasPR: true,
  },
  {
    id: "h2",
    title: "Lower Body Power",
    date: "2025-06-15",
    duration: 50,
    exercises: 5,
    calories: 380,
    focus: "strength",
    hasPR: false,
  },
  {
    id: "h3",
    title: "Core & Stability",
    date: "2025-06-12",
    duration: 30,
    exercises: 8,
    calories: 210,
    focus: "core",
    hasPR: false,
  },
  {
    id: "h4",
    title: "Full Body HIIT",
    date: "2025-06-10",
    duration: 40,
    exercises: 10,
    calories: 450,
    focus: "cardio",
    hasPR: true,
  },
  {
    id: "h5",
    title: "Active Recovery",
    date: "2025-06-08",
    duration: 25,
    exercises: 4,
    calories: 120,
    focus: "recovery",
    hasPR: false,
  },
  {
    id: "h6",
    title: "Push Day",
    date: "2025-06-05",
    duration: 45,
    exercises: 6,
    calories: 340,
    focus: "strength",
    hasPR: false,
  },
  {
    id: "h7",
    title: "Pull Day",
    date: "2025-06-03",
    duration: 45,
    exercises: 6,
    calories: 330,
    focus: "strength",
    hasPR: true,
  },
  {
    id: "h8",
    title: "Leg Day",
    date: "2025-05-30",
    duration: 55,
    exercises: 5,
    calories: 410,
    focus: "strength",
    hasPR: false,
  },
  {
    id: "h9",
    title: "Core Crusher",
    date: "2025-05-28",
    duration: 20,
    exercises: 6,
    calories: 150,
    focus: "core",
    hasPR: false,
  },
  {
    id: "h10",
    title: "Endurance Run",
    date: "2025-05-25",
    duration: 60,
    exercises: 1,
    calories: 600,
    focus: "cardio",
    hasPR: false,
  },
  {
    id: "h11",
    title: "Yoga Flow",
    date: "2025-05-22",
    duration: 40,
    exercises: 12,
    calories: 180,
    focus: "recovery",
    hasPR: false,
  },
  {
    id: "h12",
    title: "Full Body Strength",
    date: "2025-05-20",
    duration: 50,
    exercises: 8,
    calories: 390,
    focus: "strength",
    hasPR: false,
  },
];

const filters = ["All", "This Week", "This Month", "By Sport"];

function HistoryPage() {
  const c = useColors();
  const [activeFilter, setActiveFilter] = useState("All");

  const getFocusColor = (focus: string) => {
    switch (focus) {
      case "strength":
        return c.exuberant;
      case "cardio":
        return c.sunGlare;
      case "core":
        return c.violet;
      default:
        return c.textTertiary;
    }
  };

  return (
    <AppShell>
      <PageHeader title="Workout History" back="/profile" />
      <div className="px-4 lg:px-8 py-6 max-w-2xl mx-auto space-y-6 pb-12">
        <div className="text-center mb-6">
          <p className="text-sm mt-1 font-medium" style={{ color: c.textSecondary }}>
            {mockHistory.length} sessions completed
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {filters.map((f) => {
            const active = activeFilter === f;
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all active:scale-95 border"
                style={
                  active
                    ? { background: c.textPrimary, color: c.appBg, borderColor: c.textPrimary }
                    : { background: c.chipBg, color: c.textSecondary, borderColor: c.chipBorder }
                }
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* Session List */}
        <div className="space-y-3">
          {mockHistory.map((session) => (
            <div key={session.id} className="card-frosted p-4 flex items-center gap-4">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ background: getFocusColor(session.focus) }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-[15px]" style={{ color: c.textPrimary }}>
                    {session.title}
                  </h3>
                  {session.hasPR && (
                    <span
                      className="text-[10px] font-black px-1.5 py-0.5 rounded-md"
                      style={{
                        background: c.sunGlareBg,
                        color: c.sunGlare,
                        border: `1px solid ${c.sunGlare}44`,
                      }}
                    >
                      🏆 PR
                    </span>
                  )}
                </div>
                <div className="text-[12px] font-medium" style={{ color: c.textSecondary }}>
                  {new Date(session.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  · {session.duration} min · {session.exercises} exercises
                </div>
              </div>
              <div className="text-[13px] font-bold" style={{ color: c.textTertiary }}>
                {session.calories} kcal
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
