# Physcal Project Context

This document serves as a comprehensive knowledge base for the Physcal (formerly MORF) codebase. It provides an architectural overview, feature breakdown, and design system guidelines to enable AI developers to understand and maintain the project effectively.

## 1. Project Overview
- **What is Physcal:** A premium wellness and fitness application designed to be inclusive for beginners, women, and people with accessibility needs. It provides adaptive AI coaching, movement analysis, and a supportive community.
- **Current Status:** The frontend is built and fully functional using robust mock data. Backend REST API integration is pending. The codebase has recently passed a comprehensive Master Audit verifying state flows and data model consistency.
- **Target Users:** Beginners, people with joint/back issues, and those looking for a premium, non-intimidating fitness experience that adapts to their body's needs.

## 2. Full Feature List
- **Dashboard (`/dashboard`):** The primary landing hub aggregating nudges, today's workout plan, health milestones, and event previews. Includes components like `NudgeBanner` (now unified and driven by global state), `WorkoutCalendar`, and `HealthProfileCard`. Uses the `useDashboardStats` hook for single-source-of-truth metrics.
- **Onboarding (`/onboarding`):** A complex, multi-step wizard (welcome, profile, goal, sport, level, condition, loading, result, reassess) utilizing Framer Motion for transitions. Stores state in `onboardingSlice.ts`.
- **Coach / Daily Check-in (`/coach`):** Handles the daily check-in UI (logging sleep, stress, and soreness) and displays the active workout plan using calendar/session data.
- **Focus Mode / Workout Session (`/coach/workout/$sessionId`):** The core workout controller. Handles session initialization, exercise flow, state updates, and lazy component loading for heavy modules (`RepCounter`, `InjuryPauseSheet`). Includes a WakeLock implementation to keep the screen on.
  - **Rep Counter:** Supports Voice (Web Speech API) and Manual modes. Camera mode is currently a stub.
  - **Rest Timer:** Overlay with a circular countdown, skip, and add time functionalities.
  - **Injury Pause:** Allows users to pause a session, snapshot their progress, and switch to a gentle recovery workout (`InjuryPauseSheet`).
- **AI Coach Chat (`/coach/chat`):** Conversational AI interaction UI with simulated typing states and prompt suggestions. Directly bound to `appSlice` to perform state mutations (like volume adjustments or recovery swaps) based on AI intent.
- **Movement Analysis (`/analysis`):** Allows users to upload a short video for instant simulated AI feedback on their technique. Includes an analysis result page (`/analysis/result`) and strictly typed exercise options (`AnalyzableExercise`).
- **Community (`/community`):** Discover, search, filter, and create inclusive sports events. Event capacity and waitlists are powered by Radix primitives (`Progress`, `Tooltip`).
- **Profile (`/profile`):** Displays user stats, a weekly sessions chart (using Recharts), achievements (`/profile/achievements` - featuring Radix `Popover` hints for locked badges), sports profile, and notification settings.

## 3. Tech Stack & Architecture Decisions
- **Framework:** React 19, Vite, TypeScript.
- **Routing:** `@tanstack/react-router` with a file-system-based route structure located in `src/routes`. The global layout is defined in `__root.tsx`.
- **Styling:** Tailwind CSS v4 paired with a custom CSS variable system (`styles.css`) for advanced glassmorphism and the Pantone sport palette.
- **UI Primitives:** `@radix-ui/react-popover`, `@radix-ui/react-progress`, and `@radix-ui/react-tooltip` are integrated seamlessly with the custom design system (e.g., custom indicator colors and shadows).
- **State Management:** Zustand with a modular slice pattern (`appSlice`, `onboardingSlice`, `workoutSlice`) combined in `src/lib/store/index.ts`.
- **Animations:** `framer-motion` for complex page transitions, staggered reveals, and micro-interactions.
- **Data Strategy:** Currently relies entirely on `src/lib/mock-data.ts`. The Zustand store and UI components are structured to seamlessly swap mock calls for actual REST API queries.
- **Data Formatting:** All enum/union display logic is centralized in `src/lib/format.ts` to prevent UI drift and raw data leaking into views.
- **Icons:** `lucide-react`.

## 4. State Management & Data
State is managed via Zustand and defined in `src/lib/store/types.ts`:
- **`AppSlice`:** Manages global UI state including theme preferences (persisted to `localStorage`), check-in status, nudge persistence, the user's `HealthProfile`, and the `TrainingProfile` (goals, fitness level, primary/additional sports, equipment, intensity modifier).
- **`OnboardingSlice`:** Manages the temporary state of the onboarding wizard (user goals, physical health details) and flow state reset logic. (Note: `resetOnboarding` only clears this slice, leaving global app state intact).
- **`WorkoutSlice`:** Manages complex temporal data for workout sessions, including completed sets, current exercise index, live rep count, rest timer mechanics, and the injury-pause workflow (`WorkoutSessionState`, `pausedSessionSnapshot`).

## 5. Design System & UI Patterns
- **Aesthetic:** "Silver-Mint" frosted-glass aesthetic that supports both Light and Dark modes. The app enforces a premium, highly polished feel.
- **Color Palette:** Based on Pantone sport colors defined in `styles.css` and exposed via the `useColors()` hook.
  - Sun Glare (`#D6E800`) - Primary accent
  - Exuberant Orange (`#F5522A`) - Secondary accent / warnings
  - Blue Violet (`#6B5FC3`) - Tertiary accent
  - Cloud Dancer (`#F2F0E9`) - Primary text (dark mode) / surfaces
  - Darkest Hour (`#2A2A2A`) - Backgrounds
- **Typography:** `Plus Jakarta Sans` for sans/display/mono, and `Instrument Serif` for serif touches. Configured globally.
- **UI Components & Classes:**
  - **AppShell:** The root wrapper enforcing `SideNav` (desktop) and `BottomNav` (mobile) layouts.
  - **Cards:** Always use the `.card-frosted` or `.card-frosted-light` utility classes for consistent glassmorphism shadows and borders.
  - **Buttons:** Use `.btn-pill-primary` (Sun Glare) and `.btn-pill-orange` (Exuberant) classes.
  - **PhyscalAlert:** The single source of truth component for all disclaimers, warnings, and health notices.
  - **Theming Logic:** The `useTheme()` hook and `AppShell` synchronize the `theme` state with the `<html>` classList for Tailwind's dark mode variants.

## 6. Known Edge Cases & Limitations
- **Rep Counter Compatibility:** The voice recognition feature relies on the Web Speech API (`SpeechRecognition` or `webkitSpeechRecognition`), which is not supported in all browsers. It gracefully degrades to manual tap counting. The camera mode is intentionally stubbed for future implementation.
- **Wake Lock:** The `coach.workout.$sessionId.index.tsx` route attempts to use the `navigator.wakeLock` API. This is prone to failing silently in unsupported browsers or restrictive environments (e.g., non-HTTPS, low battery).
- **Injury Pause Continuity:** Redirecting a user to a recovery session captures a snapshot of current progress (`pausedSessionSnapshot`) and clears active sets for the recovery session. Resuming restores the snapshot perfectly.
- **Legacy Style Aliases:** Some legacy CSS classes (e.g., `.bg-sage-stage`) exist in `styles.css` but have been remapped internally to use the new Darkest Hour palette to prevent breaking older components during the transition.
- **Routing Strictness:** TanStack Router requires exact route definitions; ensure any new dynamic segments or search params are explicitly typed in the route configuration.
