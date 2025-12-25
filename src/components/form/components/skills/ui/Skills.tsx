"use client";

import React, { useContext } from "react";
import { ResumeContext } from "../../../../ResumeBuilder";
import { addSkillGroup } from "../utils/addSkillGroup";
import SkillGroup from "../components/SkillGroup";
import { MdAddCircle } from "react-icons/md";

const Skills = () => {
  const { resumeData, setResumeData } = useContext(ResumeContext);

  return (
    <div className="flex-col-gap-2">
      <h2 className="input-title">Skills</h2>
      {resumeData.skills && resumeData.skills.map((skillGroup, index) => (
        <SkillGroup key={index} skillGroup={skillGroup} index={index} />
      ))}
      <button
        type="button"
        onClick={() => {
          addSkillGroup(resumeData, setResumeData);
        }}
        aria-label="Add Skill Group"
        className="p-2 w-[37px] text-white bg-gray-900 dark:bg-purple-500 rounded text-xl hover:bg-gray-700 dark:hover:bg-purple-600 transition-colors"
      >
        <MdAddCircle />
      </button>
    </div>
  );
};

export default Skills;
