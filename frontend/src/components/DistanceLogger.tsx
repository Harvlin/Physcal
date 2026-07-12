import { useState } from "react";
import { Check } from "lucide-react";
import { useColors } from "@/hooks/useColors";
import type { Exercise } from "@/lib/mock-data";

type DistanceLoggerProps = {
  exercise: Exercise;
  onDone: (durationMin: number, distanceKm: number) => void;
};

export function DistanceLogger({ exercise, onDone }: DistanceLoggerProps) {
  const c = useColors();
  const [duration, setDuration] = useState<number | "">(exercise.targetDurationMinutes || "");
  const [distance, setDistance] = useState<number | "">(exercise.targetDistanceKm || "");

  const handleDone = () => {
    onDone(Number(duration) || 0, Number(distance) || 0);
  };

  return (
    <div className="flex flex-col items-center py-4">
      <div className="flex gap-4 w-full max-w-[280px] mb-8">
        {/* Duration Input */}
        <div className="flex-1 flex flex-col gap-2">
          <label
            className="text-xs font-bold uppercase tracking-wider text-center"
            style={{ color: c.textTertiary }}
          >
            Duration (min)
          </label>
          <div
            className="h-14 rounded-xl flex items-center justify-center px-2 font-extrabold text-xl tabular-nums"
            style={{
              background: c.chipBg,
              border: `1px solid ${c.chipBorder}`,
              color: c.textPrimary,
            }}
          >
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value ? Number(e.target.value) : "")}
              className="w-full bg-transparent text-center outline-none"
              placeholder="0"
              min="0"
            />
          </div>
        </div>

        {/* Distance Input */}
        <div className="flex-1 flex flex-col gap-2">
          <label
            className="text-xs font-bold uppercase tracking-wider text-center"
            style={{ color: c.textTertiary }}
          >
            Distance (km)
          </label>
          <div
            className="h-14 rounded-xl flex items-center justify-center px-2 font-extrabold text-xl tabular-nums"
            style={{
              background: c.chipBg,
              border: `1px solid ${c.chipBorder}`,
              color: c.textPrimary,
            }}
          >
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value ? Number(e.target.value) : "")}
              className="w-full bg-transparent text-center outline-none"
              placeholder="0"
              min="0"
              step="0.1"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleDone}
        className="w-full max-w-[280px] h-14 rounded-full font-bold text-[15px] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        style={{
          background: c.sunGlare,
          color: "#1C1C1A",
          boxShadow: `0 0 24px ${c.sunGlareBg}`,
        }}
      >
        <Check size={18} strokeWidth={3} /> Log & continue
      </button>
    </div>
  );
}
