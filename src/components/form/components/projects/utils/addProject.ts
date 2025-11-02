import { ResumeData } from "@/types/resume";

export const addProject = (
  resumeData: ResumeData,
  setResumeData: (data: ResumeData) => void
) => {
  setResumeData({
    ...resumeData,
    projects: [
      ...resumeData.projects,
      {
        title: "",
        description: "",
        keyAchievements: "",
        startYear: "",
        endYear: "",
      },
    ],
  });
};
