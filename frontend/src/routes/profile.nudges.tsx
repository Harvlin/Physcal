import { createFileRoute } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { nudgeHistory } from "@/lib/mock-data";
import { useColors } from "@/hooks/useColors";

export const Route = createFileRoute("/profile/nudges")({
  component: NudgesPage,
});

function NudgesPage() {
  const c = useColors();

  return (
    <div
      className="min-h-dvh"
      style={{
        background: `linear-gradient(175deg, ${c.isDark ? "#1E1E1B" : "#FFFFFF"} 0%, ${c.isDark ? "#181816" : "#F4F3EE"} 100%)`,
      }}
    >
      <PageHeader title="Nudge history" back="/profile" />
      <div className="px-4 lg:px-8 py-6 max-w-2xl mx-auto pb-12 space-y-2">
        {nudgeHistory.map((n) => (
          <div key={n.id} className="card-frosted p-4 flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-full grid place-items-center shrink-0"
              style={
                n.actedOn
                  ? { background: c.sunGlareBg, color: c.sunGlare }
                  : { background: c.chipBg, color: c.textTertiary }
              }
            >
              {n.actedOn ? (
                <Check size={14} strokeWidth={3} />
              ) : (
                <X size={14} />
              )}
            </div>
            <div className="flex-1">
              <div
                className="font-semibold text-sm"
                style={{ color: c.textPrimary }}
              >
                {n.headline}
              </div>
              <div
                className="text-xs mt-0.5"
                style={{ color: c.textSecondary }}
              >
                {n.message}
              </div>
              <div
                className="text-[10px] mt-2 uppercase tracking-wider"
                style={{ color: c.textTertiary }}
              >
                {n.ts} · {n.actedOn ? "Acted on" : "Dismissed"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
