import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(label: string, max = 2) {
  const parts = label.trim().split(/\s+/).filter(Boolean);
  const initials = parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
  return initials.slice(0, Math.max(1, max));
}

export function convertWeight(value: number, from: "kg" | "lbs", to: "kg" | "lbs"): number {
  if (from === to) return value;
  if (from === "kg" && to === "lbs") return Number((value * 2.20462).toFixed(1));
  if (from === "lbs" && to === "kg") return Number((value / 2.20462).toFixed(1));
  return value;
}

export function formatWeight(value: number, unit: "kg" | "lbs"): string {
  return `${value} ${unit}`;
}

import type { DayStatus } from "./mock-data";

/**
 * Calculates the current day streak based on the following rules:
 * - A day with DayStatus === "completed" continues the streak.
 * - A day with DayStatus === "rest" is neutral — it does NOT break the streak and does NOT increment it. Streak counting simply skips over rest days as if they weren't there.
 * - A day with DayStatus === "skipped" breaks the streak — streak count resets to 0 as of that day.
 * - A day with DayStatus === "planned" that is in the past (before today) and was never completed counts as an implicit break, equivalent to "skipped" — even if its status label wasn't explicitly updated to "skipped" in the data.
 * - A day with DayStatus === "today" is not yet counted either way until the day is over / the app has a completion result for it — it should not affect the currently-displayed streak number.
 */
export function calculateStreak(days: { day: string; status: DayStatus; date: string }[]): number {
  // Sort by date just in case, though we assume they're ordered.
  const sortedDays = [...days].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  let streak = 0;

  // Iterate backwards from the most recent day
  for (let i = sortedDays.length - 1; i >= 0; i--) {
    const d = sortedDays[i];
    if (d.status === "today") continue;
    if (d.status === "rest") continue;
    if (d.status === "completed") {
      streak++;
    } else if (d.status === "skipped" || d.status === "planned") {
      // Any planned day before 'today' is implicitly skipped and breaks the streak.
      break;
    }
  }

  return streak;
}
