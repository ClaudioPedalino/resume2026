export interface PersonalInfo {
  fullName: string;
  dateOfBirth: string;
  mainPosition: string;
  imageUrl: string;
  mail: string;
  location: string;
  remote: string;
  englishLevel: string;
  linkedinUrl: string;
  githubUrl: string;
}

export interface Tag {
  title: string;
  description: string;
}

export interface WorkExperience {
  companyName: string;
  from: string;
  to: string;
  position: string;
  techs: string;
  businessArea: string;
  country: string;
  countryFlag: string;
  tasksDescriptions: string[];
}

export interface Skill {
  order: number;
  area: string;
  icon: string;
  chips: string[];
  description: string[];
}

export interface CVData {
  personalInfo: PersonalInfo;
  tags: Tag[];
  workExperiences: WorkExperience[];
  skills: Skill[];
}
