import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useColors } from "@/hooks/useColors";

export function CircularScore({
  value,
  size = 180,
  label,
}: {
  value: number;
  size?: number;
  label?: string;
}) {
  const [animated, setAnimated] = useState(0);
  const colors = useColors();
  useEffect(() => {
    const start = performance.now();
    const dur = 1200;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setAnimated(Math.round(value * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);

  const r = size / 2 - 10;
  const c = 2 * Math.PI * r;
  const offset = c - (animated / 100) * c;

  // Color based on score
  const strokeColor =
    value >= 80 ? colors.sunGlare : value >= 60 ? colors.exuberant : colors.violet;

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors.chipBorder}
          strokeWidth={10}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={strokeColor}
          strokeWidth={10}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
            filter: `drop-shadow(0 0 8px ${strokeColor}66)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="tabular font-black" style={{ fontSize: "40px", color: strokeColor }}>
            {animated}
          </div>
          {label && (
            <div style={{ fontSize: "12px", color: colors.textTertiary, marginTop: "4px" }}>
              {label}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
