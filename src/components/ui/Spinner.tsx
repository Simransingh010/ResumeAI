"use client";

import React from "react";

interface SpinnerProps {
    size?: "sm" | "md" | "lg";
    className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = "md", className = "" }) => {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-8 h-8",
        lg: "w-12 h-12",
    };

    return (
        <div
            className={`inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent ${sizeClasses[size]} ${className}`}
            role="status"
            aria-label="Loading"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default Spinner;
