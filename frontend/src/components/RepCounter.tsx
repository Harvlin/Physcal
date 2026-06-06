import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mic, Hand, Camera, Minus, Plus, RotateCcw } from "lucide-react";
import { useApp, type RepCounterMode } from "@/lib/store";
import { useColors } from "@/hooks/useColors";
import type { Exercise } from "@/lib/mock-data";

// Indonesian number words for voice recognition
const ID_NUMBERS: Record<string, number> = {
  satu: 1, dua: 2, tiga: 3, empat: 4, lima: 5,
  enam: 6, tujuh: 7, delapan: 8, sembilan: 9, sepuluh: 10,
  sebelas: 11, "dua belas": 12, "tiga belas": 13, "empat belas": 14, "lima belas": 15,
  "enam belas": 16, "tujuh belas": 17, "delapan belas": 18, "sembilan belas": 19, "dua puluh": 20,
};

const EN_NUMBERS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15,
  sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20,
};

type RepCounterProps = {
  exercise: Exercise;
  targetReps: number;
  onComplete: (reps: number) => void;
  onClose: () => void;
};

export function RepCounter({ exercise, targetReps, onComplete, onClose }: RepCounterProps) {
  const c = useColors();
  const { repCounterMode, liveRepCount } = useApp((s) => s.workoutSession);
  const setRepCounterMode = useApp((s) => s.setRepCounterMode);
  const setLiveRepCount = useApp((s) => s.setLiveRepCount);
  const [isListening, setIsListening] = useState(false);
  const [scaleAnim, setScaleAnim] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Determine available modes on mount
  useEffect(() => {
    // Camera mode is a stub — not available
    // Try voice
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Voice not available, fall back to manual
      setRepCounterMode("manual");
    } else if (repCounterMode === "camera") {
      // Camera not implemented, fall back to voice
      setRepCounterMode("voice");
    }
  }, []);

  // Voice recognition
  useEffect(() => {
    if (repCounterMode !== "voice") {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setRepCounterMode("manual");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "id-ID";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const last = event.results[event.results.length - 1];
      if (!last.isFinal) return;
      const transcript = last[0].transcript.trim().toLowerCase();

      // Check for number commands
      if (ID_NUMBERS[transcript] !== undefined) {
        setLiveRepCount(ID_NUMBERS[transcript]);
        triggerScale();
      } else if (EN_NUMBERS[transcript] !== undefined) {
        setLiveRepCount(EN_NUMBERS[transcript]);
        triggerScale();
      } else if (["tambah", "next", "plus"].includes(transcript)) {
        setLiveRepCount(useApp.getState().workoutSession.liveRepCount + 1);
        triggerScale();
      } else if (transcript === "reset") {
        setLiveRepCount(0);
      } else if (["selesai", "finish", "done set", "done"].includes(transcript)) {
        onComplete(useApp.getState().workoutSession.liveRepCount || targetReps);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      // Restart if still in voice mode
      if (useApp.getState().workoutSession.repCounterMode === "voice") {
        try { recognition.start(); } catch { /* already started */ }
      }
    };

    try {
      recognition.start();
      setIsListening(true);
      recognitionRef.current = recognition;
    } catch {
      setRepCounterMode("manual");
    }

    return () => {
      try { recognition.stop(); } catch { /* ignore */ }
      recognitionRef.current = null;
    };
  }, [repCounterMode]);

  // Vibrate when target reached
  useEffect(() => {
    if (liveRepCount >= targetReps && liveRepCount > 0) {
      if ("vibrate" in navigator) navigator.vibrate(100);
    }
  }, [liveRepCount, targetReps]);

  const triggerScale = () => {
    setScaleAnim(true);
    setTimeout(() => setScaleAnim(false), 150);
  };

  const handleTap = useCallback(() => {
    const current = useApp.getState().workoutSession.liveRepCount;
    setLiveRepCount(current + 1);
    triggerScale();
    if ("vibrate" in navigator) navigator.vibrate(20);
  }, [setLiveRepCount]);

  const handleDecrement = useCallback(() => {
    const current = useApp.getState().workoutSession.liveRepCount;
    if (current > 0) setLiveRepCount(current - 1);
  }, [setLiveRepCount]);

  const handleIncrement = useCallback(() => {
    const current = useApp.getState().workoutSession.liveRepCount;
    setLiveRepCount(current + 1);
    triggerScale();
    if ("vibrate" in navigator) navigator.vibrate(20);
  }, [setLiveRepCount]);

  const handleDone = () => {
    onComplete(liveRepCount || targetReps);
  };

  const modes: { mode: RepCounterMode; icon: typeof Camera; label: string }[] = [
    { mode: "camera", icon: Camera, label: "Camera" },
    { mode: "voice", icon: Mic, label: "Voice" },
    { mode: "manual", icon: Hand, label: "Manual" },
  ];

  const reachedTarget = liveRepCount >= targetReps;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        className="fixed inset-0 z-50 flex flex-col"
        style={{ background: c.isDark ? "#1C1C1A" : "#F4F3EE" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <div className="text-xs uppercase tracking-widest font-bold" style={{ color: c.textTertiary }}>
              Count reps
            </div>
            <div className="text-lg font-extrabold" style={{ color: c.textPrimary }}>
              {exercise.name}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full grid place-items-center transition-all active:scale-90"
            style={{ background: c.chipBg, color: c.textSecondary }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          {/* Voice mode indicator */}
          {repCounterMode === "voice" && (
            <div className="flex items-center gap-2 mb-6">
              <div className="relative">
                <Mic size={20} style={{ color: c.sunGlare }} />
                {isListening && (
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 rounded-full"
                    style={{ border: `2px solid ${c.sunGlare}` }}
                  />
                )}
              </div>
              <span className="text-sm font-semibold" style={{ color: c.sunGlare }}>
                {isListening ? "Listening..." : "Connecting..."}
              </span>
            </div>
          )}

          {/* Camera stub */}
          {repCounterMode === "camera" && (
            <div className="flex items-center gap-2 mb-6">
              <Camera size={20} style={{ color: c.textTertiary }} />
              <span className="text-sm font-medium" style={{ color: c.textTertiary }}>
                Camera mode coming soon
              </span>
            </div>
          )}

          {/* Live count display */}
          <motion.div
            animate={{ scale: scaleAnim ? 1.2 : 1 }}
            transition={{ duration: 0.15 }}
            className="mb-2"
          >
            <span
              className="text-[72px] font-extrabold tabular-nums leading-none"
              style={{
                color: reachedTarget ? "oklch(0.52 0.14 152)" : c.textPrimary,
                fontFamily: "var(--font-sans)",
                transition: "color 0.3s",
              }}
            >
              {liveRepCount}
            </span>
          </motion.div>
          <div className="text-base font-semibold mb-8" style={{ color: c.textTertiary }}>
            of {targetReps} reps
          </div>

          {/* Manual tap zone */}
          {repCounterMode === "manual" && (
            <button
              onClick={handleTap}
              className="w-full max-w-xs rounded-2xl flex items-center justify-center font-bold text-lg transition-all active:scale-95 mb-6"
              style={{
                height: 120,
                background: c.chipBg,
                border: `2px dashed ${c.chipBorder}`,
                color: c.textSecondary,
              }}
            >
              TAP TO COUNT
            </button>
          )}

          {/* Voice instructions */}
          {repCounterMode === "voice" && (
            <p className="text-sm text-center font-medium max-w-xs mb-6" style={{ color: c.textTertiary }}>
              Say the rep number or{" "}
              <span style={{ color: c.sunGlare }}>&ldquo;selesai&rdquo;</span> when done
            </p>
          )}

          {/* +/- buttons */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={handleDecrement}
              className="w-14 h-14 rounded-full grid place-items-center transition-all active:scale-90"
              style={{ border: `1.5px solid ${c.chipBorder}`, color: c.textSecondary }}
            >
              <Minus size={20} strokeWidth={2.5} />
            </button>
            <button
              onClick={handleIncrement}
              className="w-14 h-14 rounded-full grid place-items-center transition-all active:scale-90"
              style={{ border: `1.5px solid ${c.chipBorder}`, color: c.textSecondary }}
            >
              <Plus size={20} strokeWidth={2.5} />
            </button>
            {repCounterMode === "voice" && (
              <button
                onClick={() => setLiveRepCount(0)}
                className="w-14 h-14 rounded-full grid place-items-center transition-all active:scale-90"
                style={{ border: `1.5px solid ${c.chipBorder}`, color: c.textSecondary }}
              >
                <RotateCcw size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Mode switcher */}
        <div className="flex items-center justify-center gap-6 py-3">
          {modes.map(({ mode, icon: Icon, label }) => {
            const active = repCounterMode === mode;
            const disabled = mode === "camera"; // Camera not implemented
            return (
              <button
                key={mode}
                onClick={() => !disabled && setRepCounterMode(mode)}
                className="flex flex-col items-center gap-1 transition-all"
                style={{
                  color: disabled ? c.textDisabled : active ? c.sunGlare : c.textTertiary,
                  opacity: disabled ? 0.4 : 1,
                }}
                disabled={disabled}
              >
                <Icon size={20} />
                <span className="text-[10px] font-semibold">{label}</span>
              </button>
            );
          })}
        </div>

        {/* Done CTA */}
        <div className="px-5 pb-8 pt-3">
          <button
            onClick={handleDone}
            className="w-full h-14 rounded-full font-bold text-[15px] transition-all active:scale-[0.98]"
            style={{
              background: c.sunGlare,
              color: "#1C1C1A",
              boxShadow: `0 0 28px ${c.sunGlareBg}`,
            }}
          >
            Done with this set →
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
