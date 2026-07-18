import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, type ComponentType } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  HeartPulse,
  Flame,
  Dumbbell,
  Users,
  Shield,
  Sparkles,
  Accessibility,
  Activity,
  ShieldAlert,
  Scale,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { sportRecommendations, generateDailyPlan, GoalId } from "@/lib/mock-data";
import { cn, getInitials } from "@/lib/utils";
import { useColors } from "@/hooks/useColors";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingPage,
});

const goalOptions = [
  { id: "health", label: "General health", icon: HeartPulse },
  { id: "weight", label: "Lose weight", icon: Flame },
  { id: "gain_weight", label: "Gain weight", icon: Scale },
  { id: "strength", label: "Build strength", icon: Dumbbell },
  { id: "social", label: "Have fun & socialize", icon: Users },
  { id: "recovery", label: "Recover from injury", icon: Shield },
  { id: "stress", label: "Reduce stress", icon: Sparkles },
];

const fitnessLevels = ["Complete beginner", "Rarely active", "Sometimes active", "Pretty active"];
const locations = ["Home", "Gym", "Outdoors", "Mix of all"];
const times = ["1–2 hrs", "3–5 hrs", "5+ hrs"];
const confidenceLevels = [
  { value: 1, label: "Very low" },
  { value: 2, label: "Low" },
  { value: 3, label: "Okay" },
  { value: 4, label: "Good" },
  { value: 5, label: "High" },
];
const physicalOptions = [
  "None",
  "Joint issues",
  "Back pain",
  "Post-injury",
  "Chronic condition",
  "Prefer not to say",
];
const socialOptions = ["Solo", "With a partner", "Small group", "Any is fine"];

function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const onboarding = useApp((s) => s.onboarding);
  const setOnboarding = useApp((s) => s.setOnboarding);
  const resetOnboarding = useApp((s) => s.resetOnboarding);
  const setBodyWeightGoal = useApp((s) => s.setBodyWeightGoal);
  const setWeightUnit = useApp((s) => s.setWeightUnit);
  const setTrainingProfile = useApp((s) => s.setTrainingProfile);
  const setHealthProfile = useApp((s) => s.setHealthProfile);
  const navigate = useNavigate();
  const c = useColors();

  const finishOnboarding = () => {
    // Persist weight settings
    setWeightUnit(onboarding.weightUnit);
    setBodyWeightGoal({ current: onboarding.currentWeight, goal: onboarding.goalWeight });

    // Derive and persist TrainingProfile (Part G)
    const socialMap: Record<string, string> = {
      Solo: "solo",
      "With a partner": "with_partner",
      "Small group": "small_group",
      "Any is fine": "any",
    };
    setTrainingProfile({
      goals: onboarding.goals,
      fitnessLevel: onboarding.fitnessLevel,
      location: onboarding.location,
      timePerWeek: onboarding.timePerWeek,
      confidence: onboarding.confidence,
      socialPreference: onboarding.social
        ? (socialMap[onboarding.social] ?? onboarding.social)
        : undefined,
    });

    // Derive and persist HealthProfile with disclosure status (Part H)
    const selectedPhysical = onboarding.physical;
    let disclosureStatus: import("@/lib/store/types").HealthDisclosureStatus;
    if (selectedPhysical.includes("Prefer not to say")) {
      disclosureStatus = "undisclosed";
    } else if (selectedPhysical.includes("None") || selectedPhysical.length === 0) {
      disclosureStatus = "confirmed_none";
    } else {
      disclosureStatus = "conditions_provided";
    }

    const conditions = Object.entries(onboarding.physicalDetails).map(([type, d]) => ({
      type,
      details: (d.details ?? {}) as Record<string, string | string[]>,
      severity: d.severity ?? "mild",
      avoidances: d.avoidances ?? "",
    }));

    setHealthProfile({
      hasConditions: disclosureStatus === "conditions_provided",
      disclosureStatus,
      conditions,
    });

    resetOnboarding();
  };

  const phrases = [
    "Analyzing your profile...",
    "Finding sports you'll actually enjoy...",
    "Building your starter roadmap...",
  ];

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => setPhraseIdx((i) => (i + 1) % phrases.length), 800);
    const timeout = setTimeout(() => {
      setLoading(false);
      setShowResult(true);
    }, 2500);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [loading]);

  const needsWeightStep =
    onboarding.goals.includes("weight") || onboarding.goals.includes("gain_weight");

  const next = () => {
    if (step === 3) {
      setLoading(true);
      setStep(4);
      return;
    }
    setDirection(1);
    if (step === 1 && needsWeightStep) {
      setStep(1.5);
    } else if (step === 1.5) {
      setStep(2);
    } else {
      setStep((s) => Math.min(4, s + 1));
    }
  };
  const back = () => {
    setDirection(-1);
    if (step === 2 && needsWeightStep) {
      setStep(1.5);
    } else if (step === 1.5) {
      setStep(1);
    } else {
      setStep((s) => Math.max(1, s - 1));
    }
  };

  const canContinue = (() => {
    if (step === 1) return onboarding.goals.length > 0;
    if (step === 1.5)
      return (
        onboarding.currentWeight !== null &&
        onboarding.goalWeight !== null &&
        onboarding.currentWeight > 0 &&
        onboarding.goalWeight > 0
      );
    if (step === 2)
      return (
        onboarding.fitnessLevel &&
        onboarding.location &&
        onboarding.timePerWeek &&
        onboarding.confidence
      );
    if (step === 3) return onboarding.physical.length > 0 && onboarding.social;
    return true;
  })();

  const progress = step / 4;

  return (
    <div
      className="app-stage min-h-dvh flex flex-col"
      style={{ background: c.appBg, color: c.textPrimary }}
    >
      <div className="h-1" style={{ background: c.divider }}>
        <motion.div
          style={{ height: "100%", background: c.sunGlare, boxShadow: `0 0 8px ${c.sunGlareBg}` }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <div className="flex items-center justify-between px-4 py-3">
        {step > 1 && step < 4 ? (
          <button
            onClick={back}
            className="w-10 h-10 grid place-items-center rounded-lg hover:bg-[rgba(255,255,255,0.1)]"
            aria-label="Back"
          >
            <ChevronLeft size={20} />
          </button>
        ) : (
          <div className="w-10" />
        )}
        {step === 1 && (
          <Link
            to="/dashboard"
            onClick={() => finishOnboarding()}
            className="text-sm transition-colors"
            style={{ color: c.textTertiary }}
            onMouseEnter={(e) => (e.currentTarget.style.color = c.textPrimary)}
            onMouseLeave={(e) => (e.currentTarget.style.color = c.textTertiary)}
          >
            Skip
          </Link>
        )}
      </div>

      <div className="flex-1 flex justify-center px-5 pb-12">
        <div className="w-full max-w-[480px]">
          <AnimatePresence mode="wait" custom={direction}>
            {step === 1 && !loading && !showResult && (
              <motion.div key="s1" {...slide(direction)}>
                <h1
                  className="text-3xl sm:text-4xl font-semibold mb-2"
                  style={{ color: c.textPrimary }}
                >
                  What brings you here?
                </h1>
                <p className="mb-8" style={{ color: c.textSecondary }}>
                  Pick everything that applies. We'll personalize from here.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {goalOptions.map((g) => {
                    const active = onboarding.goals.includes(g.id);
                    const Icon = g.icon;
                    return (
                      <button
                        key={g.id}
                        onClick={() =>
                          setOnboarding({
                            goals: active
                              ? onboarding.goals.filter((x) => x !== g.id)
                              : [...onboarding.goals, g.id],
                          })
                        }
                        className={cn(
                          "p-5 rounded-[28px] border text-left transition-all active:scale-[0.97]",
                        )}
                        style={
                          active
                            ? {
                                background: c.sunGlareBg,
                                border: `1px solid ${c.sunGlare}44`,
                                boxShadow: `0 0 24px ${c.sunGlareBg}`,
                              }
                            : { background: c.chipBg, border: `1px solid ${c.chipBorder}` }
                        }
                      >
                        <div
                          className={cn(
                            "w-9 h-9 rounded-xl grid place-items-center mb-2 transition-colors",
                          )}
                          style={
                            active
                              ? { background: `${c.sunGlare}22`, color: c.sunGlare }
                              : {
                                  background: c.isDark
                                    ? "rgba(255,255,255,0.08)"
                                    : "rgba(0,0,0,0.05)",
                                  color: c.textSecondary,
                                }
                          }
                        >
                          <Icon size={18} />
                        </div>
                        <div
                          className="font-bold text-[15px] leading-tight"
                          style={{ color: active ? c.sunGlare : c.textPrimary }}
                        >
                          {g.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 1.5 && (
              <motion.div key="s15" {...slide(direction)} className="space-y-7">
                <h1
                  className="text-3xl sm:text-4xl font-semibold mb-2"
                  style={{ color: c.textPrimary }}
                >
                  Let's set a target
                </h1>

                <div className="card-frosted p-5">
                  <div className="flex justify-between items-center mb-5">
                    <div className="text-sm font-medium" style={{ color: c.textPrimary }}>
                      Weight Goal
                    </div>
                    <div
                      className="flex rounded-lg overflow-hidden border"
                      style={{ borderColor: c.chipBorder }}
                    >
                      <button
                        onClick={() => {
                          if (onboarding.weightUnit !== "kg") {
                            setOnboarding({
                              weightUnit: "kg",
                              currentWeight: onboarding.currentWeight
                                ? Number((onboarding.currentWeight / 2.2046).toFixed(1))
                                : null,
                              goalWeight: onboarding.goalWeight
                                ? Number((onboarding.goalWeight / 2.2046).toFixed(1))
                                : null,
                            });
                          }
                        }}
                        className="px-3 py-1.5 text-xs font-bold transition-colors"
                        style={
                          onboarding.weightUnit === "kg"
                            ? { background: c.sunGlare, color: c.appBg }
                            : { background: c.chipBg, color: c.textSecondary }
                        }
                      >
                        kg
                      </button>
                      <button
                        onClick={() => {
                          if (onboarding.weightUnit !== "lbs") {
                            setOnboarding({
                              weightUnit: "lbs",
                              currentWeight: onboarding.currentWeight
                                ? Number((onboarding.currentWeight * 2.2046).toFixed(1))
                                : null,
                              goalWeight: onboarding.goalWeight
                                ? Number((onboarding.goalWeight * 2.2046).toFixed(1))
                                : null,
                            });
                          }
                        }}
                        className="px-3 py-1.5 text-xs font-bold transition-colors"
                        style={
                          onboarding.weightUnit === "lbs"
                            ? { background: c.sunGlare, color: c.appBg }
                            : { background: c.chipBg, color: c.textSecondary }
                        }
                      >
                        lbs
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label
                        className="block text-xs mb-1 font-semibold"
                        style={{ color: c.textSecondary }}
                      >
                        Current
                      </label>
                      <input
                        type="number"
                        value={onboarding.currentWeight ?? ""}
                        onChange={(e) =>
                          setOnboarding({
                            currentWeight: e.target.value ? Number(e.target.value) : null,
                          })
                        }
                        className="w-full rounded-lg px-4 py-3 text-lg font-bold focus:outline-none transition-colors"
                        style={{
                          background: c.inputBg,
                          color: c.textPrimary,
                          border: `1px solid ${c.inputBorder}`,
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = `${c.sunGlare}66`)}
                        onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
                        placeholder="0.0"
                      />
                    </div>
                    <div className="flex-1">
                      <label
                        className="block text-xs mb-1 font-semibold"
                        style={{ color: c.textSecondary }}
                      >
                        Goal
                      </label>
                      <input
                        type="number"
                        value={onboarding.goalWeight ?? ""}
                        onChange={(e) =>
                          setOnboarding({
                            goalWeight: e.target.value ? Number(e.target.value) : null,
                          })
                        }
                        className="w-full rounded-lg px-4 py-3 text-lg font-bold focus:outline-none transition-colors"
                        style={{
                          background: c.inputBg,
                          color: c.textPrimary,
                          border: `1px solid ${c.inputBorder}`,
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = `${c.sunGlare}66`)}
                        onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
                        placeholder="0.0"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" {...slide(direction)} className="space-y-7">
                <h1
                  className="text-3xl sm:text-4xl font-semibold mb-2"
                  style={{ color: c.textPrimary }}
                >
                  Tell us about yourself
                </h1>
                <Pills
                  label="Fitness level"
                  options={fitnessLevels}
                  value={onboarding.fitnessLevel}
                  onChange={(v) => setOnboarding({ fitnessLevel: v })}
                  c={c}
                />
                <Pills
                  label="Where you prefer to work out"
                  options={locations}
                  value={onboarding.location}
                  onChange={(v) => setOnboarding({ location: v })}
                  c={c}
                />
                <Pills
                  label="How much time per week"
                  options={times}
                  value={onboarding.timePerWeek}
                  onChange={(v) => setOnboarding({ timePerWeek: v })}
                  c={c}
                />
                <div>
                  <div className="text-sm font-medium mb-3" style={{ color: c.textPrimary }}>
                    How do you feel about exercise?
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {confidenceLevels.map((conf) => {
                      const active = onboarding.confidence === conf.value;
                      return (
                        <button
                          key={conf.value}
                          onClick={() => setOnboarding({ confidence: conf.value })}
                          className={cn(
                            "flex flex-col items-center justify-center gap-1 h-14 rounded-xl border-2 transition-all active:scale-95",
                          )}
                          style={
                            active
                              ? { background: c.sunGlareBg, border: `1px solid ${c.sunGlare}66` }
                              : { background: c.chipBg, border: `1px solid transparent` }
                          }
                        >
                          <span
                            style={{
                              fontSize: "14px",
                              fontWeight: 700,
                              color: active ? c.sunGlare : c.textPrimary,
                            }}
                          >
                            {conf.value}
                          </span>
                          <span
                            style={{
                              fontSize: "10px",
                              lineHeight: 1.2,
                              color: active ? c.sunGlare : c.textSecondary,
                            }}
                          >
                            {conf.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" {...slide(direction)} className="space-y-7">
                <div>
                  <h1
                    className="text-3xl sm:text-4xl font-semibold"
                    style={{ color: c.textPrimary }}
                  >
                    We want to get this right
                  </h1>
                  <p className="mt-2" style={{ color: c.textSecondary }}>
                    This helps us personalize your experience.
                  </p>
                </div>
                <div>
                  <div className="text-sm font-medium mb-3" style={{ color: c.textPrimary }}>
                    Any physical considerations?
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {physicalOptions.map((p) => {
                      const active = onboarding.physical.includes(p);
                      return (
                        <button
                          key={p}
                          onClick={() => {
                            if (p === "None" || p === "Prefer not to say") {
                              setOnboarding({ physical: [p] });
                            } else {
                              const next = active
                                ? onboarding.physical.filter((x) => x !== p)
                                : [
                                    ...onboarding.physical.filter(
                                      (x) => x !== "None" && x !== "Prefer not to say",
                                    ),
                                    p,
                                  ];
                              setOnboarding({ physical: next });
                            }
                          }}
                          className={cn(
                            "px-4 py-2 rounded-full border-2 text-sm font-medium transition-all active:scale-95",
                          )}
                          style={
                            active
                              ? {
                                  background: c.textPrimary,
                                  color: c.appBg,
                                  border: `2px solid ${c.textPrimary}`,
                                }
                              : {
                                  background: c.chipBg,
                                  color: c.textPrimary,
                                  border: `2px solid transparent`,
                                }
                          }
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                  <ConditionDetailCards selected={onboarding.physical} c={c} />
                </div>
                <Pills
                  label="Social preference"
                  options={socialOptions}
                  value={onboarding.social}
                  onChange={(v) => setOnboarding({ social: v })}
                  c={c}
                />
                <div>
                  <label
                    className="text-sm font-medium mb-2 block"
                    style={{ color: c.textPrimary }}
                  >
                    Anything else we should know?
                  </label>
                  <textarea
                    placeholder="optional"
                    value={onboarding.notes}
                    onChange={(e) => setOnboarding({ notes: e.target.value })}
                    rows={3}
                    className="w-full rounded-xl px-4 py-3 text-sm resize-none focus:outline-none transition-all"
                    style={{
                      background: c.inputBg,
                      border: `1px solid ${c.inputBorder}`,
                      color: c.textPrimary,
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = `${c.sunGlare}66`)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
                  />
                </div>
              </motion.div>
            )}

            {step === 4 && loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-[60vh] flex flex-col items-center justify-center text-center"
              >
                <motion.div
                  className="w-24 h-24 rounded-full grid place-items-center mb-8"
                  style={{ background: c.sunGlareBg }}
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div
                    className="w-12 h-12 rounded-full"
                    style={{ background: c.sunGlare, boxShadow: `0 0 24px ${c.sunGlareBg}` }}
                  />
                </motion.div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={phraseIdx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="text-lg font-medium"
                    style={{ color: c.textSecondary }}
                  >
                    {phrases[phraseIdx]}
                  </motion.p>
                </AnimatePresence>
              </motion.div>
            )}

            {showResult && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1
                  className="text-3xl sm:text-4xl font-semibold mb-2"
                  style={{ color: c.textPrimary }}
                >
                  Here's what we think you'll love
                </h1>
                <p className="mb-8" style={{ color: c.textSecondary }}>
                  Three sports tuned to your answers.
                </p>
                <div className="space-y-3 mb-8">
                  {sportRecommendations.map((sport) => (
                    <SportRecCard
                      key={sport.id}
                      sport={sport}
                      onPick={() => {
                        setOnboarding({ pickedSportId: sport.id });
                        navigate({ to: "/dashboard" }).then(() => finishOnboarding());
                      }}
                      c={c}
                    />
                  ))}
                </div>
                <div className="mb-6">
                  <h3 className="font-semibold mb-3" style={{ color: c.textPrimary }}>
                    Your 4-week starter plan
                  </h3>
                  <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2">
                    {[1, 2, 3, 4].map((w) => {
                      const sportId = onboarding.pickedSportId || sportRecommendations[0].id;
                      const plan = generateDailyPlan(
                        false,
                        sportId,
                        [],
                        onboarding.goals as GoalId[],
                        { hasConditions: false },
                        onboarding.fitnessLevel,
                        undefined,
                        undefined,
                        undefined,
                        w,
                      ).workout;
                      const targetSessions = onboarding.weeklySessionTarget || 3;

                      return (
                        <div
                          key={w}
                          className="card-frosted shrink-0 w-44 p-4"
                          style={{ borderColor: c.divider }}
                        >
                          <div
                            className="text-xs uppercase tracking-wider mb-1"
                            style={{ color: c.textTertiary }}
                          >
                            Week {w}
                          </div>
                          <div
                            className="font-semibold text-sm mb-2"
                            style={{ color: c.textPrimary }}
                          >
                            {
                              ["Foundation", "Form & flow", "Build endurance", "Test yourself"][
                                w - 1
                              ]
                            }
                          </div>
                          <div className="text-xs" style={{ color: c.textSecondary }}>
                            {targetSessions} sessions · {plan.difficulty}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <button
                  onClick={() => navigate({ to: "/dashboard" }).then(() => finishOnboarding())}
                  className="text-sm underline underline-offset-4 block mx-auto transition-colors"
                  style={{ color: c.textSecondary }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = c.textPrimary)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = c.textSecondary)}
                >
                  I'll decide later
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {!loading && !showResult && (
        <div
          className="sticky bottom-0 backdrop-blur-xl px-5 py-4"
          style={{
            background: c.isDark ? "rgba(24,24,22,0.85)" : "rgba(244,243,238,0.85)",
            borderTop: `1px solid ${c.divider}`,
          }}
        >
          <div className="max-w-[480px] mx-auto">
            <button
              onClick={next}
              disabled={!canContinue}
              className={cn(
                "w-full h-[52px] rounded-full font-bold text-[15px] transition-all flex items-center justify-center gap-2 active:scale-[0.98]",
              )}
              style={
                canContinue
                  ? {
                      background: c.sunGlare,
                      color: "#1C1C1A",
                      boxShadow: `0 0 28px ${c.sunGlareBg}`,
                    }
                  : {
                      background: c.chipBg,
                      color: c.textDisabled,
                      cursor: "not-allowed",
                      border: `1px solid ${c.chipBorder}`,
                    }
              }
            >
              {step === 3 ? "Find my sports" : "Continue"} <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function slide(dir: number) {
  return {
    initial: { x: dir * 30, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: dir * -30, opacity: 0 },
    transition: { duration: 0.25, ease: "easeOut" as const },
  };
}

function Pills({
  label,
  options,
  value,
  onChange,
  c,
}: {
  label: string;
  options: string[];
  value?: string;
  onChange: (v: string) => void;
  c: ReturnType<typeof useColors>;
}) {
  return (
    <div>
      <div className="text-sm font-medium mb-3" style={{ color: c.textPrimary }}>
        {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value === o;
          return (
            <button
              key={o}
              onClick={() => onChange(o)}
              className={cn(
                "px-4 py-2 rounded-full border text-sm font-semibold transition-all active:scale-95",
              )}
              style={
                active
                  ? {
                      background: c.sunGlare,
                      color: "#1C1C1A",
                      border: "1px solid transparent",
                      boxShadow: `0 0 12px ${c.sunGlareBg}`,
                    }
                  : {
                      background: c.chipBg,
                      border: `1px solid ${c.chipBorder}`,
                      color: c.textSecondary,
                    }
              }
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SportRecCard({
  sport,
  onPick,
  c,
}: {
  sport: (typeof sportRecommendations)[0];
  onPick: () => void;
  c: ReturnType<typeof useColors>;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card-frosted p-5" style={{ borderColor: c.divider }}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-9 h-9 rounded-full text-[11px] font-black grid place-items-center"
              style={{
                background: c.sunGlareBg,
                color: c.sunGlare,
                border: `1px solid ${c.sunGlare}33`,
              }}
              aria-hidden
            >
              {getInitials(sport.name)}
            </span>
            <h3 className="text-[24px] font-black" style={{ color: c.textPrimary }}>
              {sport.name}
            </h3>
          </div>
          <p className="text-sm italic" style={{ color: c.textSecondary }}>
            {sport.reason}
          </p>
        </div>
        <span
          className="text-[10px] font-semibold px-2 py-1 rounded-full uppercase tracking-wider"
          style={{ background: c.textPrimary, color: c.appBg }}
        >
          {sport.difficulty}
        </span>
      </div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-xs flex items-center gap-1 mt-2 transition-colors"
        style={{ color: c.textSecondary }}
        onMouseEnter={(e) => (e.currentTarget.style.color = c.textPrimary)}
        onMouseLeave={(e) => (e.currentTarget.style.color = c.textSecondary)}
      >
        Why this?{" "}
        <ChevronDown size={12} className={cn("transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.p
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="text-sm mt-3 overflow-hidden"
            style={{ color: c.textSecondary }}
          >
            {sport.why}
          </motion.p>
        )}
      </AnimatePresence>
      <button
        onClick={onPick}
        className="w-full mt-4 h-11 rounded-xl font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all"
        style={{ background: c.sunGlare, color: "#1C1C1A", boxShadow: `0 0 16px ${c.sunGlareBg}` }}
      >
        Let's start with {sport.name}
      </button>
    </div>
  );
}

const conditionMeta: Record<
  string,
  {
    icon: ComponentType<{ size?: number; className?: string }>;
    subLabel?: string;
    subOptions?: string[];
    placeholder: string;
  }
> = {
  "Joint issues": {
    icon: Accessibility,
    subLabel: "Which joints?",
    subOptions: ["Knee", "Hip", "Shoulder", "Wrist", "Ankle", "Other"],
    placeholder: "e.g. deep squats, overhead press...",
  },
  "Back pain": {
    icon: Activity,
    subLabel: "Which area?",
    subOptions: ["Lower", "Upper", "Full back"],
    placeholder: "e.g. spinal flexion, heavy deadlifts...",
  },
  "Post-injury": {
    icon: ShieldAlert,
    subLabel: "Which body part?",
    placeholder: "Describe the area & current status...",
  },
  "Chronic condition": {
    icon: HeartPulse,
    subLabel: "What type?",
    subOptions: ["Diabetes", "Heart condition", "Asthma", "Other"],
    placeholder: "Any specific limits to mention...",
  },
};
const severities = ["mild", "moderate", "significant"] as const;

function ConditionDetailCards({
  selected,
  c,
}: {
  selected: string[];
  c: ReturnType<typeof useColors>;
}) {
  const details = useApp((s) => s.onboarding.physicalDetails);
  const set = useApp((s) => s.setPhysicalDetail);
  const conds = selected.filter((cond) => cond !== "None" && cond !== "Prefer not to say");
  return (
    <AnimatePresence>
      {conds.length > 0 && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="overflow-hidden mt-4"
        >
          {conds.map((condName) => {
            const meta = conditionMeta[condName];
            if (!meta) return null;
            const Icon = meta.icon;
            const d = details[condName] ?? {};
            const selectedSubs = (d.details?.values as string[]) ?? [];
            return (
              <div
                key={condName}
                className="card-frosted p-4 mb-3"
                style={{ borderColor: c.divider }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ color: c.textSecondary }}>
                    <Icon size={16} />
                  </span>
                  <span className="text-sm font-medium" style={{ color: c.textPrimary }}>
                    {condName}
                  </span>
                </div>
                {meta.subLabel && (
                  <div className="mb-3">
                    <div className="text-xs mb-2" style={{ color: c.textSecondary }}>
                      {meta.subLabel}
                    </div>
                    {meta.subOptions ? (
                      <div className="flex gap-2 flex-wrap">
                        {meta.subOptions.map((o) => {
                          const active = selectedSubs.includes(o);
                          return (
                            <button
                              key={o}
                              onClick={() => {
                                const next = active
                                  ? selectedSubs.filter((x) => x !== o)
                                  : [...selectedSubs, o];
                                set(condName, { details: { values: next } });
                              }}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                              )}
                              style={
                                active
                                  ? {
                                      background: c.sunGlare,
                                      color: "#1C1C1A",
                                      border: "1px solid transparent",
                                    }
                                  : {
                                      background: c.chipBg,
                                      border: `1px solid ${c.chipBorder}`,
                                      color: c.textSecondary,
                                    }
                              }
                            >
                              {o}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={(d.details?.text as string) ?? ""}
                        onChange={(e) => set(condName, { details: { text: e.target.value } })}
                        className="w-full h-10 border border-transparent rounded-lg px-3 text-sm focus:outline-none transition-colors"
                        style={{
                          background: c.inputBg,
                          color: c.textPrimary,
                          border: `1px solid ${c.inputBorder}`,
                        }}
                        placeholder="e.g. right knee, ACL recovery"
                        onFocus={(e) => (e.currentTarget.style.borderColor = `${c.sunGlare}66`)}
                        onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
                      />
                    )}
                  </div>
                )}
                <div className="mb-3">
                  <div className="text-xs mb-2" style={{ color: c.textSecondary }}>
                    Severity
                  </div>
                  <div className="flex gap-2">
                    {severities.map((s) => {
                      const active = d.severity === s;
                      return (
                        <button
                          key={s}
                          onClick={() => set(condName, { severity: s })}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-medium border transition-all capitalize",
                          )}
                          style={
                            active
                              ? {
                                  background: c.textPrimary,
                                  color: c.appBg,
                                  border: "1px solid transparent",
                                }
                              : {
                                  background: c.chipBg,
                                  color: c.textPrimary,
                                  border: `1px solid transparent`,
                                }
                          }
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <textarea
                  value={d.avoidances ?? ""}
                  onChange={(e) => set(condName, { avoidances: e.target.value })}
                  rows={2}
                  placeholder={meta.placeholder}
                  className="w-full rounded-lg px-3 py-2 text-sm resize-none min-h-[72px] focus:outline-none transition-colors"
                  style={{
                    background: c.inputBg,
                    color: c.textPrimary,
                    border: `1px solid ${c.inputBorder}`,
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = `${c.sunGlare}66`)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
                />
              </div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
