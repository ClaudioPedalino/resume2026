'use client';

import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
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
      case 'age': label = `${age} yrs`; break;
      case 'location': label = personalInfo.location; break;
      case 'remote': label = personalInfo.remote; break;
      case 'english': label = `EN ${personalInfo.englishLevel}`; break;
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
      <div className="relative overflow-hidden rounded-2xl bg-card/40 backdrop-blur-md border border-white/15 shadow-lg">
        {/* Decorative gradient blobs — very subtle */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-secondary/12 to-transparent rounded-full -translate-y-1/3 translate-x-1/4 blur-sm" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-gradient-to-tr from-accent/8 to-transparent rounded-full translate-y-1/3 -translate-x-1/4 blur-sm" />
        </div>

        {/* Content */}
        <div className="relative px-4 sm:px-6 py-5 sm:py-6 lg:px-8 lg:py-7">
          <div className="flex flex-col items-center text-center gap-4 sm:flex-row sm:items-start sm:text-left sm:gap-6">
            {/* Profile Photo */}
            <motion.div variants={itemVariants} className="shrink-0">
              <div className="relative group">
                <motion.div
                  className="absolute -inset-1.5 bg-gradient-to-br from-primary via-accent to-secondary rounded-full opacity-25 blur-md group-hover:opacity-45 transition-opacity duration-700"
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <Avatar className="relative w-22 h-22 sm:w-26 sm:h-26 lg:w-32 lg:h-32 border-3 border-card shadow-xl">
                  <AvatarImage
                    src={personalInfo.imageUrl}
                    alt={personalInfo.fullName}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-lg sm:text-xl font-bold bg-primary text-primary-foreground">
                    CP
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold bg-accent/70 backdrop-blur-sm text-accent-foreground shadow-sm whitespace-nowrap border border-accent/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Open to work
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Personal Info */}
            <div className="flex-1 min-w-0 space-y-2.5">
              <motion.div variants={itemVariants}>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                  {personalInfo.fullName}
                </h1>
                <motion.p
                  className="text-base sm:text-lg lg:text-xl font-medium text-primary mt-0.5"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
                >
                  {personalInfo.mainPosition}
                </motion.p>
              </motion.div>

              {/* Info Badges */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap justify-center sm:justify-start gap-1.5"
              >
                {badgeItems.map((item) => (
                  <Badge
                    key={item.key}
                    variant="secondary"
                    className="flex items-center gap-1 py-0.5 px-2 text-[11px] sm:text-xs font-medium bg-card/50 border border-border/25"
                  >
                    <item.icon className="w-3 h-3 shrink-0" />
                    {item.label}
                  </Badge>
                ))}
              </motion.div>

              {/* Contact + Downloads */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap justify-center sm:justify-start gap-1.5 sm:gap-2"
              >
                {heroContactLinks.map((link) => (
                  <motion.div key={link.label} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-[11px] sm:text-xs bg-card/30 border-border/30 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 h-8"
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

                <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}>
                  <Button
                    onClick={handleDownloadPDF}
                    size="sm"
                    className="gap-1.5 text-[11px] sm:text-xs bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md transition-all duration-200 h-8"
                  >
                    <PdfIcon className="w-3.5 h-3.5" />
                    {downloadButtons.pdf.label}
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}>
                  <Button
                    onClick={handleDownloadATS}
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-[11px] sm:text-xs border-primary/40 text-primary bg-card/30 hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-sm hover:shadow-md transition-all duration-200 h-8"
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
        <div className="relative border-t border-white/10 bg-muted/15 backdrop-blur-sm">
          <div className="px-4 sm:px-6 py-3.5 sm:py-4 lg:px-8 lg:py-5">
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
                  className="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-xl bg-card/40 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {(() => {
                    const TagIcon = tagIcons[coreStackTag.title] || tagIcons['Core Stack'];
                    return (
                      <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/8 shrink-0">
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
                        <Badge
                          key={chip}
                          variant="secondary"
                          className="text-[9px] sm:text-[10px] py-0 px-1.5 font-medium bg-primary/6 border border-primary/10 text-primary hover:bg-primary/12 transition-colors duration-200"
                        >
                          {chip}
                        </Badge>
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
                      className="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-xl bg-card/40 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/8 shrink-0">
                        <TagIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-label mb-0.5">
                          {tag.title}
                        </p>
                        <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
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
