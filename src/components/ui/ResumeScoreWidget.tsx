"use client";

import React, { useMemo } from "react";
import { ResumeData } from "@/types/resume";
import { FiCheckCircle, FiInfo } from "react-icons/fi";

interface ResumeScoreWidgetProps {
    resumeData: ResumeData;
}

interface ScoreItem {
    label: string;
    score: number;
    maxScore: number;
    tip?: string;
}

export default function ResumeScoreWidget({ resumeData }: ResumeScoreWidgetProps) {
    const scores = useMemo(() => {
        const items: ScoreItem[] = [];

        // Personal Info Score (20 points max)
        let personalScore = 0;
        if (resumeData.name && resumeData.name.length > 2) personalScore += 5;
        if (resumeData.email && resumeData.email.includes("@")) personalScore += 5;
        if (resumeData.contactInformation) personalScore += 5;
        if (resumeData.address) personalScore += 3;
        if (resumeData.socialMedia && resumeData.socialMedia.length > 0) personalScore += 2;
        items.push({
            label: "Contact Info",
            score: personalScore,
            maxScore: 20,
            tip: personalScore < 15 ? "Add email, phone, and LinkedIn" : undefined,
        });

        // Summary Score (15 points max)
        let summaryScore = 0;
        if (resumeData.summary) {
            const wordCount = resumeData.summary.split(/\s+/).length;
            if (wordCount >= 30) summaryScore += 10;
            else if (wordCount >= 15) summaryScore += 5;
            if (wordCount <= 100) summaryScore += 5; // Not too long
        }
        items.push({
            label: "Summary",
            score: summaryScore,
            maxScore: 15,
            tip: summaryScore < 10 ? "Write a 30-100 word professional summary" : undefined,
        });

        // Experience Score (25 points max)
        let expScore = 0;
        if (resumeData.workExperience && resumeData.workExperience.length > 0) {
            expScore += Math.min(resumeData.workExperience.length * 5, 15);
            const hasAchievements = resumeData.workExperience.some(
                (exp) => exp.keyAchievements && exp.keyAchievements.length > 20
            );
            if (hasAchievements) expScore += 10;
        }
        items.push({
            label: "Experience",
            score: expScore,
            maxScore: 25,
            tip: expScore < 15 ? "Add work experience with achievements" : undefined,
        });

        // Education Score (15 points max)
        let eduScore = 0;
        if (resumeData.education && resumeData.education.length > 0) {
            eduScore += Math.min(resumeData.education.length * 8, 15);
        }
        items.push({
            label: "Education",
            score: eduScore,
            maxScore: 15,
            tip: eduScore < 8 ? "Add your educational background" : undefined,
        });

        // Skills Score (15 points max)
        let skillsScore = 0;
        if (resumeData.skills && resumeData.skills.length > 0) {
            const totalSkills = resumeData.skills.reduce(
                (acc, group) => acc + group.skills.length,
                0
            );
            skillsScore += Math.min(totalSkills * 2, 15);
        }
        items.push({
            label: "Skills",
            score: skillsScore,
            maxScore: 15,
            tip: skillsScore < 10 ? "Add relevant technical and soft skills" : undefined,
        });

        // Extras Score (10 points max)
        let extrasScore = 0;
        if (resumeData.languages && resumeData.languages.length > 0) extrasScore += 3;
        if (resumeData.certifications && resumeData.certifications.length > 0) extrasScore += 4;
        if (resumeData.projects && resumeData.projects.length > 0) extrasScore += 3;
        items.push({
            label: "Extras",
            score: extrasScore,
            maxScore: 10,
            tip: extrasScore < 5 ? "Add certifications, languages, or projects" : undefined,
        });

        return items;
    }, [resumeData]);

    const totalScore = scores.reduce((acc, item) => acc + item.score, 0);
    const maxScore = scores.reduce((acc, item) => acc + item.maxScore, 0);
    const percentage = Math.round((totalScore / maxScore) * 100);

    const getGrade = () => {
        if (percentage >= 80) return { letter: "A", color: "text-green-600", bg: "bg-green-500" };
        if (percentage >= 60) return { letter: "B", color: "text-blue-600", bg: "bg-blue-500" };
        if (percentage >= 40) return { letter: "C", color: "text-yellow-600", bg: "bg-yellow-500" };
        return { letter: "D", color: "text-red-600", bg: "bg-red-500" };
    };

    const grade = getGrade();
    const tips = scores.filter((s) => s.tip).map((s) => s.tip!);

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-800 p-4 mb-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    Resume Score
                </h3>
                <div className="flex items-center gap-2">
                    <span className={`text-2xl font-black ${grade.color}`}>{grade.letter}</span>
                    <span className="text-sm text-gray-500">{percentage}%</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
                <div
                    className={`h-full ${grade.bg} rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {/* Score Breakdown */}
            <div className="space-y-2 mb-4">
                {scores.map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                        <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all ${item.score / item.maxScore >= 0.7
                                        ? "bg-green-500"
                                        : item.score / item.maxScore >= 0.4
                                            ? "bg-yellow-500"
                                            : "bg-red-500"
                                        }`}
                                    style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                                />
                            </div>
                            <span className="text-gray-500 w-8 text-right">
                                {item.score}/{item.maxScore}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tips */}
            {tips.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <div className="flex items-start gap-2">
                        <FiInfo className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                            <span className="font-semibold">Quick wins:</span>{" "}
                            {tips.slice(0, 2).join(". ")}
                        </div>
                    </div>
                </div>
            )}

            {/* Success Message */}
            {percentage >= 80 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <FiCheckCircle className="w-4 h-4" />
                        <span className="text-xs font-semibold">Great job! Your resume looks solid.</span>
                    </div>
                </div>
            )}
        </div>
    );
}
