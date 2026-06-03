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

    // ── HEADER ──────────────────────────────────────────────────────────────
    lines.push(p.fullName.toUpperCase());
    lines.push(p.mainPosition);
    lines.push('─'.repeat(70));
    lines.push(`Email: ${p.mail}`);
    lines.push(`Location: ${p.location}`);
    lines.push(`Work Arrangement: ${p.remote}`);
    lines.push(`English: ${p.englishLevel}`);
    lines.push(`LinkedIn: ${p.linkedinUrl}`);
    lines.push(`GitHub: ${p.githubUrl}`);
    lines.push('─'.repeat(70));
    lines.push('');

    // ── PROFESSIONAL SUMMARY ──────────────────────────────────────────────
    lines.push('PROFESSIONAL SUMMARY');
    lines.push('─'.repeat(70));
    lines.push(texts.ats.professionalSummary);
    lines.push('');

    // ── CORE TECHNICAL SKILLS ─────────────────────────────────────────────
    lines.push('CORE TECHNICAL SKILLS');
    lines.push('─'.repeat(70));
    const sortedSkills = [...data.skills].sort((a, b) => a.order - b.order);
    sortedSkills.forEach((skill) => {
      const chips = skill.chips.join(', ');
      lines.push(`  ${skill.area}: ${chips}`);
    });
    lines.push('');

    // ── WORK EXPERIENCE ───────────────────────────────────────────────────
    lines.push('WORK EXPERIENCE');
    lines.push('─'.repeat(70));

    const sortedExperiences = [...data.workExperiences].sort(
      (a, b) => parseMonthYear(b.to).getTime() - parseMonthYear(a.to).getTime()
    );

    sortedExperiences.forEach((exp, idx) => {
      if (idx > 0) lines.push('');
      lines.push(`  ${exp.position}`);
      lines.push(`  ${exp.companyName}  |  ${exp.country}  |  ${exp.businessArea}`);
      lines.push(`  ${exp.from} — ${exp.to}`);
      lines.push(`  Technologies: ${exp.techs}`);
      exp.tasksDescriptions.forEach((task) => {
        lines.push(`    • ${task}`);
      });
    });
    lines.push('');

    // ── FOOTER ─────────────────────────────────────────────────────────────
    lines.push('─'.repeat(70));
    lines.push(`Generated from ${p.linkedinUrl}`);

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
