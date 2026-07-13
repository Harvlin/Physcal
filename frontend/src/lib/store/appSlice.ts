import type { StateCreator } from "zustand";
import type { AppState, AppSliceType, Theme, HealthProfile } from "./types";
import { todayWorkout, recoveryWorkout, adaptWorkoutForHealthProfile } from "../mock-data";

const sampleHealth: HealthProfile = {
  hasConditions: true,
  conditions: [
    {
      type: "Joint issues",
      details: { joints: ["Knee"] },
      severity: "moderate",
      avoidances: "Deep squats past 90°, jumping movements",
    },
  ],
};

const _savedTheme = (typeof localStorage !== "undefined"
  ? (localStorage.getItem("physcal-theme") as Theme | null)
  : null) ?? "dark";

/* Apply saved theme immediately before React mounts */
if (typeof document !== "undefined") {
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(_savedTheme === "system"
    ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    : _savedTheme);
}

export const createAppSlice: StateCreator<AppState, [], [], AppSliceType> = (set) => ({
  theme: _savedTheme,
  setTheme: (t) => {
    set({ theme: t });
    if (typeof document !== "undefined") {
      const resolved =
        t === "system"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
          : t;
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(resolved);
      localStorage.setItem("physcal-theme", t);
    }
  },

  checkinDoneToday: false,
  setCheckinDone: (v) => set({ checkinDoneToday: v }),

  nudgeDismissed: false,
  dismissNudge: () => set({ nudgeDismissed: true }),

  smartReminders: true,
  toggleSmartReminders: () => set((s) => ({ smartReminders: !s.smartReminders })),

  healthPanelExpanded: false,
  toggleHealthPanel: () => set((s) => ({ healthPanelExpanded: !s.healthPanelExpanded })),

  healthProfile: sampleHealth,

  todaysPlan: adaptWorkoutForHealthProfile(todayWorkout, sampleHealth).workout,
  setTodaysPlan: (w) => set({ todaysPlan: w }),
  applyChatAction: (action) => set((state) => {
    if (!state.todaysPlan) return state;
    const p = { ...state.todaysPlan };
    if (action.type === "adjust_volume") {
      p.exercises = p.exercises.map(ex => ({
        ...ex,
        sets: Math.max(1, Math.round(ex.sets * action.volumeMultiplier)),
        reps: Math.max(1, Math.round(ex.reps * action.volumeMultiplier)),
      }));
      p.appliedAdjustments = [...(p.appliedAdjustments || []), action.note];
      p.difficulty = "Adjusted";
      p.adapted = true;
    } else if (action.type === "swap_to_recovery") {
      return { todaysPlan: recoveryWorkout };
    }
    return { todaysPlan: p };
  }),

  bodyWeightGoal: null,
  setBodyWeightGoal: (goal) => set({ bodyWeightGoal: goal }),

  weightUnit: "kg",
  setWeightUnit: (unit) => set({ weightUnit: unit }),
});
