<div align="center">

  # PHYSCAL

  **Move Beyond Your Limits with AI**

  *An inclusive, adaptive, AI-powered wellness and physical activity platform designed for beginners, women, and individuals with health and accessibility considerations.*

  [![React](https://img.shields.io/badge/React-19-blue.svg?logo=react)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
  [![TanStack Router](https://img.shields.io/badge/TanStack_Router-Latest-FF4154.svg?logo=reactrouter)](https://tanstack.com/router)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38BDF8.svg?logo=tailwindcss)](https://tailwindcss.com/)
  [![Zustand](https://img.shields.io/badge/State-Zustand-764ABC.svg)](https://zustand-demo.pmnd.rs/)

</div>

---

## Overview


> **Project Scope:** This repository currently contains the **Frontend** application for Physcal. The backend infrastructure, built using **Spring Boot**, **Python** (for ML/Vision APIs), **Docker**, and **MySQL**, is under active architecture design and will be integrated in a subsequent release. Currently, the application utilizes Zustand state management and client-side algorithms for demonstration.

Physcal is designed to prioritize inclusivity, safety, and adaptability in physical activity. Rather than enforcing rigid workout regimens, Physcal dynamically adjusts training plans, workout sessions, and community activities based on user-reported health conditions, physical feedback, and real-time state.

---

## Core Features

### 1. Inclusive & Adaptive Onboarding
* **Health & Safety Disclosures:** Users specify physical conditions (e.g., knee sensitivity, lower back pain, post-injury recovery). The platform's filtering engine automatically excludes exercises carrying conflicting safety tags.
* **Goal & Social Preferences:** Tailors session recommendations according to primary goals (health, strength, stress management, recovery) and preferred training environments (solo, partner, small group).

### 2. Focus Mode Tracking Modes
* **Rep Counter:** Features high-visibility UI targets, voice counting support via Web Speech API, and stubbed computer vision integration for hands-free tracking.
* **Interval Timer:** Displays a circular timer highlighting WORK and REST phases, provides haptic feedback during phase shifts, and includes automated RPE (Rate of Perceived Exertion) logging.
* **Hold Timer:** Provides isometric countdown tracking (e.g., planks, wall sits) with full pause and resume capability.
* **Distance Logger:** Enables manual input of duration (minutes) and distance (kilometers) for endurance activities such as running and cycling.

### 3. Injury Pause & Recovery Workflows
* **Progress Snapshot:** Triggers an automatic state snapshot if a user pauses due to acute discomfort or pain.
* **Recovery Transition:** Allows immediate switching to an injury-safe recovery routine, retaining original workout progress for seamless resumption later.
* **Exercise Substitution:** Enables real-time substitution of individual exercises with anatomically equivalent, condition-safe alternatives.

### 4. AI Coaching & Safety Automation
* **Conversational Adjustments:** Enables users to request volume reductions (e.g., 20% load reduction), schedule recovery days, or log fatigue directly via natural language chat.
* **Athena Safety Guard:** Evaluates health profile compatibility prior to joining community events, displaying explicit warnings for high-intensity activities.

### 5. Community Hub & Event Management
* **Personalized Event Discovery:** Ranks community events based on user social preferences and sport interests.
* **Safety & Inclusivity Classifications:** Categorizes events by intensity levels (Beginner Friendly, General Fitness, Advanced) and verifies host accreditation (e.g., Certified Instructor).
* **Capacity Management:** Displays real-time capacity progress, tooltip details, and automated waitlist assignment.
* **AI Event Generator:** Generates structured event titles and descriptions based on sport selection and venue parameters.

### 6. Progress Analytics & History
* **Exercise Load Progression:** Tracks load increases over time across strength training movements.
* **Body Weight Tracking:** Logs weight trends over time against user-defined goals.
* **Milestone & Achievement Tracking:** Awards badges based on streak consistency, total completed sessions, and community engagement.

---

## Design System

Physcal implements a **Silver-Mint Frosted-Glass Aesthetic** built upon a defined Pantone Sport palette:

* **Sun Glare** (`#D6E800`) – Active state highlights, primary buttons, and progress indicators.
* **Exuberant Orange** (`#F5522A`) – Accents, recovery indicators, and warning states.
* **Blue Violet** (`#6B5FC3`) – AI coach avatar, badges, and secondary highlights.
* **Cloud Dancer** (`#F2F0E9`) – Surface text and light mode canvas.
* **Darkest Hour** (`#2A2A2A` / `#1C1C1A`) – Dark mode canvas and structural glass cards.

Theme state across Dark and Light modes is synchronized centrally via the `useColors()` hook.

---

## Tech Stack

### Frontend (Current Implementation)
* **Framework:** React 19 + Vite
* **Routing:** `@tanstack/react-router` (Type-safe file-based routing)
* **State Management:** Zustand (`AppSlice`, `OnboardingSlice`, `WorkoutSlice`)
* **Styling:** Vanilla CSS design tokens + TailwindCSS v4
* **Component Primitives:** Radix UI, Lucide React Icons, Sonner (Toasts)
* **Visualization:** Recharts
* **Animations:** Framer Motion

### Backend (Planned Infrastructure)
* **Core API Services:** Spring Boot (Java REST API)
* **AI & Vision Services:** Python (Computer Vision and NLP engine)
* **Database:** MySQL (Relational persistence)
* **Containerization:** Docker

---

## Repository Structure

```text
PHYSCAL/
├── PROJECT_CONTEXT.md       # Technical specification and architecture documentation
├── README.md                # Repository overview and setup instructions
└── frontend/
    ├── docs/
    │   └── user-guide.md    # Application feature guide and workflow reference
    ├── public/
    │   └── favicon.png      # Brand mark asset
    └── src/
        ├── components/      # UI components and tracking overlays
        │   ├── ui/          # Radix UI primitive wrappers
        │   ├── layout/      # AppShell, SideNav, BottomNav, PageHeader
        │   ├── RepCounter.tsx
        │   ├── IntervalTimer.tsx
        │   ├── HoldTimer.tsx
        │   └── DistanceLogger.tsx
        ├── hooks/           # Custom React hooks (useColors, useTheme, useDashboardStats)
        ├── lib/
        │   ├── mock-data.ts # Domain schemas, initial data, and workout definitions
        │   ├── progress.ts  # Badge evaluation and progression algorithms
        │   └── store/       # Zustand state management slices
        └── routes/          # TanStack file-based route definitions
```

---

## Getting Started

### Prerequisites

* **Node.js**: Version 18.0.0 or higher
* **npm**: Version 9.0.0 or higher

### Installation & Execution

1. Clone the repository and navigate to the frontend directory:
   ```bash
   git clone https://github.com/your-username/physcal.git
   cd physcal/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` (or the port specified in your console) in your web browser.

---

## Documentation

* [User Guide (`frontend/docs/user-guide.md`)](frontend/docs/user-guide.md) – Application feature breakdown and workflow documentation.
* [Project Context (`PROJECT_CONTEXT.md`)](PROJECT_CONTEXT.md) – Technical context, design system specification, state architecture, and schema definitions.

---
