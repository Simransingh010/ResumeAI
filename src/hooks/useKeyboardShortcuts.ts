"use client";

import { useEffect, useCallback } from "react";

interface ShortcutConfig {
    key: string;
    ctrl?: boolean;
    meta?: boolean;
    shift?: boolean;
    alt?: boolean;
    callback: () => void;
    description: string;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            // Don't trigger shortcuts when typing in inputs
            const target = event.target as HTMLElement;
            if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.isContentEditable
            ) {
                // Allow Escape key even in inputs
                if (event.key !== "Escape") return;
            }

            for (const shortcut of shortcuts) {
                const ctrlMatch = shortcut.ctrl ? event.ctrlKey : !event.ctrlKey;
                const metaMatch = shortcut.meta ? event.metaKey : !event.metaKey;
                const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
                const altMatch = shortcut.alt ? event.altKey : !event.altKey;
                const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

                // For Mac, treat meta as ctrl for common shortcuts
                const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
                const ctrlOrMeta = shortcut.ctrl
                    ? isMac
                        ? event.metaKey
                        : event.ctrlKey
                    : true;

                if (
                    keyMatch &&
                    (shortcut.ctrl ? ctrlOrMeta : ctrlMatch && metaMatch) &&
                    shiftMatch &&
                    altMatch
                ) {
                    event.preventDefault();
                    shortcut.callback();
                    break;
                }
            }
        },
        [shortcuts]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    return shortcuts;
}

export const SHORTCUT_LABELS = {
    save: "⌘S / Ctrl+S",
    undo: "⌘Z / Ctrl+Z",
    redo: "⌘⇧Z / Ctrl+Shift+Z",
    download: "⌘D / Ctrl+D",
    commandPalette: "⌘K / Ctrl+K",
    escape: "Esc",
};
