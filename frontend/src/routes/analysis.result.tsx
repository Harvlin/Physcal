import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ArrowUp, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { CircularScore } from "@/components/CircularScore";
import { FormattedText } from "@/components/FormattedText";
import { analyses } from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import { useColors } from "@/hooks/useColors";

export const Route = createFileRoute("/analysis/result")({
  validateSearch: (search: Record<string, unknown>): { exerciseId?: string } => {
    return { exerciseId: search.exerciseId as string | undefined };
  },
  component: ResultPage,
});

function ResultPage() {
  const { exerciseId } = Route.useSearch();
  const result =
    analyses.find(
      (a) =>
        a.exercise.toLowerCase().replace(/[^a-z]/g, "") ===
        exerciseId?.toLowerCase().replace(/[^a-z]/g, ""),
    ) || analyses[0];
  const grade =
    result.score >= 80
      ? "Excellent form"
      : result.score >= 60
        ? "Good progress"
        : result.score >= 40
          ? "Keep practicing"
          : "Let's improve together";
  const delta = result.prevScore ? result.score - result.prevScore : null;
  const c = useColors();

  const addDrillToPlan = useApp((s) => s.addDrillToPlan);
  const todaysPlan = useApp((s) => s.todaysPlan);
  const isAdded = todaysPlan?.exercises.some((ex) => ex.name === result.drill.name);

  return (
    <AppShell>
      <PageHeader title="Movement analysis" back="/analysis" />
      <div className="px-4 lg:px-8 py-6 max-w-2xl mx-auto pb-12">
        <div className="flex flex-col items-center text-center mb-6">
          <CircularScore value={result.score} label="Movement Score" />
          <div className="text-[24px] font-black mt-5" style={{ color: c.textPrimary }}>
            {grade}
          </div>
          <div
            className="text-xs mt-1.5 uppercase tracking-wider font-semibold"
            style={{ color: c.textTertiary }}
          >
            {result.exercise} ·{" "}
            {new Date(result.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
            })}
          </div>

          {delta !== null && (
            <div
              className="mt-4 inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full"
              style={{ background: c.violetBg, color: c.violet, border: `1px solid ${c.violet}33` }}
            >
              <ArrowUp size={12} /> +{delta} vs last week
            </div>
          )}
        </div>

        {/* Breakdown */}
        <div className="card-frosted p-5 mb-4">
          <h2
            className="font-bold text-sm uppercase tracking-widest mb-4"
            style={{ color: c.textTertiary }}
          >
            Breakdown
          </h2>
          <div className="space-y-4">
            {result.metrics.map((m) => (
              <div key={m.label} className="flex items-start gap-3">
                <div
                  className="w-7 h-7 rounded-lg grid place-items-center shrink-0 font-bold"
                  style={
                    m.status === "good"
                      ? { background: c.violetBg, color: c.violet }
                      : { background: c.exuberantBg, color: c.exuberant }
                  }
                >
                  {m.status === "good" ? (
                    <Check size={14} strokeWidth={3} />
                  ) : (
                    <ArrowUp size={14} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="font-semibold text-sm" style={{ color: c.textPrimary }}>
                      {m.label}
                    </div>
                    <div className="font-bold text-sm tabular" style={{ color: c.textSecondary }}>
                      {m.value}
                    </div>
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: c.textTertiary }}>
                    {m.note}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coach feedback */}
        <div className="card-frosted p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-7 h-7 rounded-full grid place-items-center text-xs font-black"
              style={{ background: c.coachAvatarBg, color: c.coachAvatarColor }}
            >
              M
            </div>
            <span className="font-bold text-sm" style={{ color: c.textPrimary }}>
              Your coach says
            </span>
          </div>
          <FormattedText text={result.feedback} />
        </div>

        {/* Drill */}
        <div
          className="card-frosted p-5 mb-6"
          style={{ borderColor: `${c.exuberant}33`, background: c.exuberantBg }}
        >
          <div
            className="text-xs uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5"
            style={{ color: c.exuberant }}
          >
            <TrendingUp size={12} strokeWidth={3} /> Try this drill
          </div>
          <h3 className="text-xl font-black mb-1" style={{ color: c.textPrimary }}>
            {result.drill.name}
          </h3>
          <p className="text-sm font-medium mb-4" style={{ color: c.textSecondary }}>
            {result.drill.description}
          </p>
          <button
            onClick={() => {
              if (!isAdded) {
                addDrillToPlan(result.drill);
              }
            }}
            disabled={isAdded}
            className="h-11 px-5 rounded-full text-sm font-bold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            style={{
              background: isAdded ? c.chipBg : c.exuberant,
              color: isAdded ? c.textDisabled : "#F2F0E9",
              boxShadow: isAdded ? "none" : `0 4px 16px ${c.exuberantBg}`,
              border: isAdded ? `1px solid ${c.chipBorder}` : "none",
              cursor: isAdded ? "default" : "pointer",
            }}
          >
            {isAdded ? (
              <>
                <Check size={16} /> Added to plan
              </>
            ) : (
              "Add to my plan"
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/analysis"
            className="h-[52px] rounded-full font-bold text-[15px] grid place-items-center transition-all hover:opacity-90 active:scale-[0.98]"
            style={{
              background: c.chipBg,
              border: `1px solid ${c.chipBorder}`,
              color: c.textPrimary,
            }}
          >
            Analyze another
          </Link>
          <Link
            to="/coach"
            className="h-[52px] rounded-full font-bold text-[15px] grid place-items-center hover:opacity-90 active:scale-[0.98] transition-all"
            style={{
              background: c.sunGlare,
              color: "#1C1C1A",
              boxShadow: `0 0 24px ${c.sunGlareBg}`,
            }}
          >
            Go to my plan
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
