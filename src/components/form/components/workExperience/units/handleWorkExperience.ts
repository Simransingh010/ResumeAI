import { ResumeData } from "@/types/resume";

export const handleWorkExperience = (
  resumeData: ResumeData,
  setResumeData: (data: ResumeData) => void,
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  index: number
) => {
  const newWorkExperience = [...resumeData.workExperience];
  newWorkExperience[index][
    e.target.name as keyof typeof newWorkExperience[0]
  ] = e.target.value;
  setResumeData({ ...resumeData, workExperience: newWorkExperience });
};
