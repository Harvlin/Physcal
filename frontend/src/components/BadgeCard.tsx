import { badgeHints, type Badge } from "@/lib/mock-data";
import { Lock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn, getInitials } from "@/lib/utils";
import { useColors } from "@/hooks/useColors";

export function BadgeCard({ badge, size = "md" }: { badge: Badge; size?: "sm" | "md" }) {
  const unlocked = !!badge.unlockedAt;
  const c = useColors();
  return (
    <div
      className={cn(
        "relative rounded-2xl p-4 flex flex-col items-center text-center transition-all",
        unlocked ? "card-frosted hover:-translate-y-0.5" : "card-frosted opacity-40",
      )}
    >
      <div
        className="w-12 h-12 rounded-full grid place-items-center text-xl mb-3 transition-all"
        style={
          unlocked
            ? {
                background: c.sunGlareBg,
                color: c.sunGlare,
                border: `1px solid ${c.sunGlare}33`,
                boxShadow: `0 0 20px ${c.sunGlareBg}`,
              }
            : {
                background: c.chipBg,
                color: c.textDisabled,
              }
        }
      >
        <span aria-hidden>{getInitials(badge.name)}</span>
      </div>
      <div
        className="font-bold text-sm"
        style={{ color: unlocked ? c.textPrimary : c.textTertiary }}
      >
        {unlocked ? badge.name : "???"}
      </div>
      {unlocked ? (
        <>
          <p className="text-xs mt-1 font-medium leading-snug" style={{ color: c.textSecondary }}>
            {badge.description}
          </p>
          {size === "md" && (
            <p
              className="text-[10px] font-bold mt-2 uppercase tracking-wider"
              style={{ color: `${c.sunGlare}88` }}
            >
              {new Date(badge.unlockedAt!).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>
          )}
        </>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <button className="mt-2 flex items-center gap-1 font-bold transition-all hover:opacity-80 focus:outline-none" style={{ color: c.textTertiary }}>
              <Lock size={10} /> <span className="text-[10px] uppercase tracking-wider">Locked</span>
            </button>
          </PopoverTrigger>
          <PopoverContent 
            sideOffset={8}
            className="card-frosted p-3 rounded-xl shadow-lg border-none text-center"
            style={{ 
              background: c.isDark ? "rgba(40,40,38,0.95)" : "rgba(255,255,255,0.95)",
              backdropFilter: "blur(20px)",
              maxWidth: "200px"
            }}
          >
            <p className="text-xs font-medium leading-relaxed" style={{ color: c.textSecondary }}>
              {badgeHints[badge.id] || "Keep training to unlock this badge."}
            </p>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
