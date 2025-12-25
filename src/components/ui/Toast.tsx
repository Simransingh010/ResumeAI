"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastData {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    toasts: ToastData[];
    addToast: (message: string, type?: ToastType) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}

interface ToastProviderProps {
    children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const addToast = useCallback((message: string, type: ToastType = "info") => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 5000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

interface ToastContainerProps {
    toasts: ToastData[];
    removeToast: (id: string) => void;
}

function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    );
}

interface ToastItemProps {
    toast: ToastData;
    onClose: () => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
    const icons = {
        success: <FiCheckCircle className="w-5 h-5 text-green-500" />,
        error: <FiXCircle className="w-5 h-5 text-red-500" />,
        warning: <FiAlertCircle className="w-5 h-5 text-yellow-500" />,
        info: <FiInfo className="w-5 h-5 text-blue-500" />,
    };

    const bgColors = {
        success: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
        error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
        warning: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
        info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    };

    return (
        <div
            className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-slide-in ${bgColors[toast.type]}`}
            role="alert"
        >
            <span className="flex-shrink-0">{icons[toast.type]}</span>
            <p className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                {toast.message}
            </p>
            <button
                onClick={onClose}
                className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                aria-label="Close notification"
            >
                <FiX className="w-4 h-4" />
            </button>
        </div>
    );
}

// Standalone Toast component for simple use cases
interface StandaloneToastProps {
    message: string;
    type?: ToastType;
    onClose: () => void;
    duration?: number;
}

export default function Toast({ message, type = "info", onClose, duration = 4000 }: StandaloneToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const icons = {
        success: <FiCheckCircle className="w-5 h-5 text-green-500" />,
        error: <FiXCircle className="w-5 h-5 text-red-500" />,
        warning: <FiAlertCircle className="w-5 h-5 text-yellow-500" />,
        info: <FiInfo className="w-5 h-5 text-blue-500" />,
    };

    const bgColors = {
        success: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
        error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
        warning: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
        info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    };

    return (
        <div className="fixed bottom-20 right-6 z-[100] max-w-sm animate-slide-in">
            <div
                className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg ${bgColors[type]}`}
                role="alert"
            >
                <span className="flex-shrink-0">{icons[type]}</span>
                <p className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {message}
                </p>
                <button
                    onClick={onClose}
                    className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    aria-label="Close notification"
                >
                    <FiX className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}