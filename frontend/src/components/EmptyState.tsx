import type { ReactNode } from "react";
import { useColors } from "@/hooks/useColors";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  const c = useColors();
  return (
    <div className="text-center py-16 px-6">
      {icon && <div className="mx-auto mb-5">{icon}</div>}
      <h3 className="font-bold text-base" style={{ color: c.textPrimary }}>
        {title}
      </h3>
      {description && (
        <p className="text-sm mt-1.5 max-w-sm mx-auto" style={{ color: c.textTertiary }}>
          {description}
        </p>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

export function CrowdIllustration() {
  const c = useColors();
  return (
    <svg width="120" height="80" viewBox="0 0 120 80" fill="none" aria-hidden>
      <circle cx="30" cy="35" r="14" fill={c.sunGlareBg} />
      <circle cx="60" cy="28" r="16" fill={c.violetBg} />
      <circle cx="90" cy="35" r="14" fill={c.exuberantBg} />
      <rect x="14" y="48" width="32" height="24" rx="6" fill={c.sunGlareBg} />
      <rect x="44" y="42" width="32" height="30" rx="6" fill={c.violetBg} />
      <rect x="74" y="48" width="32" height="24" rx="6" fill={c.exuberantBg} />
      {/* Accent dots */}
      <circle cx="30" cy="35" r="5" fill={`${c.sunGlare}66`} />
      <circle cx="60" cy="28" r="6" fill={`${c.violet}80`} />
      <circle cx="90" cy="35" r="5" fill={`${c.exuberant}66`} />
    </svg>
  );
}
