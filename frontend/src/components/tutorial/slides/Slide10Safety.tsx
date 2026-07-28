import { useColors } from "@/hooks/useColors";
import { ShieldCheck, Eye, MessageSquareWarning, HeartHandshake } from "lucide-react";

const PROMISES = [
  {
    icon: ShieldCheck,
    color: "sunGlare" as const,
    title: "We adapt around your health, not despite it",
    body: "When you disclose a condition, Physcal actively modifies exercises, flags caution movements, and explains every change. Your health is a variable in the plan, not an obstacle.",
  },
  {
    icon: Eye,
    color: "violet" as const,
    title: "You always know why something changed",
    body: "Every adaptation comes with a plain-language note — what changed, and why. No silent updates, no guessing.",
  },
  {
    icon: MessageSquareWarning,
    color: "exuberant" as const,
    title: "Free-text health info gets human attention",
    body: "If you describe a condition we can't confidently interpret from structured options, we don't guess — we flag it and ask you to confirm before acting on it.",
  },
  {
    icon: HeartHandshake,
    color: "sunGlare" as const,
    title: "You're always in control",
    body: "You can update your health profile, reassess your sport fit, or swap any exercise at any time. Physcal is a tool — you make the calls.",
  },
];

export function Slide10Safety() {
  const c = useColors();

  return (
    <div className="px-5 py-8 max-w-lg mx-auto">
      <p className="text-xs font-bold uppercase tracking-[0.18em] mb-2" style={{ color: c.violet }}>
        Health & Safety
      </p>
      <h2 className="text-2xl font-black mb-1" style={{ color: c.textPrimary }}>
        Our promise to you.
      </h2>
      <p className="text-sm font-medium mb-6 leading-relaxed" style={{ color: c.textSecondary }}>
        Physcal is built for people who've felt overlooked by fitness apps — people with 
        conditions, sensitivities, and lives that don't fit a standard program. Here's 
        how we take that seriously.
      </p>

      <div className="space-y-3">
        {PROMISES.map(({ icon: Icon, color, title, body }) => {
          const accent = c[color];
          const accentBg = color === "sunGlare" ? c.sunGlareBg : color === "violet" ? c.violetBg : c.exuberantBg;
          return (
            <div
              key={title}
              className="p-4 rounded-2xl"
              style={{ background: c.chipBg, border: `1px solid ${c.chipBorder}` }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-xl grid place-items-center shrink-0 mt-0.5"
                  style={{ background: accentBg, color: accent }}
                >
                  <Icon size={17} />
                </div>
                <div>
                  <div className="font-bold text-sm mb-1" style={{ color: c.textPrimary }}>{title}</div>
                  <div className="text-xs font-medium leading-relaxed" style={{ color: c.textSecondary }}>{body}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
