"use client";

import React, { useContext } from "react";
import { handleEducation } from "../units/handleEducation";
import { ResumeContext } from "../../../../ResumeBuilder";
import { BsTrash3 } from "react-icons/bs";
import { removeEducation } from "../units/removeEducation";
import { Education as EducationType } from "@/types/resume";

interface EducationProps {
  education: EducationType;
  index: number;
}

const Education = ({ education, index }: EducationProps) => {
  const { resumeData, setResumeData } = useContext(ResumeContext);

  return (
    <div className="flex w-fill gap-5 items-top">
      <div className="flex-wrap-gap-2">
        <input
          type="text"
          placeholder="Degree"
          name="school"
          className="w-full mb-0 other-input"
          value={education.school}
          onChange={(e) => handleEducation(resumeData, setResumeData, e, index)}
        />
        <input
          type="text"
          placeholder="Institution"
          name="degree"
          className="w-full mb-0 other-input"
          value={education.degree}
          onChange={(e) => handleEducation(resumeData, setResumeData, e, index)}
        />
        <input
          type="date"
          placeholder="Start Date"
          name="startYear"
          className="w-full mb-0 other-input"
          value={education.startYear}
          onChange={(e) => handleEducation(resumeData, setResumeData, e, index)}
        />
        <input
          type="date"
          placeholder="End Date"
          name="endYear"
          className="w-full mb-0 other-input"
          value={education.endYear}
          onChange={(e) => handleEducation(resumeData, setResumeData, e, index)}
        />
      </div>
      <button
        type="button"
        onClick={() => {
          removeEducation(resumeData, setResumeData, index);
        }}
        aria-label="Remove"
        className="p-2 text-white h-fit bg-fuchsia-700 rounded text-xl"
      >
        <BsTrash3 />
      </button>
    </div>
  );
};

export default Education;
