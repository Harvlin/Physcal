import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { UploadCloud, ChevronDown, Loader2, Play, Lock } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { cn, getInitials } from "@/lib/utils";
import { useColors } from "@/hooks/useColors";

export const Route = createFileRoute("/analysis/")({
  head: () => ({ meta: [{ title: "Movement Analysis — Physcal" }] }),
  component: AnalysisPage,
});

import { type AnalyzableExercise } from "@/lib/mock-data";

const exercises: { id: AnalyzableExercise; label: string; focus: string }[] = [
  { id: "squat", label: "Squat", focus: "Lower body" },
  { id: "pushup", label: "Push-up", focus: "Upper body" },
  { id: "lunge", label: "Lunge", focus: "Balance" },
  { id: "bridge", label: "Glute bridge", focus: "Posterior chain" },
];
const lockedExercises = [
  { id: "plank", label: "Plank" },
  { id: "deadlift", label: "Deadlift" },
  { id: "overhead", label: "Overhead press" },
  { id: "pullup", label: "Pull-up" },
  { id: "burpee", label: "Burpee" },
  { id: "jump-rope", label: "Jump rope" },
  { id: "rowing", label: "Rowing" },
];

const tips = [
  "Full body visible in frame",
  "Good lighting (not backlit)",
  "Stable camera position",
  "Wear fitted clothing if possible",
];

function AnalysisPage() {
  const [exercise, setExercise] = useState<string>();
  const [file, setFile] = useState<File | null>(null);
  const [tipsOpen, setTipsOpen] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const c = useColors();

  const handleAnalyze = () => {
    setProgress(0);
    const id = setInterval(() => {
      setProgress((p) => {
        if (p === null) return null;
        if (p >= 100) {
          clearInterval(id);
          navigate({ to: "/analysis/result", search: { exerciseId: exercise } });
          return 100;
        }
        return p + 8;
      });
    }, 120);
  };

  const canAnalyze = exercise && file && progress === null;

  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-6 lg:py-8 max-w-3xl mx-auto">
        <div className="mb-6">
          <p
            className="text-xs font-bold uppercase tracking-[0.18em] mb-2"
            style={{ color: c.violet }}
          >
            AI-powered
          </p>
          <h1 className="text-[26px] font-black leading-tight" style={{ color: c.textPrimary }}>
            Movement analysis
          </h1>
          <p className="text-sm mt-1 font-medium" style={{ color: c.textSecondary }}>
            Upload a short video and get instant AI feedback on your technique.
          </p>
        </div>

        {/* Pick a movement */}
        <div className="card-frosted mb-5 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold" style={{ color: c.textPrimary }}>
              Pick a movement
            </h2>
            <span
              className="text-[10px] uppercase tracking-widest font-semibold"
              style={{ color: c.textTertiary }}
            >
              Select one
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 sm:gap-3">
            {exercises.map((ex) => {
              const active = exercise === ex.id;
              return (
                <button
                  key={ex.id}
                  onClick={() => setExercise(ex.id)}
                  className="group relative rounded-2xl text-left transition-all p-4 min-w-[200px] sm:min-w-0"
                  style={{
                    background: active ? c.sunGlareBg : c.chipBg,
                    border: active ? `1px solid ${c.sunGlare}55` : `1px solid ${c.chipBorder}`,
                    boxShadow: active ? `0 0 20px ${c.sunGlare}22` : "none",
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="w-9 h-9 rounded-xl grid place-items-center text-[11px] font-black transition-colors"
                        style={
                          active
                            ? { background: c.violet, color: "#F2F0E9" }
                            : { background: c.chipBg, color: c.textSecondary }
                        }
                      >
                        {getInitials(ex.label)}
                      </span>
                      <div className="font-bold text-[14px]" style={{ color: c.textPrimary }}>
                        {ex.label}
                      </div>
                    </div>
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full transition-colors"
                      style={
                        active
                          ? { background: c.exuberant, color: "#F2F0E9" }
                          : { background: c.chipBg, color: c.textTertiary }
                      }
                    >
                      {active ? "✓" : "—"}
                    </span>
                  </div>
                  <div
                    className="mt-2.5 text-[11px] uppercase tracking-wider font-semibold"
                    style={{ color: active ? c.sunGlare : c.textTertiary }}
                  >
                    {ex.focus}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Locked exercises */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1 mt-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-4 sm:gap-3">
            {lockedExercises.map((ex) => (
              <div
                key={ex.id}
                className="p-4 rounded-2xl min-w-[160px] sm:min-w-0"
                style={{
                  background: c.chipBg,
                  border: `1px solid ${c.chipBorder}`,
                  opacity: 0.4,
                }}
              >
                <div
                  className="flex items-center gap-2 mb-2 text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: c.textSecondary }}
                >
                  <Lock size={11} /> Soon
                </div>
                <div className="font-bold text-[13px]" style={{ color: c.textPrimary }}>
                  {ex.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upload video */}
        <div className="card-frosted mb-4 p-5">
          <h2 className="text-sm font-bold mb-3" style={{ color: c.textPrimary }}>
            Upload video
          </h2>
          <input
            ref={inputRef}
            type="file"
            accept="video/mp4,video/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <button
            onClick={() => inputRef.current?.click()}
            className="w-full rounded-2xl border-2 border-dashed grid place-items-center transition-all text-center px-4 py-12"
            style={{
              borderColor: file ? c.violet : c.inputBorder,
              background: file ? c.violetBg : c.inputBg,
            }}
            onMouseEnter={(e) => {
              if (!file) {
                e.currentTarget.style.borderColor = `${c.sunGlare}55`;
                e.currentTarget.style.background = c.sunGlareBg;
              }
            }}
            onMouseLeave={(e) => {
              if (!file) {
                e.currentTarget.style.borderColor = c.inputBorder;
                e.currentTarget.style.background = c.inputBg;
              }
            }}
          >
            {file ? (
              <div>
                <div
                  className="w-12 h-12 mx-auto mb-3 rounded-xl grid place-items-center"
                  style={{ background: c.exuberant, color: "#F2F0E9" }}
                >
                  <Play size={18} fill="currentColor" />
                </div>
                <div
                  className="font-semibold text-sm truncate max-w-xs"
                  style={{ color: c.textPrimary }}
                >
                  {file.name}
                </div>
                <div className="text-xs mt-1" style={{ color: c.textTertiary }}>
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </div>
              </div>
            ) : (
              <div>
                <UploadCloud className="mx-auto mb-3" size={36} style={{ color: c.textDisabled }} />
                <div className="font-semibold" style={{ color: c.textSecondary }}>
                  Tap to choose video
                </div>
                <div className="text-xs mt-1" style={{ color: c.textTertiary }}>
                  or drag and drop here
                </div>
              </div>
            )}
          </button>
          <div className="flex gap-2 mt-3 justify-center">
            {["MP4", "Max 30 sec", "50MB"].map((s) => (
              <span
                key={s}
                className="text-[10px] font-bold tracking-wide uppercase"
                style={{
                  background: c.chipBg,
                  color: c.textTertiary,
                  padding: "4px 10px",
                  borderRadius: "9999px",
                  border: `1px solid ${c.chipBorder}`,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Tips accordion */}
        <div className="card-frosted mb-6 overflow-hidden">
          <button
            onClick={() => setTipsOpen((o) => !o)}
            className="w-full flex items-center justify-between p-4 transition-colors"
            onMouseEnter={(e) => (e.currentTarget.style.background = c.hoverBg)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <span className="font-bold text-sm" style={{ color: c.textPrimary }}>
              Tips for best results
            </span>
            <ChevronDown
              size={15}
              className={cn("transition-transform", tipsOpen && "rotate-180")}
              style={{ color: c.textTertiary }}
            />
          </button>
          <div
            className={cn(
              "overflow-hidden transition-[max-height,opacity] duration-200 ease-out",
              tipsOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0",
            )}
          >
            <div className="px-4 pb-4 space-y-3">
              {tips.map((t) => (
                <div key={t} className="flex items-start gap-3 text-sm">
                  <span
                    className="w-5 h-5 rounded-full grid place-items-center shrink-0 mt-0.5"
                    style={{ background: c.exuberantBg }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: c.exuberant }}
                    />
                  </span>
                  <span style={{ color: c.textSecondary }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Analyze button */}
        <button
          onClick={handleAnalyze}
          disabled={!canAnalyze}
          className={cn(
            "w-full h-[52px] font-bold text-[15px] transition-all flex items-center justify-center gap-2 relative overflow-hidden",
          )}
          style={{
            borderRadius: "9999px",
            background: canAnalyze ? c.sunGlare : c.chipBg,
            color: canAnalyze ? "#1C1C1A" : c.textDisabled,
            cursor: canAnalyze ? "pointer" : "not-allowed",
            boxShadow: canAnalyze ? `0 0 28px ${c.sunGlareBg}` : "none",
          }}
        >
          {progress !== null ? (
            <>
              <div
                className="absolute inset-0"
                style={{
                  background: c.sunGlare,
                  width: `${progress}%`,
                  transition: "width 0.12s linear",
                }}
              />
              <span className="relative flex items-center gap-2" style={{ color: "#1C1C1A" }}>
                <Loader2 className="animate-spin" size={14} /> Analyzing... {progress}%
              </span>
            </>
          ) : (
            "Analyze my form"
          )}
        </button>
      </div>
    </AppShell>
  );
}
