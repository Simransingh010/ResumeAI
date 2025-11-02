import { ResumeData } from "@/types/resume";

export const handleSocialMedia = (
  resumeData: ResumeData,
  setResumeData: (data: ResumeData) => void,
  e: React.ChangeEvent<HTMLInputElement>,
  index: number
) => {
  const newSocialMedia = [...resumeData.socialMedia];
  newSocialMedia[index][e.target.name as keyof typeof newSocialMedia[0]] =
    e.target.value.replace("https://", "");
  setResumeData({ ...resumeData, socialMedia: newSocialMedia });
};
