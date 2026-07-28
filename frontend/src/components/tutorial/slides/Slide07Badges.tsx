import { BadgeCard } from "@/components/BadgeCard";
import type { Badge } from "@/lib/mock-data";
import { useColors } from "@/hooks/useColors";

const DEMO_BADGES: Badge[] = [
  {
    id: "first-step",
    name: "First Step",
    description: "You showed up. That's everything.",
    unlockedAt: "2025-04-12",
  },
  {
    id: "form-check",
    name: "Form Check",
    description: "You cared enough to improve your technique.",
    unlockedAt: "2025-04-20",
  },
  {
    id: "community",
    name: "Community",
    description: "You found your people.",
    // intentionally locked — no unlockedAt
  },
  {
    id: "coachs-pick",
    name: "Coach's Pick",
    description: "Your AI coach is proud.",
    // intentionally locked
  },
];

export function Slide07Badges() {
  const c = useColors();

  return (
    <div className="px-5 py-8 max-w-lg mx-auto">
      <p className="text-xs font-bold uppercase tracking-[0.18em] mb-2" style={{ color: c.sunGlare }}>
        Achievements
      </p>
      <h2 className="text-2xl font-black mb-1" style={{ color: c.textPrimary }}>
        Progress you can actually trust.
      </h2>
      <p className="text-sm font-medium mb-6 leading-relaxed" style={{ color: c.textSecondary }}>
        Physcal never claims progress it can't back up. Badges, weekly reports, and unlocks 
        are always based on real activity — not motivational fluff. Tap a locked badge to see 
        exactly what it takes to earn it.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {DEMO_BADGES.map((badge) => (
          <BadgeCard key={badge.id} badge={badge} size="md" />
        ))}
      </div>

      <div className="space-y-2.5">
        {[
          "Badges unlock only when the activity actually happened — no inflation",
          "Weekly reports are auto-generated from your real session and check-in data",
          "Reassessments keep your plan honest as you grow",
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
