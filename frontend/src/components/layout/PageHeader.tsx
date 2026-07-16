import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { useColors } from "@/hooks/useColors";

export function PageHeader({
  title,
  back,
  right,
  subtitle,
}: {
  title: string;
  back?: string;
  right?: ReactNode;
  subtitle?: string;
}) {
  const c = useColors();
  return (
    <header
      className="sticky top-0 z-20 px-4 lg:px-8 py-3 flex items-center gap-3"
      style={{
        background: c.isDark ? "rgba(24,24,22,0.80)" : "rgba(255,255,255,0.80)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${c.divider}`,
      }}
    >
      {back && (
        <Link
          to={back}
          className="w-9 h-9 shrink-0 grid place-items-center rounded-xl transition-colors"
          style={{ color: c.textSecondary, border: `1px solid ${c.chipBorder}` }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = c.hoverBg;
            e.currentTarget.style.color = c.textPrimary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = c.textSecondary;
          }}
          aria-label="Back"
        >
          <ChevronLeft size={18} />
        </Link>
      )}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-bold truncate" style={{ color: c.textPrimary }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs font-semibold truncate" style={{ color: c.textTertiary }}>
            {subtitle}
          </p>
        )}
      </div>
      {right}
    </header>
  );
}
