"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface UseAutoSaveOptions {
    key: string;
    data: unknown;
    delay?: number;
    onSave?: () => void;
}

export function useAutoSave({ key, data, delay = 2000, onSave }: UseAutoSaveOptions) {
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isFirstRender = useRef(true);

    const save = useCallback(() => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            setLastSaved(new Date());
            onSave?.();
        } catch (error) {
            console.error("Auto-save failed:", error);
        }
        setIsSaving(false);
    }, [key, data, onSave]);

    useEffect(() => {
        // Skip first render to avoid saving initial/default data
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        setIsSaving(true);

        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout
        timeoutRef.current = setTimeout(save, delay);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [data, delay, save]);

    const forceSave = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        save();
    }, [save]);

    const clearSaved = useCallback(() => {
        try {
            localStorage.removeItem(key);
            setLastSaved(null);
        } catch (error) {
            console.error("Failed to clear saved data:", error);
        }
    }, [key]);

    const loadSaved = useCallback(() => {
        try {
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error("Failed to load saved data:", error);
            return null;
        }
    }, [key]);

    return {
        lastSaved,
        isSaving,
        forceSave,
        clearSaved,
        loadSaved,
    };
}
