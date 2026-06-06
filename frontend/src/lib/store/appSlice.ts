import type { StateCreator } from "zustand";
import type { AppState, AppSliceType, Theme, HealthProfile } from "./types";

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
});
