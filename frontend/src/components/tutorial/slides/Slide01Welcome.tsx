import { useColors } from "@/hooks/useColors";

export function Slide01Welcome() {
  const c = useColors();
  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-10 text-center max-w-lg mx-auto">
      {/* Logo orb */}
      <div
        className="w-20 h-20 rounded-3xl grid place-items-center mb-8 text-3xl font-black"
        style={{
          background: c.sunGlareBg,
          border: `1px solid ${c.sunGlare}33`,
          color: c.sunGlare,
          boxShadow: `0 0 40px ${c.sunGlareBg}`,
        }}
      >
        P
      </div>

      <p
        className="text-xs font-bold uppercase tracking-[0.18em] mb-4"
        style={{ color: c.sunGlare }}
      >
        Welcome to Physcal
      </p>

      <h1
        className="font-black leading-tight mb-5"
        style={{ fontSize: "clamp(28px,7vw,40px)", color: c.textPrimary }}
      >
        Fitness that fits{" "}
        <span style={{ color: c.sunGlare }}>your</span> life.
      </h1>

      <p
        className="text-base leading-relaxed font-medium max-w-[340px]"
        style={{ color: c.textSecondary }}
      >
        Physcal is built for real people — beginners, people with joint sensitivities, 
        anyone who's felt like fitness apps weren't made for them. Let's take a quick look 
        at how it all works.
      </p>

      <div
        className="mt-8 px-4 py-3 rounded-2xl text-sm font-medium"
        style={{ background: c.chipBg, border: `1px solid ${c.chipBorder}`, color: c.textSecondary }}
      >
        Takes about 2 minutes. Tap "Show me around" to begin.
      </div>
    </div>
  );
}
