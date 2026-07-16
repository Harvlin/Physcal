import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { EventCard } from "@/components/EventCard";
import { EmptyState, CrowdIllustration } from "@/components/EmptyState";
import { events } from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useColors } from "@/hooks/useColors";

export const Route = createFileRoute("/community/")({
  head: () => ({ meta: [{ title: "Community — Physcal" }] }),
  component: CommunityPage,
});

const filters = ["All", "Beginner-friendly", "Women only", "Free", "Adaptive access", "Casual"];

function CommunityPage() {
  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");
  const profile = useApp((s) => s.trainingProfile);
  const c = useColors();

  const filtered = events.filter((e) => {
    const matchQ =
      !q ||
      e.title.toLowerCase().includes(q.toLowerCase()) ||
      e.location.toLowerCase().includes(q.toLowerCase());
    const matchF =
      filter === "All" ||
      e.tags.some((t) => t.toLowerCase().includes(filter.toLowerCase().replace(" only", "-only")));
    return matchQ && matchF;
  });

  // Social preference sorting (Part F).
  // The "social" goal provides an additional +1 boost beyond the base preference match,
  // so users who explicitly listed socializing as a goal see community events rise even higher.
  const hasSocialGoal = profile?.goals?.includes("social") ?? false;
  const sorted = [...filtered].sort((a, b) => {
    if (!profile) return 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const aMatch = a.socialFit?.includes(profile.socialPreference as any) ? 1 : 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bMatch = b.socialFit?.includes(profile.socialPreference as any) ? 1 : 0;
    // Apply the "social" goal boost: adds +1 on top of the base match score
    const aScore = aMatch + (hasSocialGoal && aMatch ? 1 : 0);
    const bScore = bMatch + (hasSocialGoal && bMatch ? 1 : 0);
    return bScore - aScore;
  });

  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-6 lg:py-8 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p
              className="text-xs font-bold uppercase tracking-[0.18em] mb-2"
              style={{ color: c.violet }}
            >
              Discover
            </p>
            <h1 className="text-[26px] font-black" style={{ color: c.textPrimary }}>
              Community
            </h1>
          </div>
          <Link
            to="/community/create"
            className="hidden lg:flex items-center gap-2 text-sm font-bold hover:opacity-90 transition-all"
            style={{
              background: c.exuberant,
              color: "#F2F0E9",
              height: "40px",
              padding: "0 18px",
              borderRadius: "9999px",
              boxShadow: `0 0 20px ${c.exuberantBg}`,
            }}
          >
            <Plus size={15} /> Create event
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2"
            size={15}
            style={{ color: c.textTertiary }}
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search events, places..."
            className="w-full pl-11 pr-4 text-sm focus:outline-none"
            style={{
              background: c.inputBg,
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: `1px solid ${c.inputBorder}`,
              borderRadius: "9999px",
              height: "48px",
              color: c.textPrimary,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = c.violet;
              e.currentTarget.style.boxShadow = `0 0 0 3px ${c.violetBg}`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = c.inputBorder;
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-5 -mx-4 px-4 lg:mx-0 lg:px-0 pb-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "shrink-0 px-4 h-9 rounded-full text-[13px] font-semibold transition-all active:scale-95",
              )}
              style={
                filter === f
                  ? {
                      background: c.violet,
                      color: "#F2F0E9",
                      boxShadow: `0 0 16px ${c.violetBg}`,
                    }
                  : {
                      background: c.chipBg,
                      color: c.textSecondary,
                      border: `1px solid ${c.chipBorder}`,
                    }
              }
            >
              {f}
            </button>
          ))}
        </div>

        {sorted.length === 0 ? (
          <EmptyState
            icon={<CrowdIllustration />}
            title="No events match"
            description="Try a different filter or be the first to create one."
            action={
              <Link
                to="/community/create"
                className="font-bold h-10 px-5 rounded-full text-sm flex items-center hover:opacity-90 transition-all"
                style={{
                  background: c.exuberant,
                  color: "#F2F0E9",
                  boxShadow: `0 0 16px ${c.exuberantBg}`,
                }}
              >
                Create event
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {sorted.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </div>

      <Link
        to="/community/create"
        className="lg:hidden fixed bottom-24 right-4 z-30 w-14 h-14 rounded-full grid place-items-center hover:opacity-90 active:scale-90 transition-all"
        aria-label="Create event"
        style={{
          background: c.exuberant,
          color: "#F2F0E9",
          boxShadow: `0 4px 24px ${c.exuberantBg}`,
        }}
      >
        <Plus size={22} strokeWidth={2.5} />
      </Link>
    </AppShell>
  );
}
