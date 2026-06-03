import { NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';
import cvData from '@/data/cv-data.json';
import type { CVData } from '@/data/types';

const data = cvData as CVData;

function parseDate(dateStr: string): Date {
  const parts = dateStr.replace('-', ' ').split(' ');
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  return new Date(parseInt(parts[1] || '0'), months[parts[0]] || 0);
}

export async function GET() {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let y = 0;

    const primary = [195, 107, 77] as const; // #C36B4D
    const accent = [141, 180, 173] as const; // #8DB4AD
    const dark = [51, 51, 51] as const; // #333333
    const muted = [102, 102, 102] as const; // #666666
    const label = [141, 141, 90] as const; // #8D8D5A
    const white = [255, 255, 255] as const;
    const cream = [249, 246, 240] as const; // #F9F6F0

    // Helper: check page overflow
    const checkPage = (needed: number) => {
      if (y + needed > pageHeight - 15) {
        doc.addPage();
        y = 15;
      }
    };

    // Header bar
    doc.setFillColor(...primary);
    doc.rect(0, 0, pageWidth, 32, 'F');

    doc.setTextColor(...white);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(data.personalInfo.fullName, margin, 15);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(data.personalInfo.mainPosition, margin, 24);

    // Contact bar
    y = 34;
    doc.setFillColor(...cream);
    doc.rect(0, y, pageWidth, 10, 'F');
    doc.setFontSize(7);
    doc.setTextColor(...muted);
    const contactLine = `${data.personalInfo.mail}  |  ${data.personalInfo.location}  |  ${data.personalInfo.remote}  |  English: ${data.personalInfo.englishLevel}  |  LinkedIn  |  GitHub`;
    doc.text(contactLine, margin, y + 6.5);

    y = 48;

    // Tags section
    doc.setFontSize(7);
    data.tags.forEach((tag) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...label);
      doc.text(`${tag.title.toUpperCase()}:`, margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...muted);
      const tagLines = doc.splitTextToSize(tag.description, contentWidth - 30);
      doc.text(tagLines, margin + 30, y);
      y += tagLines.length * 3.5 + 1;
    });

    y += 3;

    // Divider
    doc.setFillColor(...primary);
    doc.rect(margin, y, contentWidth, 0.8, 'F');
    y += 6;

    // Section title helper
    const drawSectionTitle = (title: string) => {
      checkPage(12);
      doc.setFillColor(...accent);
      doc.rect(margin, y, 1.2, 6, 'F');
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primary);
      doc.text(title, margin + 4, y + 5);
      y += 10;
    };

    drawSectionTitle('WORK EXPERIENCE');

    // Work experiences
    const sortedExperiences = [...data.workExperiences].sort(
      (a, b) => parseDate(b.to).getTime() - parseDate(a.to).getTime()
    );

    sortedExperiences.forEach((exp) => {
      checkPage(25);

      // Company header
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...dark);
      doc.text(`${exp.companyName} (${exp.country})`, margin, y);

      // Period - right aligned
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...muted);
      doc.text(`${exp.from} - ${exp.to}`, pageWidth - margin, y, { align: 'right' });

      y += 4;

      // Position
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primary);
      doc.text(exp.position, margin, y);
      y += 3.5;

      // Business area
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...accent);
      doc.text(exp.businessArea, margin, y);
      y += 3.5;

      // Tech stack
      doc.setFontSize(6.5);
      doc.setTextColor(...label);
      doc.text(`Technologies: ${exp.techs}`, margin, y, {
        maxWidth: contentWidth,
      });
      y = doc.getTextDimensions(`Technologies: ${exp.techs}`, { maxWidth: contentWidth, fontSize: 6.5 }).h + y + 2;

      // Task descriptions
      exp.tasksDescriptions.forEach((task) => {
        checkPage(8);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...muted);
        const lines = doc.splitTextToSize(`• ${task}`, contentWidth - 5);
        doc.text(lines, margin + 3, y);
        y += lines.length * 3 + 1;
      });

      y += 4;
    });

    y += 2;

    checkPage(15);
    doc.setFillColor(...primary);
    doc.rect(margin, y, contentWidth, 0.8, 'F');
    y += 6;

    drawSectionTitle('SKILLS & EXPERTISE');

    const sortedSkills = [...data.skills].sort((a, b) => a.order - b.order);

    sortedSkills.forEach((skill) => {
      checkPage(15);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...dark);
      doc.text(skill.area, margin, y);
      y += 4;

      doc.setFontSize(6.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...label);
      doc.text(skill.chips.join(' | '), margin + 3, y, { maxWidth: contentWidth - 5 });
      y += 4;

      skill.description.forEach((desc) => {
        checkPage(8);
        doc.setFontSize(6.5);
        doc.setTextColor(...muted);
        const lines = doc.splitTextToSize(`• ${desc}`, contentWidth - 6);
        doc.text(lines, margin + 3, y);
        y += lines.length * 2.8 + 1;
      });

      y += 3;
    });

    // Page footer
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(6);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...muted);
      doc.text(
        `Claudio Pedalino — Curriculum Vitae — Page ${i} of ${totalPages}`,
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
        'Content-Disposition': 'attachment; filename="Claudio_Pedalino_CV.pdf"',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
