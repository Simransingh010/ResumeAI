import { ResumeData } from "@/types/resume";

export const removeSkillGroup = (
  resumeData: ResumeData,
  setResumeData: (data: ResumeData) => void,
  index: number
) => {
  const newSkills = [...resumeData.skills].filter((_, idx) => idx !== index);
  setResumeData({ ...resumeData, skills: newSkills });
};
