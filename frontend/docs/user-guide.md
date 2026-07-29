# Physcal: Complete User Guide & Experience Flow

Welcome to **Physcal**, an inclusive, AI-powered wellness and fitness platform. This guide explains how to navigate the application, the philosophy behind the user experience, and a breakdown of every core user flow.

---

## 1. Introduction & Philosophy

Physcal is designed to be the exact opposite of an intimidating, hyper-competitive fitness app.  
Our core philosophy:

- **Inclusivity:** Built for beginners, women, and individuals with accessibility needs or joint/health conditions.
- **Adaptability:** Workouts are not rigid. If you feel tired, sore, or injured, the AI adjusts volume, intensity, or swaps your plan in real-time.
- **Holistic Wellness:** Fitness isn't just about reps. We track sleep, stress, soreness, and energy to build a complete picture of your health.
- **Aesthetic:** A premium frosted-glass dark/light design system that feels welcoming, clean, and entirely non-judgmental.

---

## 2. Landing Page

Visiting Physcal for the first time brings you to the marketing landing page (`/`).

- **Header:** The Physcal logo sits top-left with "Sign In" and "Get Started" links top-right.
- **Hero Section:** A cinematic video that morphs into a card on scroll, accompanied by the brand headline.
- **Phase Scroll Section:** A sticky horizontal-scroll sequence — the page locks vertical scrolling while you scroll through three phases:
  1. **Phase 01 · Analyze** — The AI learns your body and goals.
  2. **Phase 02 · Adapt** — Your plan flexibly changes with your daily state.
  3. **Phase 03 · Achieve** — Sustainable, consistent progress. Once Phase 3 is fully visible, vertical scrolling resumes to the footer.
- **Feature Grid:** A Bento-style grid of feature highlights.
- **Footer CTA:** Final call-to-action to sign up, plus navigation links.

---

## 3. Authentication

Three auth screens share the same shell (`AuthShell`):

- **Sign In (`/login`):** Email + password form with a "Forgot password?" link and Google/Apple social login placeholders.
- **Sign Up (`/signup`):** Name, email, and password registration form.
- **Forgot Password (`/forgot-password`):** Email submission to trigger a password reset flow.

All screens display the Physcal logo prominently, a back-to-home button, and a frosted-glass card form with animated entry.

---

## 4. Onboarding (`/onboarding`)

Unlike traditional apps that throw you into a workout immediately, Physcal takes time to understand *you*.

### Steps

1. **Welcome** — Introduction to the Physcal experience.
2. **Goals** — Select multiple goals: lose weight, build strength, manage stress, recover from injury, etc.
3. **Current Level & Lifestyle** — Baseline activity level, preferred workout location (Home / Gym / Outdoors), weekly time available.
4. **Primary Sport** — Choose a primary sport (e.g., Running, Yoga, Climbing, Strength Training).
5. **Additional Sports** — Optional extra activities to bias muscle focus.
6. **Health & Safety (Crucial)** — Declare any pre-existing conditions (e.g., lower back pain, wrist issues, knee sensitivity). Physcal's engine uses this to filter out exercises with matching caution tags — you will never see a deep knee squat if you report knee issues.
7. **Loading Screen** — Simulated AI processing generates your tailored baseline plan.
8. **Result** — Your personalized starter plan is revealed.

### After Onboarding

- Users are routed to the **Interactive Tutorial** (`/tutorial?from=onboarding`) before landing on the Dashboard.

---

## 5. Interactive Tutorial (`/tutorial`)

An 11-slide guided tour that introduces every major Physcal feature. Navigation is fully hidden during the tour for a focused, immersive experience.

| Slide | Topic |
|---|---|
| 01 | Welcome to Physcal |
| 02 | Your Adaptive Plan |
| 03 | Daily Check-in |
| 04 | Focus Mode (Workout Session) |
| 05 | AI Coach Chat |
| 06 | Movement Analysis |
| 07 | Achievements & Badges |
| 08 | Community Events |
| 09 | Profile & Progress |
| 10 | Safety & Disclaimers |
| 11 | Ready — Let's Start |

- **Navigation:** Tap/click **Next**, use keyboard arrow keys, or swipe left/right on touch devices.
- **Skip:** A "Skip tour" link is always visible to exit early.
- **Re-access:** You can revisit the tutorial at any time via **Profile → Account → How Physcal Works**.

---

## 6. The Dashboard: Your Daily Hub (`/dashboard`)

Once onboarded, the Dashboard is the central nervous system of your Physcal experience.

- **Personalized Greeting:** A warm welcome summarizing your current state.
- **Nudge Banner:** Smart, context-aware reminders. If your streak is at risk or you hit a milestone (e.g., 30 days active), the banner prompts you accordingly.
- **Athena's Weekly Report:** A simulated AI insight summarizing weekly progress and offering encouragement.
- **Workout Calendar & Today's Plan:** A quick glance at your scheduled activity for the week.
- **Health Snapshot:** Your streak counter (rest days don't break it), weekly session count, and weight goal progress.

---

## 7. Coach & Workout Experience

The Coach tab (`/coach`) is where the action happens.

### Daily Check-in

Before starting a workout, Physcal asks a quick **5-metric check-in:**
- Energy · Soreness · Mood · Sleep · Stress

> If you report high soreness or low energy, the AI Coach will immediately suggest a reduced-volume or Recovery session. Accept it with one tap.

### AI Coach Chat (`/coach/chat`)

Chat directly with your AI Coach, Athena. Example: *"My knees hurt today"* → the system strips out high-impact leg exercises and shows you exactly what changed and why.

### Focus Mode (`/coach/workout/$sessionId`)

Hitting **Start Workout** locks you into Focus Mode — a clean, distraction-free session controller.

- **Rep Counter:** Large tap targets. Also supports **Voice Counting** (Web Speech API) so you never have to touch your phone mid-set.
- **Interval Timer:** Automatically activated for cardio and HIIT-style exercises. A large circular ring counts down your **WORK** time (glowing yellow), then switches to **REST** time (glowing orange) across multiple rounds. Your phone vibrates at every phase change. After all rounds complete, you'll be asked to rate your exertion on a quick 1–5 scale before moving on.
- **Hold Timer:** Perfect for static holds like planks or wall sits. Tap to start the countdown ring, and pause at any time.
- **Distance Logger:** For runs or cycling, manually log your final duration and distance (km) when you finish the set.
- **Rest Timer:** Full-screen overlay countdown. Tap to add time or skip rest entirely.
- **Injury Pause:** If you feel sharp pain, hit Pause. Physcal snapshots your exact progress and lets you switch to a gentle Recovery Session instantly. When you return — even days later — it resumes exactly where you left off.
- **Exercise Swaps:** Swap any exercise at any time. Suggestions only include alternatives that match the original muscle group *and* respect your health conditions.
- **Screen Wake Lock:** The screen stays on automatically during a session so the rep counter is always visible.

---

## 8. Movement Analysis (`/analysis`)

Verify your form without a personal trainer.

1. **Select an Exercise:** Choose from supported movements (e.g., Squat, Push-up, Lunge, Romanian Deadlift).
2. **Upload Video:** A short clip of your form.
3. **AI Feedback:** Simulated processing returns a detailed breakdown — perfect angles, minor deviations, actionable safety tips.
4. **Corrective Drills:** The AI often surfaces specific drills that can be injected directly into your daily plan with one button press.

---

## 9. Community (`/community`)

Fitness is easier together.

- **Discover Events:** Browse and filter inclusive local sports events. Events are automatically recommended and sorted for you based on your social preferences and fitness goals.
- **Inclusive Filtering:** Events are tagged by intensity (e.g., "Beginner friendly", "Knee-safe").
- **Event Capacity:** Visualized with interactive progress bars and tooltip popups.
- **Create an Event (`/community/create`):** Use the AI generator to instantly draft a well-structured, inclusive event title and description based on your selected sport and location.
- **Safety:** All community events display a `PhyscalAlert` reminding users that events are peer-organized and to consult a doctor for health conditions.

---

## 10. Profile & Progress Tracking (`/profile`)

Your historical ledger and account hub.

- **Visual Analytics:** Completed sessions mapped in a weekly bar chart.
- **Sport Management:** Add or remove sports from your training profile.
- **Achievements (`/profile/achievements`):** Earn badges for consistency, comebacks, and milestones. Locked badges include frosted-glass popover hints explaining how to unlock them.
- **Weight Tracking (`/profile/weight`):** Log and visualize body weight over time. You can also view your **Exercise Load Progress** here to see how your lifting weights have improved across recent sessions.
- **Session History (`/profile/history`):** Paginated log of all completed sessions.
- **Goals (`/profile/goals`):** Review and adjust your fitness goals.
- **Nudge History (`/profile/nudges`):** See all past smart reminders.
- **Settings & Reassessment (`/onboarding/reassess`):** Every 30 days (or on demand), run a Reassessment. Physcal evaluates your consistency and gently promotes you to the next difficulty level, ensuring you never plateau.
- **Account:** Manage email, password, and access the interactive tutorial at any time via **"How Physcal Works"**.

---

## 11. Theme

Physcal supports **Dark Mode** (default) and **Light Mode**, toggled via the Theme Toggle in the sidebar (desktop) or within Settings. Your preference is persisted across sessions.

---

### Summary

Physcal isn't just a tracker; it's a dynamic, responsive companion. By managing all state through Zustand with a single source of truth for your health and training profile, every corner of the app — from community event recommendations to the mid-workout rest timer — adapts to exactly how you feel *today*.
