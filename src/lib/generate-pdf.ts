import { jsPDF } from 'jspdf';
import type { CVData } from '@/data/types';
import { texts } from '@/data/texts';

const BRAND = [195, 107, 77] as const;
const DARK  = [51, 51, 51] as const;
const GRAY  = [102, 102, 102] as const;
const LGRAY = [160, 160, 160] as const;
const LINE  = [220, 220, 220] as const;

export function generatePDF(cvData: CVData): jsPDF {
  const { personalInfo, workExperiences, skills } = cvData;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210, H = 297;
  const ML = 16, MR = 16;
  const CW = W - ML - MR;
  const BOT = H - 14;
  let y = 18;

  // ── ACCENT BAR ──
  doc.setFillColor(...BRAND);
  doc.rect(0, 0, W, 2, 'F');

  // ── NAME ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...DARK);
  doc.text(personalInfo.fullName, ML, y + 8);
  y += 12;

  // ── POSITION ──
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...BRAND);
  doc.text(personalInfo.mainPosition, ML, y + 1);
  y += 6;

  // ── CONTACT ──
  doc.setFontSize(8.5);
  doc.setTextColor(...GRAY);
  doc.text(`${personalInfo.location}  ·  ${personalInfo.remote}  ·  English ${personalInfo.englishLevel}`, ML, y);
  y += 4;
  doc.setTextColor(...DARK);
  doc.text(personalInfo.mail, ML, y);
  doc.setTextColor(...BRAND);
  doc.text('LinkedIn', W / 2, y, { align: 'center' });
  doc.text('GitHub', W - MR, y, { align: 'right' });
  y += 5;

  // ── DIVIDER ──
  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.25);
  doc.line(ML, y, W - MR, y);
  y += 5;

  // ══════════════════════════════════════════════════════════════
  // WORK EXPERIENCE
  // ══════════════════════════════════════════════════════════════

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...BRAND);
  doc.text(texts.pdf.workExperience, ML, y);
  y += 1.5;
  doc.setDrawColor(...BRAND);
  doc.setLineWidth(0.35);
  doc.line(ML, y, ML + 42, y);
  y += 5;

  for (const exp of workExperiences) {
    if (y + 24 > BOT) { doc.addPage(); y = 18; }

    // Company + Period
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...DARK);
    doc.text(exp.companyName, ML, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...GRAY);
    doc.text(`${exp.from} – ${exp.to}`, W - MR, y, { align: 'right' });
    y += 4;

    // Role
    doc.setFontSize(9);
    doc.setTextColor(...BRAND);
    doc.text(exp.position, ML + 1, y);
    y += 3.5;

    // Country · Area
    doc.setFontSize(8);
    doc.setTextColor(...GRAY);
    doc.text(`${exp.country}  ·  ${exp.businessArea}`, ML + 1, y);
    y += 4;

    // Techs
    doc.setFontSize(8);
    doc.setTextColor(...LGRAY);
    const techLines = doc.splitTextToSize(exp.techs, CW - 4);
    for (const l of techLines) { doc.text(l, ML + 2, y); y += 3.2; }
    y += 0.5;

    // Tasks
    for (const task of exp.tasksDescriptions) {
      if (y + 5 > BOT) { doc.addPage(); y = 18; }
      doc.setFontSize(8);
      doc.setTextColor(...DARK);
      const tl = doc.splitTextToSize(`•  ${task}`, CW - 8);
      for (const l of tl) { doc.text(l, ML + 4, y); y += 3.4; }
    }
    y += 2.5;

    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.12);
    doc.line(ML + 3, y, W - MR - 3, y);
    y += 3;
  }

  // ══════════════════════════════════════════════════════════════
  // SKILLS
  // ══════════════════════════════════════════════════════════════

  if (y + 16 > BOT) { doc.addPage(); y = 18; }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...BRAND);
  doc.text(texts.pdf.skillsExpertise, ML, y);
  y += 1.5;
  doc.setDrawColor(...BRAND);
  doc.setLineWidth(0.35);
  doc.line(ML, y, ML + 42, y);
  y += 5;

  for (const skill of skills) {
    if (y + 8 > BOT) { doc.addPage(); y = 18; }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...DARK);
    doc.text(skill.area, ML, y);
    y += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...GRAY);
    const ct = skill.chips.join('  |  ');
    const cl = doc.splitTextToSize(ct, CW - 2);
    for (const l of cl) { doc.text(l, ML + 1, y); y += 3.4; }
    y += 1.5;
  }

  // ── FOOTER ──
  const tp = doc.getNumberOfPages();
  for (let i = 1; i <= tp; i++) {
    doc.setPage(i);
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.15);
    doc.line(ML, BOT + 2, W - MR, BOT + 2);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...LGRAY);
    doc.text(`${personalInfo.fullName} — Curriculum Vitae`, ML, BOT + 6);
    doc.text(`${i} / ${tp}`, W - MR, BOT + 6, { align: 'right' });
  }

  return doc;
}
