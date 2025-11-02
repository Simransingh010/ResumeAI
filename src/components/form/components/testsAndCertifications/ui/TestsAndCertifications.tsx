"use client";

import React, { useContext } from "react";
import { ResumeContext } from "../../../../ResumeBuilder";

const TestsAndCertifications = () => {
  const { resumeData, setResumeData } = useContext(ResumeContext);

  const handleCertifications = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const certifications = e.target.value
      .split("\n")
      .map((cert) => cert.trim())
      .filter((cert) => cert !== "");
    setResumeData({ ...resumeData, certifications });
  };

  return (
    <div className="flex-col-gap-2">
      <h2 className="input-title">Certifications</h2>
      <textarea
        placeholder="Certifications (one per line)"
        className="w-full other-input h-32"
        value={resumeData.certifications ? resumeData.certifications.join("\n") : ""}
        onChange={handleCertifications}
      />
    </div>
  );
};

export default TestsAndCertifications;
