"use client";

import React, { useState, useCallback, useRef } from "react";
import { FiUploadCloud, FiFile, FiX, FiCheck } from "react-icons/fi";

interface FileDropzoneProps {
    onFileSelect: (file: File) => void;
    accept?: string;
    maxSize?: number; // in MB
    selectedFile?: File | null;
    onClear?: () => void;
}

export default function FileDropzone({
    onFileSelect,
    accept = ".pdf",
    maxSize = 5,
    selectedFile,
    onClear,
}: FileDropzoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const validateFile = useCallback(
        (file: File): boolean => {
            setError(null);

            // Check file type
            const acceptedTypes = accept.split(",").map((t) => t.trim());
            const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
            if (!acceptedTypes.some((t) => t === fileExtension || file.type.includes(t.replace(".", "")))) {
                setError(`Please upload a ${accept} file`);
                return false;
            }

            // Check file size
            const fileSizeMB = file.size / (1024 * 1024);
            if (fileSizeMB > maxSize) {
                setError(`File size must be less than ${maxSize}MB`);
                return false;
            }

            return true;
        },
        [accept, maxSize]
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            const file = e.dataTransfer.files[0];
            if (file && validateFile(file)) {
                onFileSelect(file);
            }
        },
        [onFileSelect, validateFile]
    );

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file && validateFile(file)) {
                onFileSelect(file);
            }
        },
        [onFileSelect, validateFile]
    );

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        setError(null);
        onClear?.();
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="w-full">
            <div
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragging
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : selectedFile
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                            : error
                                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    onChange={handleFileInput}
                    className="hidden"
                />

                {selectedFile ? (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                            <FiCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <FiFile className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {selectedFile.name}
                            </span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            {formatFileSize(selectedFile.size)}
                        </span>
                        <button
                            onClick={handleClear}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        >
                            <FiX className="w-4 h-4" />
                            Remove file
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDragging
                                    ? "bg-blue-100 dark:bg-blue-900/30"
                                    : "bg-gray-100 dark:bg-gray-800"
                                }`}
                        >
                            <FiUploadCloud
                                className={`w-8 h-8 ${isDragging
                                        ? "text-blue-600 dark:text-blue-400"
                                        : "text-gray-400 dark:text-gray-500"
                                    }`}
                            />
                        </div>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {isDragging ? "Drop your file here" : "Drag & drop your resume"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            or click to browse
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                                PDF
                            </span>
                            <span>Max {maxSize}MB</span>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                    <FiX className="w-4 h-4" />
                    {error}
                </p>
            )}
        </div>
    );
}
