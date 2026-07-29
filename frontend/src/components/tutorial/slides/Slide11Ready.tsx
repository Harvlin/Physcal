import { useColors } from "@/hooks/useColors";
import { Sparkles } from "lucide-react";

export function Slide11Ready({ fromOnboarding }: { fromOnboarding: boolean }) {
  const c = useColors();
  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-10 text-center max-w-lg mx-auto">
      <div className="mb-8">
        <img src="/favicon.png" alt="Physcal Logo" className="h-10 w-auto object-contain mx-auto" />
      </div>

      <p
        className="text-xs font-bold uppercase tracking-[0.18em] mb-4"
        style={{ color: c.sunGlare }}
      >
        You're all set
      </p>

      <h1
        className="font-black leading-tight mb-5"
        style={{ fontSize: "clamp(26px,6vw,36px)", color: c.textPrimary }}
      >
        {fromOnboarding ? "Let's get started." : "Good to have you back."}
      </h1>

      <p
        className="text-base leading-relaxed font-medium max-w-[320px]"
        style={{ color: c.textSecondary }}
      >
        {fromOnboarding
          ? "Your plan is ready. Check in, start your first session, and let the app learn how you move."
          : "You know what Physcal can do. Head back to your profile whenever you need a refresher."}
      </p>
    </div>
  );
}
