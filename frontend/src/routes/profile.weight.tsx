import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Scale } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip, YAxis, CartesianGrid } from "recharts";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { useApp } from "@/lib/store";
import { useColors } from "@/hooks/useColors";

export const Route = createFileRoute("/profile/weight")({
  head: () => ({ meta: [{ title: "Weight Tracker — Physcal" }] }),
  component: WeightPage,
});

function getMockData(unit: "kg" | "lbs", goals: string[]) {
  // Generate some realistic mock data based on goal
  const base = unit === "kg" ? 70 : 154;
  const entries = [];
  const isLosing = goals.includes("weight") || goals.includes("lose_weight");
  const isGaining = goals.includes("gain_weight");
  
  for (let i = 9; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i * 7); // weekly entries
    
    let variance = Math.random() * 2 - 1; // -1 to 1
    let trend = 0;
    if (isLosing) trend = i * 0.5; // started higher, went down
    else if (isGaining) trend = i * -0.5; // started lower, went up
    
    entries.push({
      id: `w-${i}`,
      date: d.toISOString().split("T")[0],
      weight: Number((base + trend + variance).toFixed(1)),
    });
  }
  return entries.reverse(); // most recent first
}

function WeightPage() {
  const c = useColors();
  const onboarding = useApp((s) => s.onboarding);
  
  const goalWeight = onboarding.goalWeight;
  const unit = onboarding.weightUnit || "kg";
  
  const subtitle = goalWeight ? `Goal: ${goalWeight} ${unit}` : "Goal: maintain weight";
  
  const [history, setHistory] = useState(() => getMockData(unit, onboarding.goals));
  const [todayWeight, setTodayWeight] = useState<string>("");
  
  const todayDateStr = new Date().toISOString().split("T")[0];
  const alreadyLogged = history[0]?.date === todayDateStr;

  const handleLog = () => {
    if (!todayWeight) return;
    const num = Number(todayWeight);
    if (isNaN(num) || num <= 0) return;
    
    setHistory(prev => [
      { id: `w-new-${Date.now()}`, date: todayDateStr, weight: num },
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
            {history.map((entry) => (
              <div key={entry.id} className="flex justify-between items-center py-2 border-b last:border-0" style={{ borderColor: c.chipBorder }}>
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

      </div>
    </AppShell>
  );
}
