"use client";

import { FaCloudUploadAlt, FaCloudDownloadAlt } from "react-icons/fa";
import React, { useContext } from "react";
import { ResumeContext } from "../../ResumeBuilder";

const LoadUnload = () => {
  const { resumeData, setResumeData } = useContext(ResumeContext);

  const handleLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const resumeData = JSON.parse(event.target?.result as string);
      setResumeData(resumeData);
    };
    reader.readAsText(file);
  };

  const handleDownload = (
    data: unknown,
    filename: string,
    event: React.MouseEvent
  ) => {
    event.preventDefault();
    const jsonData = JSON.stringify(data);
    const blob = new Blob([jsonData], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6 justify-start">
      <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg cursor-pointer hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors font-semibold">
        <FaCloudUploadAlt className="text-lg" />
        <span>Load Data</span>
        <input
          aria-label="Load Data"
          type="file"
          className="hidden"
          onChange={handleLoad}
          accept=".json"
        />
      </label>
      <button
        aria-label="Save Data"
        className="inline-flex items-center gap-2 px-4 py-2 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-semibold"
        onClick={(event) =>
          handleDownload(
            resumeData,
            resumeData.name + " by ATSResume.json",
            event
          )
        }
      >
        <FaCloudDownloadAlt className="text-lg" />
        <span>Save Data</span>
      </button>
    </div>
  );
};

export default LoadUnload;
