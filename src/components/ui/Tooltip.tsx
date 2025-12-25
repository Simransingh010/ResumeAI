"use client";

import React, { useState, useRef, useEffect } from "react";

interface TooltipProps {
    content: React.ReactNode;
    children: React.ReactNode;
    position?: "top" | "bottom" | "left" | "right";
    delay?: number;
}

export default function Tooltip({
    content,
    children,
    position = "top",
    delay = 200,
}: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const showTooltip = () => {
        timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
    };

    const hideTooltip = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const positionClasses = {
        top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
        left: "right-full top-1/2 -translate-y-1/2 mr-2",
        right: "left-full top-1/2 -translate-y-1/2 ml-2",
    };

    const arrowClasses = {
        top: "top-full left-1/2 -translate-x-1/2 border-t-gray-900 dark:border-t-gray-100 border-x-transparent border-b-transparent",
        bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 dark:border-b-gray-100 border-x-transparent border-t-transparent",
        left: "left-full top-1/2 -translate-y-1/2 border-l-gray-900 dark:border-l-gray-100 border-y-transparent border-r-transparent",
        right: "right-full top-1/2 -translate-y-1/2 border-r-gray-900 dark:border-r-gray-100 border-y-transparent border-l-transparent",
    };

    return (
        <div
            className="relative inline-flex"
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
            onFocus={showTooltip}
            onBlur={hideTooltip}
        >
            {children}
            {isVisible && (
                <div
                    ref={tooltipRef}
                    role="tooltip"
                    className={`absolute z-50 px-3 py-2 text-sm font-medium text-white dark:text-gray-900 bg-gray-900 dark:bg-gray-100 rounded-lg shadow-lg whitespace-nowrap ${positionClasses[position]} animate-fade-in`}
                >
                    {content}
                    <div
                        className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`}
                    />
                </div>
            )}
        </div>
    );
}
