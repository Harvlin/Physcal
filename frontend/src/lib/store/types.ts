export type Theme = "light" | "dark" | "system";

export type HealthConditionDetail = {
  type: string;
  details: Record<string, string | string[]>;
  severity: "mild" | "moderate" | "significant";
  avoidances: string;
};

export type HealthProfile = {
  conditions: HealthConditionDetail[];
  hasConditions: boolean;
};

// ─── Workout Session Types ───────────────────────────────────────

export type SetLogEntry = {
  set: number;
  reps: number;
  weight?: number;
  completedAt: string;
};

export type RepCounterMode = "camera" | "voice" | "manual";

export type WorkoutSessionState = {
  sessionId: string | null;
  activeExerciseId: string | null;
  completedSets: Record<string, number>;
  setLog: Record<string, SetLogEntry[]>;
  usedWeights: Record<string, number>;
  isResting: boolean;
  restSecondsRemaining: number;
  restTotalSeconds: number;
  repCounterMode: RepCounterMode;
  repCounterActive: boolean;
  liveRepCount: number;
  injuryPaused: boolean;
  sessionStartedAt: string | null;
};

// ─── Slice Types ───────────────────────────────────────────────

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
  resetWorkoutSession: () => void;
};

export type AppState = AppSliceType & OnboardingSliceType & WorkoutSliceType;
