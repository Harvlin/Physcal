import { exerciseLoadHistory, ExerciseLoadEntry } from "./mock-data";

export function getPersonalRecord(exerciseId: string): number {
  const history = exerciseLoadHistory.find((h) => h.exerciseId === exerciseId);
  if (!history || history.entries.length === 0) return 0;

  // Find max weight in history
  return Math.max(...history.entries.map((e) => e.weight));
}

export function detectPR(exerciseId: string, currentWeight: number): boolean {
  const pr = getPersonalRecord(exerciseId);
  if (pr === 0) return true; // First time logging is technically a PR
  return currentWeight > pr;
}
