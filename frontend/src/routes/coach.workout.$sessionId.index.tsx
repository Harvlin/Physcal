import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Camera,
  AlertTriangle,
  Clock,
  Dumbbell,
  Flame,
  RefreshCw,
} from "lucide-react";
import {
  todayWorkout,
  recoveryWorkout,
  exerciseLoadHistory,
  motivationalCues,
  type Exercise,
} from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import { useColors } from "@/hooks/useColors";
import { getPersonalRecord, detectPR } from "@/lib/pr-utils";
import { toast } from "sonner";
import { RestTimerOverlay } from "@/components/RestTimerOverlay";
import { WeightSelector } from "@/components/WeightSelector";
import { SubstituteExerciseSheet } from "@/components/SubstituteExerciseSheet";
import { HoldTimer } from "@/components/HoldTimer";
import { DistanceLogger } from "@/components/DistanceLogger";

const RepCounter = lazy(() =>
  import("@/components/RepCounter").then((m) => ({ default: m.RepCounter })),
);
const InjuryPauseSheet = lazy(() =>
  import("@/components/InjuryPauseSheet").then((m) => ({ default: m.InjuryPauseSheet })),
);
const IntervalTimer = lazy(() =>
  import("@/components/IntervalTimer").then((m) => ({ default: m.IntervalTimer })),
);

// Preload both chunks immediately after mount so they are cached before user taps
function preloadLazyChunks() {
  import("@/components/RepCounter");
  import("@/components/InjuryPauseSheet");
  import("@/components/IntervalTimer");
}

export const Route = createFileRoute("/coach/workout/$sessionId/")({
  component: WorkoutSession,
});

function getSuggestedWeight(exerciseId: string, exercises: Exercise[]): number | undefined {
  const history = exerciseLoadHistory.find((w) => w.exerciseId === exerciseId);
  if (!history || history.entries.length === 0) return undefined;
  const last = history.entries[history.entries.length - 1];
  const exercise = exercises.find((e) => e.id === exerciseId);
  if (!exercise) return last.weight;
  const completedAll = last.completedSets >= exercise.sets && last.completedReps >= exercise.reps;
  if (completedAll) return last.weight + (last.weight >= 15 ? 1 : 0.5);
  return last.weight;
}

function ElapsedTimeDisplay({ startedAt }: { startedAt: string | null }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!startedAt) return;
    const start = new Date(startedAt).getTime();
    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startedAt]);
  const m = Math.floor(elapsed / 60);
  const s = elapsed % 60;
  return (
    <>
      {m}:{s.toString().padStart(2, "0")}
    </>
  );
}

function WorkoutSession() {
  const { sessionId } = Route.useParams();
  const navigate = useNavigate();
  const c = useColors();

  const session = useApp((s) => s.workoutSession);
  const initWorkoutSession = useApp((s) => s.initWorkoutSession);
  const completeSetAction = useApp((s) => s.completeSet);
  const completeDistanceSet = useApp((s) => s.completeDistanceSet);
  const setRestTimer = useApp((s) => s.setRestTimer);
  const setLiveRepCount = useApp((s) => s.setLiveRepCount);
  const setUsedWeight = useApp((s) => s.setUsedWeight);
  const pauseForInjury = useApp((s) => s.pauseForInjury);
  const substituteExercise = useApp((s) => s.substituteExercise);

  const [phase, setPhase] = useState<"warmup" | "active">("warmup");
  const [showRepCounter, setShowRepCounter] = useState(false);
  const [tipExpanded, setTipExpanded] = useState(false);
  const [setDoneFlash, setSetDoneFlash] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [substituteSheetOpen, setSubstituteSheetOpen] = useState(false);

  const todaysPlan = useApp((s) => s.todaysPlan) || todayWorkout;
  const weightUnit = useApp((s) => s.weightUnit);

  const substituted = session.substitutedExercises;
  const exercises = (isRecoveryMode ? recoveryWorkout.exercises : todaysPlan.exercises).map(
    (ex) => {
      if (substituted[ex.id]) {
        return { ...ex, name: substituted[ex.id] };
      }
      return ex;
    },
  );
  const workoutTitle = isRecoveryMode ? recoveryWorkout.title : todaysPlan.title;

  // Init session on mount + preload lazy chunks immediately in background
  useEffect(() => {
    initWorkoutSession(sessionId);
    // Preload after a short idle to not compete with initial render
    const id =
      "requestIdleCallback" in window
        ? window.requestIdleCallback(preloadLazyChunks)
        : setTimeout(preloadLazyChunks, 500);
    return () => {
      if ("requestIdleCallback" in window) window.cancelIdleCallback(id as number);
      else clearTimeout(id as ReturnType<typeof setTimeout>);

      // Cleanup stale session if leaving without finishing
      if (
        useApp.getState().workoutSession.sessionStartedAt &&
        !window.location.pathname.endsWith("/done")
      ) {
        useApp.getState().resetWorkoutSession();
      }
    };
  }, [sessionId]);

  // Wake lock
  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null;
    navigator.wakeLock
      ?.request("screen")
      .then((wl) => {
        wakeLock = wl;
      })
      .catch(() => {});
    return () => {
      wakeLock?.release();
    };
  }, []);

  // Active exercise detection
  const activeExerciseIdx = exercises.findIndex(
    (ex) => (session.completedSets[ex.id] ?? 0) < ex.sets,
  );
  const activeExercise = exercises[activeExerciseIdx] ?? null;
  const isWorkoutComplete = phase === "active" && activeExerciseIdx === -1;

  // Navigate to done on completion
  useEffect(() => {
    if (isWorkoutComplete) {
      const t = setTimeout(() => {
        navigate({ to: "/coach/workout/$sessionId/done", params: { sessionId } });
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [isWorkoutComplete]);

  // Totals
  const totalSets = exercises.reduce((a, e) => a + e.sets, 0);
  const completedTotalSets = Object.values(session.completedSets).reduce((a, b) => a + b, 0);
  const completedExercises = exercises.filter(
    (ex) => (session.completedSets[ex.id] ?? 0) >= ex.sets,
  ).length;

  const currentSetNum = activeExercise ? (session.completedSets[activeExercise.id] ?? 0) + 1 : 0;
  const currentWeight = activeExercise ? session.usedWeights[activeExercise.id] : undefined;

  // Next set/exercise info for rest overlay
  const nextSetInfo = useMemo(() => {
    if (!activeExercise) return undefined;
    const setsCompleted = session.completedSets[activeExercise.id] ?? 0;
    if (setsCompleted === 0) return undefined;
    return `${activeExercise.name} — set ${setsCompleted + 1}`;
  }, [activeExercise, session.completedSets]);

  const nextExerciseForRest = useMemo(() => {
    if (!activeExercise) return null;
    const setsCompleted = session.completedSets[activeExercise.id] ?? 0;
    if (setsCompleted === 0) return activeExercise;
    return null;
  }, [activeExercise, session.completedSets]);

  // Motivational cue per exercise
  const cue = motivationalCues[activeExerciseIdx % motivationalCues.length];

  const handleCompleteSet = () => {
    if (!activeExercise) return;
    const reps = session.liveRepCount || activeExercise.reps;
    const weight = currentWeight ?? activeExercise.defaultWeight;
    completeSetAction(activeExercise.id, reps, weight);
    if ("vibrate" in navigator) navigator.vibrate([100, 50, 100]);

    if (weight !== undefined) {
      if (detectPR(activeExercise.id, weight)) {
        toast.success("New PR! 🏆", {
          description: `${activeExercise.name} at ${weight}${activeExercise.weightUnit || "kg"}`,
        });

        // Push to mock data so it doesn't trigger again for the same weight in this session
        const history = exerciseLoadHistory.find((h) => h.exerciseId === activeExercise.id);
        if (history) {
          history.entries.push({
            date: new Date().toISOString(),
            weight,
            completedReps: reps,
            completedSets: 1,
          });
        } else {
          exerciseLoadHistory.push({
            exerciseId: activeExercise.id,
            exerciseName: activeExercise.name,
            unit: weightUnit,
            entries: [
              { date: new Date().toISOString(), weight, completedReps: reps, completedSets: 1 },
            ],
          });
        }
      }
    }

    setSetDoneFlash(true);
    setTimeout(() => setSetDoneFlash(false), 500);
    if (activeExercise.rest > 0) setRestTimer(activeExercise.rest);
    setTipExpanded(false);
  };

  const handleDistanceDone = (durationMin: number, distanceKm: number) => {
    if (!activeExercise) return;
    completeDistanceSet(activeExercise.id, durationMin, distanceKm);
    if ("vibrate" in navigator) navigator.vibrate([100, 50, 100]);
    setSetDoneFlash(true);
    setTimeout(() => setSetDoneFlash(false), 500);
    if (activeExercise.rest > 0) setRestTimer(activeExercise.rest);
    setTipExpanded(false);
  };

  const handleRepCounterComplete = (reps: number) => {
    setLiveRepCount(reps);
    setShowRepCounter(false);
  };

  // ─── Warmup ───
  if (phase === "warmup") {
    return (
      <div className="min-h-dvh flex flex-col" style={{ color: c.textPrimary }}>
        <div className="flex-1 flex flex-col justify-center text-center px-5 max-w-md mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div
              className="text-xs uppercase tracking-widest font-bold mb-3"
              style={{ color: c.violet }}
            >
              Get ready
            </div>
            <h1 className="text-4xl font-extrabold mb-2">{workoutTitle}</h1>
            <p className="font-medium mb-8" style={{ color: c.textSecondary }}>
              {(isRecoveryMode ? recoveryWorkout : todaysPlan).duration} min · {exercises.length}{" "}
              exercises
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="card-frosted p-5 text-left space-y-1 max-h-[40vh] overflow-y-auto"
          >
            {exercises.map((e, i) => (
              <div
                key={e.id}
                className="flex items-center gap-4 py-2.5"
                style={{
                  borderBottom: i < exercises.length - 1 ? `1px solid ${c.divider}` : "none",
                }}
              >
                <span
                  className="w-8 h-8 rounded-full grid place-items-center text-sm font-extrabold tabular-nums shrink-0"
                  style={{ background: c.exuberantBg, color: c.exuberant }}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm flex items-center gap-2">
                    {e.name}
                    {(!!substituted[e.id] ||
                      (!isRecoveryMode &&
                        !todayWorkout.exercises.some((orig) => orig.id === e.id))) && (
                      <span
                        className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm"
                        style={{ background: c.violetBg, color: c.violet }}
                      >
                        Substituted
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-medium mt-0.5" style={{ color: c.textTertiary }}>
                    {e.trackingMode === "rep" &&
                      `${e.sets}×${e.reps} ${e.defaultWeight ? `· ${e.defaultWeight} ${weightUnit}` : ""}`}
                    {e.trackingMode === "hold" && `${e.sets}× ${e.reps}s hold`}
                    {e.trackingMode === "interval" &&
                      `${e.intervalRounds} rounds · ${e.workSeconds}s on`}
                    {e.trackingMode === "distance" && `~${e.targetDurationMinutes} min`}
                  </div>
                </div>
                <div
                  className="text-xs font-semibold tabular-nums"
                  style={{ color: c.textTertiary }}
                >
                  {e.rest}s
                </div>
              </div>
            ))}
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3 max-w-md mx-auto w-full px-5 pb-8"
        >
          <button
            onClick={() => setPhase("active")}
            className="w-full h-14 rounded-full font-bold text-[15px] hover:opacity-90 active:scale-[0.98] transition-all"
            style={{
              background: c.sunGlare,
              color: "#1C1C1A",
              boxShadow: `0 0 28px ${c.sunGlareBg}`,
            }}
          >
            Start workout
          </button>
          <Link
            to="/coach"
            className="block text-center text-sm font-semibold py-2"
            style={{ color: c.textTertiary }}
          >
            Not today
          </Link>
        </motion.div>
      </div>
    );
  }

  // ─── Completion animation ───
  if (isWorkoutComplete) {
    return (
      <div className="min-h-dvh grid place-items-center" style={{ color: c.textPrimary }}>
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-center"
        >
          <div
            className="w-28 h-28 rounded-full grid place-items-center mx-auto mb-5"
            style={{ background: c.sunGlare, boxShadow: `0 0 60px ${c.sunGlareBg}` }}
          >
            <Check size={56} strokeWidth={3} style={{ color: "#1C1C1A" }} />
          </div>
          <div className="text-2xl font-extrabold mb-1">Workout Complete!</div>
          <div className="text-sm font-medium" style={{ color: c.textSecondary }}>
            <ElapsedTimeDisplay startedAt={session.sessionStartedAt} /> total
          </div>
        </motion.div>
      </div>
    );
  }

  if (!activeExercise) return null;

  const setsCompleted = session.completedSets[activeExercise.id] ?? 0;

  return (
    <div className="min-h-dvh flex flex-col" style={{ color: c.textPrimary }}>
      {/* Recovery banner */}
      {isRecoveryMode && (
        <div
          className="px-4 py-2.5 text-sm font-bold flex flex-wrap items-center justify-between gap-3"
          style={{ background: "oklch(0.70 0.14 65 / 0.12)", color: "oklch(0.70 0.14 65)" }}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} /> Recovery mode
          </div>
          {session.pausedSessionSnapshot && (
            <button
              onClick={() => {
                useApp.getState().resumeFromInjury();
                setIsRecoveryMode(false);
              }}
              className="text-xs px-2.5 py-1 rounded-md font-extrabold hover:opacity-80 transition-opacity"
              style={{ background: "oklch(0.70 0.14 65 / 0.2)", color: "oklch(0.70 0.14 65)" }}
            >
              Resume original
            </button>
          )}
        </div>
      )}

      {/* ─── Top bar ─── */}
      <div className="px-4 pt-4 pb-1">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setShowExitConfirm(true)}
            className="w-10 h-10 rounded-full grid place-items-center -ml-1"
            style={{ color: c.textTertiary }}
          >
            <ArrowLeft size={20} />
          </button>
          <div className="text-center flex-1 mx-2">
            <div className="text-[13px] font-bold leading-tight" style={{ color: c.textPrimary }}>
              {workoutTitle}
            </div>
          </div>
          <div
            className="flex items-center gap-1 text-xs font-bold tabular-nums"
            style={{ color: c.textTertiary }}
          >
            <Clock size={12} /> <ElapsedTimeDisplay startedAt={session.sessionStartedAt} />
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 rounded-full overflow-hidden" style={{ background: c.divider }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: c.sunGlare }}
            animate={{ width: `${totalSets > 0 ? (completedTotalSets / totalSets) * 100 : 0}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <div className="flex items-center justify-between mt-1.5 px-0.5">
          <span
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: c.textTertiary }}
          >
            Exercise {activeExerciseIdx + 1}/{exercises.length}
          </span>
          <span className="text-[10px] font-bold tabular-nums" style={{ color: c.textTertiary }}>
            {completedTotalSets}/{totalSets} sets
          </span>
        </div>
      </div>

      {/* ─── Main content ─── */}
      <div className="flex-1 px-4 pt-2 pb-1 flex flex-col min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeExercise.id + "-" + setsCompleted}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="card-frosted p-5 flex-1 flex flex-col"
          >
            {/* Exercise header */}
            <div className="flex items-start justify-between mb-1">
              <div className="flex flex-col gap-1 pr-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-[26px] font-extrabold leading-tight">
                    {activeExercise.name}
                  </h2>
                  {(!!substituted[activeExercise.id] ||
                    (!isRecoveryMode &&
                      !todayWorkout.exercises.some((orig) => orig.id === activeExercise.id))) && (
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-violet-500/10 text-violet-500 border border-violet-500/20">
                      Substituted
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSubstituteSheetOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-bold transition-colors w-fit hover:opacity-80"
                  style={{ color: c.textTertiary }}
                >
                  <RefreshCw size={12} /> Substitute
                </button>
              </div>
              <span
                className="text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 mt-1"
                style={{
                  background: c.sunGlareBg,
                  color: c.sunGlare,
                  border: `1px solid ${c.sunGlare}33`,
                }}
              >
                SET {currentSetNum}/{activeExercise.sets}
              </span>
            </div>

            {/* Subtitle */}
            <div
              className="flex items-center gap-3 mb-4 text-[13px] font-semibold flex-wrap"
              style={{ color: c.textTertiary }}
            >
              <span className="flex items-center gap-1">
                <Dumbbell size={12} /> {activeExercise.reps} reps
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock size={12} /> {activeExercise.rest}s rest
              </span>
              {activeExercise.defaultWeight !== undefined && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Flame size={12} /> Weighted
                  </span>
                </>
              )}
              {getPersonalRecord(activeExercise.id) !== null && (
                <>
                  <span>·</span>
                  <span
                    className="flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded-md"
                    style={{
                      background: c.sunGlareBg,
                      color: c.sunGlare,
                      border: `1px solid ${c.sunGlare}44`,
                    }}
                  >
                    🏆 PR: {getPersonalRecord(activeExercise.id)}
                    {weightUnit}
                  </span>
                </>
              )}
            </div>

            {/* Set progress — visual bar */}
            <div className="flex items-center gap-1.5 mb-5">
              {Array.from({ length: activeExercise.sets }).map((_, i) => {
                const done = setsCompleted > i;
                const current = setsCompleted === i;
                return (
                  <div key={i} className="flex-1 relative">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        background: done ? "oklch(0.52 0.14 152)" : c.chipBg,
                        border: current
                          ? `1.5px solid ${c.sunGlare}`
                          : `1px solid ${done ? "transparent" : c.chipBorder}`,
                        boxShadow: done
                          ? "0 0 8px oklch(0.52 0.14 152 / 0.3)"
                          : current
                            ? `0 0 8px ${c.sunGlareBg}`
                            : "none",
                      }}
                    >
                      {current && (
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: `${c.sunGlare}44` }}
                          animate={{ opacity: [0.3, 0.7, 0.3] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Weight selector */}
            {activeExercise.defaultWeight !== undefined && (
              <div className="mb-4">
                <WeightSelector
                  exercise={activeExercise}
                  currentWeight={currentWeight}
                  suggestedWeight={getSuggestedWeight(activeExercise.id, exercises)}
                  onWeightChange={(w) => setUsedWeight(activeExercise.id, w)}
                />
              </div>
            )}

            {/* Tip (collapsible) */}
            <button
              onClick={() => setTipExpanded(!tipExpanded)}
              className="flex items-center gap-2 text-sm font-semibold py-2 w-full text-left"
              style={{ color: c.textSecondary }}
            >
              💡 Form tip {tipExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            <AnimatePresence>
              {tipExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div
                    className="rounded-xl p-3.5 mb-2"
                    style={{ background: c.chipBg, border: `1px solid ${c.chipBorder}` }}
                  >
                    <p className="text-sm font-semibold mb-1.5" style={{ color: c.sunGlare }}>
                      {activeExercise.tip}
                    </p>
                    <p
                      className="text-xs font-medium leading-relaxed"
                      style={{ color: c.textTertiary }}
                    >
                      {activeExercise.instructions}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Spacer */}
            <div className="flex-1 min-h-4" />

            {/* Rep counter & motivational cue */}
            <div className="space-y-3">
              {/* Motivational cue */}
              <p
                className="text-center text-[13px] italic font-medium"
                style={{ color: c.textTertiary }}
              >
                "{cue}"
              </p>

              {/* Modes */}
              {activeExercise.trackingMode === "rep" &&
                activeExercise.supportsRepCount &&
                !isRecoveryMode && (
                  <div>
                    {session.liveRepCount > 0 ? (
                      <button
                        onClick={() => setShowRepCounter(true)}
                        className="w-full rounded-xl p-3 flex items-center gap-3 transition-all active:scale-[0.98]"
                        style={{ background: c.chipBg, border: `1px solid ${c.chipBorder}` }}
                      >
                        <div
                          className="w-12 h-12 rounded-full grid place-items-center font-extrabold text-lg"
                          style={{
                            background:
                              session.liveRepCount >= activeExercise.reps
                                ? "oklch(0.52 0.14 152 / 0.15)"
                                : c.sunGlareBg,
                            color:
                              session.liveRepCount >= activeExercise.reps
                                ? "oklch(0.52 0.14 152)"
                                : c.sunGlare,
                          }}
                        >
                          {session.liveRepCount}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-sm font-bold" style={{ color: c.textPrimary }}>
                            {session.liveRepCount}/{activeExercise.reps} reps counted
                          </div>
                          <div className="text-xs font-medium" style={{ color: c.textTertiary }}>
                            Tap to continue counting
                          </div>
                        </div>
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowRepCounter(true)}
                        className="w-full h-12 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all active:scale-[0.98]"
                        style={{
                          background: c.chipBg,
                          border: `1px solid ${c.chipBorder}`,
                          color: c.sunGlare,
                        }}
                      >
                        <Camera size={16} /> Count my reps
                      </button>
                    )}
                  </div>
                )}

              {activeExercise.trackingMode === "hold" && (
                <HoldTimer exercise={activeExercise} onDone={handleCompleteSet} />
              )}
              {activeExercise.trackingMode === "interval" && (
                <Suspense fallback={<div className="h-40" />}>
                  <IntervalTimer exercise={activeExercise} onComplete={handleCompleteSet} />
                </Suspense>
              )}
              {activeExercise.trackingMode === "distance" && (
                <DistanceLogger exercise={activeExercise} onDone={handleDistanceDone} />
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Exercise queue */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-2.5 -mx-0.5 px-0.5">
          {exercises.map((ex) => {
            const done = (session.completedSets[ex.id] ?? 0) >= ex.sets;
            const active = ex.id === activeExercise.id;
            const exSets = session.completedSets[ex.id] ?? 0;
            return (
              <div
                key={ex.id}
                className="shrink-0 rounded-xl py-2 px-3 text-center"
                style={{
                  minWidth: 72,
                  background: active ? c.chipBg : "transparent",
                  border: `1px solid ${active ? c.chipBorder : "transparent"}`,
                }}
              >
                <div
                  className="text-[11px] font-bold leading-tight mb-1"
                  style={{
                    color: done ? "oklch(0.52 0.14 152)" : active ? c.textPrimary : c.textTertiary,
                  }}
                >
                  {/* Show abbreviated name — first word only for long names */}
                  {ex.name.split(" ").length > 1 ? ex.name.split(" ")[0] : ex.name}
                </div>
                <div className="flex justify-center gap-0.5">
                  {Array.from({ length: ex.sets }).map((_, si) => (
                    <div
                      key={si}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background:
                          exSets > si
                            ? "oklch(0.52 0.14 152)"
                            : active && si === exSets
                              ? c.sunGlare
                              : c.divider,
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Sticky bottom ─── */}
      <div className="px-4 pb-5 pt-1">
        <div className="flex items-center gap-2.5">
          {!activeExercise || activeExercise.trackingMode === "rep" ? (
            <motion.button
              onClick={handleCompleteSet}
              animate={setDoneFlash ? { scale: [1, 1.03, 1] } : {}}
              transition={{ duration: 0.3 }}
              className="flex-1 h-14 rounded-full font-bold text-[15px] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              style={{
                background: setDoneFlash ? "oklch(0.52 0.14 152)" : c.sunGlare,
                color: "#1C1C1A",
                boxShadow: setDoneFlash
                  ? "0 0 30px oklch(0.52 0.14 152 / 0.4)"
                  : `0 0 24px ${c.sunGlareBg}`,
              }}
            >
              <Check size={18} strokeWidth={3} />
              {setDoneFlash ? "Set done! ✓" : `Complete set ${currentSetNum}`}
            </motion.button>
          ) : (
            <div className="flex-1" />
          )}
          <Suspense
            fallback={
              <button
                className="h-14 w-14 rounded-full grid place-items-center shrink-0"
                style={{ border: `1.5px solid ${c.chipBorder}`, color: c.textTertiary }}
              >
              </button>
            }
          >
            <InjuryPauseSheet
              sessionId={sessionId}
              onSwitchToRecovery={() => setIsRecoveryMode(true)}
            >
              <button
                className="h-14 w-14 rounded-full grid place-items-center transition-all active:scale-90 shrink-0"
                style={{ border: `1.5px solid ${c.chipBorder}`, color: c.textTertiary }}
                aria-label="Take a break"
              >
              </button>
            </InjuryPauseSheet>
          </Suspense>
        </div>
      </div>

      {/* Overlays */}
      <RestTimerOverlay nextExercise={nextExerciseForRest} nextSetInfo={nextSetInfo} />
      {showRepCounter && activeExercise && (
        <Suspense fallback={null}>
          <RepCounter
            exercise={activeExercise}
            targetReps={activeExercise.reps}
            onComplete={handleRepCounterComplete}
            onClose={() => setShowRepCounter(false)}
          />
        </Suspense>
      )}

      {/* Exit confirm */}
      <AnimatePresence>
        {showExitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 grid place-items-center px-5"
          >
            <motion.div
              initial={{ scale: 0.95, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              className="card-frosted p-6 max-w-sm w-full"
            >
              <h3 className="font-extrabold text-lg mb-1.5">Exit workout?</h3>
              <p className="text-sm font-medium mb-5" style={{ color: c.textSecondary }}>
                You've completed {completedTotalSets} sets so far. Your progress will be saved.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 h-12 rounded-full font-bold text-sm transition-all active:scale-95"
                  style={{ border: `1px solid ${c.chipBorder}`, color: c.textSecondary }}
                >
                  Keep going
                </button>
                <Link
                  to="/coach/workout/$sessionId/done"
                  params={{ sessionId }}
                  className="flex-1 h-12 rounded-full font-bold text-sm grid place-items-center transition-all active:scale-95"
                  style={{ background: c.exuberant, color: "#F2F0E9" }}
                >
                  Exit & save
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SubstituteExerciseSheet
        isOpen={substituteSheetOpen}
        onOpenChange={setSubstituteSheetOpen}
        originalExercise={activeExercise}
        onSubstitute={(newId) => {
          if (!activeExercise) return;
          substituteExercise(
            activeExercise.id,
            newId.includes("alt1")
              ? `Machine ${activeExercise.name}`
              : newId.includes("alt2")
                ? `Dumbbell ${activeExercise.name}`
                : `Bodyweight ${activeExercise.name}`,
          );
          setSubstituteSheetOpen(false);
          toast.success("Exercise substituted", {
            description: "Your session plan has been updated.",
          });
        }}
      />
    </div>
  );
}
