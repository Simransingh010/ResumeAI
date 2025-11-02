import { ResumeData } from "@/types/resume";

export const removeWorkExperience = (
  resumeData: ResumeData,
  setResumeData: (data: ResumeData) => void,
  index: number
) => {
  const newWorkExperience = [...resumeData.workExperience].filter(
    (_, idx) => idx !== index
  );
  setResumeData({ ...resumeData, workExperience: newWorkExperience });
};
