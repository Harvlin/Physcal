import type { ReactNode } from "react";
import { useEffect } from "react";
import { BottomNav } from "./BottomNav";
import { SideNav } from "./SideNav";
import { useApp } from "@/lib/store";

export function AppShell({ children }: { children: ReactNode }) {
  const theme = useApp((s) => s.theme);
  const setTheme = useApp((s) => s.setTheme);

  /* Ensure the html element always has the right class on first paint */
  useEffect(() => {
    setTheme(theme);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="app-stage min-h-dvh">
      <SideNav />
      <main className="lg:pl-[280px] pb-24 lg:pb-0 min-h-dvh">{children}</main>
      <BottomNav />
    </div>
  );
}
