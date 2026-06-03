import { NextResponse } from 'next/server';
import cvData from '@/data/cv-data.json';
import type { CVData } from '@/data/types';
import { parseMonthYear } from '@/lib/date';

const data = cvData as CVData;

export async function GET() {
  try {
    const p = data.personalInfo;
    const age = (() => {
      const today = new Date();
      const birth = new Date(p.dateOfBirth);
      let a = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) a--;
      return a;
    })();

    const lines: string[] = [];

    // Header
    lines.push(`${p.fullName.toUpperCase()}`);
    lines.push(`${p.mainPosition}`);
    lines.push(`${p.mail} | ${p.location} | ${p.remote} | English: ${p.englishLevel}`);
    lines.push(`LinkedIn: ${p.linkedinUrl} | GitHub: ${p.githubUrl}`);
    lines.push('');

    // Tags
    data.tags.forEach((tag) => {
      lines.push(`${tag.title}: ${tag.description}`);
    });
    lines.push('');

    // Work Experience
    lines.push('WORK EXPERIENCE');
    lines.push('─'.repeat(60));

    const sortedExperiences = [...data.workExperiences].sort(
      (a, b) => parseMonthYear(b.to).getTime() - parseMonthYear(a.to).getTime()
    );

    sortedExperiences.forEach((exp) => {
      lines.push(`${exp.companyName} (${exp.country}) | ${exp.position}`);
      lines.push(`${exp.from} - ${exp.to} | ${exp.businessArea}`);
      lines.push(`Technologies: ${exp.techs}`);
      exp.tasksDescriptions.forEach((task) => {
        lines.push(`  - ${task}`);
      });
      lines.push('');
    });

    // Skills
    lines.push('SKILLS');
    lines.push('─'.repeat(60));

    const sortedSkills = [...data.skills].sort((a, b) => a.order - b.order);
    sortedSkills.forEach((skill) => {
      lines.push(`${skill.area}: ${skill.chips.join(', ')}`);
      skill.description.forEach((desc) => {
        lines.push(`  - ${desc}`);
      });
    });

    const atsContent = lines.join('\n');

    return new NextResponse(atsContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': 'attachment; filename="Claudio_Pedalino_CV_ATS.txt"',
      },
    });
  } catch (error) {
    console.error('ATS generation error:', error);
    return NextResponse.json({ error: 'Failed to generate ATS file' }, { status: 500 });
  }
}
