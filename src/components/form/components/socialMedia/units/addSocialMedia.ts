import { ResumeData } from "@/types/resume";

export const addSocialMedia = (
  resumeData: ResumeData,
  setResumeData: (data: ResumeData) => void
) => {
  setResumeData({
    ...resumeData,
    socialMedia: [...resumeData.socialMedia, { socialMedia: "", link: "" }],
  });
};
