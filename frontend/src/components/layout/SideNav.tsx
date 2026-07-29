import { Link, useRouterState } from "@tanstack/react-router";
import { House, Dumbbell, Video, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useColors } from "@/hooks/useColors";
import { ThemeToggle } from "./ThemeToggle";

const items = [
  { to: "/dashboard", label: "Home", icon: House },
  { to: "/coach", label: "Coach", icon: Dumbbell },
  { to: "/analysis", label: "Analysis", icon: Video },
  { to: "/community", label: "Community", icon: Users },
  { to: "/profile", label: "Profile", icon: User },
];

export function SideNav() {
  const { location } = useRouterState();
  const c = useColors();
  if (location.pathname.startsWith("/onboarding") || location.pathname.startsWith("/tutorial") || location.pathname.startsWith("/coach/workout"))
    return null;

  return (
    <aside
      className="glass hidden lg:flex fixed inset-y-4 left-4 w-60 flex-col px-4 py-6 z-30 rounded-[28px]"
      style={{ borderColor: "rgba(242,240,233,0.09)" }}
    >
      <Link to="/dashboard" className="flex items-center px-2 mb-8">
        <img src="/favicon.png" alt="Physcal Logo" className="h-7 w-auto object-contain" />
      </Link>

      <nav className="flex-1">
        <ul className="space-y-0.5">
          {items.map((item) => {
            const active =
              location.pathname === item.to || location.pathname.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-[12px] transition-all duration-200 group-hover:bg-transparent",
                  )}
                  style={
                    active
                      ? { background: c.sideNavActiveBg, color: c.sideNavActiveColor }
                      : { color: c.sideNavInactive }
                  }
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.background = c.hoverBg;
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t pt-4 space-y-3" style={{ borderColor: c.divider }}>
        <div className="px-3 flex items-center justify-between">
          <span className="text-xs font-medium" style={{ color: c.textSecondary }}>
            Theme
          </span>
          <ThemeToggle />
        </div>
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
          style={{ background: c.sideNavBeta, border: `1px solid ${c.sideNavBetaBorder}` }}
        >

          <span className="text-xs font-medium" style={{ color: c.sideNavBetaText }}>
            Beta build · v0.1
          </span>
        </div>
      </div>
    </aside>
  );
}
