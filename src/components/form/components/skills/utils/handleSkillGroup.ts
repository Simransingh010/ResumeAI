import { ResumeData } from "@/types/resume";

export const handleSkillGroup = (
  resumeData: ResumeData,
  setResumeData: (data: ResumeData) => void,
  e: React.ChangeEvent<HTMLInputElement>,
  index: number,
  field: "title" | "skills"
) => {
  const newSkills = [...resumeData.skills];
  if (field === "skills") {
    newSkills[index].skills = e.target.value
      .split(",")
      .map((skill) => skill.trim());
  } else {
    newSkills[index].title = e.target.value;
  }
  setResumeData({ ...resumeData, skills: newSkills });
};
