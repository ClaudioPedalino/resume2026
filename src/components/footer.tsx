'use client';

import { Mail, Linkedin, FileDown, Heart } from 'lucide-react';
import { data, downloadFilenames } from '@/data/site.config';
import { texts } from '@/data/texts';
import { generatePDF } from '@/lib/generate-pdf';

export default function Footer() {
  const p = data.personalInfo;

  const handleDownloadPDF = () => {
    const doc = generatePDF(data);
    doc.save(downloadFilenames.pdf);
  };

  return (
    <footer className="w-full mt-auto">
      {/* Top gradient accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />

      <div className="bg-card/60 backdrop-blur-2xl ring-1 ring-inset ring-white/[0.04]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 py-5 sm:py-6">
            <a
              href={`mailto:${p.mail}`}
              className="group flex-1 inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-primary/8 hover:bg-primary/15 text-primary border border-primary/15 hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-300 text-sm font-medium"
            >
              <Mail className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
              {texts.hero.contactLabel.email}
            </a>
            <a
              href={p.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex-1 inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-accent/8 hover:bg-accent/15 text-accent-foreground border border-accent/15 hover:border-accent/30 shadow-sm hover:shadow-md transition-all duration-300 text-sm font-medium"
            >
              <Linkedin className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
              {texts.hero.contactLabel.linkedin}
            </a>
            <button
              onClick={handleDownloadPDF}
              className="group flex-1 inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-secondary/20 hover:bg-secondary/35 text-secondary-foreground border border-secondary/30 hover:border-secondary/50 shadow-sm hover:shadow-md transition-all duration-300 text-sm font-medium cursor-pointer"
            >
              <FileDown className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
              {texts.hero.download.pdf}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
