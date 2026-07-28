import { useState, useEffect } from "react";
import { ChatBubble } from "@/components/ChatBubble";
import { motion, AnimatePresence } from "framer-motion";
import { useColors } from "@/hooks/useColors";
import type { ChatMessage } from "@/lib/mock-data";

function useReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const PROMPTS = [
  "I'm feeling sore today",
  "Make today's workout easier",
  "How am I doing this week?",
];

const CANNED: Record<string, { user: string; ai: string; action?: string }> = {
  "I'm feeling sore today": {
    user: "I'm feeling sore today",
    ai: "Noted — soreness is data. I've reduced volume by 20% and added 5 minutes of stretching at the end. Push only when it feels right.",
    action: "✓ Volume reduced · Stretching added",
  },
  "Make today's workout easier": {
    user: "Make today's workout easier",
    ai: "Done. I've trimmed sets from 4 to 3 across all exercises and extended rest periods by 20 seconds. Same movements, less load.",
    action: "✓ Applied to your plan",
  },
  "How am I doing this week?": {
    user: "How am I doing this week?",
    ai: "You've completed 3 of 4 planned sessions — that's a strong week. Your check-in energy scores trended upward from Tuesday onwards. Keep that up.",
    action: "✓ Weekly summary generated",
  },
};

export function Slide05Chat() {
  const c = useColors();
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "typing" | "replied">("idle");

  useEffect(() => {
    if (selected) {
      setPhase("typing");
      const t = setTimeout(() => setPhase("replied"), reduced ? 100 : 1400);
      return () => clearTimeout(t);
    }
  }, [selected, reduced]);

  const openingMsg: ChatMessage = {
    id: "t-ai-0",
    role: "ai",
    text: "Good morning! What can I adjust for you today?",
    ts: "Now",
  };

  const userMsg: ChatMessage | null = selected
    ? { id: "t-u-1", role: "user", text: CANNED[selected].user, ts: "Now" }
    : null;

  const aiReplyMsg: ChatMessage | null =
    selected && phase === "replied"
      ? { id: "t-ai-1", role: "ai", text: CANNED[selected].ai, ts: "Now" }
      : null;

  return (
    <div className="px-5 py-8 max-w-lg mx-auto">
      <p className="text-xs font-bold uppercase tracking-[0.18em] mb-2" style={{ color: c.violet }}>
        AI Coach Chat
      </p>
      <h2 className="text-2xl font-black mb-1" style={{ color: c.textPrimary }}>
        Ask, and it actually does it.
      </h2>
      <p className="text-sm font-medium mb-6 leading-relaxed" style={{ color: c.textSecondary }}>
        The AI coach isn't just conversational — when it says it'll adjust your plan, 
        it updates your plan right there. Try tapping a suggestion below.
      </p>

      {/* Chat window */}
      <div className="card-frosted p-4 mb-4 space-y-3 min-h-[160px]">
        <ChatBubble message={openingMsg} />

        <AnimatePresence>
          {userMsg && (
            <motion.div
              key="user"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChatBubble message={userMsg} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === "typing" && (
            <motion.div
              key="typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 px-1"
            >
              <div
                className="w-5 h-5 rounded-full text-[10px] font-black grid place-items-center"
                style={{ background: c.coachAvatarBg, color: c.coachAvatarColor }}
              >
                M
              </div>
              <div
                className="rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center"
                style={{ background: c.chipBg, border: `1px solid ${c.chipBorder}` }}
              >
                {[0, 0.2, 0.4].map((delay) => (
                  <motion.div
                    key={delay}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: c.textTertiary }}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {aiReplyMsg && (
            <motion.div
              key="ai-reply"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <ChatBubble message={aiReplyMsg} />
              {selected && CANNED[selected].action && (
                <motion.div
                  initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                  className="mt-2 ml-7 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ background: c.sunGlareBg, color: c.sunGlare, border: `1px solid ${c.sunGlare}33` }}
                >
                  {CANNED[selected].action}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Prompt chips */}
      <div className="flex flex-wrap gap-2 mb-2">
        {PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => {
              setSelected(p);
              setPhase("idle");
            }}
            className="px-3 py-2 rounded-full text-xs font-semibold transition-all active:scale-95"
            style={{
              background: selected === p ? c.violetBg : c.chipBg,
              border: `1px solid ${selected === p ? c.violet : c.chipBorder}`,
              color: selected === p ? c.violetLight : c.textSecondary,
            }}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
