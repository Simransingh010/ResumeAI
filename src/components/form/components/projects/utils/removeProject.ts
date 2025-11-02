import { ResumeData } from "@/types/resume";

export const removeProject = (
  resumeData: ResumeData,
  setResumeData: (data: ResumeData) => void,
  index: number
) => {
  const newProjects = [...resumeData.projects].filter(
    (_, idx) => idx !== index
  );
  setResumeData({ ...resumeData, projects: newProjects });
};
