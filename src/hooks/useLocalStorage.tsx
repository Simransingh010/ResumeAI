"use client";

import { useState, useEffect, useCallback } from "react";

type SetValue<T> = T | ((prevValue: T) => T);

export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: SetValue<T>) => void, () => void] {
    // State to store our value
    const [storedValue, setStoredValue] = useState<T>(initialValue);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize from localStorage on mount
    useEffect(() => {
        if (typeof window === "undefined") return;

        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                setStoredValue(JSON.parse(item));
            }
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
        }
        setIsInitialized(true);
    }, [key]);

    // Return a wrapped version of useState's setter function that persists to localStorage
    const setValue = useCallback(
        (value: SetValue<T>) => {
            try {
                // Allow value to be a function so we have same API as useState
                const valueToStore =
                    value instanceof Function ? value(storedValue) : value;

                setStoredValue(valueToStore);

                if (typeof window !== "undefined") {
                    window.localStorage.setItem(key, JSON.stringify(valueToStore));
                }
            } catch (error) {
                console.warn(`Error setting localStorage key "${key}":`, error);
            }
        },
        [key, storedValue]
    );

    // Remove from localStorage
    const removeValue = useCallback(() => {
        try {
            setStoredValue(initialValue);
            if (typeof window !== "undefined") {
                window.localStorage.removeItem(key);
            }
        } catch (error) {
            console.warn(`Error removing localStorage key "${key}":`, error);
        }
    }, [key, initialValue]);

    // Return initial value during SSR
    if (!isInitialized) {
        return [initialValue, setValue, removeValue];
    }

    return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
