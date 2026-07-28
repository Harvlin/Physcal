import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { useApp } from "@/lib/store";
import { TutorialShell } from "@/components/tutorial/TutorialShell";
import { Slide01Welcome } from "@/components/tutorial/slides/Slide01Welcome";
import { Slide02Plan } from "@/components/tutorial/slides/Slide02Plan";
import { Slide03Checkin } from "@/components/tutorial/slides/Slide03Checkin";
import { Slide04FocusMode } from "@/components/tutorial/slides/Slide04FocusMode";
import { Slide05Chat } from "@/components/tutorial/slides/Slide05Chat";
import { Slide06Analysis } from "@/components/tutorial/slides/Slide06Analysis";
import { Slide07Badges } from "@/components/tutorial/slides/Slide07Badges";
import { Slide08Community } from "@/components/tutorial/slides/Slide08Community";
import { Slide09Profile } from "@/components/tutorial/slides/Slide09Profile";
import { Slide10Safety } from "@/components/tutorial/slides/Slide10Safety";
import { Slide11Ready } from "@/components/tutorial/slides/Slide11Ready";

const searchSchema = z.object({
  from: z.enum(["onboarding", "profile"]).optional().default("profile"),
});

export const Route = createFileRoute("/tutorial")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "How Physcal Works — App Tour" },
      { name: "description", content: "A guided interactive tour of every Physcal feature." },
    ],
  }),
  component: TutorialPage,
});

const TOTAL = 11;

function TutorialPage() {
  const { from } = Route.useSearch();
  const navigate = useNavigate();
  const setHasSeenTutorial = useApp((s) => s.setHasSeenTutorial);

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const isLast = step === TOTAL - 1;
  const fromOnboarding = from === "onboarding";

  const finishAndExit = () => {
    setHasSeenTutorial(true);
    if (fromOnboarding) {
      navigate({ to: "/dashboard" });
    } else {
      navigate({ to: "/profile" });
    }
  };

  const next = () => {
    if (isLast) {
      finishAndExit();
      return;
    }
    setDirection(1);
    setStep((s) => s + 1);
  };

  const back = () => {
    if (step === 0) return;
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const nextLabel = isLast
    ? fromOnboarding
      ? "Let's start →"
      : "Back to profile →"
    : step === 0
      ? "Show me around"
      : "Next";

  const slides = [
    <Slide01Welcome />,
    <Slide02Plan />,
    <Slide03Checkin />,
    <Slide04FocusMode />,
    <Slide05Chat />,
    <Slide06Analysis />,
    <Slide07Badges />,
    <Slide08Community />,
    <Slide09Profile />,
    <Slide10Safety />,
    <Slide11Ready fromOnboarding={fromOnboarding} />,
  ];

  return (
    <TutorialShell
      step={step}
      direction={direction}
      onNext={next}
      onBack={back}
      onSkip={finishAndExit}
      nextLabel={nextLabel}
    >
      {slides[step]}
    </TutorialShell>
  );
}
