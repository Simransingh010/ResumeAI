import { ResumeData } from "@/types/resume";

export const addEducation = (
  resumeData: ResumeData,
  setResumeData: (data: ResumeData) => void
) => {
  setResumeData({
    ...resumeData,
    education: [
      ...resumeData.education,
      { school: "", degree: "", startYear: "", endYear: "" },
    ],
  });
};
