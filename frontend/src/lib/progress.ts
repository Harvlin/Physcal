import {
  Badge,
  badges,
  ExerciseLoadEntry,
  CheckinEntry,
  BodyWeightEntry,
  shouldShowMilestoneNudge,
} from "./mock-data";
import { calculateStreak } from "./utils";
import { toast } from "sonner";

// ─── 1. Reassessment Flow ───────────────────────────────────────────────────

export type SessionHistoryEntry = {
  date: string;
  completed: boolean;
  isRecovery: boolean;
};

export type ReassessmentResult = {
  levelChanged: boolean;
  newLevel: "Beginner" | "Intermediate" | "Advanced";
  reasoning: string;
};

export function evaluateReassessment(
  sessionHistory: SessionHistoryEntry[],
  currentLevel: string,
): ReassessmentResult {
  const completedSessions = sessionHistory.filter((s) => s.completed || s.isRecovery);
  const totalCompleted = completedSessions.length;

  // Group by ISO week (approximate by sorting and chunking into 7-day buckets for simplicity here)
  const weeks = new Map<string, number>();
  completedSessions.forEach((s) => {
    // A simple week key based on date
    const d = new Date(s.date);
    const startOfYear = new Date(d.getFullYear(), 0, 1);
    const days = Math.floor((d.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((d.getDay() + 1 + days) / 7);
    const key = `${d.getFullYear()}-W${weekNumber}`;
    weeks.set(key, (weeks.get(key) || 0) + 1);
  });

  let consistentWeeks = 0;
  for (const count of weeks.values()) {
    if (count >= 2) consistentWeeks++;
  }

  // Regression check (e.g., no sessions in the last 14 days if they had history)
  if (sessionHistory.length > 0) {
    const sorted = [...sessionHistory].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    const lastSessionDate = new Date(sorted[0].date);
    const daysSinceLastSession = Math.floor(
      (new Date().getTime() - lastSessionDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (totalCompleted > 5 && daysSinceLastSession > 14) {
      return {
        levelChanged: false,
        newLevel: currentLevel as any,
        reasoning: "Life happens — let's ease back in. Your foundation is still there.",
      };
    }
  }

  // Level up logic
  if (currentLevel === "Beginner" && totalCompleted >= 12 && consistentWeeks >= 3) {
    return {
      levelChanged: true,
      newLevel: "Intermediate",
      reasoning: "Your taste hasn't changed — but your level has. We've leveled up your roadmap.",
    };
  } else if (currentLevel === "Intermediate" && totalCompleted >= 30 && consistentWeeks >= 8) {
    return {
      levelChanged: true,
      newLevel: "Advanced",
      reasoning: "You've built serious consistency. It's time to challenge yourself further.",
    };
  }

  // Default no-change
  return {
    levelChanged: false,
    newLevel: currentLevel as any,
    reasoning: "Still building your foundation. Consistency is everything right now.",
  };
}

// ─── 2. Weekly Report ───────────────────────────────────────────────────────

export function computeWeeklyReport(
  checkinHistory: CheckinEntry[],
  exerciseLoadHistory: { exerciseId: string; entries: ExerciseLoadEntry[] }[],
  bodyWeightHistory: BodyWeightEntry[],
  referenceDate?: Date
) {
  const now = referenceDate || new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // 1. Sessions Completed (derived from checkins for simplicity in this mock, assuming 1 checkin = 1 session day)
  const recentCheckins = checkinHistory.filter((c) => new Date(c.date) >= oneWeekAgo && new Date(c.date) <= now);
  const sessionsCompleted = recentCheckins.length;

  // 2. New PRs
  let newPRs = 0;
  exerciseLoadHistory.forEach((history) => {
    const recentEntries = history.entries.filter((e) => new Date(e.date) >= oneWeekAgo && new Date(e.date) <= now);
    const olderEntries = history.entries.filter((e) => new Date(e.date) < oneWeekAgo);
    if (recentEntries.length > 0) {
      const maxRecent = Math.max(...recentEntries.map((e) => e.weight));
      const maxOlder = olderEntries.length > 0 ? Math.max(...olderEntries.map((e) => e.weight)) : 0;
      if (maxRecent > maxOlder) newPRs++;
    }
  });

  // 3. Weight Delta
  let weightDelta: number | null = null;
  const sortedBW = [...bodyWeightHistory].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  if (sortedBW.length >= 2) {
    // Find latest entry within the window (up to 'now')
    const latest = sortedBW.find((e) => new Date(e.date).getTime() <= now.getTime());
    // Find entry closest to 7 days prior
    const prior = sortedBW.find((e) => new Date(e.date).getTime() <= oneWeekAgo.getTime());
    if (latest && prior && latest !== prior) {
      weightDelta = Number((latest.weight - prior.weight).toFixed(1));
    }
  }

  // 4. Narrative
  let narrative = "";
  if (sessionsCompleted === 0) {
    narrative = "This week was quieter — no pressure, let's ease back in when you're ready.";
  } else if (sessionsCompleted >= 3 && newPRs > 0) {
    narrative = "Incredible week. You showed up consistently and broke new ground with your PRs.";
  } else if (sessionsCompleted >= 3) {
    narrative = "Solid effort! You maintained great consistency this week.";
  } else {
    narrative = "You got some movement in this week. Every session counts toward your foundation.";
  }

  return { sessionsCompleted, newPRs, weightDelta, narrative };
}

// ─── 3. Badge System ────────────────────────────────────────────────────────

export type BadgeCheckContext = {
  totalSessions: number;
  days: { day: string; status: any; date: string }[];
  recoveryDates: string[]; // for streak calculation
  joinedAt: string;
  today: Date;
  eventsCreatedCount: number;
  chatActionAppliedCount: number;
};

export type BadgeRule = {
  id: string;
  checkFn: (context: BadgeCheckContext) => boolean;
  triggerPoint: "session_complete" | "event_created" | "checkin_submitted" | "chat_interaction";
};

export const badgeRules: BadgeRule[] = [
  { id: "first-step", checkFn: (ctx) => ctx.totalSessions >= 1, triggerPoint: "session_complete" },
  {
    id: "week-one",
    checkFn: (ctx) => calculateStreak(ctx.days, ctx.recoveryDates) >= 7,
    triggerPoint: "checkin_submitted",
  },
  {
    id: "consistency",
    checkFn: (ctx) => calculateStreak(ctx.days, ctx.recoveryDates) >= 14,
    triggerPoint: "checkin_submitted",
  },
  {
    id: "milestone-30",
    checkFn: (ctx) => shouldShowMilestoneNudge(ctx.joinedAt, ctx.today, true),
    triggerPoint: "checkin_submitted",
  },
  { id: "organizer", checkFn: (ctx) => ctx.eventsCreatedCount >= 1, triggerPoint: "event_created" },
  {
    id: "coachs-pick",
    checkFn: (ctx) => ctx.chatActionAppliedCount >= 3,
    triggerPoint: "chat_interaction",
  },
];

export function checkAndUnlockBadges(
  triggerPoint: BadgeRule["triggerPoint"],
  context: BadgeCheckContext,
): Badge[] {
  const newlyUnlocked: Badge[] = [];

  badgeRules
    .filter((r) => r.triggerPoint === triggerPoint)
    .forEach((rule) => {
      const badge = badges.find((b) => b.id === rule.id);
      if (badge && !badge.unlockedAt) {
        if (rule.checkFn(context)) {
          badge.unlockedAt = new Date().toISOString(); // Mutates mock-data for this session
          newlyUnlocked.push(badge);

          toast.success("Achievement Unlocked! 🏆", {
            description: badge.name,
          });
        }
      }
    });

  return newlyUnlocked;
}

// ─── 5. Suggested Weight ────────────────────────────────────────────────────

export function calculateSuggestedWeight(
  exerciseLoadHistory: ExerciseLoadEntry[],
  currentWeight: number,
  targetReps: number,
  targetSets: number,
  unit: "kg" | "lbs",
  isSubstituted: boolean,
): number {
  if (isSubstituted) return currentWeight; // Never suggest an increase for a substituted exercise
  if (!exerciseLoadHistory || exerciseLoadHistory.length === 0) return currentWeight;

  // Sort entries chronologically
  const sorted = [...exerciseLoadHistory].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const lastEntry = sorted[sorted.length - 1];

  const completedAllReps =
    lastEntry.completedReps >= targetReps && lastEntry.completedSets >= targetSets;
  if (!completedAllReps) return currentWeight; // didn't complete fully

  // Check consecutive success at the CURRENT weight
  let consecutiveSuccess = 0;
  for (let i = sorted.length - 1; i >= 0; i--) {
    const entry = sorted[i];
    if (
      entry.weight === currentWeight &&
      entry.completedReps >= targetReps &&
      entry.completedSets >= targetSets
    ) {
      consecutiveSuccess++;
    } else {
      break; // Streak broken
    }
  }

  if (consecutiveSuccess >= 2) {
    const rawIncrease = currentWeight * 1.0625; // ~6% increase
    const step = rawIncrease >= 20 ? 1 : 0.5;
    const rounded = Math.round(rawIncrease / step) * step;
    return rounded > currentWeight ? rounded : currentWeight + step;
  }

  return currentWeight;
}
