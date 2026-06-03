'use client';

import { Heart } from 'lucide-react';
import { data, footerLinks } from '@/data/site.config';

export default function Footer() {
  const p = data.personalInfo;

  return (
    <footer className="w-full mt-auto border-t border-white/15 bg-card/40 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-primary fill-primary" /> by{' '}
            <span className="font-medium text-foreground">{p.fullName}</span>
          </p>
          <div className="flex items-center gap-4">
            {footerLinks.map((link) => (
              <a
                key={link.ariaLabel}
                href={link.hrefKey === 'mail' ? `mailto:${p.mail}` : p[link.hrefKey]}
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:scale-110 inline-block"
                aria-label={link.ariaLabel}
              >
                <link.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground/60">
            &copy; {new Date().getFullYear()} All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
