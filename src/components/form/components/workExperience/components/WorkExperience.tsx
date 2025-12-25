"use client";

import React, { useContext } from "react";
import { handleWorkExperience } from "../units/handleWorkExperience";
import { ResumeContext } from "../../../../ResumeBuilder";
import { BsTrash3 } from "react-icons/bs";
import { removeWorkExperience } from "../units/removeWorkExperience";
import { WorkExperience as WorkExperienceType } from "@/types/resume";

interface WorkExperienceProps {
  workExperience: WorkExperienceType;
  index: number;
}

const WorkExperience = ({ workExperience, index }: WorkExperienceProps) => {
  const { resumeData, setResumeData } = useContext(ResumeContext);

  return (
    <div className="flex w-fill gap-5 items-top">
      <div className="flex-wrap-gap-2">
        <input
          type="text"
          placeholder="Company"
          name="company"
          className="w-full mb-0 other-input"
          value={workExperience.company}
          onChange={(e) =>
            handleWorkExperience(resumeData, setResumeData, e, index)
          }
        />
        <input
          type="text"
          placeholder="Position"
          name="position"
          className="w-full mb-0 other-input"
          value={workExperience.position}
          onChange={(e) =>
            handleWorkExperience(resumeData, setResumeData, e, index)
          }
        />
        <textarea
          placeholder="Description"
          name="description"
          className="w-full mb-0 other-input h-20"
          value={workExperience.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            handleWorkExperience(resumeData, setResumeData, e, index)
          }
        />
        <textarea
          placeholder="Key Achievements (separate with line breaks)"
          name="keyAchievements"
          className="w-full mb-0 other-input h-32"
          value={workExperience.keyAchievements}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            handleWorkExperience(resumeData, setResumeData, e, index)
          }
        />
        <input
          type="date"
          placeholder="Start Date"
          name="startYear"
          className="w-full mb-0 other-input"
          value={workExperience.startYear}
          onChange={(e) =>
            handleWorkExperience(resumeData, setResumeData, e, index)
          }
        />
        <input
          type="date"
          placeholder="End Date"
          name="endYear"
          className="w-full mb-0 other-input"
          value={workExperience.endYear}
          onChange={(e) =>
            handleWorkExperience(resumeData, setResumeData, e, index)
          }
        />
      </div>
      <button
        type="button"
        onClick={() => {
          removeWorkExperience(resumeData, setResumeData, index);
        }}
        aria-label="Remove"
        className="p-2 text-white h-fit bg-red-600 dark:bg-red-500 rounded text-xl hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
      >
        <BsTrash3 />
      </button>
    </div>
  );
};

export default WorkExperience;
