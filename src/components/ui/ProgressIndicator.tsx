"use client";

import React from "react";
import { FiCheck, FiCircle } from "react-icons/fi";

interface Section {
    id: string;
    label: string;
    isComplete: boolean;
}

interface ProgressIndicatorProps {
    sections: Section[];
    currentSection?: string;
    onSectionClick?: (sectionId: string) => void;
}

export default function ProgressIndicator({
    sections,
    currentSection,
    onSectionClick,
}: ProgressIndicatorProps) {
    const completedCount = sections.filter((s) => s.isComplete).length;
    const progress = (completedCount / sections.length) * 100;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-800 p-4 mb-6">
            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    Resume Progress
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {completedCount}/{sections.length} sections
                </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
                <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Section Pills */}
            <div className="flex flex-wrap gap-2">
                {sections.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => onSectionClick?.(section.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${section.isComplete
                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                : currentSection === section.id
                                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                    >
                        {section.isComplete ? (
                            <FiCheck className="w-3 h-3" />
                        ) : (
                            <FiCircle className="w-3 h-3" />
                        )}
                        {section.label}
                    </button>
                ))}
            </div>

            {/* Completion Message */}
            {progress === 100 && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
                        <span className="text-lg">🎉</span>
                        All sections complete! Your resume is ready to download.
                    </p>
                </div>
            )}
        </div>
    );
}
