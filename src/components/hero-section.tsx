'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { PersonalInfo, Tag } from '@/data/types';
import {
  data,
  heroBadgeIcons,
  tagIcons,
  heroContactLinks,
  downloadButtons,
  downloadFilenames,
} from '@/data/site.config';
import { texts } from '@/data/texts';

function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

interface HeroSectionProps {
  personalInfo: PersonalInfo;
  tags: Tag[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function splitByMiddleDot(text: string): string[] {
  return text
    .split('·')
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function HeroSection({ personalInfo, tags }: HeroSectionProps) {
  const age = calculateAge(personalInfo.dateOfBirth);
  const PdfIcon = downloadButtons.pdf.icon;
  const AtsIcon = downloadButtons.ats.icon;

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch('/api/export/pdf');
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadFilenames.pdf;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      console.error('PDF download failed');
    }
  };

  const handleDownloadATS = async () => {
    try {
      const response = await fetch('/api/export/ats');
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadFilenames.ats;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      console.error('ATS download failed');
    }
  };

  // Build badge items from config
  const badgeItems = heroBadgeIcons.map((item) => {
    let label = '';
    switch (item.key) {
      case texts.hero.badgeKey.age: label = `${age} ${texts.hero.ageSuffix}`; break;
      case texts.hero.badgeKey.location: label = personalInfo.location; break;
      case texts.hero.badgeKey.remote: label = personalInfo.remote; break;
      case texts.hero.badgeKey.english: label = `${texts.hero.englishPrefix} ${personalInfo.englishLevel}`; break;
    }
    return { ...item, label };
  });

  // Separate Core Stack from other tags
  const coreStackTag = tags.find((t) => t.title === 'Core Stack');
  const otherTags = tags.filter((t) => t.title !== 'Core Stack');
  const coreStackChips = coreStackTag ? splitByMiddleDot(coreStackTag.description) : [];

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <div className="relative overflow-hidden rounded-2xl bg-card/40 backdrop-blur-md border border-white/15 shadow-premium-lg ring-1 ring-inset ring-white/[0.08] bg-mesh-warm">
        {/* Decorative gradient blobs — animated mesh, premium depth */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute -top-20 -right-20 w-72 h-72 bg-gradient-to-bl from-primary/25 via-primary/8 to-transparent rounded-full blur-2xl"
            animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-24 -left-16 w-64 h-64 bg-gradient-to-tr from-accent/20 via-accent/5 to-transparent rounded-full blur-2xl"
            animate={{ scale: [1, 1.18, 1], opacity: [0.45, 0.75, 0.45] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          />
          <motion.div
            className="absolute top-1/3 left-1/2 w-48 h-48 bg-gradient-to-br from-secondary/15 to-transparent rounded-full blur-3xl -translate-x-1/2"
            animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 px-4 sm:px-6 py-5 sm:py-6 lg:px-8 lg:py-7">
          <div className="flex flex-col items-center text-center gap-4 sm:flex-row sm:items-start sm:text-left sm:gap-6">
            {/* Profile Photo */}
            <motion.div variants={itemVariants} className="shrink-0">
              <div className="relative group">
                {/* Animated conic gradient ring — premium signature element */}
                <motion.div
                  className="absolute -inset-2 rounded-full opacity-60 group-hover:opacity-95 transition-opacity duration-500"
                  style={{
                    background:
                      'conic-gradient(from 0deg, #C36B4D 0%, #8DB4AD 33%, #E8D9A1 66%, #C36B4D 100%)',
                    filter: 'blur(10px)',
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                />
                {/* Inner static ring for definition */}
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary/40 via-accent/30 to-secondary/40 opacity-50" />
                <Avatar className="relative w-22 h-22 sm:w-26 sm:h-26 lg:w-32 lg:h-32 border-[3px] border-card shadow-premium">
                  <Image
                    src={personalInfo.imageUrl}
                    alt={personalInfo.fullName}
                    fill
                    sizes="(max-width: 640px) 88px, (max-width: 1024px) 104px, 128px"
                    className="object-cover"
                    priority
                  />
                  <AvatarFallback className="text-lg sm:text-xl font-bold bg-primary text-primary-foreground">
                    CP
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold bg-gradient-to-r from-accent/80 to-accent/60 backdrop-blur-md text-accent-foreground shadow-premium whitespace-nowrap border border-accent/30 ring-1 ring-inset ring-white/20">
                    <span className="relative flex w-2 h-2">
                      <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
                      <span className="relative rounded-full w-2 h-2 bg-green-500" />
                    </span>
                    {texts.hero.openToWork}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Personal Info */}
            <div className="flex-1 min-w-0 space-y-3">
              <motion.div variants={itemVariants}>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                  {personalInfo.fullName}
                </h1>
                <motion.p
                  className="text-base sm:text-lg lg:text-xl font-semibold text-gradient-primary mt-0.5"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
                >
                  {personalInfo.mainPosition}
                </motion.p>
              </motion.div>

              {/* Info Badges — premium glassmorphism chips */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap justify-center sm:justify-start gap-1.5"
              >
                {badgeItems.map((item) => (
                  <span
                    key={item.key}
                    className="group inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs sm:text-[13px] font-medium bg-gradient-to-r from-card/70 to-card/40 backdrop-blur-sm border border-border/30 ring-1 ring-inset ring-white/[0.08] shadow-sm hover:shadow-premium hover:border-primary/30 hover:from-card/90 transition-all duration-300"
                  >
                    <item.icon className="w-3 h-3 shrink-0 text-primary/80 group-hover:text-primary transition-colors" />
                    <span className="text-foreground/85 group-hover:text-foreground transition-colors">{item.label}</span>
                  </span>
                ))}
              </motion.div>

              {/* Contact + Downloads */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap justify-center sm:justify-start gap-1.5 sm:gap-2"
              >
                {heroContactLinks.map((link) => (
                  <motion.div key={link.label} whileHover={{ scale: 1.05, y: -1 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-[11px] sm:text-xs bg-gradient-to-b from-card/50 to-card/30 border-border/40 ring-1 ring-inset ring-white/[0.06] hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-premium transition-all duration-300 h-8"
                      asChild
                    >
                      <a
                        href={link.hrefKey === 'mail' ? `mailto:${personalInfo.mail}` : personalInfo[link.hrefKey]}
                        {...(link.external
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                      >
                        <link.icon className="w-3.5 h-3.5" />
                        {link.label}
                      </a>
                    </Button>
                  </motion.div>
                ))}

                <motion.div whileHover={{ scale: 1.06, y: -1 }} whileTap={{ scale: 0.94 }}>
                  <Button
                    onClick={handleDownloadPDF}
                    size="sm"
                    className="gap-1.5 text-[11px] sm:text-xs bg-gradient-to-b from-primary to-primary/85 hover:from-primary hover:to-primary/80 text-primary-foreground shadow-premium hover:shadow-premium-lg ring-1 ring-inset ring-white/15 transition-all duration-300 h-8"
                  >
                    <PdfIcon className="w-3.5 h-3.5" />
                    {downloadButtons.pdf.label}
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.06, y: -1 }} whileTap={{ scale: 0.94 }}>
                  <Button
                    onClick={handleDownloadATS}
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-[11px] sm:text-xs border-primary/40 text-primary bg-gradient-to-b from-card/50 to-card/30 hover:bg-primary hover:text-primary-foreground hover:border-primary ring-1 ring-inset ring-primary/15 shadow-premium hover:shadow-premium-lg transition-all duration-300 h-8"
                  >
                    <AtsIcon className="w-3.5 h-3.5" />
                    {downloadButtons.ats.label}
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Tags section — Core Stack full width, Goal + Looking For side by side */}
        <div className="relative z-10 border-t border-white/[0.08] bg-gradient-to-b from-muted/10 to-muted/20 backdrop-blur-md">
          <div className="px-4 sm:px-6 pt-2.5 pb-3.5 sm:pt-3 sm:pb-4 lg:px-8 lg:pt-3.5 lg:pb-5">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2 sm:space-y-2.5"
            >
              {/* Core Stack — full width with individual chips */}
              {coreStackTag && (
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -1, transition: { duration: 0.2 } }}
                  className="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-sm border border-white/[0.1] ring-1 ring-inset ring-white/[0.05] shadow-premium hover:shadow-premium-lg hover:border-primary/30 transition-all duration-300"
                >
                  {(() => {
                    const TagIcon = tagIcons[coreStackTag.title] || tagIcons['Core Stack'];
                    return (
                      <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 ring-1 ring-inset ring-primary/15 shrink-0">
                        <TagIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                      </div>
                    );
                  })()}
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-label mb-1.5">
                      {coreStackTag.title}
                    </p>
                    <div className="flex flex-wrap gap-1 sm:gap-1.5">
                      {coreStackChips.map((chip) => (
                        <span
                          key={chip}
                          className="inline-flex items-center text-[10px] sm:text-[11px] py-0.5 px-2 font-medium rounded-full bg-gradient-to-b from-primary/10 to-primary/5 border border-primary/15 text-primary ring-1 ring-inset ring-primary/[0.08] hover:from-primary/15 hover:to-primary/10 hover:border-primary/30 transition-all duration-200"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Goal + Looking For — side by side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                {otherTags.map((tag) => {
                  const TagIcon = tagIcons[tag.title] || tagIcons['Core Stack'];
                  return (
                    <motion.div
                      key={tag.title}
                      variants={itemVariants}
                      whileHover={{ y: -1, transition: { duration: 0.2 } }}
                      className="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-sm border border-white/[0.1] ring-1 ring-inset ring-white/[0.05] shadow-premium hover:shadow-premium-lg hover:border-accent/30 transition-all duration-300"
                    >
                      <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-accent/15 to-accent/5 ring-1 ring-inset ring-accent/15 shrink-0">
                        <TagIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-label mb-0.5">
                          {tag.title}
                        </p>
                        <p className="text-[11px] sm:text-xs text-muted-foreground">
                          {tag.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
