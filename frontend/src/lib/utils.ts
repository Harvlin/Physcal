import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(label: string, max = 2) {
  const parts = label
    .trim()
    .split(/\s+/)
    .filter(Boolean);
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
