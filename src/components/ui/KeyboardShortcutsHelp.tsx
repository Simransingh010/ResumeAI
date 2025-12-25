"use client";

import React from "react";
import { FiX, FiCommand } from "react-icons/fi";

interface Shortcut {
    keys: string[];
    description: string;
}

interface KeyboardShortcutsHelpProps {
    isOpen: boolean;
    onClose: () => void;
}

const shortcuts: { category: string; items: Shortcut[] }[] = [
    {
        category: "General",
        items: [
            { keys: ["⌘", "K"], description: "Open command palette" },
            { keys: ["⌘", "S"], description: "Save resume data" },
            { keys: ["⌘", "D"], description: "Download PDF" },
            { keys: ["Esc"], description: "Close dialogs" },
        ],
    },
    {
        category: "Editing",
        items: [
            { keys: ["⌘", "Z"], description: "Undo" },
            { keys: ["⌘", "⇧", "Z"], description: "Redo" },
        ],
    },
    {
        category: "Navigation",
        items: [
            { keys: ["Tab"], description: "Next field" },
            { keys: ["⇧", "Tab"], description: "Previous field" },
        ],
    },
];

export default function KeyboardShortcutsHelp({ isOpen, onClose }: KeyboardShortcutsHelpProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <FiCommand className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            Keyboard Shortcuts
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {shortcuts.map((group) => (
                        <div key={group.category} className="mb-6 last:mb-0">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                                {group.category}
                            </h3>
                            <div className="space-y-2">
                                {group.items.map((shortcut, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between py-2"
                                    >
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            {shortcut.description}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            {shortcut.keys.map((key, keyIndex) => (
                                                <kbd
                                                    key={keyIndex}
                                                    className="min-w-[24px] h-6 px-2 flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
                                                >
                                                    {key}
                                                </kbd>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 text-center">
                        Press <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">?</kbd> anytime to show this help
                    </p>
                </div>
            </div>
        </div>
    );
}
