"use client";

import ResumeBuilder from "@/components/ResumeBuilder";
import Onboarding, { useOnboarding } from "@/components/ui/Onboarding";

export default function BuildResumePage() {
  const { showOnboarding, completeOnboarding } = useOnboarding();

  return (
    <div className="min-h-screen">
      <ResumeBuilder />
      {showOnboarding && <Onboarding onComplete={completeOnboarding} />}
    </div>
  );
}
