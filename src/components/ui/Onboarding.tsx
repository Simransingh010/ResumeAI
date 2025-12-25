"use client";

import React, { useState, useEffect } from "react";
import { FiX, FiArrowRight, FiArrowLeft, FiCheck } from "react-icons/fi";

interface OnboardingStep {
    title: string;
    description: string;
    icon: string;
    tip?: string;
}

const steps: OnboardingStep[] = [
    {
        title: "Welcome to Resume Builder",
        description: "Create a professional, ATS-optimized resume in minutes. Let's walk through the key features.",
        icon: "👋",
        tip: "Press ⌘K anytime to open the command palette",
    },
    {
        title: "Fill in Your Details",
        description: "Start with your personal information, then add your experience, education, and skills. The preview updates in real-time.",
        icon: "✍️",
        tip: "Your progress is tracked at the top of the form",
    },
    {
        title: "Auto-Save Enabled",
        description: "Don't worry about losing your work. We automatically save your progress every few seconds.",
        icon: "💾",
        tip: "Press ⌘S to manually save anytime",
    },
    {
        title: "Undo & Redo",
        description: "Made a mistake? Use undo (⌘Z) and redo (⌘⇧Z) to navigate through your changes.",
        icon: "↩️",
        tip: "The undo/redo buttons are in the top toolbar",
    },
    {
        title: "Download Your Resume",
        description: "When you're ready, click the Download PDF button to get your polished resume.",
        icon: "📄",
        tip: "Press ⌘D for quick download",
    },
];

interface OnboardingProps {
    onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = () => {
        setIsVisible(false);
        localStorage.setItem("atsense-onboarding-complete", "true");
        setTimeout(onComplete, 300);
    };

    const handleSkip = () => {
        handleComplete();
    };

    if (!isVisible) return null;

    const step = steps[currentStep];
    const isLastStep = currentStep === steps.length - 1;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
                {/* Progress bar */}
                <div className="h-1 bg-gray-200 dark:bg-gray-800">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                        style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    />
                </div>

                {/* Close button */}
                <button
                    onClick={handleSkip}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Skip onboarding"
                >
                    <FiX className="w-5 h-5" />
                </button>

                {/* Content */}
                <div className="p-8 pt-6">
                    {/* Icon */}
                    <div className="text-6xl mb-6 text-center">{step.icon}</div>

                    {/* Title */}
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white text-center mb-3">
                        {step.title}
                    </h2>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 text-center mb-6 leading-relaxed">
                        {step.description}
                    </p>

                    {/* Tip */}
                    {step.tip && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-6">
                            <p className="text-sm text-blue-700 dark:text-blue-400 text-center font-medium">
                                💡 {step.tip}
                            </p>
                        </div>
                    )}

                    {/* Step indicators */}
                    <div className="flex justify-center gap-2 mb-6">
                        {steps.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentStep(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentStep
                                        ? "w-6 bg-gray-900 dark:bg-white"
                                        : index < currentStep
                                            ? "bg-gray-400 dark:bg-gray-600"
                                            : "bg-gray-200 dark:bg-gray-700"
                                    }`}
                                aria-label={`Go to step ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between gap-4">
                        <button
                            onClick={handlePrev}
                            disabled={currentStep === 0}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <FiArrowLeft className="w-4 h-4" />
                            Back
                        </button>

                        <button
                            onClick={handleNext}
                            className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-semibold hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors"
                        >
                            {isLastStep ? (
                                <>
                                    Get Started
                                    <FiCheck className="w-4 h-4" />
                                </>
                            ) : (
                                <>
                                    Next
                                    <FiArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Hook to check if onboarding should be shown
export function useOnboarding() {
    const [showOnboarding, setShowOnboarding] = useState(false);

    useEffect(() => {
        const completed = localStorage.getItem("atsense-onboarding-complete");
        if (!completed) {
            setShowOnboarding(true);
        }
    }, []);

    const completeOnboarding = () => {
        setShowOnboarding(false);
    };

    const resetOnboarding = () => {
        localStorage.removeItem("atsense-onboarding-complete");
        setShowOnboarding(true);
    };

    return { showOnboarding, completeOnboarding, resetOnboarding };
}
