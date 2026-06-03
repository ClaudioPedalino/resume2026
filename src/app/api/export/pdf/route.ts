import { NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';
import cvData from '@/data/cv-data.json';
import type { CVData } from '@/data/types';
import { parseMonthYear } from '@/lib/date';
import { texts } from '@/data/texts';

const data = cvData as CVData;

export async function GET() {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 16;
    const contentWidth = pageWidth - margin * 2;
    let y = 0;

    // Brand palette
    const primary = [195, 107, 77] as const;
    const accent = [141, 180, 173] as const;
    const dark = [40, 40, 40] as const;
    const muted = [100, 100, 100] as const;
    const label = [130, 130, 80] as const;
    const white = [255, 255, 255] as const;
    const cream = [249, 246, 240] as const;
    const lightGray = [230, 230, 230] as const;

    // ── Helpers ──────────────────────────────────────────────────────────────
    const checkPage = (needed: number) => {
      if (y + needed > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }
    };

    const drawDivider = () => {
      doc.setFillColor(...lightGray);
      doc.rect(margin, y, contentWidth, 0.3, 'F');
      y += 4;
    };

    const drawSectionTitle = (title: string) => {
      checkPage(14);
      y += 2;
      // Accent bar
      doc.setFillColor(...primary);
      doc.rect(margin, y, 1.5, 5, 'F');
      // Title
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primary);
      doc.text(title.toUpperCase(), margin + 4, y + 4);
      // Underline
      doc.setFillColor(...lightGray);
      doc.rect(margin, y + 6, contentWidth, 0.2, 'F');
      y += 9;
    };

    // ── Header ───────────────────────────────────────────────────────────────
    doc.setFillColor(...primary);
    doc.rect(0, 0, pageWidth, 28, 'F');

    doc.setTextColor(...white);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(data.personalInfo.fullName, margin, 12);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(data.personalInfo.mainPosition, margin, 19);

    // ── Contact Bar ──────────────────────────────────────────────────────────
    y = 30;
    doc.setFillColor(...cream);
    doc.rect(0, y, pageWidth, 8, 'F');
    doc.setFontSize(6.5);
    doc.setTextColor(...muted);
    const contactParts = [
      data.personalInfo.mail,
      data.personalInfo.location,
      data.personalInfo.remote,
      `${texts.pdf.englishLabel} ${data.personalInfo.englishLevel}`,
    ];
    doc.text(contactParts.join('  |  '), margin, y + 5.5);

    y = 42;

    // ── Tags ─────────────────────────────────────────────────────────────────
    data.tags.forEach((tag) => {
      doc.setFontSize(6.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...label);
      doc.text(`${tag.title.toUpperCase()}:`, margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...muted);
      const descLines = doc.splitTextToSize(tag.description, contentWidth - 28);
      doc.text(descLines, margin + 28, y);
      y += descLines.length * 3 + 1.5;
    });

    y += 2;
    drawDivider();

    // ── Work Experience ──────────────────────────────────────────────────────
    drawSectionTitle(texts.pdf.workExperience);

    const sortedExperiences = [...data.workExperiences].sort(
      (a, b) => parseMonthYear(b.to).getTime() - parseMonthYear(a.to).getTime()
    );

    sortedExperiences.forEach((exp) => {
      checkPage(22);

      // Company + Country + Date
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...dark);
      doc.text(exp.companyName, margin, y);

      doc.setFontSize(6.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...muted);
      doc.text(`(${exp.country})`, margin + doc.getTextWidth(exp.companyName) + 2, y);

      // Date right-aligned
      doc.text(`${exp.from} — ${exp.to}`, pageWidth - margin, y, { align: 'right' });

      y += 3.5;

      // Position
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primary);
      doc.text(exp.position, margin, y);
      y += 3;

      // Business area
      doc.setFontSize(6.5);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(...accent);
      doc.text(exp.businessArea, margin, y);
      y += 3.5;

      // Tech stack
      doc.setFontSize(6);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...label);
      const techLines = doc.splitTextToSize(`Technologies: ${exp.techs}`, contentWidth - 4);
      doc.text(techLines, margin, y);
      y += techLines.length * 2.8 + 1;

      // Tasks
      exp.tasksDescriptions.forEach((task) => {
        checkPage(6);
        doc.setFontSize(6.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...muted);
        const lines = doc.splitTextToSize(`  ${task}`, contentWidth - 6);
        doc.text(lines, margin + 2, y);
        y += lines.length * 2.8 + 0.5;
      });

      y += 3;
    });

    y += 1;
    drawDivider();

    // ── Skills ───────────────────────────────────────────────────────────────
    drawSectionTitle(texts.pdf.skillsExpertise);

    const sortedSkills = [...data.skills].sort((a, b) => a.order - b.order);
    const colWidth = (contentWidth - 4) / 2;

    sortedSkills.forEach((skill, idx) => {
      checkPage(10);

      const col = idx % 2;
      const x = margin + col * (colWidth + 4);

      // Skill area
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...dark);
      doc.text(skill.area, x, y);

      // Chips on next line
      doc.setFontSize(5.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...label);
      const chipText = skill.chips.join(' | ');
      const chipLines = doc.splitTextToSize(chipText, colWidth);
      doc.text(chipLines, x, y + 3);
      y += chipLines.length * 2.5 + 4;

      // New row after 2 columns
      if (col === 1 || idx === sortedSkills.length - 1) {
        y += 1;
      }
    });

    // ── Footer ───────────────────────────────────────────────────────────────
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(5.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...muted);
      doc.text(
        `${data.personalInfo.fullName}  |  ${data.personalInfo.mainPosition}  |  Page ${i} of ${totalPages}`,
        pageWidth / 2,
        pageHeight - 8,
        { align: 'center' }
      );
    }

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${texts.pdf.filename}"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
