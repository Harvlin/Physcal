import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { CalendarDays, LayoutGrid, ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useColors } from "@/hooks/useColors";

export type CalendarDay = {
  date: string;
  status: "done" | "skipped" | "rest" | "planned" | "empty" | "today";
  workout?: {
    title: string;
    duration: number;
    intensity: "low" | "medium" | "high";
    sessionId: string;
  };
};

export type WorkoutCalendarProps = {
  data: CalendarDay[];
  defaultMode?: "week" | "month";
  currentDate: Date;
  onDaySelect?: (day: CalendarDay) => void;
};

const DOW_ID = ["SEN", "SEL", "RAB", "KAM", "JUM", "SAB", "MIN"];
const DOW_EN = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}
function parseISO(s: string) {
  return new Date(s + "T00:00:00");
}

function generateMonth(currentDate: Date, weekData: CalendarDay[]): CalendarDay[] {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days: CalendarDay[] = [];
  const lastDay = new Date(year, month + 1, 0).getDate();
  const weekMap = new Map(weekData.map((d) => [d.date, d]));
  const today = iso(new Date());
  for (let i = 1; i <= lastDay; i++) {
    const date = iso(new Date(year, month, i));
    const existing = weekMap.get(date);
    if (existing) {
      days.push(existing);
      continue;
    }
    if (date === today) {
      days.push({
        date,
        status: "today",
        workout: { title: "Lower Body", duration: 35, intensity: "medium", sessionId: "w_today" },
      });
    } else {
      const dayOfWeek = new Date(year, month, i).getDay();
      const past = date < today;
      if (past) {
        // mix of done/skipped/rest
        const r = (i * 7) % 5;
        if (r === 0) days.push({ date, status: "rest" });
        else if (r === 1) days.push({ date, status: "skipped" });
        else
          days.push({
            date,
            status: "done",
            workout: { title: "Session", duration: 30, intensity: "medium", sessionId: "w_" + i },
          });
      } else {
        if (dayOfWeek === 0 || dayOfWeek === 3) days.push({ date, status: "rest" });
        else
          days.push({
            date,
            status: "planned",
            workout: {
              title: "Upper Body",
              duration: 30,
              intensity: "medium",
              sessionId: "w_" + i,
            },
          });
      }
    }
  }
  return days;
}

export function WorkoutCalendar({
  data,
  defaultMode = "week",
  currentDate,
  onDaySelect,
}: WorkoutCalendarProps) {
  const [mode, setMode] = useState<"week" | "month">(defaultMode);
  const [viewDate, setViewDate] = useState(currentDate);
  const [selected, setSelected] = useState<CalendarDay | null>(null);
  const c = useColors();

  const handleSelect = (d: CalendarDay) => {
    if (d.status === "empty") return;
    setSelected(d);
    onDaySelect?.(d);
  };

  return (
    <div className="card-frosted p-5" style={{ borderColor: c.divider }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              const d = new Date(viewDate);
              if (mode === "week") d.setDate(d.getDate() - 7);
              else d.setMonth(d.getMonth() - 1);
              setViewDate(d);
            }}
            className="w-7 h-7 rounded-md grid place-items-center transition-colors"
            style={{ color: c.textTertiary }}
            onMouseEnter={(e) => (e.currentTarget.style.background = c.hoverBg)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <ChevronLeft size={14} />
          </button>
          <span
            className="text-sm font-semibold px-1.5 min-w-[100px] text-center"
            style={{ color: c.textPrimary }}
          >
            {mode === "week"
              ? "This week"
              : viewDate.toLocaleString("default", { month: "long", year: "numeric" })}
          </span>
          <button
            onClick={() => {
              const d = new Date(viewDate);
              if (mode === "week") d.setDate(d.getDate() + 7);
              else d.setMonth(d.getMonth() + 1);
              setViewDate(d);
            }}
            className="w-7 h-7 rounded-md grid place-items-center transition-colors"
            style={{ color: c.textTertiary }}
            onMouseEnter={(e) => (e.currentTarget.style.background = c.hoverBg)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <ChevronRight size={14} />
          </button>
        </div>
        <button
          onClick={() => setMode(mode === "week" ? "month" : "week")}
          className="text-xs flex items-center gap-1.5 px-2.5 h-7 rounded-md transition-colors"
          style={{ color: c.textTertiary }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = c.hoverBg;
            e.currentTarget.style.color = c.textPrimary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = c.textTertiary;
          }}
        >
          {mode === "week" ? (
            <>
              <CalendarDays size={13} /> Month view
            </>
          ) : (
            <>
              <LayoutGrid size={13} /> Week view
            </>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={mode}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="overflow-hidden"
        >
          {mode === "week" ? (
            <WeekView data={data} onSelect={handleSelect} selected={selected} c={c} />
          ) : (
            <MonthView
              viewDate={viewDate}
              weekData={data}
              onSelect={handleSelect}
              selected={selected}
              c={c}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {selected && <DayPopover day={selected} onClose={() => setSelected(null)} c={c} />}
    </div>
  );
}

function WeekView({
  data,
  onSelect,
  selected,
  c,
}: {
  data: CalendarDay[];
  onSelect: (d: CalendarDay) => void;
  selected: CalendarDay | null;
  c: ReturnType<typeof useColors>;
}) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {data.map((d, i) => {
        const date = parseISO(d.date);
        const isToday = d.status === "today";
        const isSelected = selected?.date === d.date;
        return (
          <button
            key={d.date}
            onClick={() => onSelect(d)}
            className="flex flex-col items-center gap-1.5 group"
          >
            <span
              className="text-[10px] uppercase tracking-wider font-semibold"
              style={{ color: c.textTertiary }}
            >
              {DOW_EN[(date.getDay() + 6) % 7]}
            </span>
            <span
              className="w-full aspect-square rounded-xl flex items-center justify-center text-xs font-medium font-mono relative transition-all"
              style={{
                background:
                  d.status === "done"
                    ? c.sunGlareBg
                    : isToday
                      ? c.sunGlare
                      : d.status === "planned"
                        ? c.chipBg
                        : d.status === "rest"
                          ? c.isDark
                            ? "rgba(242,240,233,0.03)"
                            : "rgba(28,28,26,0.03)"
                          : d.status === "skipped"
                            ? c.exuberantBg
                            : "transparent",
                color:
                  d.status === "done"
                    ? c.sunGlare
                    : isToday
                      ? "#1C1C1A"
                      : d.status === "planned"
                        ? c.textSecondary
                        : d.status === "rest"
                          ? c.textDisabled
                          : d.status === "skipped"
                            ? c.exuberant
                            : c.textDisabled,
                border:
                  isSelected && !isToday
                    ? `2px solid ${c.sunGlare}88`
                    : d.status === "rest"
                      ? `1px dashed ${c.inputBorder}`
                      : d.status === "skipped"
                        ? `1px dashed ${c.exuberant}33`
                        : "none",
                fontWeight: isToday ? 900 : 500,
              }}
            >
              {d.status === "done" && <Check size={14} strokeWidth={3} />}
              {isToday && "•"}
              {d.status === "planned" && date.getDate()}
              {d.status === "rest" && "R"}
              {d.status === "skipped" && "×"}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function MonthView({
  viewDate,
  weekData,
  onSelect,
  selected,
  c,
}: {
  viewDate: Date;
  weekData: CalendarDay[];
  onSelect: (d: CalendarDay) => void;
  selected: CalendarDay | null;
  c: ReturnType<typeof useColors>;
}) {
  const days = generateMonth(viewDate, weekData);
  const first = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const padStart = (first.getDay() + 6) % 7; // Mon = 0
  const cells: Array<CalendarDay | null> = [...Array(padStart).fill(null), ...days];
  while (cells.length % 7 !== 0) cells.push(null);

  const stats = days.reduce(
    (acc, d) => {
      if (d.status === "done") acc.done++;
      else if (d.status === "skipped") acc.skipped++;
      else if (d.status === "rest") acc.rest++;
      return acc;
    },
    { done: 0, skipped: 0, rest: 0 },
  );

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DOW_ID.map((d) => (
          <div
            key={d}
            className="text-[10px] uppercase tracking-wider text-center font-semibold"
            style={{ color: c.textTertiary }}
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={"e" + i} className="aspect-square" />;
          const isToday = d.status === "today";
          const isSelected = selected?.date === d.date;
          const dateNum = parseISO(d.date).getDate();
          return (
            <button
              key={d.date}
              onClick={() => onSelect(d)}
              className="aspect-square rounded-lg flex flex-col items-center justify-center gap-1 transition-all relative"
              style={{
                background: isToday
                  ? c.sunGlareBg
                  : d.status === "done"
                    ? `${c.sunGlare}11`
                    : "transparent",
                border: isSelected
                  ? `2px solid ${c.sunGlare}88`
                  : isToday
                    ? `1px solid ${c.sunGlare}44`
                    : "none",
              }}
              onMouseEnter={(e) => {
                if (!isToday && !isSelected) e.currentTarget.style.background = c.hoverBg;
              }}
              onMouseLeave={(e) => {
                if (!isToday && !isSelected)
                  e.currentTarget.style.background =
                    d.status === "done" ? `${c.sunGlare}11` : "transparent";
              }}
            >
              <span
                className="text-xs font-medium tabular-nums"
                style={{
                  color: isToday
                    ? c.sunGlare
                    : d.status === "done"
                      ? c.textPrimary
                      : d.status === "skipped"
                        ? c.exuberant
                        : d.status === "rest"
                          ? c.textDisabled
                          : c.textSecondary,
                  textDecoration: d.status === "skipped" ? "line-through" : "none",
                  fontWeight: isToday ? 700 : 500,
                }}
              >
                {dateNum}
              </span>
              {d.status === "done" && (
                <span className="w-1 h-1 rounded-full" style={{ background: c.sunGlare }} />
              )}
              {isToday && (
                <span className="w-1 h-1 rounded-full" style={{ background: c.sunGlare }} />
              )}
              {d.status === "skipped" && (
                <span className="w-1 h-1 rounded-full" style={{ background: c.exuberant }} />
              )}
              {d.status === "planned" && (
                <span className="w-1 h-1 rounded-full" style={{ background: c.chipBorder }} />
              )}
            </button>
          );
        })}
      </div>
      <div className="flex gap-4 px-1 pt-3 mt-3" style={{ borderTop: `1px solid ${c.divider}` }}>
        <Stat color={c.sunGlare} label={`${stats.done} done`} c={c} />
        <Stat color={c.exuberant} label={`${stats.skipped} skipped`} c={c} />
        <Stat color={c.textDisabled} label={`${stats.rest} rest days`} c={c} />
      </div>
    </div>
  );
}

function Stat({
  color,
  label,
  c,
}: {
  color: string;
  label: string;
  c: ReturnType<typeof useColors>;
}) {
  return (
    <div className="flex items-center gap-1.5 text-xs" style={{ color: c.textTertiary }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {label}
    </div>
  );
}

function DayPopover({
  day,
  onClose,
  c,
}: {
  day: CalendarDay;
  onClose: () => void;
  c: ReturnType<typeof useColors>;
}) {
  const d = parseISO(day.date);
  const label = d.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "short" });
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="mt-4 card-frosted p-4 shadow-xl relative"
      style={{ borderColor: c.divider }}
    >
      <button
        onClick={onClose}
        className="absolute top-2.5 right-2.5 w-7 h-7 grid place-items-center rounded-lg transition-colors"
        style={{ color: c.textTertiary }}
        onMouseEnter={(e) => (e.currentTarget.style.background = c.hoverBg)}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <X size={13} />
      </button>
      <div className="text-xs font-semibold pr-6" style={{ color: c.textTertiary }}>
        {label}
      </div>
      <div className="mt-2.5">
        {day.status === "today" && day.workout && (
          <>
            <div className="text-sm font-semibold" style={{ color: c.textPrimary }}>
              {day.workout.title} · {day.workout.duration} min
            </div>
            <Link
              to="/coach/workout/$sessionId"
              params={{ sessionId: day.workout.sessionId }}
              className="inline-flex items-center mt-3 h-9 px-4 rounded-lg text-xs font-bold hover:opacity-90 active:scale-[0.97] transition-all"
              style={{ background: c.sunGlare, color: "#1C1C1A" }}
            >
              Start workout →
            </Link>
          </>
        )}
        {day.status === "done" && (
          <>
            <span
              className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
              style={{
                background: c.sunGlareBg,
                color: c.sunGlare,
                border: `1px solid ${c.sunGlare}33`,
              }}
            >
              ✓ Completed
            </span>
            <div className="text-sm font-semibold mt-2" style={{ color: c.textPrimary }}>
              {day.workout?.title ?? "Session"} · {day.workout?.duration ?? 30} min
            </div>
            <button
              className="text-xs font-bold hover:underline mt-3"
              style={{ color: c.sunGlare }}
            >
              View details →
            </button>
          </>
        )}
        {day.status === "planned" && (
          <>
            <div className="text-sm font-semibold" style={{ color: c.textPrimary }}>
              {day.workout?.title ?? "Workout"}
            </div>
            <div className="text-xs mt-0.5" style={{ color: c.textTertiary }}>
              {day.workout?.duration ?? 30} min · planned
            </div>
            <button
              className="text-xs font-bold hover:underline mt-3"
              style={{ color: c.textSecondary }}
            >
              Edit plan
            </button>
          </>
        )}
        {day.status === "rest" && (
          <>
            <span
              className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
              style={{ background: c.violetBg, color: c.violet, border: `1px solid ${c.violet}33` }}
            >
              Rest day
            </span>
            <div className="text-xs mt-2" style={{ color: c.textTertiary }}>
              Recovery matters as much as the work. Hydrate & sleep well.
            </div>
          </>
        )}
        {day.status === "skipped" && (
          <>
            <span
              className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
              style={{
                background: c.exuberantBg,
                color: c.exuberant,
                border: `1px solid ${c.exuberant}33`,
              }}
            >
              Skipped
            </span>
            <button
              className="block text-xs font-bold hover:underline mt-3"
              style={{ color: c.textTertiary }}
            >
              Log reason
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
