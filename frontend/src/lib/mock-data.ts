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

export type Sport = {
  id: string;
  name: string;
  reason: string;
  difficulty: "Beginner" | "Intermediate";
  why: string;
};

export const sportRecommendations: Sport[] = [
  {
    id: "badminton",
    name: "Badminton",
    reason: "Social, low-impact, and forgiving for beginners — great for building confidence.",
    difficulty: "Beginner",
    why: "Your goals lean social and stress-relief, and you mentioned joint sensitivity. Badminton is gentle on joints, easy to learn the basics, and the doubles format takes pressure off solo performance.",
  },
  {
    id: "swimming",
    name: "Swimming",
    reason: "Full-body strength with zero joint impact — ideal for steady, sustainable progress.",
    difficulty: "Beginner",
    why: "Swimming gives you cardio and strength without weight-bearing stress. Perfect for someone starting out who wants to feel capable, not exhausted.",
  },
  {
    id: "yoga",
    name: "Yoga",
    reason: "Builds strength, flexibility, and a calmer relationship with your body.",
    difficulty: "Beginner",
    why: "You ranked stress-reduction high. Yoga is the most direct path: it builds physical strength while training your nervous system to relax.",
  },
];

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
};

export type Workout = {
  id: string;
  title: string;
  duration: number;
  exercises: Exercise[];
  difficulty: "Adjusted" | "Regular" | "Rest";
  adapted: boolean;
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
    },
    {
      id: "e5",
      name: "Plank",
      sets: 3,
      reps: 30,
      rest: 45,
      tip: "Reps are seconds — keep hips level.",
      instructions: "Forearms down, body straight from heels to head, brace the core.",
      defaultWeight: undefined,
      supportsRepCount: false,
    },
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

export type ChatMessage = {
  id: string;
  role: "user" | "ai";
  text: string;
  ts: string;
};

export const chatHistory: ChatMessage[] = [
  {
    id: "m1",
    role: "ai",
    text: "Selamat pagi, Sarah! Bagaimana perasaanmu hari ini?",
    ts: "08:12",
  },
  {
    id: "m2",
    role: "user",
    text: "Pagi! Aku agak pegal di paha dari latihan kemarin.",
    ts: "08:14",
  },
  {
    id: "m3",
    role: "ai",
    text: "Wajar setelah lower body. Aku sudah **menyesuaikan** sesi hari ini:\n\n- Volume turun 20%\n- Tambah peregangan 5 menit\n- Fokus form, bukan beban\n\nMau lanjut atau hari istirahat saja?",
    ts: "08:14",
  },
  { id: "m4", role: "user", text: "Lanjut versi yang lebih ringan ya.", ts: "08:15" },
  {
    id: "m5",
    role: "ai",
    text: "Siap. Sudah aku update di plan-mu. Ingat: konsistensi > intensitas. Kabari aku setelah selesai.",
    ts: "08:15",
  },
  { id: "m6", role: "user", text: "Btw, video squat kemarin gimana?", ts: "08:20" },
  {
    id: "m7",
    role: "ai",
    text: "Skor kamu **78** — naik 6 poin dari minggu lalu. Yang sudah bagus:\n- Kedalaman lutut sudah ideal\n- Ritme stabil\n\nYang bisa diperbaiki:\n- Lutut sedikit collapse di rep terakhir\n- Coba drill *banded squat* 2x seminggu",
    ts: "08:21",
  },
  { id: "m8", role: "user", text: "Oke aku coba. Makasih!", ts: "08:22" },
  {
    id: "m9",
    role: "ai",
    text: "Selalu di sini kalau perlu. Have a great session.",
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
      "Sesi santai untuk yang baru mulai. Tidak ada pengalaman? Tidak masalah. Kami punya raket cadangan dan akan ajarkan dasar-dasarnya.",
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
      "Lari santai 5K dengan pace ngobrol. Kita berhenti sesuai kebutuhan kelompok — ini tentang kebersamaan, bukan kecepatan.",
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
      "Modifikasi tersedia untuk semua pose. Kursi dan props disediakan. Untuk siapa pun — yang baru sembuh dari cedera, mobilitas terbatas, atau hanya ingin gerakan lembut.",
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
    description: "Gowes santai 15km menyusuri pantai. Bring your own bike.",
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
      "Belajar berenang dari nol — ramah untuk dewasa yang belum pernah belajar atau takut air.",
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
      "Your **squat depth is excellent** and your tempo is controlled — that's the hard part.\n\n• Lutut sedikit roll ke dalam pada rep terakhir, terutama di sisi kanan\n• Coba aktifkan glute medius dengan banded squat\n• Lihat ke depan, bukan ke bawah, untuk menjaga posisi dada",
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
      "**Hip stability is great.**\n\n• Siku terlalu lebar — tarik sedikit ke arah tubuh\n• Bahu cenderung naik di rep akhir, jaga rileks",
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

export type WeightEntry = {
  date: string;
  weight: number;
  completedReps: number;
  completedSets: number;
};

export type ExerciseWeightHistory = {
  exerciseId: string;
  exerciseName: string;
  unit: "kg" | "lbs";
  entries: WeightEntry[];
};

export const weightHistory: ExerciseWeightHistory[] = [
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
    },
    {
      id: "r2",
      name: "90/90 Hip Stretch",
      sets: 2,
      reps: 45,
      rest: 20,
      tip: "Reps are seconds per side.",
      instructions: "Sit with both legs at 90° angles, hold each side.",
      supportsRepCount: false,
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
    },
  ],
};
