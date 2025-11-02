import { ResumeData } from "@/types/resume";

export const removeEducation = (
  resumeData: ResumeData,
  setResumeData: (data: ResumeData) => void,
  index: number
) => {
  const newEducation = [...resumeData.education].filter(
    (_, idx) => idx !== index
  );
  setResumeData({ ...resumeData, education: newEducation });
};
