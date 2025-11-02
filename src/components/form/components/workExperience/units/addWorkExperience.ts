import { ResumeData } from "@/types/resume";

export const addWorkExperience = (
  resumeData: ResumeData,
  setResumeData: (data: ResumeData) => void
) => {
  setResumeData({
    ...resumeData,
    workExperience: [
      ...resumeData.workExperience,
      {
        company: "",
        position: "",
        description: "",
        keyAchievements: "",
        startYear: "",
        endYear: "",
      },
    ],
  });
};
