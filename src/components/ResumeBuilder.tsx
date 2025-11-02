"use client";

import React, { createContext, useState } from "react";
import Preview from "./preview/ui/Preview";
import DefaultResumeData from "./utility/DefaultResumeData";
import dynamic from "next/dynamic";
import Form from "./form/ui/Form";
import DownloadPdfButton from "./DownloadPdfButton";
import { ResumeData } from "@/types/resume";

// Define context type
interface ResumeContextType {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
  handleProfilePicture: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

// Create context with proper initial value
const ResumeContext = createContext<ResumeContextType>({
  resumeData: DefaultResumeData,
  setResumeData: () => { },
  handleProfilePicture: () => { },
  handleChange: () => { },
});

// server side rendering false
const Print = dynamic(() => import("./utility/WinPrint"), {
  ssr: false,
});

export default function ResumeBuilder() {
  // resume data - initialize with default data
  const [resumeData, setResumeData] = useState<ResumeData>(DefaultResumeData);

  // profile picture
  const handleProfilePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file instanceof Blob) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target?.result) {
          setResumeData({ ...resumeData, profilePicture: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    } else {
      console.error("Invalid file type");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setResumeData({ ...resumeData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <ResumeContext.Provider
        value={{
          resumeData,
          setResumeData,
          handleProfilePicture,
          handleChange,
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-screen bg-gray-50 dark:bg-gray-950">
          <div className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-8 overflow-y-auto h-screen exclude-print">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Resume Builder</h2>
              <Form />
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-950 p-8 overflow-y-auto h-screen sticky top-0">
            <Preview />
          </div>
        </div>
        <DownloadPdfButton resumeName={resumeData.name || "resume"} />
        <Print />
      </ResumeContext.Provider>
    </>
  );
}

export { ResumeContext };
