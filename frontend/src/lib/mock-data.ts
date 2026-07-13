// Mock data for the entire Athena experience

export type User = {
  id: string;
  name: string;
  initials: string;
  joinedAt: string;
  totalSessions: number;
  bestStreak: number;
  analysesDone: number;
  sports: string[];
};

export const currentUser: User = {
  id: "u_sarah",
  name: "Sarah",
  initials: "SA",
  joinedAt: "2025-04-12",
  totalSessions: 23,
  bestStreak: 11,
  analysesDone: 4,
  sports: ["Badminton", "Yoga", "Walking"],
};

export const otherUsers: User[] = [
  {
    id: "u_budi",
    name: "Budi",
    initials: "BU",
    joinedAt: "2025-03-02",
    totalSessions: 41,
    bestStreak: 18,
    analysesDone: 7,
    sports: ["Running", "Cycling"],
  },
  {
    id: "u_maya",
    name: "Maya",
    initials: "MA",
    joinedAt: "2025-05-20",
    totalSessions: 9,
    bestStreak: 4,
    analysesDone: 2,
    sports: ["Pilates"],
  },
];

export type TrackingMode = "rep" | "hold" | "interval" | "distance";

export type FocusArea =
  | "full_body_strength"
  | "lower_endurance"
  | "core_rotational"
  | "shoulder_mobility"
  | "agility"
  | "balance_flexibility"
  | "cardio_endurance";

export type Sport = {
  id: string;
  name: string;
  reason: string;
  difficulty: "Beginner" | "Intermediate";
  why: string;
  focusAreaPriorities: FocusArea[];
};

export const sportRecommendations: Sport[] = [
  {
    id: "badminton",
    name: "Badminton",
    reason: "Social, low-impact, and forgiving for beginners — great for building confidence.",
    difficulty: "Beginner",
    why: "Your goals lean social and stress-relief, and you mentioned joint sensitivity. Badminton is gentle on joints, easy to learn the basics, and the doubles format takes pressure off solo performance.",
    focusAreaPriorities: ["agility", "shoulder_mobility", "core_rotational", "cardio_endurance"],
  },
  {
    id: "swimming",
    name: "Swimming",
    reason: "Full-body strength with zero joint impact — ideal for steady, sustainable progress.",
    difficulty: "Beginner",
    why: "Swimming gives you cardio and strength without weight-bearing stress. Perfect for someone starting out who wants to feel capable, not exhausted.",
    focusAreaPriorities: ["shoulder_mobility", "core_rotational", "cardio_endurance", "full_body_strength"],
  },
  {
    id: "yoga",
    name: "Yoga",
    reason: "Builds strength, flexibility, and a calmer relationship with your body.",
    difficulty: "Beginner",
    why: "You ranked stress-reduction high. Yoga is the most direct path: it builds physical strength while training your nervous system to relax.",
    focusAreaPriorities: ["balance_flexibility", "shoulder_mobility", "core_rotational", "full_body_strength"],
  },
];

export type CautionTag =
  | "deep_knee_flexion"
  | "high_impact_landing"
  | "spinal_flexion_load"
  | "spinal_extension_load"
  | "overhead_shoulder_load"
  | "wrist_loading"
  | "high_cardio_intensity";

export type EquipmentTag = 
  | "dumbbell" 
  | "resistance_band" 
  | "bodyweight_only" 
  | "mat" 
  | "cardio_machine" 
  | "pool_access";

export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  rest: number;
  tip: string;
  instructions: string;
  // Optional weight & pose fields
  defaultWeight?: number;    // kg, undefined = bodyweight
  weightUnit?: "kg" | "lbs";
  supportsRepCount?: boolean; // can MediaPipe/voice count this exercise?
  poseType?: "squat" | "pushup" | "lunge" | "bridge"; // for pose detection
  
  trackingMode: TrackingMode;
  focusAreas: FocusArea[];

  // interval-mode only (optional, present when trackingMode === "interval")
  intervalRounds?: number;
  workSeconds?: number;
  restSeconds?: number;

  // distance-mode only (optional, present when trackingMode === "distance")
  targetDurationMinutes?: number;
  targetDistanceKm?: number;

  cautionTags?: CautionTag[];
  equipmentNeeded?: EquipmentTag[];
};

export type Workout = {
  id: string;
  title: string;
  duration: number;
  exercises: Exercise[];
  difficulty: "Adjusted" | "Regular" | "Rest";
  adapted: boolean;
  isRestDay?: boolean;
  appliedAdjustments?: string[];
};

export const todayWorkout: Workout = {
  id: "w_today",
  title: "Lower Body Strength",
  duration: 35,
  difficulty: "Regular",
  adapted: false,
  exercises: [
    {
      id: "e1",
      name: "Goblet Squat",
      sets: 3,
      reps: 12,
      rest: 60,
      tip: "Keep your chest tall and weight in your heels.",
      instructions:
        "Hold a weight at chest level. Lower hips back and down, keeping knees tracking over toes.",
      defaultWeight: 8,
      weightUnit: "kg",
      supportsRepCount: true,
      poseType: "squat",
      trackingMode: "rep",
      focusAreas: ["full_body_strength", "lower_endurance"],
      cautionTags: ["deep_knee_flexion"],
      equipmentNeeded: ["dumbbell"],
    },
    {
      id: "e2",
      name: "Glute Bridge",
      sets: 3,
      reps: 15,
      rest: 45,
      tip: "Squeeze glutes at the top, don't arch your back.",
      instructions:
        "Lie on back, knees bent. Drive through heels and lift hips until body forms a straight line.",
      defaultWeight: undefined,
      supportsRepCount: true,
      poseType: "bridge",
      trackingMode: "rep",
      focusAreas: ["full_body_strength", "core_rotational"],
      cautionTags: [],
      equipmentNeeded: ["bodyweight_only"],
    },
    {
      id: "e3",
      name: "Reverse Lunge",
      sets: 3,
      reps: 10,
      rest: 60,
      tip: "Step long enough that your front knee stays over your ankle.",
      instructions:
        "Step one foot back, lower until both knees bend ~90°, drive front heel to return.",
      defaultWeight: undefined,
      supportsRepCount: true,
      poseType: "lunge",
      trackingMode: "rep",
      focusAreas: ["lower_endurance", "full_body_strength"],
      cautionTags: ["deep_knee_flexion", "high_impact_landing"],
      equipmentNeeded: [],
    },
    {
      id: "e4",
      name: "Calf Raise",
      sets: 2,
      reps: 20,
      rest: 30,
      tip: "Pause briefly at the top of each rep.",
      instructions: "Stand tall, rise onto balls of feet, lower under control.",
      defaultWeight: undefined,
      supportsRepCount: false,
      trackingMode: "rep",
      focusAreas: ["lower_endurance"],
      cautionTags: [],
      equipmentNeeded: ["bodyweight_only"],
    },
    {
      id: "e5",
      name: "Plank",
      sets: 3,
      reps: 30,
      rest: 45,
      tip: "Hold duration is in seconds — keep hips level.",
      instructions: "Forearms down, body straight from heels to head, brace the core.",
      defaultWeight: undefined,
      supportsRepCount: false,
      trackingMode: "hold",
      focusAreas: ["core_rotational", "full_body_strength"],
      cautionTags: [],
      equipmentNeeded: ["bodyweight_only"],
    },
    {
      id: "ex_lateral_shuttle",
      name: "Lateral Shuttle Run",
      sets: 1, reps: 0, rest: 0,
      tip: "Stay low and push off your outside foot.",
      instructions: "Shuffle side to side between two markers. Keep your chest up.",
      trackingMode: "interval",
      focusAreas: ["agility", "cardio_endurance"],
      intervalRounds: 2, workSeconds: 5, restSeconds: 5,
      cautionTags: ["high_impact_landing"],
      equipmentNeeded: [],
    },
    {
      id: "ex_easy_jog",
      name: "Easy Jog",
      sets: 1, reps: 1, rest: 0,
      tip: "Keep a conversational pace.",
      instructions: "Jog at a relaxed, steady effort.",
      trackingMode: "distance",
      focusAreas: ["cardio_endurance", "lower_endurance"],
      targetDurationMinutes: 20,
      cautionTags: ["high_impact_landing"],
      equipmentNeeded: [],
    }
  ],
};

export type DayStatus = "completed" | "planned" | "rest" | "skipped" | "today";
export const weekOverview: { day: string; status: DayStatus; date: string }[] = [
  { day: "Mon", status: "completed", date: "2025-05-12" },
  { day: "Tue", status: "completed", date: "2025-05-13" },
  { day: "Wed", status: "rest", date: "2025-05-14" },
  { day: "Thu", status: "today", date: "2025-05-15" },
  { day: "Fri", status: "planned", date: "2025-05-16" },
  { day: "Sat", status: "planned", date: "2025-05-17" },
  { day: "Sun", status: "rest", date: "2025-05-18" },
];

export const weeklySessions = [
  { week: "W1", sessions: 2 },
  { week: "W2", sessions: 3 },
  { week: "W3", sessions: 4 },
  { week: "W4", sessions: 3 },
];

export type ChatAction =
  | { type: "adjust_volume"; volumeMultiplier: number; note: string }
  | { type: "swap_to_recovery" };

export type ChatMessage = {
  id: string;
  role: "user" | "ai";
  text: string;
  ts: string;
  action?: ChatAction;
};

export const chatHistory: ChatMessage[] = [
  {
    id: "m1",
    role: "ai",
    text: "Good morning, Sarah! How are you feeling today?",
    ts: "08:12",
  },
  {
    id: "m2",
    role: "user",
    text: "Morning! My thighs are a bit sore from yesterday's workout.",
    ts: "08:14",
  },
  {
    id: "m3",
    role: "ai",
    text: "That's completely normal after lower body day. I've **adjusted** today's session:\n\n- Volume reduced by 20%\n- Added 5 minutes of stretching\n- Focus on form, not weight\n\nDo you want to proceed or take a rest day instead?",
    ts: "08:14",
    action: { type: "adjust_volume", volumeMultiplier: 0.8, note: "Volume reduced by 20%" },
  },
  { id: "m4", role: "user", text: "Let's go with the lighter version.", ts: "08:15" },
  {
    id: "m5",
    role: "ai",
    text: "Got it. I've updated your plan. Remember: consistency > intensity. Let me know when you're done.",
    ts: "08:15",
  },
  { id: "m6", role: "user", text: "Btw, how was the squat video from yesterday?", ts: "08:20" },
  {
    id: "m7",
    role: "ai",
    text: "Your score is **78** — up 6 points from last week. What's going great:\n- Knee depth is ideal\n- Stable rhythm\n\nWhat we can improve:\n- Knees slightly collapsed on the last rep\n- Let's try the *banded squat* drill twice a week",
    ts: "08:21",
  },
  { id: "m8", role: "user", text: "Okay, I'll try it. Thanks!", ts: "08:22" },
  {
    id: "m9",
    role: "ai",
    text: "Always here if you need me. Have a great session.",
    ts: "08:22",
  },
];

export type EventItem = {
  id: string;
  title: string;
  sport: string;
  date: string;
  time: string;
  location: string;
  tags: string[];
  joined: number;
  capacity: number;
  host: string;
  description: string;
  safetyLevel: "beginner_friendly" | "general_fitness" | "advanced";
  instructorPresent: boolean;
  isJoined: boolean;
};

export const events: EventItem[] = [
  {
    id: "ev1",
    title: "Beginner Badminton — Just Show Up",
    sport: "Badminton",
    date: "Sat, May 17",
    time: "08:00 – 10:00",
    location: "GOR Bulungan, Jakarta",
    tags: ["beginner-friendly", "casual"],
    joined: 12,
    capacity: 20,
    host: "Budi",
    description:
      "A casual session for those just starting out. No experience? No problem. We have spare rackets and will teach you the basics.",
    safetyLevel: "beginner_friendly",
    instructorPresent: false,
    isJoined: false,
  },
  {
    id: "ev2",
    title: "Women's Morning Run",
    sport: "Running",
    date: "Sun, May 18",
    time: "06:00 – 07:30",
    location: "Senayan Loop",
    tags: ["women-only", "beginner-friendly"],
    joined: 8,
    capacity: 15,
    host: "Maya",
    description:
      "A relaxed 5K run at conversational pace. We stop as the group needs — it's about togetherness, not speed.",
    safetyLevel: "beginner_friendly",
    instructorPresent: false,
    isJoined: false,
  },
  {
    id: "ev3",
    title: "Adaptive Yoga Flow",
    sport: "Yoga",
    date: "Mon, May 19",
    time: "18:30 – 19:30",
    location: "Studio Tenang, Kemang",
    tags: ["adaptive access", "free", "beginner-friendly"],
    joined: 6,
    capacity: 12,
    host: "Sarah",
    description:
      "Modifications available for all poses. Chairs and props provided. For anyone — whether recovering from an injury, having limited mobility, or just wanting gentle movement.",
    safetyLevel: "beginner_friendly",
    instructorPresent: true,
    isJoined: false,
  },
  {
    id: "ev4",
    title: "Casual Cycling Sunset",
    sport: "Cycling",
    date: "Fri, May 23",
    time: "16:30 – 18:30",
    location: "PIK Pantjoran",
    tags: ["casual"],
    joined: 20,
    capacity: 20,
    host: "Budi",
    description: "A relaxed 15km ride along the coast. Bring your own bike.",
    safetyLevel: "general_fitness",
    instructorPresent: false,
    isJoined: false,
  },
  {
    id: "ev5",
    title: "Swimming Basics for Adults",
    sport: "Swimming",
    date: "Sat, May 24",
    time: "09:00 – 10:30",
    location: "Senayan Aquatic",
    tags: ["beginner-friendly", "adaptive access"],
    joined: 4,
    capacity: 10,
    host: "Maya",
    description:
      "Learn to swim from scratch — friendly for adults who have never learned or are afraid of the water.",
    safetyLevel: "beginner_friendly",
    instructorPresent: true,
    isJoined: false,
  },
];

export type Badge = {
  id: string;
  name: string;
  description: string;
  unlockedAt?: string;
};

export const badges: Badge[] = [
  {
    id: "first-step",
    name: "First Step",
    description: "You showed up. That's everything.",
    unlockedAt: "2025-04-12",
  },
  {
    id: "form-check",
    name: "Form Check",
    description: "You cared enough to improve your technique.",
    unlockedAt: "2025-04-20",
  },
  {
    id: "week-one",
    name: "Week One",
    description: "7 days of check-ins. Habit forming.",
    unlockedAt: "2025-04-19",
  },
  {
    id: "consistency",
    name: "Consistency",
    description: "You kept your word to yourself.",
    unlockedAt: "2025-05-01",
  },
  { id: "community", name: "Community", description: "You found your people." },
  { id: "coachs-pick", name: "Coach's Pick", description: "Your AI coach is proud." },
  {
    id: "comeback",
    name: "Comeback",
    description: "Life happened. You came back anyway.",
  },
  { id: "deep-dive", name: "Deep Dive", description: "You asked the right questions." },
  { id: "organizer", name: "Organizer", description: "You created space for others." },
  {
    id: "milestone-30",
    name: "Milestone 30",
    description: "30 days in. You're building something real.",
  },
];

export type AnalysisResult = {
  id: string;
  exercise: "Squat" | "Push-up";
  date: string;
  score: number;
  metrics: { label: string; value: string; status: "good" | "improve"; note: string }[];
  feedback: string;
  drill: { name: string; description: string };
  prevScore?: number;
};

export const analyses: AnalysisResult[] = [
  {
    id: "a1",
    exercise: "Squat",
    date: "2025-05-14",
    score: 78,
    prevScore: 72,
    metrics: [
      { label: "Knee depth", value: "94°", status: "good", note: "Good depth achieved" },
      {
        label: "Knee tracking",
        value: "Mostly aligned",
        status: "improve",
        note: "Slight collapse on rep 8–10",
      },
      { label: "Tempo", value: "2.1s down / 1.4s up", status: "good", note: "Controlled descent" },
    ],
    feedback:
      "Your **squat depth is excellent** and your tempo is controlled — that's the hard part.\n\n• Knees slightly rolled inward on the last rep, especially on the right side\n• Try activating the glute medius with banded squats\n• Look forward, not down, to keep your chest up",
    drill: {
      name: "Banded Squat",
      description:
        "3 sets of 12 with a mini band above the knees. Forces glutes to fire and prevents knee valgus.",
    },
  },
  {
    id: "a2",
    exercise: "Push-up",
    date: "2025-05-08",
    score: 64,
    metrics: [
      { label: "Elbow angle", value: "52°", status: "improve", note: "Flares wide — aim for ~45°" },
      { label: "Hip position", value: "Stable", status: "good", note: "No sagging" },
    ],
    feedback:
      "**Hip stability is great.**\n\n• Elbows are flaring slightly wide — tuck them closer to your body\n• Shoulders tend to shrug on the final reps, keep them relaxed and down",
    drill: {
      name: "Knee Push-up Tempo",
      description: "3 × 8 with 3-second descent. Builds the right elbow path before adding load.",
    },
  },
];

export const checkinHistory = [
  { date: "2025-05-09", energy: 4, soreness: 2, mood: 4, motivation: 5, sleep: 4 },
  { date: "2025-05-10", energy: 3, soreness: 3, mood: 4, motivation: 4, sleep: 3 },
  { date: "2025-05-11", energy: 5, soreness: 1, mood: 5, motivation: 5, sleep: 5 },
  { date: "2025-05-12", energy: 3, soreness: 4, mood: 3, motivation: 3, sleep: 3 },
  { date: "2025-05-13", energy: 4, soreness: 3, mood: 4, motivation: 4, sleep: 4 },
  { date: "2025-05-14", energy: 4, soreness: 2, mood: 5, motivation: 4, sleep: 4 },
];

export const suggestedPrompts = [
  "I'm feeling sore today",
  "Make today's workout easier",
  "How am I doing this week?",
];

export const motivationalCues = [
  "You're doing great. One more set.",
  "Breathe. You've got this.",
  "Halfway there — keep going.",
  "Your future self is grateful.",
  "Consistency beats perfection.",
];

export type Nudge = {
  id: string;
  headline: string;
  message: string;
  cta: string;
  ctaLink: string;
  ts: string;
};

export const activeNudge: Nudge = {
  id: "n_streak",
  headline: "Don't break the streak",
  message: "You're on a 6-day streak. One check-in keeps it alive.",
  cta: "Check in now",
  ctaLink: "/coach",
  ts: "2 hours ago",
};

export const nudgeHistory: (Nudge & { actedOn: boolean })[] = [
  { ...activeNudge, id: "n1", actedOn: false },
  {
    id: "n2",
    headline: "Your drill is waiting",
    message: "You got feedback on your squat 2 days ago. Ready to try the drill?",
    cta: "Start drill",
    ctaLink: "/coach",
    ts: "Yesterday",
    actedOn: true,
  },
  {
    id: "n3",
    headline: "New event you might like",
    message: "A beginner-friendly badminton session was just posted.",
    cta: "See event",
    ctaLink: "/community",
    ts: "2 days ago",
    actedOn: true,
  },
  {
    id: "n4",
    headline: "Looks like today was your workout day",
    message: "Want to do a shorter version? 15 minutes is still progress.",
    cta: "See today's plan",
    ctaLink: "/coach",
    ts: "5 days ago",
    actedOn: false,
  },
];

// ─── Weight History ───────────────────────────────────────────────

export type ExerciseLoadEntry = {
  date: string;
  weight: number;
  completedReps: number;
  completedSets: number;
};

export type ExerciseLoadHistory = {
  exerciseId: string;
  exerciseName: string;
  unit: "kg" | "lbs";
  entries: ExerciseLoadEntry[];
};

export const exerciseLoadHistory: ExerciseLoadHistory[] = [
  {
    exerciseId: "e1",
    exerciseName: "Goblet Squat",
    unit: "kg",
    entries: [
      { date: "2025-05-08", weight: 6, completedReps: 12, completedSets: 3 },
      { date: "2025-05-11", weight: 6, completedReps: 12, completedSets: 3 },
      { date: "2025-05-13", weight: 8, completedReps: 12, completedSets: 3 },
    ],
  },
];

// ─── Recovery Workout (for Injury Pause mode) ────────────────────

export const recoveryWorkout: Workout = {
  id: "w_recovery",
  title: "Gentle Recovery",
  duration: 15,
  difficulty: "Adjusted",
  adapted: true,
  exercises: [
    {
      id: "r1",
      name: "Cat-Cow Stretch",
      sets: 2,
      reps: 10,
      rest: 20,
      tip: "Move slowly, breathe with each transition.",
      instructions: "On hands and knees, alternate between arching and rounding your spine.",
      supportsRepCount: false,
      trackingMode: "rep",
      focusAreas: ["balance_flexibility"],
      cautionTags: ["spinal_flexion_load", "spinal_extension_load"],
      equipmentNeeded: ["mat"],
    },
    {
      id: "r2",
      name: "90/90 Hip Stretch",
      sets: 2,
      reps: 45,
      rest: 20,
      tip: "Hold duration is in seconds per side.",
      instructions: "Sit with both legs at 90° angles, hold each side.",
      supportsRepCount: false,
      trackingMode: "hold",
      focusAreas: ["balance_flexibility", "shoulder_mobility"],
      cautionTags: [],
      equipmentNeeded: ["mat"],
    },
    {
      id: "r3",
      name: "Child's Pose",
      sets: 1,
      reps: 60,
      rest: 0,
      tip: "Breathe into your lower back.",
      instructions: "Kneel, sit hips to heels, arms extended forward or alongside body.",
      supportsRepCount: false,
      trackingMode: "hold",
      focusAreas: ["balance_flexibility"],
      cautionTags: [],
      equipmentNeeded: ["mat"],
    },
  ],
};

export const exerciseCatalog: Exercise[] = [
  ...todayWorkout.exercises,
  ...recoveryWorkout.exercises,
  {
    id: "ex_lateral_shuttle",
    name: "Lateral Shuttle Run",
    sets: 1, reps: 0, rest: 0,
    tip: "Stay low and push off your outside foot.",
    instructions: "Shuffle side to side between two markers. Keep your chest up.",
    trackingMode: "interval",
    focusAreas: ["agility", "cardio_endurance"],
    intervalRounds: 4, workSeconds: 30, restSeconds: 15,
  },
  {
    id: "ex_jump_rope",
    name: "Jump Rope Intervals",
    sets: 1, reps: 0, rest: 0,
    tip: "Stay light on your feet, use your wrists.",
    instructions: "Jump rope at a steady pace.",
    trackingMode: "interval",
    focusAreas: ["cardio_endurance", "lower_endurance"],
    intervalRounds: 5, workSeconds: 40, restSeconds: 20,
  },
  {
    id: "ex_side_plank",
    name: "Side Plank",
    sets: 2, reps: 30, rest: 30,
    tip: "Hold duration is in seconds per side. Keep your body in a straight line.",
    instructions: "Support yourself on one forearm and the side of your foot.",
    trackingMode: "hold",
    focusAreas: ["core_rotational"],
  },
  {
    id: "ex_shoulder_flow",
    name: "Shoulder Mobility Flow",
    sets: 1, reps: 45, rest: 0,
    tip: "Move smoothly through your full range of motion.",
    instructions: "Perform arm circles and pass-throughs.",
    trackingMode: "hold",
    focusAreas: ["shoulder_mobility", "balance_flexibility"],
  },
  {
    id: "ex_easy_jog",
    name: "Easy Jog",
    sets: 1, reps: 1, rest: 0,
    tip: "Keep a conversational pace.",
    instructions: "Jog at a relaxed, steady effort.",
    trackingMode: "distance",
    focusAreas: ["cardio_endurance", "lower_endurance"],
    targetDurationMinutes: 20,
  },
  {
    id: "ex_steady_swim",
    name: "Steady Swim",
    sets: 1, reps: 1, rest: 0,
    tip: "Focus on your breathing rhythm.",
    instructions: "Swim continuously at a moderate pace.",
    trackingMode: "distance",
    focusAreas: ["cardio_endurance", "shoulder_mobility"],
    targetDurationMinutes: 30, targetDistanceKm: 0.5,
  },
  {
    id: "ex_hip_hinge",
    name: "Hip Hinge Drill",
    sets: 3, reps: 12, rest: 30,
    tip: "Push your hips back to the wall.",
    instructions: "Keep your back straight and hinge at the hips.",
    trackingMode: "rep",
    focusAreas: ["lower_endurance", "full_body_strength"],
  },
  {
    id: "ex_squat_jump",
    name: "Squat Jump",
    sets: 1, reps: 0, rest: 0,
    tip: "Land softly to protect your knees.",
    instructions: "Explode up from a squat, land with bent knees.",
    trackingMode: "interval",
    focusAreas: ["agility", "lower_endurance"],
    intervalRounds: 4, workSeconds: 20, restSeconds: 20,
  }
];

// MOCK ONLY — this simulates what the Spring Boot backend will eventually do:
// select exercises from the catalog whose focusAreas overlap with the
// user's picked sport's focusAreaPriorities, and assemble a daily workout.
// Replace this with a real API call (GET /api/workouts/today) later.
export function generateMockWorkoutForSport(sportId: string): Workout {
  const sport = sportRecommendations.find(s => s.id === sportId);
  if (!sport) return todayWorkout;

  const priorities = sport.focusAreaPriorities;
  
  // Find exercises matching the top priorities
  // Simple mock algorithm: get all exercises that share at least one focus area
  // Sort them so those with top priorities come first, then take top 5
  const scoredExercises = exerciseCatalog.map(ex => {
    let score = 0;
    ex.focusAreas.forEach(fa => {
      const idx = priorities.indexOf(fa);
      if (idx !== -1) {
        // Higher priority (lower index) gives more points
        score += (priorities.length - idx);
      }
    });
    return { ex, score };
  }).filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const selectedExercises = scoredExercises.slice(0, 5).map(item => item.ex);

  // If no match found, fallback to todayWorkout
  if (selectedExercises.length === 0) {
    return todayWorkout;
  }

  return {
    id: `w_mock_${sportId}`,
    title: `${sport.name} Conditioning`,
    duration: 30, 
    difficulty: "Regular",
    adapted: false,
    exercises: selectedExercises,
  };
}

export type BodyWeightEntry = {
  date: string;
  weight: number;
};

export const bodyWeightHistory: BodyWeightEntry[] = [
  { date: "2025-04-10", weight: 72.5 },
  { date: "2025-04-17", weight: 72.1 },
  { date: "2025-04-24", weight: 71.8 },
  { date: "2025-05-01", weight: 71.5 },
  { date: "2025-05-08", weight: 71.2 },
  { date: "2025-05-15", weight: 71.0 },
];

export const structuredConditionCautionMap: Record<string, CautionTag[]> = {
  // Joint issues — maps each sub-option from conditionMeta
  "Joint issues:Knee":     ["deep_knee_flexion", "high_impact_landing"],
  "Joint issues:Hip":      ["deep_knee_flexion", "high_impact_landing"],
  "Joint issues:Shoulder": ["overhead_shoulder_load"],
  "Joint issues:Wrist":    ["wrist_loading"],
  "Joint issues:Ankle":    ["high_impact_landing"],
  // "Joint issues:Other" is intentionally omitted — free-text context, flagged as manual_review

  // Back pain
  "Back pain:Lower":     ["spinal_flexion_load", "spinal_extension_load"],
  "Back pain:Upper":     ["spinal_extension_load", "overhead_shoulder_load"],
  "Back pain:Full back": ["spinal_flexion_load", "spinal_extension_load"],

  // Chronic conditions
  "Chronic condition:Heart condition": ["high_cardio_intensity"],
  "Chronic condition:Asthma":          ["high_cardio_intensity"],
  "Chronic condition:Diabetes":        ["high_cardio_intensity"],
  // "Chronic condition:Other" is intentionally omitted — free-text, flagged as manual_review
};

export type AdaptationNote = {
  exerciseId: string;
  exerciseName: string;
  type: "substituted" | "caution" | "manual_review";
  reason: string;
};

export function adaptWorkoutForHealthProfile(
  workout: Workout,
  healthProfile: any
): { workout: Workout; adaptationNotes: AdaptationNote[] } {
  if (!healthProfile.hasConditions || healthProfile.conditions.length === 0) {
    return { workout, adaptationNotes: [] };
  }

  const notes: AdaptationNote[] = [];
  const adaptedWorkout: Workout = { ...workout, exercises: [...workout.exercises] };

  let needsManualReview = false;
  const manualReviewReasons: string[] = [];

  const activeCautions = new Set<CautionTag>();
  const activeCautionReasons = new Map<CautionTag, string>();

  healthProfile.conditions.forEach((c: any) => {
    const conditionValues: string[] = c.details?.values || c.details?.joints || [];
    const hasOtherJoint = c.type === "Joint issues" && conditionValues.includes("Other");
    const hasOtherChronic = c.type === "Chronic condition" && conditionValues.includes("Other");

    if (c.avoidances || c.type === "Post-injury" || hasOtherJoint || hasOtherChronic) {
      needsManualReview = true;
      manualReviewReasons.push(`Manual review needed for: ${c.type}`);
    }

    const typePrefix = c.type;
    
    if (conditionValues.length > 0) {
      conditionValues.forEach((v: string) => {
        // Skip "Other" — it's free-text context, flagged as manual_review above
        if (v === "Other") return;
        const key = `${typePrefix}:${v}`;
        const tags = structuredConditionCautionMap[key];
        if (tags) {
          tags.forEach(tag => {
            activeCautions.add(tag);
            activeCautionReasons.set(tag, c.severity);
          });
        }
      });
    } else {
      const key = typePrefix;
      const tags = structuredConditionCautionMap[key];
      if (tags) {
        tags.forEach(tag => {
          activeCautions.add(tag);
          activeCautionReasons.set(tag, c.severity);
        });
      }
    }
  });

  if (needsManualReview) {
    notes.push({
      exerciseId: "global",
      exerciseName: "All",
      type: "manual_review",
      reason: "This condition needs a closer look — exercises aren't auto-adjusted for it yet. Take it easy and modify as needed.",
    });
  }

  for (let i = 0; i < adaptedWorkout.exercises.length; i++) {
    const ex = adaptedWorkout.exercises[i];
    let conflictTag: CautionTag | null = null;
    let maxSeverity = "mild";

    if (ex.cautionTags) {
      for (const tag of ex.cautionTags) {
        if (activeCautions.has(tag)) {
          conflictTag = tag;
          const sev = activeCautionReasons.get(tag);
          if (sev === "significant") maxSeverity = "significant";
          else if (sev === "moderate" && maxSeverity !== "significant") maxSeverity = "moderate";
        }
      }
    }

    if (conflictTag) {
      if (maxSeverity === "mild") {
        notes.push({
          exerciseId: ex.id,
          exerciseName: ex.name,
          type: "caution",
          reason: `Proceed with mindfulness due to your health profile.`,
        });
      } else {
        const substitute = exerciseCatalog.find(
          cEx => cEx.id !== ex.id &&
          cEx.trackingMode === ex.trackingMode &&
          cEx.focusAreas.some(fa => ex.focusAreas.includes(fa)) &&
          (!cEx.cautionTags || !cEx.cautionTags.includes(conflictTag as CautionTag))
        );

        if (substitute) {
          adaptedWorkout.exercises[i] = substitute;
          adaptedWorkout.adapted = true;
          notes.push({
            exerciseId: substitute.id,
            exerciseName: substitute.name,
            type: "substituted",
            reason: `Swapped out ${ex.name} to protect your health.`,
          });
        } else {
          notes.push({
            exerciseId: ex.id,
            exerciseName: ex.name,
            type: "caution",
            reason: `Could not find a substitute. Modify or skip this exercise if it causes discomfort.`,
          });
        }
      }
    }
  }

  return { workout: adaptedWorkout, adaptationNotes: notes };
}

export function filterExercisesByLocation(exercises: Exercise[], location: string): Exercise[] {
  if (location === "Gym" || location === "Mix of all" || !location) return exercises;
  
  return exercises.filter(ex => {
    const eq = ex.equipmentNeeded || [];
    
    if (location === "Home") {
      const needsGymEq = eq.some(e => e === "dumbbell" || e === "resistance_band" || e === "cardio_machine" || e === "pool_access");
      if (needsGymEq && !eq.includes("bodyweight_only")) return false;
      return true;
    }
    
    if (location === "Outdoors") {
      if (eq.includes("pool_access") || eq.includes("cardio_machine")) return false;
      return true;
    }
    
    return true;
  });
}
