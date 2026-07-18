import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, Sparkles } from "lucide-react";
import { currentUser, sportRecommendations, weekOverview, type DayStatus } from "@/lib/mock-data";
import { getInitials } from "@/lib/utils";
import { useColors } from "@/hooks/useColors";
import { cn } from "@/lib/utils";

import { evaluateReassessment } from "@/lib/progress";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/onboarding/reassess")({
  component: Reassess,
});

function Reassess() {
  const [stage, setStage] = useState<"welcome" | "result">("welcome");
  const navigate = useNavigate();
  const c = useColors();
  const trainingProfile = useApp((s) => s.trainingProfile);

  const sessionHistory = weekOverview.map((d: { date: string; status: DayStatus }) => ({
    date: d.date,
    completed: d.status === "completed",
    isRecovery: false,
  }));
  const result = evaluateReassessment(sessionHistory, trainingProfile?.fitnessLevel || "Beginner");

  if (stage === "welcome") {
    return (
      <div
        className="app-stage min-h-dvh flex flex-col px-5 py-8"
        style={{ background: c.appBg, color: c.textPrimary }}
      >
        <Link
          to="/dashboard"
          className="w-10 h-10 -ml-2 grid place-items-center rounded-lg self-start transition-colors"
          style={{ color: c.textPrimary }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.hoverBg)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          aria-label="Back"
        >
          <ChevronLeft size={20} />
        </Link>
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 rounded-full grid place-items-center mb-6"
            style={{ background: c.violetBg, color: c.violet }}
          >
            <Sparkles size={22} />
          </motion.div>
          <h1 className="text-4xl font-semibold mb-3">Welcome back, {currentUser.name}</h1>
          <p className="mb-6" style={{ color: c.textSecondary }}>
            A lot can change in 30 days. Let's see how you've grown.
          </p>
          <div
            className="card-frosted rounded-2xl px-5 py-4 mb-8 w-full"
            style={{ borderColor: c.divider }}
          >
            <div
              className="text-xs uppercase tracking-widest mb-1"
              style={{ color: c.textSecondary }}
            >
              You started with
            </div>
            <div
              className="text-[24px] font-bold flex items-center justify-center gap-2"
              style={{ color: c.textPrimary }}
            >
              <span
                className="w-9 h-9 rounded-full text-[11px] font-semibold grid place-items-center"
                style={{
                  background: c.chipBg,
                  borderColor: c.chipBorder,
                  borderWidth: 1,
                  color: c.textSecondary,
                }}
              >
                {getInitials("Badminton")}
              </span>
              Badminton
            </div>
          </div>
          <button
            onClick={() => setStage("result")}
            className="w-full h-12 rounded-xl font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
            style={{
              background: c.sunGlare,
              color: "#1C1C1A",
              boxShadow: `0 0 16px ${c.sunGlareBg}`,
            }}
          >
            Update my profile
          </button>
          <Link
            to="/dashboard"
            className="mt-3 text-sm transition-colors"
            style={{ color: c.textSecondary }}
            onMouseEnter={(e) => (e.currentTarget.style.color = c.textPrimary)}
            onMouseLeave={(e) => (e.currentTarget.style.color = c.textSecondary)}
          >
            Keep my current profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="app-stage min-h-dvh px-5 py-8"
      style={{ background: c.appBg, color: c.textPrimary }}
    >
      <Link
        to="/dashboard"
        className="w-10 h-10 -ml-2 grid place-items-center rounded-lg mb-4 transition-colors"
        style={{ color: c.textPrimary }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.hoverBg)}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        aria-label="Back"
      >
        <ChevronLeft size={20} />
      </Link>
      <div className="max-w-md mx-auto">
        <div
          className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-4"
          style={{ background: c.violetBg, color: c.violet }}
        >
          <Sparkles size={12} /> Comparison ready
        </div>
        <h1 className="text-3xl font-semibold mb-2">
          {result.levelChanged ? "You've evolved" : "Staying the course"}
        </h1>
        <p className="mb-6" style={{ color: c.textSecondary }}>
          {result.reasoning}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="card-frosted rounded-2xl p-4" style={{ borderColor: c.divider }}>
            <div
              className="text-[10px] uppercase tracking-widest mb-2"
              style={{ color: c.textSecondary }}
            >
              Before
            </div>
            <div
              className="w-9 h-9 rounded-full text-[11px] font-semibold grid place-items-center mb-2"
              style={{
                background: c.chipBg,
                borderColor: c.chipBorder,
                borderWidth: 1,
                color: c.textSecondary,
              }}
            >
              {getInitials("Badminton")}
            </div>
            <div className="font-semibold">Badminton</div>
            <div className="text-xs mt-1" style={{ color: c.textSecondary }}>
              {trainingProfile?.fitnessLevel || "Beginner"}
            </div>
          </div>
          <div
            className="rounded-2xl p-4"
            style={{
              background: result.levelChanged ? c.sunGlareBg : c.chipBg,
              borderColor: result.levelChanged ? c.sunGlare : c.chipBorder,
              borderWidth: 1,
            }}
          >
            <div
              className="text-[10px] uppercase tracking-widest mb-2"
              style={{ color: result.levelChanged ? c.sunGlare : c.textSecondary }}
            >
              Now
            </div>
            <div
              className="w-9 h-9 rounded-full text-[11px] font-semibold grid place-items-center mb-2"
              style={{
                background: c.chipBg,
                borderColor: result.levelChanged ? c.sunGlare : c.chipBorder,
                borderWidth: 1,
                color: result.levelChanged ? c.sunGlare : c.textSecondary,
              }}
            >
              {getInitials("Badminton")}
            </div>
            <div className="font-semibold">Badminton</div>
            <div
              className="text-xs mt-1"
              style={{ color: result.levelChanged ? c.sunGlare : c.textSecondary }}
            >
              {result.newLevel}
            </div>
          </div>
        </div>

        <div className="card-frosted rounded-2xl p-4 mb-6" style={{ borderColor: c.divider }}>
          <div
            className="text-xs uppercase tracking-widest mb-2"
            style={{ color: c.textSecondary }}
          >
            New recommendations
          </div>
          {sportRecommendations.slice(0, 2).map((s) => (
            <div key={s.id} className="flex items-center gap-3 py-2">
              <span
                className="w-8 h-8 rounded-full text-[11px] font-semibold grid place-items-center"
                style={{
                  background: c.chipBg,
                  borderColor: c.chipBorder,
                  borderWidth: 1,
                  color: c.textSecondary,
                }}
              >
                {getInitials(s.name)}
              </span>
              <div className="font-medium text-sm">{s.name}</div>
              <span
                className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider"
                style={{ background: c.violetBg, color: c.violet }}
              >
                {s.difficulty}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate({ to: "/dashboard" })}
            className="w-full h-12 rounded-xl font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
            style={{
              background: c.sunGlare,
              color: "#1C1C1A",
              boxShadow: `0 0 16px ${c.sunGlareBg}`,
            }}
          >
            Start fresh with new plan
          </button>
          <Link
            to="/dashboard"
            className="block text-center text-sm transition-colors"
            style={{ color: c.textSecondary }}
            onMouseEnter={(e) => (e.currentTarget.style.color = c.textPrimary)}
            onMouseLeave={(e) => (e.currentTarget.style.color = c.textSecondary)}
          >
            Keep my current plan
          </Link>
        </div>
      </div>
    </div>
  );
}
