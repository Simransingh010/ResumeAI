"use client";

import React, { useState } from "react";
import { FiChevronDown, FiChevronUp, FiHelpCircle } from "react-icons/fi";
import Tooltip from "./Tooltip";

interface FormSectionProps {
    title: string;
    description?: string;
    tip?: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    badge?: string;
}

export default function FormSection({
    title,
    description,
    tip,
    children,
    defaultOpen = true,
    badge,
}: FormSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        {title}
                    </h2>
                    {badge && (
                        <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                            {badge}
                        </span>
                    )}
                    {tip && (
                        <Tooltip content={tip} position="right">
                            <FiHelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" />
                        </Tooltip>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {description && !isOpen && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                            {description}
                        </span>
                    )}
                    {isOpen ? (
                        <FiChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                        <FiChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                </div>
            </button>

            {/* Content */}
            {isOpen && (
                <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700">
                    {description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            {description}
                        </p>
                    )}
                    {children}
                </div>
            )}
        </div>
    );
}
