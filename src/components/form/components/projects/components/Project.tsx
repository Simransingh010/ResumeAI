"use client";

import React, { useContext } from "react";
import { handleProject } from "../utils/handleProject";
import { ResumeContext } from "../../../../ResumeBuilder";
import { BsTrash3 } from "react-icons/bs";
import { removeProject } from "../utils/removeProject";
import { Project as ProjectType } from "@/types/resume";

interface ProjectProps {
  project: ProjectType;
  index: number;
}

const Project = ({ project, index }: ProjectProps) => {
  const { resumeData, setResumeData } = useContext(ResumeContext);

  return (
    <div className="flex w-fill gap-5 items-top">
      <div className="flex-wrap-gap-2">
        <input
          type="text"
          placeholder="Project Title"
          name="title"
          className="w-full mb-0 other-input"
          value={project.title}
          onChange={(e) => handleProject(resumeData, setResumeData, e, index)}
        />
        <textarea
          placeholder="Description"
          name="description"
          className="w-full mb-0 other-input h-20"
          value={project.description}
          onChange={(e: any) =>
            handleProject(resumeData, setResumeData, e, index)
          }
        />
        <textarea
          placeholder="Key Achievements (separate with line breaks)"
          name="keyAchievements"
          className="w-full mb-0 other-input h-32"
          value={project.keyAchievements}
          onChange={(e: any) =>
            handleProject(resumeData, setResumeData, e, index)
          }
        />
        <input
          type="date"
          placeholder="Start Date"
          name="startYear"
          className="w-full mb-0 other-input"
          value={project.startYear}
          onChange={(e) => handleProject(resumeData, setResumeData, e, index)}
        />
        <input
          type="date"
          placeholder="End Date"
          name="endYear"
          className="w-full mb-0 other-input"
          value={project.endYear}
          onChange={(e) => handleProject(resumeData, setResumeData, e, index)}
        />
      </div>
      <button
        type="button"
        onClick={() => {
          removeProject(resumeData, setResumeData, index);
        }}
        aria-label="Remove"
        className="p-2 text-white h-fit bg-fuchsia-700 rounded text-xl"
      >
        <BsTrash3 />
      </button>
    </div>
  );
};

export default Project;
