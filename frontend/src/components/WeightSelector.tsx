import { Minus, Plus, TrendingUp } from "lucide-react";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/lib/store";
import type { Exercise } from "@/lib/mock-data";

type WeightSelectorProps = {
  exercise: Exercise;
  currentWeight: number | undefined;
  suggestedWeight: number | undefined;
  onWeightChange: (weight: number) => void;
};

export function WeightSelector({
  exercise,
  currentWeight,
  suggestedWeight,
  onWeightChange,
}: WeightSelectorProps) {
  const c = useColors();
  const unit = useApp((s) => s.weightUnit);

  // Bodyweight exercise — no weight selector needed
  if (exercise.defaultWeight === undefined && currentWeight === undefined) {
    return (
      <div
        className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl"
        style={{ background: c.chipBg }}
      >
        <span className="text-sm font-semibold" style={{ color: c.textSecondary }}>
          Bodyweight
        </span>
      </div>
    );
  }

  const weight = currentWeight ?? exercise.defaultWeight ?? 0;
  const step = weight >= 20 ? 1 : 0.5;

  const hasSuggestion = suggestedWeight !== undefined && suggestedWeight > weight;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex items-center gap-3">
        {/* Decrease */}
        <button
          onClick={() => onWeightChange(Math.max(0, weight - step))}
          className="w-11 h-11 rounded-full grid place-items-center transition-all active:scale-90"
          style={{
            border: `1.5px solid ${c.chipBorder}`,
            color: c.textSecondary,
          }}
          aria-label="Decrease weight"
        >
          <Minus size={16} strokeWidth={2.5} />
        </button>

        {/* Weight display */}
        <div
          className="min-w-[80px] h-11 rounded-xl flex items-center justify-center px-4 font-extrabold text-lg tabular-nums"
          style={{
            background: c.chipBg,
            border: `1px solid ${c.chipBorder}`,
            color: c.textPrimary,
          }}
        >
          {weight} {unit}
        </div>

        {/* Increase */}
        <button
          onClick={() => onWeightChange(weight + step)}
          className="w-11 h-11 rounded-full grid place-items-center transition-all active:scale-90"
          style={{
            border: `1.5px solid ${c.chipBorder}`,
            color: c.textSecondary,
          }}
          aria-label="Increase weight"
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>
      </div>

      {/* Suggestion */}
      {hasSuggestion && (
        <div
          className="flex items-center gap-1 text-xs font-semibold"
          style={{ color: c.sunGlare }}
        >
          <TrendingUp size={12} />
          <span>
            suggested: {suggestedWeight} {unit}
          </span>
        </div>
      )}
    </div>
  );
}
