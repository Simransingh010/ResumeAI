"use client";

import React, { useContext } from "react";
import { ResumeContext } from "../../../../ResumeBuilder";
import { BsTrash3 } from "react-icons/bs";
import { removeSkillGroup } from "../utils/removeSkillGroup";
import { handleSkillGroup } from "../utils/handleSkillGroup";
import { SkillGroup as SkillGroupType } from "@/types/resume";

interface SkillGroupProps {
  skillGroup: SkillGroupType;
  index: number;
}

const SkillGroup = ({ skillGroup, index }: SkillGroupProps) => {
  const { resumeData, setResumeData } = useContext(ResumeContext);

  return (
    <div className="flex w-fill gap-5 items-top">
      <div className="flex-wrap-gap-2">
        <input
          type="text"
          placeholder="Skill Category (e.g., Technical Skills)"
          name="title"
          className="w-full mb-0 other-input"
          value={skillGroup.title}
          onChange={(e) =>
            handleSkillGroup(resumeData, setResumeData, e, index, "title")
          }
        />
        <input
          type="text"
          placeholder="Skills (comma separated)"
          name="skills"
          className="w-full mb-0 other-input"
          value={skillGroup.skills.join(", ")}
          onChange={(e) =>
            handleSkillGroup(resumeData, setResumeData, e, index, "skills")
          }
        />
      </div>
      <button
        type="button"
        onClick={() => {
          removeSkillGroup(resumeData, setResumeData, index);
        }}
        aria-label="Remove"
        className="p-2 text-white h-fit bg-red-600 dark:bg-red-500 rounded text-xl hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
      >
        <BsTrash3 />
      </button>
    </div>
  );
};

export default SkillGroup;
