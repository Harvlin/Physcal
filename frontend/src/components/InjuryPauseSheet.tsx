import { useNavigate } from "@tanstack/react-router";
import { Heart, Leaf, ArrowLeft } from "lucide-react";
import { useApp } from "@/lib/store";
import { useColors } from "@/hooks/useColors";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

type InjuryPauseSheetProps = {
  sessionId: string;
  onSwitchToRecovery: () => void;
  children: React.ReactNode; // trigger button
};

export function InjuryPauseSheet({ sessionId, onSwitchToRecovery, children }: InjuryPauseSheetProps) {
  const c = useColors();
  const navigate = useNavigate();
  const pauseForInjury = useApp((s) => s.pauseForInjury);

  const handleStop = () => {
    pauseForInjury();
    if ("vibrate" in navigator) navigator.vibrate(50);
    navigate({
      to: "/coach/workout/$sessionId/done",
      params: { sessionId },
    });
  };

  const handleRecovery = () => {
    pauseForInjury();
    if ("vibrate" in navigator) navigator.vibrate(50);
    onSwitchToRecovery();
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent
        className="pb-8"
        style={{
          background: c.isDark
            ? "linear-gradient(160deg, rgba(40,38,35,0.98), rgba(30,28,26,0.98))"
            : "linear-gradient(160deg, rgba(255,255,255,0.98), rgba(244,243,238,0.98))",
          borderColor: c.chipBorder,
        }}
      >
        <DrawerHeader className="text-center pt-6 pb-2">
          <DrawerTitle
            className="text-[22px] font-extrabold"
            style={{ color: c.textPrimary }}
          >
            Something&apos;s not right?
          </DrawerTitle>
          <DrawerDescription
            className="text-sm font-medium mt-1"
            style={{ color: c.textSecondary }}
          >
            That&apos;s okay. Your progress is saved.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-5 space-y-3 mt-4">
          {/* Stop & rest */}
          <button
            onClick={handleStop}
            className="w-full h-14 rounded-2xl flex items-center justify-center gap-3 font-bold text-[15px] transition-all active:scale-[0.98]"
            style={{
              background: c.sunGlare,
              color: "#1C1C1A",
              boxShadow: `0 0 20px ${c.sunGlareBg}`,
            }}
          >
            <Heart size={18} />
            Stop & rest today
          </button>

          {/* Switch to recovery */}
          <button
            onClick={handleRecovery}
            className="w-full h-14 rounded-2xl flex items-center justify-center gap-3 font-bold text-[15px] transition-all active:scale-[0.98]"
            style={{
              border: `1.5px solid ${c.chipBorder}`,
              color: c.textPrimary,
              background: c.chipBg,
            }}
          >
            <Leaf size={18} style={{ color: "oklch(0.52 0.14 152)" }} />
            Switch to gentle recovery
          </button>

          {/* Keep going */}
          <DrawerClose asChild>
            <button
              className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm transition-all active:scale-[0.98]"
              style={{ color: c.textTertiary }}
            >
              <ArrowLeft size={16} />
              Keep going (I&apos;m fine)
            </button>
          </DrawerClose>
        </div>

        <p
          className="text-xs text-center font-medium mt-6 px-8"
          style={{ color: c.textTertiary }}
        >
          Your sets so far are logged. Take care of your body first.
        </p>
      </DrawerContent>
    </Drawer>
  );
}
