# Physcal Project Context

This document serves as a comprehensive knowledge base for the Physcal (formerly MORF) codebase. It provides an architectural overview, feature breakdown, and design system guidelines to enable AI developers to understand and maintain the project effectively.

---

## 1. Project Overview

- **What is Physcal:** A premium wellness and fitness application designed to be inclusive for beginners, women, and people with accessibility needs. It provides adaptive AI coaching, movement analysis, and a supportive community.
- **Current Status:** The frontend is fully functional with rich mock data. Backend REST API integration is pending. The codebase has passed a comprehensive Master Audit and multiple rounds of refactoring for performance, responsiveness, and design consistency.
- **Target Users:** Beginners, people with joint/back issues, and those seeking a premium, non-intimidating fitness experience that adapts to their body's needs daily.
- **Branding:** The official logo is a custom image asset (`/public/favicon.png` → served at `/favicon.png`). It is used as the sole visual brand mark across all surfaces — no custom SVG wordmark or Lucide icon is used for the logo.

---

## 2. Full Feature List

- **Landing Page (`/`):** A cinematic, scroll-driven landing page with a sticky horizontal-scroll phase section (Phases 1–3: Analyze → Adapt → Achieve) that locks vertical scroll progress until all three phases have been swiped through. Also includes a `HeroSection` with a video-to-card morphing animation, a Bento grid of feature cards, and a `FooterCTA`.
- **Authentication (`/login`, `/signup`, `/forgot-password`):** Three screens sharing the `AuthShell` component. `AuthShell` handles the decorative gradient background, back-to-home arrow, and centered logo rendered as an `<img>` tag.
- **Onboarding (`/onboarding`):** A complex, multi-step wizard (welcome → profile → goal → sport → level → condition → loading → result → reassess) using Framer Motion for transitions. State is held in `onboardingSlice.ts`. On completion, new users are routed to `/tutorial?from=onboarding` (first-timers) or `/dashboard` (returning users checked via `hasSeenTutorial` in `appSlice`).
- **Interactive Tutorial (`/tutorial`):** An 11-slide guided tour built from isolated interactive mini-demos using real app components (`RepCounter`, `ChatBubble`, `CircularScore`, `BadgeCard`, `EventCard`, etc.) on local `useState` — never touching global store. Supports keyboard navigation, touch swipe, and `prefers-reduced-motion`. The shell (`TutorialShell.tsx`) hides `SideNav` and `BottomNav` for a full-screen immersive experience. Accessible via onboarding flow or via Profile → Account → "How Physcal Works".
  - **Slides:** 01 Welcome · 02 Your Plan · 03 Daily Check-in · 04 Focus Mode · 05 AI Chat · 06 Movement Analysis · 07 Badges · 08 Community · 09 Profile & Progress · 10 Safety · 11 Ready (exit)
- **Dashboard (`/dashboard`):** The primary hub aggregating nudges, today's workout plan, health milestones, and event previews. Uses `NudgeBanner`, `WorkoutCalendar`, and `HealthProfileCard`. The `useDashboardStats` hook is the single source of truth for metrics.
- **Coach / Daily Check-in (`/coach`):** The daily check-in UI (logging sleep, stress, soreness) and the active workout plan via calendar/session data.
- **Focus Mode / Workout Session (`/coach/workout/$sessionId`):** The core workout controller. Handles session initialization, exercise flow, state updates, and lazy component loading (`RepCounter`, `InjuryPauseSheet`, `IntervalTimer`). Implements `WakeLock` to keep the screen active.
  - **Tracking Modes:** Each exercise is typed with one of four `TrackingMode` values — `rep`, `hold`, `interval`, or `distance` — and the UI renders the correct controller automatically.
  - **Rep Counter:** Voice (Web Speech API) and Manual modes. Camera mode is stubbed.
  - **Interval Timer (`IntervalTimer.tsx`):** Dedicated controller for `interval`-mode exercises. Shows a circular SVG ring countdown, alternating between **WORK** (Sun Glare) and **REST** (Exuberant Orange) phases across configurable rounds (`intervalRounds`, `workSeconds`, `restSeconds`). Fires haptics (`navigator.vibrate`) on phase transitions. After all rounds complete, prompts an **RPE self-report** (1–5 scale) before advancing. State lives in `WorkoutSlice` (`startIntervalRound`, `tickIntervalTimer`, `setIntervalPhase`, `endInterval`).
  - **Hold Timer (`HoldTimer.tsx`):** For static exercises (like planks). Uses an SVG ring countdown based on the target seconds (using the `reps` field).
  - **Distance Logger (`DistanceLogger.tsx`):** For distance-based exercises (like running or cycling). Captures both `durationMin` and `distanceKm`.
  - **Rest Timer:** Circular countdown overlay between sets with skip and add-time controls.
  - **Injury Pause:** Snapshot current progress and switch to a gentle recovery workout; resumes exactly where left off.
- **AI Coach Chat (`/coach/chat`):** Conversational AI UI with simulated typing and prompt suggestions. Bound to `appSlice` for intent-based state mutations (volume adjustments, recovery swaps).
- **Movement Analysis (`/analysis`):** Upload a short video clip for simulated AI form feedback. Includes a result page (`/analysis/result`) with typed exercise options (`AnalyzableExercise`). Corrective drills can be injected directly into the daily plan.
- **Community (`/community`):** Discover, filter, and create inclusive events. Capacity/waitlists use Radix `Progress` + `Tooltip`. AI event generation in `/community/create`. Events are automatically sorted by a `socialFit` score based on the user's `TrainingProfile.socialPreference` and `goals`.
- **Profile (`/profile`):** User stats, weekly session bar chart (Recharts), sport management, achievements, notification settings, and account actions.
  - **Sub-routes:** `/profile/achievements` (badge grid with Radix Popover hints) · `/profile/goals` · `/profile/weight` (also visualizes Exercise Load Progress to track weight improvements over time) · `/profile/history` · `/profile/nudges`
  - **Account Card:** "How Physcal Works" link navigates to `/tutorial?from=profile`.
- **Reassessment (`/onboarding/reassess`):** Periodic check-in to promote fitness level or adjust goals.

---

## 3. Tech Stack & Architecture Decisions

- **Framework:** React 19, Vite, TypeScript with TanStack Start (SSR/prerender).
- **Routing:** `@tanstack/react-router` file-system routes in `src/routes/`. Global layout in `__root.tsx`. `SideNav` and `BottomNav` are hidden on `/onboarding`, `/tutorial`, and `/coach/workout` routes.
- **Styling:** Tailwind CSS v4 with a custom CSS variable system (`styles.css`) for glassmorphism and the Pantone sport palette. `overflow-x: clip` (not `hidden`) is applied globally to `html, body` to allow `position: sticky` to work correctly in nested scroll containers (critical for the landing page horizontal scroll).
- **UI Primitives:** `@radix-ui/react-popover`, `@radix-ui/react-progress`, `@radix-ui/react-tooltip`.
- **State Management:** Zustand with modular slices (`appSlice`, `onboardingSlice`, `workoutSlice`) combined in `src/lib/store/index.ts`.
- **Animations:** `framer-motion` for page transitions, staggered reveals, scroll-driven horizontal phase animation, and tutorial slide transitions.
- **Data Strategy:** Fully mock-data driven (`src/lib/mock-data.ts`). Store + UI structured to swap to REST APIs seamlessly.
- **Data Formatting:** All enum/union display logic in `src/lib/format.ts`.
- **Icons:** `lucide-react`. Note: the **brand logo** uses `<img src="/favicon.png" />`, not a Lucide icon.

---

## 4. State Management & Data

State is managed via Zustand (`src/lib/store/types.ts`):

- **`AppSlice`:** Global UI state — theme (persisted to `localStorage`), check-in status, nudge persistence, `HealthProfile`, `TrainingProfile`, and **`hasSeenTutorial`** (persisted to `localStorage` under key `physcal-tutorial-seen`). Controls the one-time tutorial routing gate.
- **`OnboardingSlice`:** Temporary wizard state (goals, health details). `resetOnboarding` only clears this slice.
- **`WorkoutSlice`:** Complex session state — completed sets, exercise index, live rep count, rest timer, injury-pause snapshot.

---

## 5. Design System & UI Patterns

- **Aesthetic:** "Silver-Mint" frosted-glass aesthetic supporting Light and Dark modes.
- **Brand Logo:** A single PNG image (`/favicon.png`) used everywhere as an `<img>` tag with `object-contain` and natural aspect ratio (never cropped with `object-cover` in a square container). Also registered as the browser tab favicon and Apple touch icon.
- **Color Palette (Pantone sport colors, `useColors()` hook):**
  | Token | Value | Usage |
  |---|---|---|
  | Sun Glare | `#D6E800` | Primary accent, CTA backgrounds |
  | Exuberant Orange | `#F5522A` | Secondary accent, warnings, destructive |
  | Blue Violet | `#6B5FC3` | Tertiary accent |
  | Cloud Dancer | `#F2F0E9` | Primary text (dark mode) / surfaces |
  | Darkest Hour | `#2A2A2A` | Backgrounds |
- **Typography:** `Plus Jakarta Sans` (sans/display/mono), `Instrument Serif` (serif). Loaded from Google Fonts.
- **Key CSS Classes:**
  - `.glass`, `.glass-strong`, `.glass-light` — glassmorphism surfaces with `backdrop-filter`
  - `.card-frosted`, `.card-frosted-light` — content cards
  - `.btn-pill-primary`, `.btn-pill-orange` — CTA buttons
  - `.app-stage`, `.bg-stage` — radial gradient background
  - `.no-scrollbar` — hide scrollbars on overflow containers
- **Components:**
  - **AppShell:** Root wrapper enforcing `SideNav` (desktop) + `BottomNav` (mobile).
  - **PhyscalAlert:** Single-source-of-truth for all disclaimers and health notices.
  - **TutorialShell:** Full-screen shell for the 11-slide interactive tour, hides navigation.

---

## 6. Known Edge Cases & Limitations

- **Sticky Scroll (Landing Page):** `position: sticky` requires that no ancestor sets `overflow` to `hidden` or `auto`. Globally, `html, body` use `overflow-x: clip` (not `overflow-x: hidden`) specifically to preserve sticky behavior. The `LandingPage` root `<div>` must not set `overflowX: 'hidden'`.
- **Tutorial State Gate:** `hasSeenTutorial` is read from `localStorage` on app boot. New users from onboarding are routed to `/tutorial?from=onboarding`; returning users bypass it. The tutorial can be re-accessed at any time via Profile → Account.
- **Rep Counter Compatibility:** Voice mode uses the Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`). Gracefully degrades to manual tap counting if unsupported. Camera mode is stubbed.
- **Wake Lock:** `navigator.wakeLock` in `coach.workout.$sessionId.index.tsx` fails silently in non-HTTPS or low-battery environments.
- **Injury Pause Continuity:** `pausedSessionSnapshot` captures session progress. Switching to recovery clears active sets. Resuming restores the snapshot.
- **Logo Aspect Ratio:** The logo PNG is landscape/rectangular. Always use `w-auto h-{size} object-contain` — never force it into a square container with `object-cover` or it will be cropped.
- **Legacy Style Aliases:** Some legacy classes (e.g., `.bg-sage-stage`) remain in `styles.css` but are remapped to the Darkest Hour palette.
- **Routing Strictness:** TanStack Router requires explicit typing of dynamic segments and search params in route configuration.
