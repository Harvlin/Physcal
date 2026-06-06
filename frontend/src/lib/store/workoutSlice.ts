import type { StateCreator } from "zustand";
import type { AppState, WorkoutSliceType, WorkoutSessionState, SetLogEntry } from "./types";

const defaultWorkoutSession: WorkoutSessionState = {
  sessionId: null,
  activeExerciseId: null,
  completedSets: {},
  setLog: {},
  usedWeights: {},
  isResting: false,
  restSecondsRemaining: 0,
  restTotalSeconds: 0,
  repCounterMode: "manual",
  repCounterActive: false,
  liveRepCount: 0,
  injuryPaused: false,
  sessionStartedAt: null,
};

export const createWorkoutSlice: StateCreator<AppState, [], [], WorkoutSliceType> = (set) => ({
  workoutSession: { ...defaultWorkoutSession },

  initWorkoutSession: (sessionId) => set(() => ({
    workoutSession: {
      ...defaultWorkoutSession,
      sessionId,
      sessionStartedAt: new Date().toISOString(),
    },
  })),

  completeSet: (exerciseId, reps, weight) => set((s) => {
    const prev = s.workoutSession.completedSets[exerciseId] ?? 0;
    const entry: SetLogEntry = {
      set: prev + 1,
      reps,
      weight,
      completedAt: new Date().toISOString(),
    };
    return {
      workoutSession: {
        ...s.workoutSession,
        completedSets: { ...s.workoutSession.completedSets, [exerciseId]: prev + 1 },
        setLog: {
          ...s.workoutSession.setLog,
          [exerciseId]: [...(s.workoutSession.setLog[exerciseId] ?? []), entry],
        },
        liveRepCount: 0,
      },
    };
  }),

  setRestTimer: (seconds) => set((s) => ({
    workoutSession: {
      ...s.workoutSession,
      isResting: true,
      restSecondsRemaining: seconds,
      restTotalSeconds: seconds,
      repCounterActive: false,
    },
  })),

  tickRestTimer: () => set((s) => {
    const next = s.workoutSession.restSecondsRemaining - 1;
    if (next <= 0) {
      return { workoutSession: { ...s.workoutSession, isResting: false, restSecondsRemaining: 0 } };
    }
    return { workoutSession: { ...s.workoutSession, restSecondsRemaining: next } };
  }),

  endRest: () => set((s) => ({
    workoutSession: { ...s.workoutSession, isResting: false, restSecondsRemaining: 0 },
  })),

  setRepCounterMode: (mode) => set((s) => ({
    workoutSession: { ...s.workoutSession, repCounterMode: mode },
  })),

  setRepCounterActive: (active) => set((s) => ({
    workoutSession: {
      ...s.workoutSession,
      repCounterActive: active,
      liveRepCount: active ? 0 : s.workoutSession.liveRepCount,
    },
  })),

  setLiveRepCount: (count) => set((s) => ({
    workoutSession: { ...s.workoutSession, liveRepCount: count },
  })),

  setUsedWeight: (exerciseId, weight) => set((s) => ({
    workoutSession: {
      ...s.workoutSession,
      usedWeights: { ...s.workoutSession.usedWeights, [exerciseId]: weight },
    },
  })),

  pauseForInjury: () => set((s) => ({
    workoutSession: {
      ...s.workoutSession,
      injuryPaused: true,
      isResting: false,
      repCounterActive: false,
    },
  })),

  resumeFromInjury: () => set((s) => ({
    workoutSession: { ...s.workoutSession, injuryPaused: false },
  })),

  resetWorkoutSession: () => set({ workoutSession: { ...defaultWorkoutSession } }),
});
