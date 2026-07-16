import type { ChatMessage } from "@/lib/mock-data";
import { FormattedText } from "./FormattedText";
import { cn } from "@/lib/utils";
import { useColors } from "@/hooks/useColors";

export function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const c = useColors();

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div className="flex flex-col gap-1 max-w-[85%] sm:max-w-[75%]">
        {!isUser && (
          <div className="flex items-center gap-2 px-1">
            <div
              className="w-5 h-5 rounded-full text-[10px] font-black grid place-items-center"
              style={{ background: c.coachAvatarBg, color: c.coachAvatarColor }}
            >
              M
            </div>
            <span
              className="text-[11px] font-bold uppercase tracking-widest"
              style={{ color: c.textTertiary }}
            >
              Physcal Coach
            </span>
          </div>
        )}
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-[15px]",
            isUser ? "rounded-br-sm" : "rounded-bl-sm",
          )}
          style={
            isUser
              ? {
                  background: c.sunGlare,
                  color: "#1C1C1A",
                  boxShadow: `0 4px 16px ${c.sunGlareBg}`,
                }
              : {
                  background: c.chipBg,
                  border: `1px solid ${c.chipBorder}`,
                  color: c.textPrimary,
                }
          }
        >
          <FormattedText text={message.text} className={isUser ? "text-[#1C1C1A]" : undefined} />
        </div>
        <span
          className={cn("text-[10px] px-1 font-medium", isUser ? "text-right" : "")}
          style={{ color: c.textTertiary }}
        >
          {message.ts}
        </span>
      </div>
    </div>
  );
}
