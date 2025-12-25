"use client";

import React, { forwardRef, TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
    showCount?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, helperText, showCount, className = "", id, maxLength, value, ...props }, ref) => {
        const textareaId = id || props.name;
        const currentLength = typeof value === "string" ? value.length : 0;

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1.5"
                    >
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={textareaId}
                    value={value}
                    maxLength={maxLength}
                    className={`
            w-full px-3 py-2.5 
            text-gray-900 dark:text-gray-100 
            bg-gray-50 dark:bg-gray-900 
            border-2 rounded-lg
            transition-colors duration-200
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            focus:outline-none focus:bg-white dark:focus:bg-gray-800
            resize-y min-h-[100px]
            ${error
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-200 dark:border-gray-700 focus:border-gray-900 dark:focus:border-gray-100"
                        }
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
                    {...props}
                />
                <div className="flex justify-between items-center mt-1.5">
                    <div>
                        {error && (
                            <p id={`${textareaId}-error`} className="text-sm text-red-500" role="alert">
                                {error}
                            </p>
                        )}
                        {helperText && !error && (
                            <p id={`${textareaId}-helper`} className="text-sm text-gray-500 dark:text-gray-400">
                                {helperText}
                            </p>
                        )}
                    </div>
                    {showCount && maxLength && (
                        <span className="text-sm text-gray-400 dark:text-gray-500">
                            {currentLength}/{maxLength}
                        </span>
                    )}
                </div>
            </div>
        );
    }
);

Textarea.displayName = "Textarea";

export default Textarea;
