# MORF Frontend Architecture & Context (Updated)

This document provides a highly comprehensive overview of the MORF frontend application architecture. It serves as the single source of truth for the AI assistant to grasp the project's state, structure, styling methodologies, state management, and business logic. 

*(Note: Raw code blocks were removed from this context file; the agent should read the necessary modules natively via its file-reading tools to ensure it is seeing the latest, most accurate source code).*

## 1. Tech Stack & Dependencies

*   **Core:** React 19 (^19.2.0), React DOM 19, TypeScript (v5.8).
*   **Meta-Framework & Routing:** TanStack Start paired with @tanstack/react-router for file-based routing and SSR/SPA configurations.
*   **State Management:** 
    *   zustand: Handles global application state (themes, onboarding steps, health condition profiles).
    *   @tanstack/react-query: For future async data fetching/caching layers.
*   **Styling & UI:** Tailwind CSS v4 (@tailwindcss/vite), clsx, 	ailwind-merge for class compositions.
*   **UI Primitives:** shadcn/ui inspired modular components built on @radix-ui/react-* primitives, along with Embla Carousel and Vaul for accessible interaction patterns.
*   **Animations:** ramer-motion and 	w-animate-css are heavily utilized for fluid mobile-first transitions (especially in onboarding, coach interactions, and daily check-ins).
*   **Forms & Validation:** eact-hook-form paired with @hookform/resolvers and zod.
*   **Build Tooling:** Vite with configurations predominantly managed by the @lovable.dev/vite-tanstack-config preset.

## 2. File Structure & Architectural Layout

`	ext
frontend/
  ├── package.json
  ├── vite.config.ts            # Vite & Lovable preset configs
  ├── components.json           # shadcn/ui configuration
  ├── tsconfig.json             # TypeScript settings
  ├── src/
  │   ├── server.ts             # Server entry and SSR error wrapper
  │   ├── start.ts              # Client entry point
  │   ├── styles.css            # Tailwind V4 imports & custom core CSS variables / modes
  │   ├── router.tsx            # Main router provider context
  │   ├── routeTree.gen.ts      # Generated robust route mappings
  │   ├── lib/
  │   │   ├── store.ts          # Zustand global store (Theme, Onboarding, Toggles)
  │   │   ├── mock-data.ts      # Mocked API representing Athena AI schemas
  │   │   └── utils.ts          # Utility functions (e.g., Tailwind class merging)
  │   ├── hooks/                # Local hooks (useTheme, useColors, use-mobile)
  │   ├── components/
  │   │   ├── ui/               # Standard Radix interface parts (Buttons, Dialogs, Selects)
  │   │   ├── layout/           # AppShell, PageHeader, Navbars, ThemeToggles
  │   │   └── *                 # Domain specific modules: EventCard, CheckinDot, WorkoutCalendar
  │   └── routes/
  │       ├── __root.tsx                    # Root UI shell & baseline Providers
  │       ├── index.tsx                     # Landing page routing
  │       ├── dashboard.tsx                 # Core user overview (hub)
  │       ├── onboarding.*                  # Workflows for user initial setup and quizzes
  │       ├── coach/                        # AI Coach routines, workouts, summaries
  │       ├── community/                    # Event structures and location-based discovery
  │       ├── profile/                      # Achievements, user nudges, parameters
  │       ├── analysis/                     # Analytics results
  │       └── (auth routes)                 # login, signup, forgot-password
`

## 3. Global Application State (src/lib/store.ts)

The zustand implementation tracks multi-faceted data heavily centered around personalization:
*   **Theme Initialization:** Toggles light, dark, or system modes, storing values in localStorage under physcal-theme.
*   **Full Onboarding Flow Context:** Maintains in-depth survey inputs required by the AI mock data to generate workout boundaries (goals, itnessLevel, location, 	imePerWeek, confidence).
*   **Health Parameter Arrays:** An exceptionally complex piece that holds details specifying active joint issues or vulnerabilities alongside their severities (mild, moderate, significant) and exact avoidance mechanisms.
*   **Lifecycle Switches:** Contains UI trigger booleans defining if the daily check-in is done (checkinDoneToday), smart reminders active, or panel expansiveness (
udgeDismissed, healthPanelExpanded).

## 4. Mock Data Paradigms (src/lib/mock-data.ts)

Currently, business logic is simulated through rigorous data models defining the app's smart agent, _"Athena"_:
*   **Generative Workout Assembly:** Contains plans adjusting iteratively depending on user factors dapted: true, generating structured exercises (repetitions, seconds, targeted warnings).
*   **Event Emulation:** Hardcoded lists mapping out nearby events utilized primarily in the /community tabs, with tags mapped sequentially to onboarding parameters.
*   **Gamification Vectors:** Generates badges, milestones, week streaks, and user progression analytics integrated flawlessly into the Recharts components under profiles.
*   **Agent Dialogue Chat:** Pre-rendered arrays imitating real conversational NLP text strings from an interactive coach, dynamically assisting via /coach/chat.

## 5. UI Architecture & Patterns

*   **Responsive & Mobile-first:** Everything nests within a standard overarching <AppShell /> enforcing structural rigidity across all devices with cohesive, accessible navigation.
*   **Motion Semantics:** ramer-motion applies sophisticated exit/entrance routines seamlessly managing multi-step screens like /onboarding, dynamic WorkoutCalendar interactions, or the conditional Coach Check-in expansion menus.
*   **Strict Design System Isolation:** Generic baseline components isolated in /ui, avoiding domain logic. Any functional business concepts (Gamified Rings, Athlete Status, Calendars) reside openly in /components.

## 6. Build and Deployment Execution

*   **Build Preset Customization:** Handled exclusively inside ite.config.ts loading @lovable.dev/vite-tanstack-config. It seamlessly manages SPA defaults and Tailwind 4 configuration integrations absent of typical config heavy-lifting.
*   **Target Environments:** Currently defined optimally for sandboxed standard Node executions, with cloudflare: false pre-selected emphasizing Vercel or isolated React environments prior to deeper edge adoptions.
