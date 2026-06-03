'use client';

import { Heart } from 'lucide-react';
import { data, footerLinks } from '@/data/site.config';
import { texts } from '@/data/texts';

export default function Footer() {
  const p = data.personalInfo;

  return (
    <footer className="w-full mt-auto border-t border-white/[0.08] bg-gradient-to-b from-card/30 to-card/50 backdrop-blur-xl ring-1 ring-inset ring-white/[0.02]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            {texts.footer.builtWith} <Heart className="w-3 h-3 text-primary fill-primary" /> {texts.footer.by}{' '}
            <span className="font-medium text-foreground">{p.fullName}</span>
          </p>
          <div className="flex items-center gap-4">
            {footerLinks.map((link) => (
              <a
                key={link.ariaLabel}
                href={link.hrefKey === 'mail' ? `mailto:${p.mail}` : p[link.hrefKey]}
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 inline-block p-1.5 rounded-md hover:bg-primary/10"
                aria-label={link.ariaLabel}
              >
                <link.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground/60">
            &copy; {new Date().getFullYear()} {texts.footer.rightsReserved}
          </p>
        </div>
      </div>
    </footer>
  );
}
