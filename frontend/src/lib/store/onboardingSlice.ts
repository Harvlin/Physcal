import type { StateCreator } from "zustand";
import type { AppState, OnboardingSliceType } from "./types";

const defaultOnboarding = {
  goals: [],
  physical: [],
  physicalDetails: {},
  notes: "",
  currentWeight: null,
  goalWeight: null,
  weightUnit: "kg" as const,
  weeklySessionTarget: 3,
};

export const createOnboardingSlice: StateCreator<AppState, [], [], OnboardingSliceType> = (
  set,
) => ({
  onboarding: { ...defaultOnboarding },
  setOnboarding: (patch) => set((s) => ({ onboarding: { ...s.onboarding, ...patch } })),
  setPhysicalDetail: (cond, patch) =>
    set((s) => ({
      onboarding: {
        ...s.onboarding,
        physicalDetails: {
          ...s.onboarding.physicalDetails,
          [cond]: { ...s.onboarding.physicalDetails[cond], ...patch },
        },
      },
    })),
  resetOnboarding: () => set({ onboarding: { ...defaultOnboarding } }),
});
