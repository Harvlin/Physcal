import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Edit2, Minus, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { useApp } from "@/lib/store";
import { useColors } from "@/hooks/useColors";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile/goals")({
  head: () => ({ meta: [{ title: "My Goals — Physcal" }] }),
  component: GoalsPage,
});

const goalOptions = [
  { id: "health", label: "General health" },
  { id: "weight", label: "Lose weight" },
  { id: "gain_weight", label: "Gain weight" },
  { id: "strength", label: "Build strength" },
  { id: "social", label: "Have fun & socialize" },
  { id: "recovery", label: "Recover from injury" },
  { id: "stress", label: "Reduce stress" },
];

const fitnessLevels = ["Complete beginner", "Rarely active", "Sometimes active", "Pretty active"];

function GoalsPage() {
  const c = useColors();
  const onboarding = useApp((s) => s.onboarding);
  const setOnboarding = useApp((s) => s.setOnboarding);

  const [editingGoals, setEditingGoals] = useState(false);
  
  const hasWeightGoal = onboarding.goals.includes("weight") || onboarding.goals.includes("gain_weight");

  return (
    <AppShell>
      <PageHeader title="My Goals" back="/profile" />
      <div className="px-4 lg:px-8 py-6 max-w-2xl mx-auto space-y-6 pb-12">
        <div className="text-center mb-6">
          <p className="text-sm mt-1 font-medium" style={{ color: c.textSecondary }}>
            Update your targets anytime
          </p>
        </div>

        {/* Primary Goals Card */}
        <div className="card-frosted p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-[15px]" style={{ color: c.textPrimary }}>Primary goals</h2>
            <button
              onClick={() => setEditingGoals(!editingGoals)}
              className="w-8 h-8 rounded-full grid place-items-center transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              style={{ color: c.textTertiary }}
            >
              {editingGoals ? <Check size={16} style={{ color: c.sunGlare }} /> : <Edit2 size={14} />}
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {editingGoals ? (
              goalOptions.map((g) => {
                const active = onboarding.goals.includes(g.id);
                return (
                  <button
                    key={g.id}
                    onClick={() =>
                      setOnboarding({
                        goals: active
                          ? onboarding.goals.filter((x) => x !== g.id)
                          : [...onboarding.goals, g.id],
                      })
                    }
                    className="px-4 py-2 rounded-xl text-sm font-bold border transition-all"
                    style={
                      active
                        ? { background: c.sunGlareBg, borderColor: `${c.sunGlare}44`, color: c.sunGlare }
                        : { background: c.chipBg, borderColor: c.chipBorder, color: c.textSecondary }
                    }
                  >
                    {g.label}
                  </button>
                );
              })
            ) : (
              onboarding.goals.map((gid) => {
                const g = goalOptions.find(x => x.id === gid);
                if (!g) return null;
                return (
                  <span
                    key={gid}
                    className="px-4 py-2 rounded-xl text-sm font-bold"
                    style={{ background: c.sunGlareBg, color: c.sunGlare, border: `1px solid ${c.sunGlare}22` }}
                  >
                    {g.label}
                  </span>
                );
              })
            )}
          </div>
        </div>

        {/* Weight Targets Card */}
        {hasWeightGoal && (
          <div className="card-frosted p-5">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-bold text-[15px]" style={{ color: c.textPrimary }}>Weight targets</h2>
              <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: c.chipBorder }}>
                <button
                  onClick={() => {
                    if (onboarding.weightUnit !== "kg") {
                      setOnboarding({
                        weightUnit: "kg",
                        currentWeight: onboarding.currentWeight ? Number((onboarding.currentWeight / 2.2046).toFixed(1)) : null,
                        goalWeight: onboarding.goalWeight ? Number((onboarding.goalWeight / 2.2046).toFixed(1)) : null,
                      });
                    }
                  }}
                  className="px-3 py-1.5 text-xs font-bold transition-colors"
                  style={onboarding.weightUnit === "kg" ? { background: c.sunGlare, color: c.appBg } : { background: c.chipBg, color: c.textSecondary }}
                >
                  kg
                </button>
                <button
                  onClick={() => {
                    if (onboarding.weightUnit !== "lbs") {
                      setOnboarding({
                        weightUnit: "lbs",
                        currentWeight: onboarding.currentWeight ? Number((onboarding.currentWeight * 2.2046).toFixed(1)) : null,
                        goalWeight: onboarding.goalWeight ? Number((onboarding.goalWeight * 2.2046).toFixed(1)) : null,
                      });
                    }
                  }}
                  className="px-3 py-1.5 text-xs font-bold transition-colors"
                  style={onboarding.weightUnit === "lbs" ? { background: c.sunGlare, color: c.appBg } : { background: c.chipBg, color: c.textSecondary }}
                >
                  lbs
                </button>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs mb-1 font-semibold" style={{ color: c.textSecondary }}>Current</label>
                <input
                  type="number"
                  value={onboarding.currentWeight ?? ""}
                  onChange={(e) => setOnboarding({ currentWeight: e.target.value ? Number(e.target.value) : null })}
                  className="w-full rounded-lg px-4 py-3 text-lg font-bold focus:outline-none transition-colors"
                  style={{ background: c.inputBg, color: c.textPrimary, border: `1px solid ${c.inputBorder}` }}
                  onFocus={e => (e.currentTarget.style.borderColor = `${c.sunGlare}66`)}
                  onBlur={e => (e.currentTarget.style.borderColor = c.inputBorder)}
                  placeholder="0.0"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs mb-1 font-semibold" style={{ color: c.textSecondary }}>Goal</label>
                <input
                  type="number"
                  value={onboarding.goalWeight ?? ""}
                  onChange={(e) => setOnboarding({ goalWeight: e.target.value ? Number(e.target.value) : null })}
                  className="w-full rounded-lg px-4 py-3 text-lg font-bold focus:outline-none transition-colors"
                  style={{ background: c.inputBg, color: c.textPrimary, border: `1px solid ${c.inputBorder}` }}
                  onFocus={e => (e.currentTarget.style.borderColor = `${c.sunGlare}66`)}
                  onBlur={e => (e.currentTarget.style.borderColor = c.inputBorder)}
                  placeholder="0.0"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 rounded-full text-sm font-bold transition-all active:scale-95"
                style={{ background: c.sunGlare, color: c.appBg }}
                onClick={() => {
                  // Simply dismiss keyboard or show toast
                  (document.activeElement as HTMLElement)?.blur();
                }}
              >
                Save targets
              </button>
            </div>
          </div>
        )}

        {/* Weekly session target card */}
        <div className="card-frosted p-5 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-[15px]" style={{ color: c.textPrimary }}>Weekly sessions</h2>
            <p className="text-xs mt-1" style={{ color: c.textSecondary }}>How many times you want to work out</p>
          </div>
          <div className="flex items-center gap-4 bg-black/5 dark:bg-white/5 rounded-2xl p-1.5" style={{ border: `1px solid ${c.chipBorder}` }}>
            <button
              onClick={() => setOnboarding({ weeklySessionTarget: Math.max(1, onboarding.weeklySessionTarget - 1) })}
              className="w-10 h-10 rounded-xl grid place-items-center transition-colors active:scale-95 bg-white dark:bg-[#2A2A26] shadow-sm"
              style={{ color: c.textPrimary }}
            >
              <Minus size={16} />
            </button>
            <span className="w-4 text-center font-black text-lg" style={{ color: c.textPrimary }}>
              {onboarding.weeklySessionTarget}
            </span>
            <button
              onClick={() => setOnboarding({ weeklySessionTarget: Math.min(7, onboarding.weeklySessionTarget + 1) })}
              className="w-10 h-10 rounded-xl grid place-items-center transition-colors active:scale-95 bg-white dark:bg-[#2A2A26] shadow-sm"
              style={{ color: c.textPrimary }}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Fitness Level */}
        <div className="card-frosted p-5">
          <h2 className="font-bold text-[15px] mb-4" style={{ color: c.textPrimary }}>Fitness level</h2>
          <div className="flex flex-wrap gap-2">
            {fitnessLevels.map((lvl) => {
              const active = onboarding.fitnessLevel === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => setOnboarding({ fitnessLevel: lvl })}
                  className="px-4 py-2 rounded-xl text-sm font-bold border transition-all active:scale-95"
                  style={
                    active
                      ? { background: c.violetBg, borderColor: `${c.violet}44`, color: c.violet }
                      : { background: c.chipBg, borderColor: c.chipBorder, color: c.textSecondary }
                  }
                >
                  {lvl}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </AppShell>
  );
}
