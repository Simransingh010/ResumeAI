import { ResumeData } from "@/types/resume";

export const addSkillGroup = (
  resumeData: ResumeData,
  setResumeData: (data: ResumeData) => void
) => {
  setResumeData({
    ...resumeData,
    skills: [...resumeData.skills, { title: "", skills: [] }],
  });
};
