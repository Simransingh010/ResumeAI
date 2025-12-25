"use client";

import React, { forwardRef, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            variant = "primary",
            size = "md",
            isLoading = false,
            leftIcon,
            rightIcon,
            className = "",
            disabled,
            ...props
        },
        ref
    ) => {
        const baseClasses =
            "inline-flex items-center justify-center font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

        const variantClasses = {
            primary:
                "bg-gray-900 text-white hover:bg-gray-700 focus:ring-gray-500 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100",
            secondary:
                "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700",
            outline:
                "border-2 border-gray-900 text-gray-900 hover:bg-gray-100 focus:ring-gray-500 dark:border-white dark:text-white dark:hover:bg-gray-800",
            ghost:
                "text-gray-700 hover:bg-gray-100 focus:ring-gray-300 dark:text-gray-300 dark:hover:bg-gray-800",
            danger:
                "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600",
        };

        const sizeClasses = {
            sm: "px-3 py-1.5 text-sm gap-1.5",
            md: "px-4 py-2 text-base gap-2",
            lg: "px-6 py-3 text-lg gap-2.5",
        };

        return (
            <button
                ref={ref}
                className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <>
                        <svg
                            className="animate-spin h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        <span>Loading...</span>
                    </>
                ) : (
                    <>
                        {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
                        {children}
                        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
                    </>
                )}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;
