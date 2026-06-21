import { weightHistory, WeightEntry } from "./mock-data";

export function getPersonalRecord(exerciseId: string): number | null {
  const history = weightHistory.find((h) => h.exerciseId === exerciseId);
  if (!history || history.entries.length === 0) return null;
  
  // Find max weight in history
  return Math.max(...history.entries.map((e) => e.weight));
}

export function detectPR(exerciseId: string, currentWeight: number): boolean {
  const pr = getPersonalRecord(exerciseId);
  if (pr === null) return true; // First time logging is technically a PR
  return currentWeight > pr;
}
