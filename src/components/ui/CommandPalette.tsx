"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { FiSearch, FiCommand, FiDownload, FiSave, FiRotateCcw, FiRotateCw, FiPrinter, FiTrash2, FiSun, FiMoon } from "react-icons/fi";

interface Command {
    id: string;
    label: string;
    shortcut?: string;
    icon: React.ReactNode;
    action: () => void;
    category: string;
}

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    commands: Command[];
}

export default function CommandPalette({ isOpen, onClose, commands }: CommandPaletteProps) {
    const [search, setSearch] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const filteredCommands = commands.filter(
        (cmd) =>
            cmd.label.toLowerCase().includes(search.toLowerCase()) ||
            cmd.category.toLowerCase().includes(search.toLowerCase())
    );

    // Group commands by category
    const groupedCommands = filteredCommands.reduce((acc, cmd) => {
        if (!acc[cmd.category]) {
            acc[cmd.category] = [];
        }
        acc[cmd.category].push(cmd);
        return acc;
    }, {} as Record<string, Command[]>);

    useEffect(() => {
        if (isOpen) {
            setSearch("");
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    }, [isOpen]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [search]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1));
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setSelectedIndex((i) => Math.max(i - 1, 0));
                    break;
                case "Enter":
                    e.preventDefault();
                    if (filteredCommands[selectedIndex]) {
                        filteredCommands[selectedIndex].action();
                        onClose();
                    }
                    break;
                case "Escape":
                    e.preventDefault();
                    onClose();
                    break;
            }
        },
        [filteredCommands, selectedIndex, onClose]
    );

    // Scroll selected item into view
    useEffect(() => {
        const selectedElement = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
        selectedElement?.scrollIntoView({ block: "nearest" });
    }, [selectedIndex]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <FiSearch className="w-5 h-5 text-gray-400" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Type a command or search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none text-lg"
                    />
                    <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 rounded">
                        ESC
                    </kbd>
                </div>

                {/* Commands List */}
                <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-2">
                    {Object.entries(groupedCommands).length === 0 ? (
                        <div className="px-4 py-8 text-center text-gray-500">
                            No commands found
                        </div>
                    ) : (
                        Object.entries(groupedCommands).map(([category, cmds]) => (
                            <div key={category} className="mb-2">
                                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    {category}
                                </div>
                                {cmds.map((cmd) => {
                                    const globalIndex = filteredCommands.indexOf(cmd);
                                    return (
                                        <button
                                            key={cmd.id}
                                            data-index={globalIndex}
                                            onClick={() => {
                                                cmd.action();
                                                onClose();
                                            }}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${globalIndex === selectedIndex
                                                    ? "bg-gray-100 dark:bg-gray-800"
                                                    : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                                }`}
                                        >
                                            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                                {cmd.icon}
                                            </span>
                                            <span className="flex-1 text-left text-gray-900 dark:text-white font-medium">
                                                {cmd.label}
                                            </span>
                                            {cmd.shortcut && (
                                                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 rounded">
                                                    {cmd.shortcut}
                                                </kbd>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">↑↓</kbd>
                            Navigate
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">↵</kbd>
                            Select
                        </span>
                    </div>
                    <span className="flex items-center gap-1">
                        <FiCommand className="w-3 h-3" />K to open
                    </span>
                </div>
            </div>
        </div>
    );
}

export { FiDownload, FiSave, FiRotateCcw, FiRotateCw, FiPrinter, FiTrash2, FiSun, FiMoon };
