import { ResumeData } from "@/types/resume";

export const handleEducation = (
  resumeData: ResumeData,
  setResumeData: (data: ResumeData) => void,
  e: React.ChangeEvent<HTMLInputElement>,
  index: number
) => {
  const newEducation = [...resumeData.education];
  newEducation[index][e.target.name as keyof typeof newEducation[0]] =
    e.target.value;
  setResumeData({ ...resumeData, education: newEducation });
};
