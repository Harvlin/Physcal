import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useColors } from "@/hooks/useColors";
import { MapPin, Calendar, GraduationCap, Check } from "lucide-react";
import type { EventItem } from "@/lib/mock-data";

function useReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const DEMO_EVENTS: EventItem[] = [
  {
    id: "ev-t1",
    title: "Beginner Badminton — Just Show Up",
    sport: "Badminton",
    date: "Sat, May 17",
    time: "08:00 – 10:00",
    location: "GOR Bulungan, Jakarta",
    tags: ["beginner-friendly", "casual"],
    joined: 12,
    capacity: 20,
    host: "Budi",
    description: "",
    safetyLevel: "beginner_friendly",
    instructorPresent: false,
    isJoined: false,
    waitlistCount: 0,
    isUserWaitlisted: false,
    socialFit: ["small_group", "any"],
  },
  {
    id: "ev-t2",
    title: "Adaptive Yoga Flow",
    sport: "Yoga",
    date: "Mon, May 19",
    time: "18:30 – 19:30",
    location: "Studio Tenang, Kemang",
    tags: ["adaptive access", "free", "beginner-friendly"],
    joined: 6,
    capacity: 12,
    host: "Sarah",
    description: "",
    safetyLevel: "beginner_friendly",
    instructorPresent: true,
    isJoined: false,
    waitlistCount: 0,
    isUserWaitlisted: false,
    socialFit: ["solo", "small_group", "any"],
  },
];

function EventDemo({
  event,
  onJoin,
  isJoined,
  c,
}: {
  event: EventItem;
  onJoin: () => void;
  isJoined: boolean;
  c: ReturnType<typeof useColors>;
}) {
  const reduced = useReducedMotion();
  return (
    <div className="card-frosted p-4">
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl grid place-items-center shrink-0 text-xs font-bold"
          style={{ background: c.sunGlareBg, color: c.sunGlare, border: `1px solid ${c.sunGlare}33` }}
        >
          {event.sport.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm leading-tight mb-1" style={{ color: c.textPrimary }}>{event.title}</div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: c.textSecondary }}>
            <Calendar size={11} /> {event.date} · {event.time}
          </div>
          <div className="flex items-center gap-1.5 text-xs mt-0.5" style={{ color: c.textSecondary }}>
            <MapPin size={11} /> {event.location}
          </div>
          {event.instructorPresent && (
            <div className="flex items-center gap-1 mt-1 text-[11px] font-medium" style={{ color: c.textTertiary }}>
              <GraduationCap size={11} /> Instructor present
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs font-medium" style={{ color: c.textTertiary }}>
          {event.joined} / {event.capacity} going
        </div>
        <motion.button
          whileTap={reduced ? {} : { scale: 0.93 }}
          onClick={onJoin}
          disabled={isJoined}
          className="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
          style={{
            background: isJoined ? c.chipBg : c.sunGlareBg,
            border: `1px solid ${isJoined ? c.chipBorder : c.sunGlare + "44"}`,
            color: isJoined ? c.textSecondary : c.sunGlare,
          }}
        >
          <AnimatePresence mode="wait">
            {isJoined ? (
              <motion.span
                key="joined"
                initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1"
              >
                <Check size={11} /> Joined
              </motion.span>
            ) : (
              <motion.span key="join" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                Join
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}

export function Slide08Community() {
  const c = useColors();
  const [joined, setJoined] = useState<Record<string, boolean>>({});

  return (
    <div className="px-5 py-8 max-w-lg mx-auto">
      <p className="text-xs font-bold uppercase tracking-[0.18em] mb-2" style={{ color: c.exuberant }}>
        Community
      </p>
      <h2 className="text-2xl font-black mb-1" style={{ color: c.textPrimary }}>
        Find your people. Train together.
      </h2>
      <p className="text-sm font-medium mb-6 leading-relaxed" style={{ color: c.textSecondary }}>
        Discover local events matched to your sport, fitness level, and social preference. 
        Join with one tap — or add yourself to the waitlist if a session is full.
      </p>

      <div className="space-y-3 mb-5">
        {DEMO_EVENTS.map((ev) => (
          <EventDemo
            key={ev.id}
            event={ev}
            isJoined={!!joined[ev.id]}
            onJoin={() => setJoined((j) => ({ ...j, [ev.id]: true }))}
            c={c}
          />
        ))}
      </div>

      <div className="space-y-2.5">
        {[
          "Events matched to your sport, pace, and social preference — no noise",
          "Waitlist support when a session fills up — you'll get a spot when one opens",
          "Create your own events and host your local community",
        ].map((line) => (
          <div key={line} className="flex items-start gap-2.5">
            <div
              className="w-4 h-4 rounded-full grid place-items-center shrink-0 mt-0.5"
              style={{ background: c.exuberantBg }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: c.exuberant }} />
            </div>
            <p className="text-sm font-medium leading-snug" style={{ color: c.textSecondary }}>{line}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
