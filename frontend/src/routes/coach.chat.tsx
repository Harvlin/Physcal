import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ArrowUp, HeartPulse } from "lucide-react";
import { useApp } from "@/lib/store";
import { motion } from "framer-motion";
import { ChatBubble } from "@/components/ChatBubble";
import { chatHistory, suggestedPrompts, type ChatMessage } from "@/lib/mock-data";
import { useColors } from "@/hooks/useColors";

export const Route = createFileRoute("/coach/chat")({
  head: () => ({ meta: [{ title: "Coach Chat — Physcal" }] }),
  component: ChatPage,
});

function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(chatHistory);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const c = useColors();

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
      setMessages((m) => [
        ...m,
        {
          id: String(Date.now() + 1),
          role: "ai",
          text: "Got it. Based on your pattern this week, **recommendations**:\n\n- Rest major muscle groups for 24 hours\n- Do 10 minutes of mobility\n- Extra hydration today\n\nWant me to set up a mobility session?",
          ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1100);
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
          onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
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
          <div className="font-bold text-sm flex items-center gap-2" style={{ color: c.textPrimary }}>
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
          <ChatBubble key={m.id} message={m} />
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
                onMouseEnter={e => {
                  e.currentTarget.style.background = c.exuberantBg;
                  e.currentTarget.style.color = c.exuberant;
                  e.currentTarget.style.borderColor = `${c.exuberant}40`;
                }}
                onMouseLeave={e => {
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
            onFocus={e => {
              e.currentTarget.style.borderColor = `${c.violet}59`;
              e.currentTarget.style.boxShadow = `0 0 0 3px ${c.violet}1A`;
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = c.inputBorder;
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-12 h-12 shrink-0 rounded-full grid place-items-center disabled:opacity-30 hover:opacity-90 active:scale-90 transition-all"
            style={{ background: c.exuberant, color: "#F2F0E9", boxShadow: input.trim() ? `0 0 20px ${c.exuberant}4D` : "none" }}
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
