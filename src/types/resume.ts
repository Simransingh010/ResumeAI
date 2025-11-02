export interface SocialMedia {
  socialMedia: string;
  link: string;
}

export interface Education {
  school: string;
  degree: string;
  startYear: string;
  endYear: string;
}

export interface WorkExperience {
  company: string;
  position: string;
  description: string;
  keyAchievements: string;
  startYear: string;
  endYear: string;
}

export interface Project {
  title: string;
  description: string;
  keyAchievements: string;
  startYear: string;
  endYear: string;
}

export interface SkillGroup {
  title: string;
  skills: string[];
}

export interface ResumeData {
  name: string;
  position: string;
  contactInformation: string;
  email: string;
  address: string;
  profilePicture: string;
  socialMedia: SocialMedia[];
  summary: string;
  education: Education[];
  workExperience: WorkExperience[];
  projects: Project[];
  skills: SkillGroup[];
  languages: string[];
  certifications: string[];
}
