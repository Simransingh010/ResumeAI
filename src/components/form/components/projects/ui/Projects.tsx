"use client";

import React, { useContext } from "react";
import { ResumeContext } from "../../../../ResumeBuilder";
import { addProject } from "../utils/addProject";
import Project from "../components/Project";
import { MdAddCircle } from "react-icons/md";

const Projects = () => {
  const { resumeData, setResumeData } = useContext(ResumeContext);

  return (
    <div className="flex-col-gap-2">
      <h2 className="input-title">Projects</h2>
      {resumeData.projects && resumeData.projects.map((project, index) => (
        <Project key={index} project={project} index={index} />
      ))}
      <button
        type="button"
        onClick={() => {
          addProject(resumeData, setResumeData);
        }}
        aria-label="Add"
        className="p-2 w-[37px] text-white bg-gray-900 dark:bg-purple-500 rounded text-xl hover:bg-gray-700 dark:hover:bg-purple-600 transition-colors"
      >
        <MdAddCircle />
      </button>
    </div>
  );
};

export default Projects;
