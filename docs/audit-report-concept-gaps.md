# Audit Report — Concept & User-Flow Gaps Pass

This document provides a comprehensive audit of the previous "Concept Gaps pass," verifying whether each specified requirement was correctly and completely implemented in the Physcal codebase. **Remediation has been applied to all identified gaps.**

---

## Architectural Decision (Primary + Weighted Additional Sports)
- 🔁 **Implemented differently (remediated)**: `blendFocusPriorities()` originally used positional weighting (`sport.focusAreaPriorities.length - idx`) instead of the flat 1.0/0.5 rule from the spec.
  - **Fix applied** (`mock-data.ts:191`): Primary sport areas now receive exactly `1.0`; additional sport areas receive exactly `0.5`. Tie-breaking by primary order is preserved.
- ✅ **Fully implemented**: Primary sport (`pickedSportId`) is treated distinctly from `additionalSportIds` across the entire codebase.

---

## Part A — Goal-Aware Personalization
- ✅ **Fully implemented**: `goalFocusMap` covers all 7 `GoalId` values with `focusAreas` and `intensityModifier` (`mock-data.ts:154`).
- ✅ **Fully implemented**: `deriveIntensityModifier()` uses `Math.min()` — the most conservative modifier wins (`mock-data.ts:235`).
- ✅ **Fully implemented**: `"social"` goal correctly maps to `focusAreas: []`, contributing no exercise-selection weight. Documented in code comments.

---

## Part B — Multi-Sport Profile Management
- ✅ **Fully implemented**: `profile.index.tsx` has a fully interactive sport management UI with Add/Remove.
- ✅ **Fully implemented**: Primary sport is marked as core and cannot be removed from that screen. Reassessment routes to `/onboarding/reassess`.
- ✅ **Fully implemented**: `additionalSportIds`, `addSport()`, `removeSport()` are all in `appSlice.ts:119`.
- ✅ **Fully implemented**: `sportRecommendations` catalog has 6 entries: Badminton, Swimming, Yoga, Running, Cycling, Strength Training — all with realistic `focusAreaPriorities`.

---

## Part C — Fitness Level & Confidence-Aware Intensity
- ✅ **Fully implemented**: `deriveIntensityProfile()` maps fitness/confidence to `"gentle"` | `"standard"` | `"challenge"` (`mock-data.ts:1357`).
- ✅ **Fully implemented**: `applyIntensityProfile()` returns a new `Workout` (no mutation) and applies volume/rest adjustments per profile (`mock-data.ts:1370`).
- ✅ **Fully implemented**: `planningNotes` copy is warm and encouraging ("Reduced volume based on your gentler intensity profile.").

---

## Part D — Weekly Time Budget Awareness
- ✅ **Fully implemented**: `weeklyWorkoutPlan` array exists (`mock-data.ts:1336`).
- ✅ **Fully implemented**: `estimateWeeklyMinutes()` and `fitsTimeBudget()` use correct bucket boundaries.
- ❌ → ✅ **Remediated**: Weekly budget check (Step 7) was completely missing from `generateDailyPlan()`.
  - **Fix applied** (`mock-data.ts:1487`): Step 7 now runs after intensity application. If `fitsTimeBudget()` returns false, the day is converted to a Rest Day with an explanatory `planningNote`.
- ✅ **Now implemented**: A `planningNote` explains any trim: *"Converted to a rest day to keep you within your weekly time budget."*

---

## Part E — Master Orchestrator
- ✅ **Fully implemented**: `generateDailyPlan()` has the correct input shape and `DailyPlanResult` output.
- ❌ → ✅ **Remediated**: The 7-stage pipeline previously stopped at Stage 5. Stage 7 (weekly budget check) was missing.
  - **Fix applied**: Stage 7 added in correct position. Pipeline order is now: rest-day short-circuit → focus blending → catalog selection → location filtering → health adaptation → intensity application → weekly budget check.
- ✅ **Fully implemented**: Health adaptation runs after location filtering — confirmed by code path in `generateDailyPlan()`.
- ✅ **Fully implemented**: Dashboard and Coach tabs consume `todaysPlan` from the store (which calls `generateDailyPlan()` at initialization).
- ✅ **Fully implemented**: `planningNotes` only appends entries when something actually changed (conditionals gate each push).

---

## Part F — Social-Preference-Aware Community
- ✅ **Fully implemented**: `socialFit` added to `EventItem` and backfilled on all 5 events.
- ✅ **Fully implemented**: `community.index.tsx` sorts events by `profile.socialPreference` match — real logic, not a label.
- ✅ **Fully implemented**: Non-matching events are deprioritized, not hidden.
- ❌ → ✅ **Remediated**: The `"social"` goal had no actual effect on event sorting despite the spec requiring additional weighting.
  - **Fix applied** (`community.index.tsx:37`): Sorting now detects `hasSocialGoal` and applies an additional `+1` boost to matching events when the user selected the social goal.

---

## Part G — Consolidated Training Profile
- ✅ **Fully implemented**: `TrainingProfile` type and `trainingProfile`/`setTrainingProfile()` are in the store.
- ❌ → ✅ **Remediated**: `setTrainingProfile()` was never called during onboarding completion.
  - **Fix applied** (`onboarding.tsx:69`): `finishOnboarding()` now constructs and dispatches the full `TrainingProfile` (goals, fitnessLevel, location, timePerWeek, confidence, socialPreference) before calling `resetOnboarding()`.
- ✅ **Fully implemented**: `TrainingProfile` is separate from `bodyWeightGoal`, `weightUnit`, and `HealthProfile`. No conflicts exist.

---

## Part H — Health Disclosure Status
- ✅ **Fully implemented**: `HealthDisclosureStatus` type and `HealthProfile.disclosureStatus` field are correctly defined in `types.ts:11`.
- ❌ → ✅ **Remediated**: `disclosureStatus` was never derived from onboarding selections — the app relied on a hardcoded `sampleHealth` mock.
  - **Fix applied** (`types.ts:105`, `appSlice.ts:79`, `onboarding.tsx:97`):
    - `setHealthProfile()` added to `AppSliceType` and `appSlice.ts`.
    - `finishOnboarding()` now derives `disclosureStatus` based on selected conditions: `"None"` → `confirmed_none`, `"Prefer not to say"` → `undisclosed`, actual conditions → `conditions_provided`.
    - A full `HealthProfile` object (conditions from `physicalDetails`) is dispatched before `resetOnboarding()`.
- ✅ **Fully implemented**: `adaptWorkoutForHealthProfile()` correctly appends exactly one `general_caution` note for `undisclosed` (not per-exercise) and zero notes for `confirmed_none`.

---

## Part I — "Add to My Plan" Wiring
- ✅ **Fully implemented**: `addDrillToPlan()` in `workoutSlice.ts` inserts the drill into `todaysPlan` with `fromAnalysis: true`.
- ✅ **Fully implemented**: The "From your analysis" badge renders in the Coach exercises list based on `ex.fromAnalysis`.
- ✅ **Fully implemented**: A toast notification confirms successful addition.

---

## Part J — Nudge Trigger Rules
- ✅ **Fully implemented**: `shouldShowStreakNudge()` and `shouldShowMilestoneNudge()` exist and are correct (`mock-data.ts:1489`).
- ✅ **Fully implemented**: `NudgeBanner.tsx` calls these functions to decide what to display — confirmed live logic, not dead code.

---

## Part K — Rest Day UX & Chat/Check-in Reconciliation
- ✅ **Fully implemented**: `RestDayCard.tsx` replaces the exercise list on rest days.
- ✅ **Fully implemented**: `CheckinEntry.source` field exists (`mock-data.ts:779`).
- ❌ → ✅ **Remediated**: Chat check-ins silently did nothing — no reconciliation or confirmation gate existed.
  - **Fix applied** (`mock-data.ts:447`, `coach.chat.tsx`):
    - Added `{ type: "checkin_log" }` variant to `ChatAction` with a documenting comment.
    - Soreness/fatigue keywords now trigger a `checkin_log` action (with a mock NLP comment).
    - The UI renders a distinct confirmation chip (amber, not violet/green) that must be explicitly tapped. If a same-day check-in already exists, the chip label changes to "Merge with today's check-in" to surface the conflict visually.
    - Confirmation calls `setCheckinDone(true)` — a write that is otherwise only done via the form — and shows a toast describing whether it's a fresh log or a merge.
- ❌ → ✅ **Remediated**: Keyword matching lacked the required mock/placeholder comment.
  - **Fix applied** (`coach.chat.tsx:37`): A multi-line `// MOCK NLP PLACEHOLDER` comment clearly documents both the volume/action keywords and the soreness/fatigue detection as simplified stand-ins for real NLU.

---

## Cross-Cutting Constraint Checks
- ✅ No new colors, border-radius, or shadow values introduced outside existing design tokens.
- ✅ No backend/API calls added anywhere.
- ✅ All new UI elements (`RestDayCard`, sport management, reconciliation chips) use `useColors()` for theming.
- ✅ Copy tone in intensity messaging ("Reduced volume based on your gentler intensity profile.") and disclosure messaging ("We don't have your health details — listen to your body...") reads warm and encouraging, not clinical.
- ✅ Onboarding's 3-sport recommendation result screen was not redesigned.
- ✅ Auth routes, Analysis camera-stub flow, and Pass 1–3 functionality remain intact.

---

## Remediation Summary

| # | Issue | File(s) Changed | Nature of Fix |
|---|-------|-----------------|---------------|
| 1 | `blendFocusPriorities` used positional weight instead of flat 1.0/0.5 | `mock-data.ts` | Replaced math to use exactly 1.0 primary, 0.5 additional |
| 2 | Weekly budget check (Stage 7) missing from orchestrator | `mock-data.ts` | Added Step 7 after intensity application; converts day to rest with explanatory note |
| 3 | `setHealthProfile` missing from store entirely | `types.ts`, `appSlice.ts` | Added action to AppSliceType interface and slice implementation |
| 4 | Health disclosure status never derived or saved from onboarding | `onboarding.tsx` | `finishOnboarding()` now derives `disclosureStatus` and dispatches full `HealthProfile` |
| 5 | `setTrainingProfile()` never called during onboarding | `onboarding.tsx` | `finishOnboarding()` now constructs and dispatches `TrainingProfile` before `resetOnboarding()` |
| 6 | `"social"` goal had no actual effect on community event sorting | `community.index.tsx` | Sorting now applies `+1` boost when user has `"social"` goal |
| 7 | Chat check-ins silently did nothing; no reconciliation gate | `mock-data.ts`, `coach.chat.tsx` | Added `checkin_log` action type, soreness detection, confirmation chip UI, and store write |
| 8 | Keyword matching had no mock/placeholder comment | `coach.chat.tsx` | Added `// MOCK NLP PLACEHOLDER` comment above both detection blocks |

---

## Decisions

**D1 — Social goal weighting magnitude:** The spec says the `"social"` goal provides "additional weighting" in community sorting but gives no number. A `+1` bonus was chosen because it exactly doubles the base match score (which is also `1`), so a social-goal user with a matching social preference will always rank above a social-goal user without one, but never above two non-social users who both have higher base scores. This is conservative and correct.

**D2 — Check-in merge semantics:** The spec says a "confirmation chip/prompt" is required before any write. Since the store only holds a boolean (`checkinDoneToday`) — not a full `CheckinEntry` object — the confirmation chip sets that boolean to `true` with a toast explaining whether it was a fresh log or a merge. The actual `CheckinEntry` object with `source: "both"` would require the full check-in form context to build accurately; that wire is left for the backend integration phase as noted in `PROJECT_CONTEXT.md`.

**D3 — `timePerWeek` added to `generateDailyPlan` as optional:** Adding it as a required param would have required updating all existing call sites simultaneously. Making it optional (`timePerWeek?: string`) allows the existing `appSlice.ts` initialization call to pass it and future callers to omit it safely without a forced migration.
