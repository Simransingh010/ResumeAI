import { ResumeData } from "@/types/resume";

export const handleProject = (
  resumeData: ResumeData,
  setResumeData: (data: ResumeData) => void,
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  index: number
) => {
  const newProjects = [...resumeData.projects];
  newProjects[index][e.target.name as keyof typeof newProjects[0]] =
    e.target.value;
  setResumeData({ ...resumeData, projects: newProjects });
};
