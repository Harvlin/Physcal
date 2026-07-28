import { useColors } from "@/hooks/useColors";
import { Shield, Dumbbell, Clock } from "lucide-react";

export function Slide02Plan() {
  const c = useColors();

  const exercises = [
    { name: "Goblet Squat", detail: "3 sets · 12 reps · 8 kg" },
    { name: "Glute Bridge", detail: "3 sets · 15 reps · bodyweight" },
    { name: "Reverse Lunge", detail: "3 sets · 10 reps/side" },
  ];

  return (
    <div className="px-5 py-8 max-w-lg mx-auto">
      <p className="text-xs font-bold uppercase tracking-[0.18em] mb-2" style={{ color: c.sunGlare }}>
        Your Plan
      </p>
      <h2 className="text-2xl font-black mb-1" style={{ color: c.textPrimary }}>
        Personalized, not generic.
      </h2>
      <p className="text-sm font-medium mb-6 leading-relaxed" style={{ color: c.textSecondary }}>
        Every session is generated from your sport, goal, fitness level, health 
        conditions, and available time — all blended into one coherent daily plan.
      </p>

      {/* Mock plan card */}
      <div className="card-frosted p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="font-black text-base" style={{ color: c.textPrimary }}>Lower Body Strength</div>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-xs font-medium" style={{ color: c.textTertiary }}>
                <Clock size={11} /> 35 min
              </span>
              <span className="flex items-center gap-1 text-xs font-medium" style={{ color: c.textTertiary }}>
                <Dumbbell size={11} /> Beginner
              </span>
            </div>
          </div>
          <div
            className="px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ background: c.sunGlareBg, color: c.sunGlare, border: `1px solid ${c.sunGlare}33` }}
          >
            Adapted
          </div>
        </div>

        <div className="space-y-2">
          {exercises.map((ex) => (
            <div
              key={ex.name}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: c.chipBg, border: `1px solid ${c.chipBorder}` }}
            >
              <div
                className="w-1 h-8 rounded-full shrink-0"
                style={{ background: c.sunGlare }}
              />
              <div>
                <div className="text-sm font-semibold" style={{ color: c.textPrimary }}>{ex.name}</div>
                <div className="text-xs font-medium" style={{ color: c.textTertiary }}>{ex.detail}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Planning note */}
        <div
          className="mt-3 flex items-start gap-2 p-3 rounded-xl text-xs font-medium leading-relaxed"
          style={{ background: c.violetBg, color: c.violetLight, border: `1px solid ${c.violet}22` }}
        >
          <Shield size={13} className="shrink-0 mt-0.5" />
          Adjusted for your Badminton focus · Started lighter while you build confidence
        </div>
      </div>

      <div className="space-y-2.5">
        {[
          "Blends sport, goal, level, conditions, and time into every session",
          "Adapts week by week as you progress and your data builds up",
          "Always tells you *why* something changed — never quietly adjusts",
        ].map((line) => (
          <div key={line} className="flex items-start gap-2.5">
            <div
              className="w-4 h-4 rounded-full grid place-items-center shrink-0 mt-0.5"
              style={{ background: c.sunGlareBg }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: c.sunGlare }} />
            </div>
            <p className="text-sm font-medium leading-snug" style={{ color: c.textSecondary }}>{line}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
