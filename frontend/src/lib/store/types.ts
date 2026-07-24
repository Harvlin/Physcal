export type Theme = "light" | "dark" | "system";

export type HealthConditionDetail = {
  type: string;
  details: Record<string, string | string[]>;
  severity: "mild" | "moderate" | "significant";
  avoidances: string;
};

export type HealthDisclosureStatus = "confirmed_none" | "undisclosed" | "conditions_provided";

export type HealthProfile = {
  conditions: HealthConditionDetail[];
  hasConditions: boolean;
  disclosureStatus: HealthDisclosureStatus;
};

export type TrainingProfile = {
  goals: string[];
  fitnessLevel: string | undefined;
  location: string | undefined;
  timePerWeek: string | undefined;
  confidence: number | undefined;
  socialPreference: string | undefined;
};

import type { Workout, ChatAction } from "../mock-data";

export type SetLogEntry = {
  set: number;
  reps: number;
  weight?: number;
  completedAt: string;
  // distance-mode fields
  durationMin?: number;
  distanceKm?: number;
};

export type RepCounterMode = "camera" | "voice" | "manual";

export type WorkoutSessionState = {
  sessionId: string | null;
  activeExerciseId: string | null;
  completedSets: Record<string, number>;
  setLog: Record<string, SetLogEntry[]>;
  usedWeights: Record<string, number>;
  substitutedExercises: Record<string, string>;
  isResting: boolean;
  restSecondsRemaining: number;
  restTotalSeconds: number;
  repCounterMode: RepCounterMode;
  repCounterActive: boolean;
  liveRepCount: number;
  injuryPaused: boolean;
  sessionStartedAt: string | null;

  // interval-mode session state
  intervalCurrentRound: number;
  intervalPhase: "work" | "rest" | null;
  intervalSecondsRemaining: number;

  // hold-mode session state
  holdSecondsRemaining: number;
  holdActive: boolean;

  // RPE self-report, keyed by exerciseId, recorded after interval/hold sets
  rpeLog: Record<string, number>;

  pausedSessionSnapshot: {
    sessionId: string;
    activeExerciseId: string | null;
    completedSets: Record<string, number>;
    setLog: Record<string, SetLogEntry[]>;
    usedWeights: Record<string, number>;
  } | null;
  recoveryCompletedAt: string | null;
};

export type AppSliceType = {
  theme: Theme;
  setTheme: (t: Theme) => void;

  checkinDoneToday: boolean;
  setCheckinDone: (v: boolean) => void;

  nudgeDismissed: boolean;
  dismissNudge: () => void;

  smartReminders: boolean;
  toggleSmartReminders: () => void;

  healthPanelExpanded: boolean;
  toggleHealthPanel: () => void;

  healthProfile: HealthProfile;
  setHealthProfile: (profile: HealthProfile) => void;

  todaysPlan: Workout | null;
  setTodaysPlan: (w: Workout) => void;
  applyChatAction: (action: ChatAction) => void;

  bodyWeightGoal: { current: number | null; goal: number | null } | null;
  setBodyWeightGoal: (goal: { current: number | null; goal: number | null }) => void;

  weightUnit: "kg" | "lbs";
  setWeightUnit: (unit: "kg" | "lbs") => void;

  trainingProfile: TrainingProfile | null;
  setTrainingProfile: (profile: TrainingProfile) => void;

  additionalSportIds: string[];
  addSport: (sportId: string) => void;
  removeSport: (sportId: string) => void;
};

export type OnboardingSliceType = {
  onboarding: {
    goals: string[];
    fitnessLevel?: string;
    location?: string;
    timePerWeek?: string;
    confidence?: number;
    physical: string[];
    physicalDetails: Record<string, Partial<HealthConditionDetail>>;
    social?: string;
    notes: string;
    pickedSportId?: string;
    currentWeight: number | null;
    goalWeight: number | null;
    weightUnit: "kg" | "lbs";
    weeklySessionTarget: number;
  };
  setOnboarding: (patch: Partial<OnboardingSliceType["onboarding"]>) => void;
  setPhysicalDetail: (cond: string, patch: Partial<HealthConditionDetail>) => void;
  resetOnboarding: () => void;
};

export type WorkoutSliceType = {
  workoutSession: WorkoutSessionState;
  initWorkoutSession: (sessionId: string) => void;
  completeSet: (exerciseId: string, reps: number, weight?: number) => void;
  setRestTimer: (seconds: number) => void;
  tickRestTimer: () => void;
  endRest: () => void;
  setRepCounterMode: (mode: RepCounterMode) => void;
  setRepCounterActive: (active: boolean) => void;
  setLiveRepCount: (count: number) => void;
  setUsedWeight: (exerciseId: string, weight: number) => void;
  pauseForInjury: () => void;
  resumeFromInjury: () => void;
  substituteExercise: (originalId: string, newExerciseName: string) => void;
  resetWorkoutSession: () => void;

  startHold: (exerciseId: string, seconds: number) => void;
  tickHoldTimer: () => void;
  endHold: () => void;

  startIntervalRound: (exerciseId: string, workSec: number) => void;
  tickIntervalTimer: () => void;
  setIntervalPhase: (phase: "work" | "rest" | null, seconds: number, round: number) => void;
  endInterval: () => void;

  logRpe: (exerciseId: string, rpe: number) => void;
  completeDistanceSet: (exerciseId: string, durationMin: number, distanceKm: number) => void;

  addDrillToPlan: (drill: { name: string; description: string }) => void;
  markRecoveryComplete: () => void;
};

export type AppState = AppSliceType & OnboardingSliceType & WorkoutSliceType;
