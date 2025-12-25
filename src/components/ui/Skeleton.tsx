"use client";

import React from "react";

interface SkeletonProps {
    className?: string;
    variant?: "text" | "circular" | "rectangular";
    width?: string | number;
    height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    className = "",
    variant = "rectangular",
    width,
    height,
}) => {
    const baseClasses = "animate-pulse bg-gray-200 dark:bg-gray-700";

    const variantClasses = {
        text: "rounded",
        circular: "rounded-full",
        rectangular: "rounded-lg",
    };

    const style: React.CSSProperties = {
        width: width ?? "100%",
        height: height ?? (variant === "text" ? "1em" : "100%"),
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
            aria-hidden="true"
        />
    );
};

export const CardSkeleton: React.FC = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6">
        <Skeleton height={48} className="mb-4" />
        <Skeleton variant="text" height={20} className="mb-2" />
        <Skeleton variant="text" height={20} width="80%" />
    </div>
);

export const FormSkeleton: React.FC = () => (
    <div className="space-y-4">
        <Skeleton height={40} />
        <Skeleton height={40} />
        <Skeleton height={100} />
        <Skeleton height={48} width={120} />
    </div>
);

export const AnalysisSkeleton: React.FC = () => (
    <div className="space-y-8">
        <div className="text-center py-12">
            <Skeleton variant="text" height={60} width="60%" className="mx-auto mb-4" />
            <Skeleton variant="text" height={24} width="80%" className="mx-auto mb-8" />
            <Skeleton variant="circular" width={120} height={120} className="mx-auto" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    </div>
);

export default Skeleton;
