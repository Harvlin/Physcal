import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Check, Heart, Clock, Dumbbell, Repeat, TrendingUp } from "lucide-react";
import { todayWorkout, recoveryWorkout, exerciseLoadHistory } from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import { useColors } from "@/hooks/useColors";
import { toast } from "sonner";

export const Route = createFileRoute("/coach/workout/$sessionId/done")({
  component: DonePage,
});

function DonePage() {
  const c = useColors();
  const [feedback, setFeedback] = useState<string>();
  const [note, setNote] = useState("");
  const session = useApp((s) => s.workoutSession);
  const resetWorkoutSession = useApp((s) => s.resetWorkoutSession);
  const isInjury = session.injuryPaused;

  // Compute stats from session
  const totalSetsCompleted = Object.values(session.completedSets).reduce((a, b) => a + b, 0);
  const totalRepsCompleted = Object.values(session.setLog).reduce(
    (acc, logs) => acc + logs.reduce((a, l) => a + l.reps, 0), 0
  );
  const exercisesCompleted = todayWorkout.exercises.filter(
    (ex) => (session.completedSets[ex.id] ?? 0) >= ex.sets
  ).length;
  const totalTime = useMemo(() => {
    if (!session.sessionStartedAt) return "—";
    const start = new Date(session.sessionStartedAt).getTime();
    const diff = Math.floor((Date.now() - start) / 60000);
    return `${diff} min`;
  }, [session.sessionStartedAt]);

  // Weight changes
  const weightChanges = useMemo(() => {
    const changes = [];
    const sourceWorkout = session.injuryPaused ? recoveryWorkout : todayWorkout;
    for (const ex of sourceWorkout.exercises) {
      if (session.usedWeights[ex.id] && ex.defaultWeight && session.usedWeights[ex.id] > ex.defaultWeight) {
        changes.push({
          exerciseId: ex.id,
          exerciseName: session.substitutedExercises?.[ex.id] || ex.name,
          oldWeight: ex.defaultWeight,
          newWeight: session.usedWeights[ex.id],
          unit: ex.weightUnit || "kg",
        });
      }
    }
    return changes;
  }, [session.usedWeights, session.injuryPaused, session.substitutedExercises]);

  const [weightUpdated, setWeightUpdated] = useState<Record<string, boolean>>({});

  return (
    <div className="app-stage min-h-dvh flex flex-col px-5 py-8" style={{ color: c.textPrimary }}>
      <div className="flex-1 flex flex-col items-center text-center max-w-md mx-auto w-full">
        {/* Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-24 h-24 rounded-full grid place-items-center mb-6"
          style={{
            background: isInjury ? "oklch(0.70 0.14 65)" : c.sunGlare,
            boxShadow: isInjury ? "0 0 40px oklch(0.70 0.14 65 / 0.4)" : `0 0 40px ${c.sunGlareBg}`,
          }}
        >
          {isInjury ? <Heart size={48} strokeWidth={2.5} style={{ color: "#1C1C1A" }} /> : <Check size={48} strokeWidth={3} style={{ color: "#1C1C1A" }} />}
        </motion.div>

        {/* Headline */}
        {isInjury ? (
          <>
            <h1 className="text-3xl font-extrabold mb-2">You listened to your body today.</h1>
            <p className="font-medium mb-8" style={{ color: c.textSecondary }}>
              That's not a failure — that's smart training.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-extrabold mb-2">Workout complete!</h1>
            <p className="font-medium mb-8" style={{ color: c.textSecondary }}>
              {totalTime} of real work. Proud of you.
            </p>
          </>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 w-full mb-6">
          <StatCard icon={<Repeat size={18} />} label="Sets" value={String(totalSetsCompleted)} c={c} />
          <StatCard icon={<Dumbbell size={18} />} label="Reps" value={String(totalRepsCompleted)} c={c} />
          <StatCard icon={<Clock size={18} />} label="Time" value={totalTime} c={c} />
          <StatCard icon={<Check size={18} />} label="Exercises" value={`${exercisesCompleted}/${todayWorkout.exercises.length}`} c={c} />
        </div>

        {/* Weight updates */}
        {weightChanges.length > 0 && (
          <div className="w-full mb-6">
            <div className="text-sm font-bold mb-3 text-left" style={{ color: c.textSecondary }}>Weight updates</div>
            {weightChanges.map((wc) => (
              <div key={wc.exerciseId} className="card-frosted p-4 mb-2 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={14} style={{ color: c.sunGlare }} />
                  <span className="text-sm font-bold">{wc.exerciseName}</span>
                </div>
                <div className="text-sm font-medium mb-3" style={{ color: c.textSecondary }}>
                  {wc.oldWeight} {wc.unit} → {wc.newWeight} {wc.unit} next time?
                </div>
                {!weightUpdated[wc.exerciseId] ? (
                  <div className="flex gap-2">
                    <button onClick={() => setWeightUpdated((p) => ({ ...p, [wc.exerciseId]: true }))} className="flex-1 h-10 rounded-xl text-xs font-bold" style={{ background: c.sunGlare, color: "#1C1C1A" }}>
                      Yes, update
                    </button>
                    <button onClick={() => setWeightUpdated((p) => ({ ...p, [wc.exerciseId]: true }))} className="flex-1 h-10 rounded-xl text-xs font-bold" style={{ border: `1px solid ${c.chipBorder}`, color: c.textSecondary }}>
                      Keep at {wc.oldWeight} {wc.unit}
                    </button>
                  </div>
                ) : (
                  <div className="text-xs font-semibold" style={{ color: "oklch(0.52 0.14 152)" }}>✓ Updated</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Feedback */}
        <div className="w-full mb-5">
          <div className="text-sm font-bold mb-2.5 text-left" style={{ color: c.textSecondary }}>How did that feel?</div>
          <div className="grid grid-cols-3 gap-2">
            {["Too easy", "Just right", "Too hard"].map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFeedback(f);
                  toast.success("Feedback saved!", { description: "We'll adjust your next session." });
                }}
                className="h-12 rounded-xl text-sm font-semibold transition-all active:scale-95"
                style={{
                  background: feedback === f ? c.sunGlareBg : c.chipBg,
                  border: `2px solid ${feedback === f ? c.sunGlare : c.chipBorder}`,
                  color: feedback === f ? c.sunGlare : c.textSecondary,
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <textarea
          placeholder="Notes (optional)..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="w-full rounded-xl px-4 py-3 text-sm resize-none mb-5 focus:outline-none"
          style={{ background: c.chipBg, border: `1px solid ${c.chipBorder}`, color: c.textPrimary }}
        />
      </div>

      <div className="space-y-3 max-w-md mx-auto w-full">
        <Link
          to="/dashboard"
          onClick={() => resetWorkoutSession()}
          className="w-full h-[52px] rounded-full font-bold text-[15px] flex items-center justify-center hover:opacity-90 active:scale-[0.98] transition-all"
          style={{ background: c.sunGlare, color: "#1C1C1A", boxShadow: `0 0 24px ${c.sunGlareBg}` }}
        >
          Save & finish
        </Link>
        <Link to="/dashboard" onClick={() => resetWorkoutSession()} className="block text-center text-sm font-semibold" style={{ color: c.textTertiary }}>
          Back to home
        </Link>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, c }: { icon: React.ReactNode; label: string; value: string; c: ReturnType<typeof useColors> }) {
  return (
    <div className="card-frosted p-4 text-left">
      <div className="flex items-center gap-2 mb-2" style={{ color: c.textTertiary }}>{icon}</div>
      <div className="text-2xl font-extrabold tabular-nums">{value}</div>
      <div className="text-[10px] uppercase tracking-wider font-bold mt-0.5" style={{ color: c.textTertiary }}>{label}</div>
    </div>
  );
}
