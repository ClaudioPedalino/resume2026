import { NextResponse } from 'next/server';
import cvData from '@/data/cv-data.json';
import type { CVData } from '@/data/types';
import { parseMonthYear } from '@/lib/date';
import { texts } from '@/data/texts';

const data = cvData as CVData;

export async function GET() {
  try {
    const p = data.personalInfo;

    const lines: string[] = [];

    // ── CONTACT INFORMATION ────────────────────────────────────────────────
    lines.push(p.fullName.toUpperCase());
    lines.push(p.mainPosition);
    lines.push('');
    lines.push(`Email: ${p.mail}`);
    lines.push(`Location: ${p.location}`);
    lines.push(`Work arrangement: ${p.remote}`);
    lines.push(`English level: ${p.englishLevel}`);
    lines.push(`LinkedIn: ${p.linkedinUrl}`);
    lines.push(`GitHub: ${p.githubUrl}`);
    lines.push('');

    // ── PROFESSIONAL SUMMARY ──────────────────────────────────────────────
    lines.push('PROFESSIONAL SUMMARY');
    lines.push('='.repeat(60));
    lines.push(texts.ats.professionalSummary);
    lines.push('');

    // ── CORE TECHNICAL SKILLS ─────────────────────────────────────────────
    lines.push(texts.ats.coreTechnicalSkills);
    lines.push('='.repeat(60));
    const sortedSkills = [...data.skills].sort((a, b) => a.order - b.order);
    sortedSkills.forEach((skill) => {
      lines.push(`${skill.area}: ${skill.chips.join(', ')}`);
    });
    lines.push('');

    // ── WORK EXPERIENCE ───────────────────────────────────────────────────
    lines.push('WORK EXPERIENCE');
    lines.push('='.repeat(60));

    const sortedExperiences = [...data.workExperiences].sort(
      (a, b) => parseMonthYear(b.to).getTime() - parseMonthYear(a.to).getTime()
    );

    sortedExperiences.forEach((exp) => {
      lines.push(`${exp.position}`);
      lines.push(`${exp.companyName} | ${exp.country} | ${exp.businessArea}`);
      lines.push(`${exp.from} - ${exp.to}`);
      lines.push(`Technologies: ${exp.techs}`);
      lines.push('');
      exp.tasksDescriptions.forEach((task) => {
        lines.push(`* ${task}`);
      });
      lines.push('');
    });

    // ── EDUCATION (placeholder — add when available) ──────────────────────
    // lines.push('EDUCATION');
    // lines.push('='.repeat(60));
    // lines.push('');

    // ── CERTIFICATIONS (placeholder — add when available) ──────────────────
    // lines.push('CERTIFICATIONS');
    // lines.push('='.repeat(60));
    // lines.push('');

    const atsContent = lines.join('\n');

    return new NextResponse(atsContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${texts.ats.filename}"`,
      },
    });
  } catch (error) {
    console.error('ATS generation error:', error);
    return NextResponse.json({ error: 'Failed to generate ATS file' }, { status: 500 });
  }
}
