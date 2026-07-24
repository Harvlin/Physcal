# Physcal: Complete User Guide & Experience Flow

Welcome to **Physcal** (formerly MORF), an inclusive, AI-powered wellness and fitness platform. This guide explains how to navigate the application, the philosophy behind the user experience, and a breakdown of the core user flows.

---

## 1. Introduction & Philosophy

Physcal is designed to be the exact opposite of an intimidating, hyper-competitive fitness app. 
Our core philosophy revolves around:
- **Inclusivity:** Built for beginners, women, and individuals with accessibility needs or joint/health conditions.
- **Adaptability:** Workouts are not rigid. If you feel tired, sore, or injured, the AI adjusts the volume, intensity, or the entire plan in real-time.
- **Holistic Wellness:** Fitness isn't just about reps. We track sleep, stress, soreness, and energy levels to build a complete picture of your health.
- **Aesthetic:** A premium "Silver-Mint" frosted-glass design that feels welcoming, clean, and entirely non-judgmental.

---

## 2. Getting Started: Onboarding

The journey begins at the Landing Page, leading directly into our comprehensive Onboarding flow.

### The Onboarding Flow (`/onboarding`)
Unlike traditional apps that ask for your height and weight and instantly throw you into an intense workout, Physcal takes time to understand *you*.
1. **Goals:** Do you want to reduce stress? Gain strength? Recover from an injury? You can select multiple goals.
2. **Current Level & Lifestyle:** We ask about your baseline activity level, where you prefer to work out (Home, Gym, Outdoors), and how much time you have.
3. **Sports & Activities:** Select your primary sport (e.g., Running, Yoga, Climbing) and any additional activities. We use this to bias your muscle focus areas.
4. **Health & Safety (Crucial):** We ask about pre-existing conditions (e.g., lower back pain, wrist issues, pregnancy). 
   - *Experience Note:* Physcal's engine uses this data to completely filter out exercises that trigger your condition's "caution tags" (e.g., removing deep knee flexion if you have knee issues).
5. **Loading Screen:** A simulated AI processing screen generates your tailored baseline.

---

## 3. The Dashboard: Your Daily Hub

Once onboarded, you land on the **Dashboard** (`/dashboard`), the central nervous system of your Physcal experience.

- **The Greeting:** A personalized, warm welcome summarizing your current state.
- **Nudge Banner:** Smart, context-aware reminders. If your streak is at risk, or if you hit a milestone (like 30 days active), the banner will prompt you (e.g., "Don't break the streak").
- **Athena's Weekly Report:** A simulated AI insight summarizing your weekly progress, weight trends, and offering encouragement.
- **Workout Calendar & Today's Plan:** A quick glance at your scheduled activity.
- **Health Snapshot:** Quick access to your streak counter (which ignores rest days and rewards recovery), weekly session count, and weight goals.

---

## 4. Coach & Workout Experience

The Coach tab (`/coach`) is where the action happens.

### The Daily Check-in
Before you start a workout, Physcal asks for a quick **5-tap check-in**:
- How is your Energy? Soreness? Mood? Sleep? Stress?
- *Experience Note:* If you report high soreness or low energy, the AI Coach can instantly suggest a reduced volume or swap you to a gentle Recovery session. You can accept this adjustment with one tap.

### AI Coach Chat
If you want granular control, you can chat directly with your AI Coach (`/coach/chat`). Tell Athena "My knees hurt today" and the system will automatically strip out high-impact leg exercises and replace them with low-impact alternatives, showing you exactly what changed.

### Focus Mode (The Workout Session)
When you hit **Start Workout**, you enter Focus Mode (`/coach/workout/$sessionId`).
- **Rep Counter:** Uses large, accessible tap targets. (It also supports Voice Counting via the Web Speech API so you don't have to touch your phone).
- **Rest Timer:** An overlay that counts down between sets, allowing you to easily add time or skip rest entirely.
- **Injury Pause System:** If you feel sharp pain during a workout, hit the Pause button. Physcal will snapshot your exact progress and allow you to instantly switch to a Recovery Session. When you are ready to return (even days later), it will resume exactly where you left off.
- **Exercise Swaps:** At any time, you can tap an exercise to swap it. The engine will only suggest substitutes that match the original muscle focus *and* respect your health conditions.

---

## 5. Movement Analysis

Found in the bottom navigation (`/analysis`), this feature allows users to verify their form without needing an expensive personal trainer.
1. **Select an Exercise:** Choose from a strictly-typed list of supported movements (e.g., Squat, Push-up, Lunge).
2. **Upload Video:** The user uploads a short clip of their form.
3. **AI Feedback:** The system simulates processing the video and returns a detailed breakdown highlighting perfect angles, minor deviations, and actionable safety tips. 
4. **Actionable Drills:** The AI often provides specific corrective drills which can be injected directly into your daily plan with a single button press.

---

## 6. Community Integration

Fitness is easier together. The Community tab (`/community`) allows you to find and create local events.
- **Inclusive Filtering:** Events are tagged by safety and intensity (e.g., "Beginner friendly", "Knee friendly").
- **Radix UI Integrations:** Waitlists and event capacities are beautifully visualized using interactive Progress bars and Tooltips.
- **AI Event Generation:** Can't think of an event? Use the AI generator (`/community/create`) to instantly draft a well-structured, inclusive event title and description based on your selected sport and location.
- **Safety First:** All community events display a standard `PhyscalAlert` reminding users that events are peer-organized and to consult doctors for health conditions.

---

## 7. Profile & Progress Tracking

The Profile tab (`/profile`) is your historical ledger.
- **Visual Analytics:** View your completed sessions mapped out over the week via Recharts.
- **Achievements:** Earn badges for consistency, comebacks, and milestones. Locked badges feature a frosted-glass popover hinting at how to unlock them (e.g., "Life happens — coming back counts too").
- **Settings & Reassessment:** Every 30 days, or whenever you feel like it, you can run a Reassessment (`/onboarding/reassess`). Physcal will evaluate your consistency and gently promote you to the next difficulty level if you're ready, ensuring you never hit a permanent plateau.

---

### Summary
Physcal isn't just a tracker; it's a dynamic, responsive companion. By strictly managing state (via Zustand) and relying on a single source of truth for your health and training profile, every corner of the app—from community event recommendations to the mid-workout timer—adapts to exactly how you feel *today*.
