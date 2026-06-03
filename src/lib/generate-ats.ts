import type { CVData } from '@/data/types';
import { texts } from '@/data/texts';

export function generateATS(cvData: CVData): string {
  const { personalInfo, workExperiences, skills } = cvData;
  const lines: string[] = [];

  // Header
  lines.push(personalInfo.fullName.toUpperCase());
  lines.push(personalInfo.mainPosition);
  lines.push('');
  lines.push(`${personalInfo.location} · ${personalInfo.remote}`);
  lines.push(`English: ${personalInfo.englishLevel}`);
  lines.push(personalInfo.mail);
  lines.push(personalInfo.linkedinUrl);
  lines.push(personalInfo.githubUrl);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Professional Summary
  lines.push(texts.ats.professionalSummary);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Work Experience
  lines.push(texts.ats.workExperience.toUpperCase());
  lines.push('');

  for (const exp of workExperiences) {
    lines.push(`${exp.position} — ${exp.companyName}`);
    lines.push(`${exp.from} – ${exp.to} | ${exp.country} | ${exp.businessArea}`);
    lines.push('');
    lines.push(`${texts.ats.technologies} ${exp.techs}`);
    lines.push('');
    for (const task of exp.tasksDescriptions) {
      lines.push(`• ${task}`);
    }
    lines.push('');
  }

  lines.push('---');
  lines.push('');

  // Skills
  lines.push(texts.ats.coreTechnicalSkills.toUpperCase());
  lines.push('');

  for (const skill of skills) {
    lines.push(`${skill.area}:`);
    lines.push(`${texts.ats.technologies} ${skill.chips.join(' | ')}`);
    lines.push('');
  }

  return lines.join('\n');
}
