import { create } from "zustand";
import type { AppState } from "./types";
import { createAppSlice } from "./appSlice";
import { createOnboardingSlice } from "./onboardingSlice";
import { createWorkoutSlice } from "./workoutSlice";

export * from "./types";

export const useApp = create<AppState>()((...a) => ({
  ...createAppSlice(...a),
  ...createOnboardingSlice(...a),
  ...createWorkoutSlice(...a),
}));
