import { useColors } from "@/hooks/useColors";
import { Scale, Target, History, Award, Dumbbell, Activity } from "lucide-react";

const SECTIONS = [
  {
    icon: Scale,
    label: "Body weight tracking",
    desc: "Logged separately from training load — never conflated",
  },
  {
    icon: Target,
    label: "Goals & progress",
    desc: "Set a weight goal or fitness milestone, track it weekly",
  },
  {
    icon: Dumbbell,
    label: "Your sports",
    desc: "Primary sport plus additional ones that influence your plan",
  },
  {
    icon: History,
    label: "Session history",
    desc: "Full log of completed sessions and check-ins",
  },
  {
    icon: Award,
    label: "Achievements",
    desc: "All earned and locked badges in one place",
  },
  {
    icon: Activity,
    label: "Health profile",
    desc: "Conditions you've disclosed and how they're being considered",
  },
];

export function Slide09Profile() {
  const c = useColors();

  return (
    <div className="px-5 py-8 max-w-lg mx-auto">
      <p className="text-xs font-bold uppercase tracking-[0.18em] mb-2" style={{ color: c.sunGlare }}>
        Your Profile
      </p>
      <h2 className="text-2xl font-black mb-1" style={{ color: c.textPrimary }}>
        Everything about you, in one place.
      </h2>
      <p className="text-sm font-medium mb-6 leading-relaxed" style={{ color: c.textSecondary }}>
        Your profile brings together your training history, goals, sports, and health data 
        — tracked carefully and kept separate where it matters.
      </p>

      <div className="grid grid-cols-1 gap-2.5">
        {SECTIONS.map(({ icon: Icon, label, desc }) => (
          <div
            key={label}
            className="flex items-center gap-4 p-4 rounded-2xl"
            style={{
              background: c.chipBg,
              border: `1px solid ${c.chipBorder}`,
            }}
          >
            <div
              className="w-10 h-10 rounded-xl grid place-items-center shrink-0"
              style={{ background: c.sunGlareBg, color: c.sunGlare }}
            >
              <Icon size={18} />
            </div>
            <div>
              <div className="font-bold text-sm" style={{ color: c.textPrimary }}>{label}</div>
              <div className="text-xs font-medium mt-0.5 leading-snug" style={{ color: c.textTertiary }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
