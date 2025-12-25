"use client";

import { useState, useCallback, useRef } from "react";

interface UseUndoRedoOptions {
    maxHistory?: number;
}

export function useUndoRedo<T>(
    initialState: T,
    options: UseUndoRedoOptions = {}
) {
    const { maxHistory = 50 } = options;

    const [state, setState] = useState<T>(initialState);
    const historyRef = useRef<T[]>([initialState]);
    const indexRef = useRef(0);
    const isUndoRedoRef = useRef(false);

    const set = useCallback(
        (newState: T | ((prev: T) => T)) => {
            const resolvedState =
                typeof newState === "function"
                    ? (newState as (prev: T) => T)(state)
                    : newState;

            // Don't add to history if this is an undo/redo operation
            if (isUndoRedoRef.current) {
                setState(resolvedState);
                return;
            }

            // Remove any future states if we're not at the end
            const newHistory = historyRef.current.slice(0, indexRef.current + 1);

            // Add new state
            newHistory.push(resolvedState);

            // Limit history size
            if (newHistory.length > maxHistory) {
                newHistory.shift();
            } else {
                indexRef.current++;
            }

            historyRef.current = newHistory;
            setState(resolvedState);
        },
        [state, maxHistory]
    );

    const undo = useCallback(() => {
        if (indexRef.current > 0) {
            indexRef.current--;
            isUndoRedoRef.current = true;
            setState(historyRef.current[indexRef.current]);
            isUndoRedoRef.current = false;
            return true;
        }
        return false;
    }, []);

    const redo = useCallback(() => {
        if (indexRef.current < historyRef.current.length - 1) {
            indexRef.current++;
            isUndoRedoRef.current = true;
            setState(historyRef.current[indexRef.current]);
            isUndoRedoRef.current = false;
            return true;
        }
        return false;
    }, []);

    const canUndo = indexRef.current > 0;
    const canRedo = indexRef.current < historyRef.current.length - 1;

    const reset = useCallback((newState: T) => {
        historyRef.current = [newState];
        indexRef.current = 0;
        setState(newState);
    }, []);

    return {
        state,
        set,
        undo,
        redo,
        canUndo,
        canRedo,
        reset,
        historyLength: historyRef.current.length,
        currentIndex: indexRef.current,
    };
}
