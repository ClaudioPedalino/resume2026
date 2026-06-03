import { jsPDF } from 'jspdf';
import type { CVData } from '@/data/types';
import { texts } from '@/data/texts';

const BRAND = [195, 107, 77] as const;
const DARK  = [51, 51, 51] as const;
const GRAY  = [102, 102, 102] as const;
const LGRAY = [160, 160, 160] as const;
const LINE  = [210, 210, 210] as const;

function safeText(doc: jsPDF, text: string, x: number, y: number, maxW: number) {
  const lines = doc.splitTextToSize(text, maxW);
  for (const l of lines) {
    doc.text(l, x, y);
    y += (doc.getLineHeight() / doc.internal.scaleFactor);
  }
  return y;
}

export function generatePDF(cvData: CVData): jsPDF {
  const { personalInfo, workExperiences, skills } = cvData;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210, H = 297;
  const ML = 14, MR = 14;
  const CW = W - ML - MR;
  const BOT = H - 12;
  let y = 14;

  // ── ACCENT BAR ──
  doc.setFillColor(...BRAND);
  doc.rect(0, 0, W, 2, 'F');

  // ── NAME ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...DARK);
  doc.text(personalInfo.fullName, ML, y + 7);
  y += 10;

  // ── POSITION ──
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...BRAND);
  doc.text(personalInfo.mainPosition, ML, y + 1);
  y += 5;

  // ── CONTACT ──
  doc.setFontSize(7.5);
  doc.setTextColor(...GRAY);
  doc.text(`${personalInfo.location} - ${personalInfo.remote} - English ${personalInfo.englishLevel}`, ML, y);
  y += 3.2;
  doc.text(personalInfo.mail, ML, y);
  y += 3.2;
  doc.setTextColor(...BRAND);
  doc.text(`LinkedIn: ${personalInfo.linkedinUrl}`, ML, y);
  doc.text(`GitHub: ${personalInfo.githubUrl}`, W - MR, y, { align: 'right' });
  y += 4;

  // ── DIVIDER ──
  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.2);
  doc.line(ML, y, W - MR, y);
  y += 4;

  // ══════════════════════════════════════════════════════════════
  // WORK EXPERIENCE
  // ══════════════════════════════════════════════════════════════

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...BRAND);
  doc.text(texts.pdf.workExperience, ML, y);
  y += 1.5;
  doc.setDrawColor(...BRAND);
  doc.setLineWidth(0.3);
  doc.line(ML, y, ML + 38, y);
  y += 4;

  for (const exp of workExperiences) {
    if (y + 14 > BOT) { doc.addPage(); y = 14; }

    // Company + Period
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...DARK);
    doc.text(exp.companyName, ML, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...GRAY);
    doc.text(`${exp.from} - ${exp.to}`, W - MR, y, { align: 'right' });
    y += 3.2;

    // Role
    doc.setFontSize(7.5);
    doc.setTextColor(...BRAND);
    doc.text(exp.position, ML + 1, y);
    y += 3;

    // Country - Area
    doc.setFontSize(7);
    doc.setTextColor(...LGRAY);
    doc.text(`${exp.country} - ${exp.businessArea}`, ML + 1, y);
    y += 3;

    // Techs
    doc.setFontSize(6.5);
    doc.setTextColor(...LGRAY);
    y = safeText(doc, exp.techs, ML + 2, y, CW - 4);
    y += 0.5;

    // Tasks
    doc.setFontSize(6.5);
    doc.setTextColor(...DARK);
    for (const task of exp.tasksDescriptions) {
      y = safeText(doc, `- ${task}`, ML + 3, y, CW - 6);
    }

    y += 1.5;
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.1);
    doc.line(ML + 2, y, W - MR - 2, y);
    y += 2.5;
  }

  // ══════════════════════════════════════════════════════════════
  // SKILLS - 2 COLUMNS
  // ══════════════════════════════════════════════════════════════

  if (y + 10 > BOT) { doc.addPage(); y = 14; }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...BRAND);
  doc.text(texts.pdf.skillsExpertise, ML, y);
  y += 1.5;
  doc.setDrawColor(...BRAND);
  doc.setLineWidth(0.3);
  doc.line(ML, y, ML + 38, y);
  y += 4;

  const COL_W = CW / 2 - 4;
  const colX = [ML, ML + CW / 2 + 2];
  const skillsPerCol = Math.ceil(skills.length / 2);

  for (let col = 0; col < 2; col++) {
    const colSkills = skills.slice(col * skillsPerCol, (col + 1) * skillsPerCol);
    let cy = y;

    for (const skill of colSkills) {
      // Area name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(...DARK);
      doc.text(skill.area, colX[col], cy);
      cy += 3;

      // Chips
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(...GRAY);
      const ct = skill.chips.join(' | ');
      const cl = doc.splitTextToSize(ct, COL_W);
      for (const l of cl) { doc.text(l, colX[col] + 1, cy); cy += 2.6; }
      cy += 1.5;
    }
  }

  // ── FOOTER ──
  const tp = doc.getNumberOfPages();
  for (let i = 1; i <= tp; i++) {
    doc.setPage(i);
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.12);
    doc.line(ML, BOT + 1, W - MR, BOT + 1);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(...LGRAY);
    doc.text(`${personalInfo.fullName} - Curriculum Vitae`, ML, BOT + 5);
    doc.text(`${i} / ${tp}`, W - MR, BOT + 5, { align: 'right' });
  }

  return doc;
}
