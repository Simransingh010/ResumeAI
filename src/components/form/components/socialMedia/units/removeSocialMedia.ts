import { ResumeData } from "@/types/resume";

export const removeSocialMedia = (
  resumeData: ResumeData,
  setResumeData: (data: ResumeData) => void,
  index: number
) => {
  const newSocialMedia = [...resumeData.socialMedia].filter(
    (_, idx) => idx !== index
  );
  setResumeData({ ...resumeData, socialMedia: newSocialMedia });
};
