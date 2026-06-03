import { jsPDF } from 'jspdf';
import type { CVData } from '@/data/types';
import { texts } from '@/data/texts';

function addPageFooter(doc: jsPDF, fullName: string, pageNum: number, totalPages: number) {
  const w = doc.internal.pageSize.getWidth();
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(texts.pdf.page(fullName, pageNum, totalPages), w / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
}

export function generatePDF(cvData: CVData): jsPDF {
  const { personalInfo, workExperiences, skills } = cvData;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const w = doc.internal.pageSize.getWidth();
  const margin = 18;
  const contentW = w - margin * 2;
  let y = margin;

  const fullName = personalInfo.fullName;

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(51);
  doc.text(fullName, margin, y + 8);
  y += 12;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(personalInfo.mainPosition, margin, y + 4);
  y += 7;

  doc.setFontSize(9);
  doc.setTextColor(130);
  const contactLine = `${personalInfo.location} · ${personalInfo.remote} · English ${personalInfo.englishLevel}`;
  doc.text(contactLine, margin, y + 3);
  y += 5;
  doc.text(`${personalInfo.mail}  |  ${personalInfo.linkedinUrl}  |  ${personalInfo.githubUrl}`, margin, y + 3);
  y += 8;

  // Divider
  doc.setDrawColor(200);
  doc.setLineWidth(0.3);
  doc.line(margin, y, w - margin, y);
  y += 8;

  // Work Experience
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(195, 107, 77);
  doc.text(texts.pdf.workExperience, margin, y);
  y += 7;

  for (const exp of workExperiences) {
    if (y > 260) {
      doc.addPage();
      y = margin;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(51);
    doc.text(`${exp.position} — ${exp.companyName}`, margin, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(130);
    doc.text(`${exp.from} – ${exp.to}  |  ${exp.country}  |  ${exp.businessArea}`, margin, y);
    y += 5;

    doc.setFontSize(9);
    doc.setTextColor(80);
    doc.text(`${texts.pdf.technologies} ${exp.techs}`, margin, y);
    y += 5;

    for (const task of exp.tasksDescriptions) {
      const lines = doc.splitTextToSize(`• ${task}`, contentW - 4);
      for (const line of lines) {
        if (y > 275) { doc.addPage(); y = margin; }
        doc.text(line, margin + 2, y);
        y += 4;
      }
    }
    y += 4;
  }

  // Skills
  if (y > 240) { doc.addPage(); y = margin; }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(195, 107, 77);
  doc.text(texts.pdf.skillsExpertise, margin, y);
  y += 7;

  for (const skill of skills) {
    if (y > 270) { doc.addPage(); y = margin; }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(51);
    doc.text(skill.area, margin, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80);
    const chipLine = skill.chips.join(' | ');
    const chipLines = doc.splitTextToSize(`${texts.pdf.technologies} ${chipLine}`, contentW);
    for (const line of chipLines) {
      doc.text(line, margin, y);
      y += 4;
    }
    y += 2;
  }

  // Add footers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addPageFooter(doc, fullName, i, totalPages);
  }

  return doc;
}
