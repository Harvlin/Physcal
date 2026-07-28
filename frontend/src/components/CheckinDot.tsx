import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useColors } from "@/hooks/useColors";

export function CheckinDot({
  value,
  onChange,
  label,
  icon,
}: {
  value: number;
  onChange: (n: number) => void;
  label: string;
  icon?: ReactNode;
}) {
  const c = useColors();
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-[14px] font-semibold flex items-center gap-2"
          style={{ color: c.textPrimary }}
        >
          <span aria-hidden style={{ color: c.textTertiary }}>
            {icon}
          </span>
          {label}
        </span>
        <span className="text-[11px] font-medium" style={{ color: c.textTertiary }}>
          {value > 0 ? `${value}/5` : "Tap to rate"}
        </span>
      </div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = n <= value;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              aria-label={`${label} ${n} of 5`}
              className={cn(
                "flex-1 flex items-center justify-center transition-all duration-150 active:scale-95 text-[13px] font-bold",
              )}
              style={{
                height: "40px",
                borderRadius: "10px",
                border: filled ? "none" : `1px solid ${c.chipBorder}`,
                background: filled ? c.sunGlare : c.chipBg,
                color: filled ? "#1C1C1A" : c.textTertiary,
                boxShadow: filled ? `0 0 16px ${c.sunGlareBg}` : "none",
              }}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}
