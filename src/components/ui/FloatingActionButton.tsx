"use client";

import React, { useState } from "react";
import { FiPlus, FiX, FiDownload, FiSave, FiCommand, FiHelpCircle } from "react-icons/fi";

interface Action {
    id: string;
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
}

interface FloatingActionButtonProps {
    actions: Action[];
}

export default function FloatingActionButton({ actions }: FloatingActionButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 left-6 z-50 exclude-print">
            {/* Action buttons */}
            <div
                className={`flex flex-col-reverse gap-3 mb-3 transition-all duration-300 ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
                    }`}
            >
                {actions.map((action) => (
                    <button
                        key={action.id}
                        onClick={() => {
                            action.onClick();
                            setIsOpen(false);
                        }}
                        className="group flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                    >
                        <span className="text-gray-600 dark:text-gray-400">{action.icon}</span>
                        <span className="pr-2 text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                            {action.label}
                        </span>
                    </button>
                ))}
            </div>

            {/* Main FAB */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${isOpen
                        ? "bg-gray-200 dark:bg-gray-700 rotate-45"
                        : "bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100"
                    }`}
            >
                {isOpen ? (
                    <FiX className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                ) : (
                    <FiPlus className="w-6 h-6 text-white dark:text-gray-900" />
                )}
            </button>
        </div>
    );
}

export { FiDownload, FiSave, FiCommand, FiHelpCircle };
