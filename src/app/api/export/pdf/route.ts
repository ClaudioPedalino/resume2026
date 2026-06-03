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
    const margin = 17;
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
      if (y + needed > pageHeight - 16) {
        doc.addPage();
        y = 16;
      }
    };

    const drawDivider = () => {
      doc.setDrawColor(...lightGray);
      doc.setLineWidth(0.15);
      doc.line(margin, y, margin + contentWidth, y);
      y += 2;
    };

    const drawSectionTitle = (title: string) => {
      checkPage(10);
      y += 1.5;
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primary);
      doc.text(title.toUpperCase(), margin, y);
      doc.setDrawColor(...lightGray);
      doc.setLineWidth(0.2);
      doc.line(margin, y + 1, margin + contentWidth, y + 1);
      y += 4;
    };

    // ── Header ───────────────────────────────────────────────────────────────
    doc.setFillColor(...primary);
    doc.rect(0, 0, pageWidth, 18, 'F');

    doc.setTextColor(...white);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(data.personalInfo.fullName, margin, 8.5);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(data.personalInfo.mainPosition, margin, 13.5);

    // ── Contact Bar ──────────────────────────────────────────────────────────
    y = 20;
    doc.setFillColor(...cream);
    doc.rect(0, y, pageWidth, 5, 'F');
    doc.setFontSize(5.5);
    doc.setTextColor(...muted);
    doc.text(
      [data.personalInfo.mail, data.personalInfo.location, data.personalInfo.remote, `${texts.pdf.englishLabel} ${data.personalInfo.englishLevel}`].join('  |  '),
      margin,
      y + 3.5
    );

    y = 28;

    // ── Tags ─────────────────────────────────────────────────────────────────
    const tagLines: string[] = [];
    data.tags.forEach((tag) => {
      const line = `${tag.title.toUpperCase()}: ${tag.description}`;
      const wrapped = doc.splitTextToSize(line, contentWidth);
      tagLines.push(...wrapped);
    });
    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...muted);
    doc.text(tagLines, margin, y);
    y += tagLines.length * 2.5 + 1.5;

    drawDivider();

    // ── Work Experience ──────────────────────────────────────────────────────
    drawSectionTitle(texts.pdf.workExperience);

    const sortedExperiences = [...data.workExperiences].sort(
      (a, b) => parseMonthYear(b.to).getTime() - parseMonthYear(a.to).getTime()
    );

    sortedExperiences.forEach((exp) => {
      checkPage(16);

      // Company + Date (same line)
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...dark);
      doc.text(exp.companyName, margin, y);

      doc.setFontSize(6);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...muted);
      doc.text(`${exp.from} — ${exp.to}`, pageWidth - margin, y, { align: 'right' });

      y += 3;

      // Country + Position (same line)
      doc.setFontSize(6);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...muted);
      doc.text(exp.country, margin, y);

      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primary);
      const posLabel = `${exp.position}  •  ${exp.businessArea}`;
      const posX = Math.max(margin + doc.getTextWidth(exp.country) + 5, margin + 50);
      doc.text(posLabel, posX, y);

      y += 2.5;

      // Tech stack
      doc.setFontSize(5.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...label);
      const techLines = doc.splitTextToSize(`Technologies: ${exp.techs}`, contentWidth - 4);
      doc.text(techLines, margin, y);
      y += techLines.length * 2.5 + 0.5;

      // Tasks
      exp.tasksDescriptions.forEach((task) => {
        checkPage(5);
        doc.setFontSize(6);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...muted);
        const lines = doc.splitTextToSize(`• ${task}`, contentWidth - 8);
        doc.text(lines, margin + 3, y);
        y += lines.length * 2.5 + 0.3;
      });

      y += 1.5;
    });

    drawDivider();

    // ── Skills ───────────────────────────────────────────────────────────────
    drawSectionTitle(texts.pdf.skillsExpertise);

    const sortedSkills = [...data.skills].sort((a, b) => a.order - b.order);
    const colWidth = (contentWidth - 6) / 2;

    sortedSkills.forEach((skill, idx) => {
      checkPage(8);

      const col = idx % 2;
      const x = margin + col * (colWidth + 6);

      doc.setFontSize(6.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...dark);
      doc.text(skill.area, x, y);

      doc.setFontSize(5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...label);
      const chipLines = doc.splitTextToSize(skill.chips.join('  ·  '), colWidth);
      doc.text(chipLines, x, y + 2.5);
      y += chipLines.length * 2.2 + 3;

      if (col === 1 || idx === sortedSkills.length - 1) {
        y += 0.5;
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
        `${data.personalInfo.fullName}  |  ${data.personalInfo.mainPosition}`,
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
