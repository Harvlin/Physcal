import { Link, useRouterState } from "@tanstack/react-router";
import { House, Dumbbell, Video, Users, User } from "lucide-react";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useColors } from "@/hooks/useColors";

const items = [
  { to: "/dashboard", label: "Home", icon: House },
  { to: "/coach", label: "Coach", icon: Dumbbell, dot: "checkin" as const },
  { to: "/analysis", label: "Analysis", icon: Video },
  { to: "/community", label: "Community", icon: Users, dot: "events" as const },
  { to: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const { location } = useRouterState();
  const checkinDone = useApp((s) => s.checkinDoneToday);
  const c = useColors();

  if (
    location.pathname.startsWith("/coach/workout") ||
    location.pathname.startsWith("/coach/chat") ||
    location.pathname.startsWith("/onboarding") ||
    location.pathname.startsWith("/tutorial")
  )
    return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[380px] z-40 lg:hidden">
      <nav className="nav-pill p-1.5 flex items-center justify-between gap-1">
        {items.map((item) => {
          const active =
            location.pathname === item.to || location.pathname.startsWith(item.to + "/");
          const Icon = item.icon;
          const showDot = (item.dot === "checkin" && !checkinDone) || item.dot === "events";

          return (
            <Link
              key={item.to}
              to={item.to}
              aria-label={item.label}
              className={cn(
                "relative flex items-center justify-center rounded-full transition-all duration-200",
                active ? "w-12 h-10" : "size-11",
              )}
              style={active ? c.navActive : { color: c.navInactive }}
            >
              <Icon className={cn("shrink-0", active ? "size-[18px]" : "size-[18px]")} strokeWidth={active ? 2.5 : 2} />
              {showDot && !active && (
                <span
                  className="absolute top-1.5 right-1.5 size-2 rounded-full ring-2"
                  style={{ background: "#F5522A" }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
