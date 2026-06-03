'use client';

import { Mail, Linkedin } from 'lucide-react';
import { data } from '@/data/site.config';
import { texts } from '@/data/texts';

export default function Footer() {
  const p = data.personalInfo;

  return (
    <footer className="w-full mt-auto border-t border-white/[0.06] bg-card/50 backdrop-blur-2xl ring-1 ring-inset ring-white/[0.03] shadow-premium-lg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div className="flex items-center gap-4">
          <a
            href={`mailto:${p.mail}`}
            className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl bg-primary/12 hover:bg-primary/22 text-primary border border-primary/20 hover:border-primary/35 backdrop-blur-sm shadow-sm hover:shadow-premium transition-all duration-300 text-sm font-medium"
          >
            <Mail className="w-4 h-4" />
            {texts.hero.contactLabel.email}
          </a>
          <a
            href={p.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl bg-accent/12 hover:bg-accent/22 text-accent-foreground border border-accent/20 hover:border-accent/35 backdrop-blur-sm shadow-sm hover:shadow-premium transition-all duration-300 text-sm font-medium"
          >
            <Linkedin className="w-4 h-4" />
            {texts.hero.contactLabel.linkedin}
          </a>
        </div>
      </div>
    </footer>
  );
}
