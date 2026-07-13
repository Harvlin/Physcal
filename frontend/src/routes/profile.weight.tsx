import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Scale, Dumbbell, TrendingUp } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip, YAxis, CartesianGrid } from "recharts";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { useApp } from "@/lib/store";
import { useColors } from "@/hooks/useColors";
import { bodyWeightHistory, exerciseLoadHistory } from "@/lib/mock-data";
import { convertWeight, formatWeight } from "@/lib/utils";

export const Route = createFileRoute("/profile/weight")({
  head: () => ({ meta: [{ title: "Weight Tracker — Physcal" }] }),
  component: WeightPage,
});

function WeightPage() {
  const c = useColors();
  const bodyWeightGoal = useApp((s) => s.bodyWeightGoal);
  const unit = useApp((s) => s.weightUnit);
  
  const goalWeight = bodyWeightGoal?.goal;
  
  const subtitle = goalWeight ? `Goal: ${goalWeight} ${unit}` : "Goal: maintain weight";
  
  type LocalEntry = { date: string; weight: number };
  const [history, setHistory] = useState<LocalEntry[]>(() => [...bodyWeightHistory].reverse());
  const [todayWeight, setTodayWeight] = useState<string>("");
  
  const todayDateStr = new Date().toISOString().split("T")[0];
  const alreadyLogged = history[0]?.date === todayDateStr;

  const handleLog = () => {
    if (!todayWeight) return;
    const num = Number(todayWeight);
    if (isNaN(num) || num <= 0) return;
    
    setHistory(prev => [
      { date: todayDateStr, weight: num },
      ...prev,
    ]);
    setTodayWeight("");
  };

  // Recharts expects chronological order for drawing lines
  const chartData = [...history].reverse();

  return (
    <AppShell>
      <PageHeader title="Weight Tracker" back="/profile" />
      <div className="px-4 lg:px-8 py-6 max-w-2xl mx-auto space-y-6">
        
        {/* Title & Subtitle */}
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 rounded-full grid place-items-center mb-3" style={{ background: c.sunGlareBg, color: c.sunGlare }}>
            <Scale size={24} />
          </div>
          <h1 className="text-[24px] font-black" style={{ color: c.textPrimary }}>Weight Tracker</h1>
          <p className="text-sm mt-1 font-medium" style={{ color: c.textSecondary }}>{subtitle}</p>
        </div>

        {/* Log today's weight card */}
        <div className="card-frosted p-5 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold mb-2" style={{ color: c.textSecondary }}>
              Log today's weight
            </label>
            <div className="relative">
              <input
                type="number"
                value={todayWeight}
                onChange={e => setTodayWeight(e.target.value)}
                disabled={alreadyLogged}
                className="w-full rounded-xl px-4 py-3 text-xl font-bold focus:outline-none transition-colors disabled:opacity-50"
                style={{ background: c.inputBg, color: c.textPrimary, border: `1px solid ${c.inputBorder}` }}
                placeholder="0.0"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold" style={{ color: c.textTertiary }}>
                {unit}
              </span>
            </div>
          </div>
          <button
            onClick={handleLog}
            disabled={alreadyLogged || !todayWeight}
            className="w-full sm:w-auto px-6 h-[52px] rounded-full font-bold text-[15px] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 sm:mt-0"
            style={{
              background: alreadyLogged ? c.chipBg : c.sunGlare,
              color: alreadyLogged ? c.textDisabled : "#1C1C1A",
              boxShadow: alreadyLogged ? "none" : `0 0 24px ${c.sunGlareBg}`,
            }}
          >
            {alreadyLogged ? "Logged" : "Log weight"}
          </button>
        </div>

        {/* Progress chart */}
        <div className="card-frosted p-5">
          <h2 className="font-bold text-[13px] uppercase tracking-[0.1em] mb-4" style={{ color: c.textTertiary }}>
            Progress
          </h2>
          {history.length >= 2 ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={c.chipBorder} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: c.textTertiary, fontSize: 10 }} 
                    tickFormatter={(val) => {
                      const d = new Date(val);
                      return `${d.getMonth()+1}/${d.getDate()}`;
                    }}
                  />
                  <YAxis 
                    domain={['auto', 'auto']} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: c.textTertiary, fontSize: 10 }} 
                  />
                  <Tooltip
                    contentStyle={{
                      background: c.isDark ? "rgba(30,30,27,0.95)" : "rgba(255,255,255,0.95)",
                      border: `1px solid ${c.inputBorder}`,
                      borderRadius: 12,
                      fontSize: 12,
                      color: c.textPrimary,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke={c.sunGlare} 
                    strokeWidth={3} 
                    dot={{ fill: c.sunGlare, strokeWidth: 0, r: 4 }} 
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState
              icon={<Scale size={32} style={{ color: c.textDisabled }} />}
              title="Not enough data"
              description="Log your weight a few times to see your progress chart."
            />
          )}
        </div>

        {/* History list */}
        <div className="card-frosted p-5">
          <h2 className="font-bold text-[13px] uppercase tracking-[0.1em] mb-4" style={{ color: c.textTertiary }}>
            History
          </h2>
          <div className="space-y-3">
            {history.map((entry, i) => (
              <div key={`${entry.date}-${i}`} className="flex justify-between items-center py-2 border-b last:border-0" style={{ borderColor: c.chipBorder }}>
                <span className="font-medium" style={{ color: c.textSecondary }}>
                  {new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
                <span className="font-bold" style={{ color: c.textPrimary }}>
                  {entry.weight} {unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Exercise Load Progress */}
        <div className="card-frosted p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full grid place-items-center" style={{ background: c.violetBg, color: c.violet }}>
              <Dumbbell size={16} />
            </div>
            <h2 className="font-bold text-[13px] uppercase tracking-[0.1em]" style={{ color: c.textTertiary }}>
              Exercise Load Progress
            </h2>
          </div>
          <div className="space-y-4">
            {exerciseLoadHistory.map((exHistory) => {
              const latest = exHistory.entries[exHistory.entries.length - 1];
              const oldest = exHistory.entries[0];
              const diff = latest.weight - oldest.weight;
              const hasImproved = diff > 0;
              const isSameUnit = exHistory.unit === unit;
              const displayWeight = isSameUnit ? latest.weight : convertWeight(latest.weight, exHistory.unit, unit);
              const displayDiff = isSameUnit ? diff : convertWeight(diff, exHistory.unit, unit);
              
              return (
                <div key={exHistory.exerciseId} className="flex justify-between items-center p-3 rounded-xl" style={{ background: c.chipBg, border: `1px solid ${c.chipBorder}` }}>
                  <div>
                    <div className="font-bold text-sm" style={{ color: c.textPrimary }}>{exHistory.exerciseName}</div>
                    <div className="text-xs font-medium" style={{ color: c.textSecondary }}>
                      {exHistory.entries.length} sessions logged
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold" style={{ color: c.textPrimary }}>
                      {formatWeight(displayWeight, unit)}
                    </div>
                    {hasImproved && (
                      <div className="text-[10px] font-bold flex items-center justify-end gap-1 mt-0.5" style={{ color: c.sunGlare }}>
                        <TrendingUp size={10} /> +{formatWeight(displayDiff, unit)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {exerciseLoadHistory.length === 0 && (
              <div className="text-center py-6">
                <p className="text-sm font-medium" style={{ color: c.textSecondary }}>No exercises tracked yet.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </AppShell>
  );
}
