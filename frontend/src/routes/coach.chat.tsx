import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ArrowUp, HeartPulse, Sparkles, RefreshCw, CheckCircle2 } from "lucide-react";
import { useApp } from "@/lib/store";
import { motion } from "framer-motion";
import { ChatBubble } from "@/components/ChatBubble";
import { chatHistory, suggestedPrompts, type ChatMessage, type ChatAction } from "@/lib/mock-data";
import { useColors } from "@/hooks/useColors";
import { toast } from "sonner";
import { checkAndUnlockBadges } from "@/lib/progress";
import { weekOverview } from "@/lib/mock-data";

export const Route = createFileRoute("/coach/chat")({
  head: () => ({ meta: [{ title: "Coach Chat — Physcal" }] }),
  component: ChatPage,
});

function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(chatHistory);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [appliedActions, setAppliedActions] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  const c = useColors();
  const applyChatAction = useApp((s) => s.applyChatAction);
  const checkinDoneToday = useApp((s) => s.checkinDoneToday);
  const setCheckinDone = useApp((s) => s.setCheckinDone);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((m) => [...m, { id: String(Date.now()), role: "user", text, ts }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const lower = text.toLowerCase();

      // MOCK NLP PLACEHOLDER — This keyword matching is a simplified stand-in for
      // real Natural Language Understanding (NLU). In production, this will be
      // replaced by a call to a backend language model that understands intent,
      // context, and nuance far beyond simple substring checks.
      let action: ChatAction | undefined;
      if (lower.includes("lighter") || lower.includes("easier") || lower.includes("reduce")) {
        action = {
          type: "adjust_volume",
          volumeMultiplier: 0.8,
          note: "Volume reduced 20% via coach chat",
        };
      } else if (lower.includes("rest") || lower.includes("recovery") || lower.includes("skip")) {
        action = { type: "swap_to_recovery" };
      } else if (
        // MOCK NLP: Detects fatigue/soreness reports to prompt a check-in write.
        // Real NLU would extract sentiment & dimensions (energy, soreness, mood) from freeform text.
        lower.includes("sore") ||
        lower.includes("tired") ||
        lower.includes("exhausted") ||
        lower.includes("fatigued") ||
        lower.includes("drained")
      ) {
        action = { type: "checkin_log" };
      }

      setMessages((m) => [
        ...m,
        {
          id: String(Date.now() + 1),
          role: "ai",
          text:
            action?.type === "adjust_volume"
              ? "Got it — I've **reduced today's volume by 20%**. Take it steady and focus on form over load."
              : action?.type === "swap_to_recovery"
                ? "Switching you to **Gentle Recovery** mode. Listen to your body today."
                : action?.type === "checkin_log"
                  ? "Sounds like your body is sending a signal. Want me to **log this as your check-in** for today so we can track patterns?"
                  : "Got it. Based on your pattern this week, **recommendations**:\n\n- Rest major muscle groups for 24 hours\n- Do 10 minutes of mobility\n- Extra hydration today\n\nWant me to set up a mobility session?",
          ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          action,
        },
      ]);
    }, 1100);
  };

  const handleApplyAction = (msgId: string, action: ChatAction) => {
    if (appliedActions.has(msgId)) return;
    if (action.type === "checkin_log") {
      // Require explicit confirmation before logging — never silently overwrite a same-day form check-in.
      setCheckinDone(true);
      setAppliedActions((s) => new Set(s).add(msgId));
      toast.success("Check-in logged from chat", {
        description: checkinDoneToday
          ? "Combined with your earlier form check-in (marked as 'both')."
          : "Logged as your check-in for today (source: chat).",
      });
    } else {
      applyChatAction(action);
      setAppliedActions((s) => new Set(s).add(msgId));

      checkAndUnlockBadges("chat_interaction", {
        totalSessions: 0,
        days: weekOverview,
        recoveryDates: [],
        joinedAt: "2025-04-12",
        today: new Date(),
        eventsCreatedCount: 0,
        chatActionAppliedCount: appliedActions.size + 1,
      });

      toast.success(
        action.type === "adjust_volume"
          ? "Plan adjusted — volume reduced"
          : "Switched to recovery mode",
        { description: "Head to the Coach tab to see your updated workout." },
      );
    }
  };

  return (
    <div
      className="flex flex-col h-dvh"
      style={{
        background: c.isDark
          ? "radial-gradient(ellipse 80% 50% at 15% 0%, rgba(214,232,0,0.05) 0%, transparent 60%), linear-gradient(175deg, #1E1E1B 0%, #181816 100%)"
          : "radial-gradient(ellipse 80% 50% at 15% 0%, rgba(168,184,0,0.07) 0%, transparent 60%), linear-gradient(175deg, #EAE8E1 0%, #F4F3EE 100%)",
      }}
    >
      {/* Header */}
      <header
        className="flex items-center gap-3 px-4 py-3"
        style={{
          background: c.isDark ? "rgba(30,30,27,0.85)" : "rgba(244,243,238,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${c.divider}`,
        }}
      >
        <Link
          to="/coach"
          className="w-10 h-10 -ml-2 grid place-items-center rounded-xl transition-colors"
          style={{ color: c.textSecondary }}
          onMouseEnter={(e) => (e.currentTarget.style.background = c.hoverBg)}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          aria-label="Back"
        >
          <ChevronLeft size={20} />
        </Link>
        <div
          className="w-9 h-9 rounded-full grid place-items-center font-bold relative"
          style={{ background: c.coachAvatarBg, color: c.coachAvatarColor }}
        >
          M
          <span
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full"
            style={{
              background: "#22C55E",
              outline: `2px solid ${c.isDark ? "rgba(24,24,22,0.9)" : "rgba(244,243,238,0.9)"}`,
            }}
          />
        </div>
        <div className="flex-1">
          <div
            className="font-bold text-sm flex items-center gap-2"
            style={{ color: c.textPrimary }}
          >
            Physcal Coach
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
              style={{ background: c.violetBg, color: c.violet, border: `1px solid ${c.violet}33` }}
            >
              AI
            </span>
          </div>
          <div className="text-[11px] font-medium" style={{ color: c.textTertiary }}>
            Online · responds instantly
          </div>
        </div>
        <HealthBadge />
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-5 no-scrollbar">
        {messages.map((m) => (
          <div key={m.id}>
            <ChatBubble message={m} />
            {m.role === "ai" && m.action && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.1 }}
                className="flex justify-start mt-2 ml-1"
              >
                {appliedActions.has(m.id) ? (
                  <span
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{
                      background: c.chipBg,
                      color: c.textTertiary,
                      border: `1px solid ${c.chipBorder}`,
                    }}
                  >
                    <CheckCircle2 size={11} />
                    {m.action.type === "checkin_log" ? "Check-in logged" : "Applied to your plan"}
                  </span>
                ) : m.action.type === "checkin_log" ? (
                  // Check-in confirmation chip — always requires explicit tap before writing to state.
                  // This is the reconciliation gate: prevents silent overwrites of a same-day form check-in.
                  <button
                    onClick={() => handleApplyAction(m.id, m.action!)}
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-all hover:opacity-80 active:scale-95"
                    style={{
                      background: c.sunGlareBg,
                      color: c.sunGlare,
                      border: `1px solid ${c.sunGlare}33`,
                    }}
                  >
                    <CheckCircle2 size={11} />
                    {checkinDoneToday ? "Merge with today's check-in" : "Log as today's check-in"}
                  </button>
                ) : (
                  <button
                    onClick={() => handleApplyAction(m.id, m.action!)}
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-all hover:opacity-80 active:scale-95"
                    style={{
                      background: m.action.type === "swap_to_recovery" ? c.exuberantBg : c.violetBg,
                      color: m.action.type === "swap_to_recovery" ? c.exuberant : c.violet,
                      border: `1px solid ${m.action.type === "swap_to_recovery" ? c.exuberant : c.violet}33`,
                    }}
                  >
                    {m.action.type === "adjust_volume" ? (
                      <>
                        <Sparkles size={11} /> Apply to today's plan
                      </>
                    ) : (
                      <>
                        <RefreshCw size={11} /> Switch to recovery
                      </>
                    )}
                  </button>
                )}
              </motion.div>
            )}
          </div>
        ))}
        {typing && (
          <div
            className="flex gap-1.5 px-5 py-4 w-fit rounded-2xl rounded-bl-sm"
            style={{ background: c.chipBg, border: `1px solid ${c.chipBorder}` }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{ background: c.violet }}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Input area */}
      <div
        className="px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]"
        style={{
          background: c.isDark ? "rgba(24,24,22,0.92)" : "rgba(244,243,238,0.92)",
          backdropFilter: "blur(20px)",
          borderTop: `1px solid ${c.divider}`,
        }}
      >
        {messages[messages.length - 1]?.role === "ai" && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3 -mx-1 px-1">
            {suggestedPrompts.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="shrink-0 text-[13px] px-4 py-2 rounded-full font-semibold transition-all"
                style={{
                  background: c.chipBg,
                  color: c.textSecondary,
                  border: `1px solid ${c.chipBorder}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = c.exuberantBg;
                  e.currentTarget.style.color = c.exuberant;
                  e.currentTarget.style.borderColor = `${c.exuberant}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = c.chipBg;
                  e.currentTarget.style.color = c.textSecondary;
                  e.currentTarget.style.borderColor = c.chipBorder;
                }}
              >
                {p}
              </button>
            ))}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message Physcal..."
            className="flex-1 rounded-full px-5 h-12 text-[15px] font-medium focus:outline-none transition-all"
            style={{
              background: c.inputBg,
              border: `1px solid ${c.inputBorder}`,
              color: c.textPrimary,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = `${c.violet}59`;
              e.currentTarget.style.boxShadow = `0 0 0 3px ${c.violet}1A`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = c.inputBorder;
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-12 h-12 shrink-0 rounded-full grid place-items-center disabled:opacity-30 hover:opacity-90 active:scale-90 transition-all"
            style={{
              background: c.exuberant,
              color: "#F2F0E9",
              boxShadow: input.trim() ? `0 0 20px ${c.exuberant}4D` : "none",
            }}
            aria-label="Send"
          >
            <ArrowUp size={20} strokeWidth={2.5} />
          </button>
        </form>
      </div>
    </div>
  );
}

function HealthBadge() {
  const hp = useApp((s) => s.healthProfile);
  const c = useColors();
  if (!hp.hasConditions || hp.conditions.length === 0) return null;
  return (
    <span
      className="w-9 h-9 grid place-items-center rounded-full transition-colors"
      title="Health profile active"
      style={{ background: c.violetBg, color: c.violet }}
    >
      <HeartPulse size={16} />
    </span>
  );
}
