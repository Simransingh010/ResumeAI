"use client";

import React, { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, className = "", id, ...props }, ref) => {
        const inputId = id || props.name;

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1.5"
                    >
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={`
            w-full px-3 py-2.5 
            text-gray-900 dark:text-gray-100 
            bg-gray-50 dark:bg-gray-900 
            border-2 rounded-lg
            transition-colors duration-200
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            focus:outline-none focus:bg-white dark:focus:bg-gray-800
            ${error
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-200 dark:border-gray-700 focus:border-gray-900 dark:focus:border-gray-100"
                        }
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
                    {...props}
                />
                {error && (
                    <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-500" role="alert">
                        {error}
                    </p>
                )}
                {helperText && !error && (
                    <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
