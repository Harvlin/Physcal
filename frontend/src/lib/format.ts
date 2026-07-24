import type { FocusArea, GoalId, TrackingMode, Exercise } from "./mock-data";

const FOCUS_AREA_LABELS: Record<FocusArea, string> = {
  full_body_strength: "Full-body strength",
  lower_endurance: "Lower-body endurance",
  core_rotational: "Core & rotation",
  shoulder_mobility: "Shoulder mobility",
  agility: "Agility",
  balance_flexibility: "Balance & flexibility",
  cardio_endurance: "Cardio endurance",
};

export function formatFocusArea(area: FocusArea): string {
  return FOCUS_AREA_LABELS[area] ?? area;
}

export function formatFocusAreaList(areas: FocusArea[]): string {
  if (areas.length === 0) return "";
  const labels = areas.map(formatFocusArea);
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`;
}

const GOAL_LABELS: Record<GoalId, string> = {
  health: "General health",
  weight: "Lose weight",
  gain_weight: "Gain weight",
  strength: "Build strength",
  social: "Have fun & socialize",
  recovery: "Recover from injury",
  stress: "Reduce stress",
};

export function formatGoalId(goal: GoalId): string {
  return GOAL_LABELS[goal] ?? goal;
}

export function formatTrackingModeSummary(exercise: Exercise): string {
  switch (exercise.trackingMode as TrackingMode) {
    case "rep":
      return `${exercise.sets} sets × ${exercise.reps} reps`;

    case "hold": {
      const holdSec = exercise.reps; // reps field stores hold-seconds for hold mode
      if (exercise.sets === 1) {
        return `Hold for ${holdSec}s`;
      }
      return `${exercise.sets} × ${holdSec}s hold`;
    }

    case "interval": {
      const rounds = exercise.intervalRounds ?? exercise.sets;
      const work = exercise.workSeconds ?? 0;
      const rest = exercise.restSeconds ?? 0;
      return rest > 0
        ? `${rounds} rounds · ${work}s work / ${rest}s rest`
        : `${rounds} rounds · ${work}s work`;
    }

    case "distance": {
      if (exercise.targetDistanceKm !== undefined) {
        return `~${exercise.targetDistanceKm} km`;
      }
      if (exercise.targetDurationMinutes !== undefined) {
        return `~${exercise.targetDurationMinutes} min`;
      }
      return "Distance";
    }

    default:
      return `${exercise.sets} sets × ${exercise.reps} reps`;
  }
}
