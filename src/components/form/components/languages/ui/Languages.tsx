"use client";

import React, { useContext } from "react";
import { ResumeContext } from "../../../../ResumeBuilder";

const Languages = () => {
  const { resumeData, setResumeData } = useContext(ResumeContext);

  const handleLanguages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const languages = e.target.value.split(",").map((lang) => lang.trim());
    setResumeData({ ...resumeData, languages });
  };

  return (
    <div className="flex-col-gap-2">
      <h2 className="input-title">Languages</h2>
      <input
        type="text"
        placeholder="Languages (comma separated)"
        className="w-full other-input"
        value={resumeData.languages ? resumeData.languages.join(", ") : ""}
        onChange={handleLanguages}
      />
    </div>
  );
};

export default Languages;
