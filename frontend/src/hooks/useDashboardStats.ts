import { useMemo } from "react";
import { useApp } from "@/lib/store";
import { calculateStreak } from "@/lib/utils";
import { computeWeeklyReport } from "@/lib/progress";
import {
  weekOverview,
  checkinHistory,
  exerciseLoadHistory,
  bodyWeightHistory,
} from "@/lib/mock-data";

export function useDashboardStats() {
  const weeklyTarget = useApp((s) => s.onboarding.weeklySessionTarget);
  
  const stats = useMemo(() => {
    const streak = calculateStreak(weekOverview);
    
    // Find the latest date in weekOverview to anchor the mock-data dates
    const latestDateStr = [...weekOverview]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.date;
      
    // Set time to end of day to include the full day
    const referenceDate = latestDateStr ? new Date(`${latestDateStr}T23:59:59`) : new Date();

    const weeklyReport = computeWeeklyReport(
      checkinHistory,
      exerciseLoadHistory,
      bodyWeightHistory,
      referenceDate
    );

    return { streak, weeklyReport };
  }, []);

  return {
    streak: stats.streak,
    weeklyReport: stats.weeklyReport,
    weeklyTarget,
  };
}
