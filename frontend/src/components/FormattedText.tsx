import { cn } from "@/lib/utils";

// Renders simple markdown: **bold**, lists with •/-, line breaks
export function FormattedText({ text, className }: { text: string; className?: string }) {
  const lines = text.split("\n");
  return (
    <div className={cn("text-[14px] leading-relaxed space-y-1.5", className)}>
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-1" />;
        if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span className="text-primary mt-1">•</span>
              <span dangerouslySetInnerHTML={{ __html: bold(trimmed.slice(2)) }} />
            </div>
          );
        }
        return <p key={i} dangerouslySetInnerHTML={{ __html: bold(trimmed) }} />;
      })}
    </div>
  );
}

function bold(s: string) {
  // escape HTML first
  const esc = s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return esc
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
}
