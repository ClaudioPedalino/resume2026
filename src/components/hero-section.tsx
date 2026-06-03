'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Mail, Linkedin, Github } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { PersonalInfo, Tag } from '@/data/types';
import {
  heroBadgeIcons,
  tagIcons,
  downloadButtons,
  downloadFilenames,
} from '@/data/site.config';
import { texts } from '@/data/texts';
import { generatePDF } from '@/lib/generate-pdf';
import { generateATS } from '@/lib/generate-ats';
import { data } from '@/data/site.config';

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
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] as const },
  },
};

function splitByMiddleDot(text: string): string[] {
  return text.split('·').map((s) => s.trim()).filter(Boolean);
}

function MagneticButton({
  children,
  strength = 0.3,
  className = '',
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 1 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HeroSection({ personalInfo, tags }: HeroSectionProps) {
  const age = calculateAge(personalInfo.dateOfBirth);
  const PdfIcon = downloadButtons.pdf.icon;
  const AtsIcon = downloadButtons.ats.icon;
  const [pdfLoading, setPdfLoading] = useState(false);
  const [atsLoading, setAtsLoading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      cardRef.current.style.setProperty('--mouse-x', `${x}%`);
      cardRef.current.style.setProperty('--mouse-y', `${y}%`);
    });
  };

  const handleMouseLeave = () => {
    cardRef.current?.style.setProperty('--mouse-x', '50%');
    cardRef.current?.style.setProperty('--mouse-y', '50%');
  };

  const handleDownloadPDF = () => {
    setPdfLoading(true);
    setDownloadError(null);
    try {
      const doc = generatePDF(data);
      doc.save(downloadFilenames.pdf);
    } catch {
      setDownloadError('PDF generation failed. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  };

  const handleDownloadATS = () => {
    setAtsLoading(true);
    setDownloadError(null);
    try {
      const text = generateATS(data);
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadFilenames.ats;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      setDownloadError('ATS generation failed. Please try again.');
    } finally {
      setAtsLoading(false);
    }
  };

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
      {/* Card — traveling light border + glass */}
      <div className="border-glow-hero rounded-[2rem]">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group/card relative rounded-[2rem] bg-white/70 backdrop-blur-xl shadow-premium-lg ring-1 ring-inset ring-white/[0.06] overflow-hidden noise-texture transition-all duration-300"
      >
        {/* Mouse-tracking border glow */}
        <div
          className="absolute inset-0 rounded-[2rem] pointer-events-none transition-opacity duration-200 opacity-0 group-hover/card:opacity-60"
          style={{
            background: 'radial-gradient(350px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(195,107,77,0.15), rgba(141,180,173,0.08), transparent 50%)',
          }}
        />
        {/* Inner refraction */}
        <div className="absolute inset-0 rounded-[2rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),inset_0_-1px_0_rgba(0,0,0,0.02)] pointer-events-none" />
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-accent to-secondary" />

        {/* Content */}
        <div className="relative z-10 p-5 sm:p-7 lg:p-9">
          <div className="flex flex-row items-center gap-4 sm:items-start sm:justify-center sm:gap-12 lg:gap-16">
            {/* LEFT: Text Content */}
            <div className="flex-1 min-w-0 sm:ml-auto">
              <motion.div variants={itemVariants}>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter leading-none text-foreground">
                  {personalInfo.fullName}
                </h1>
                <motion.p
                  className="text-sm sm:text-base lg:text-lg font-medium tracking-wide text-primary mt-1.5 uppercase"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.25, ease: [0.23, 1, 0.32, 1] as const }}
                >
                  {personalInfo.mainPosition}
                </motion.p>
              </motion.div>

              {/* Info Badges */}
              <motion.div variants={itemVariants} className="flex flex-wrap gap-1.5 mt-4">
                {badgeItems.map((item) => (
                  <span
                    key={item.key}
                    className="group inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full border-glow-sm text-xs sm:text-[13px] font-medium bg-white/60 backdrop-blur-sm ring-1 ring-inset ring-white/[0.08] shadow-sm transition-all duration-300"
                  >
                    <item.icon className="w-3 h-3 shrink-0 text-primary/80 group-hover:text-primary transition-colors duration-300" />
                    <span className="text-foreground/85 group-hover:text-foreground transition-colors duration-300">{item.label}</span>
                  </span>
                ))}
              </motion.div>

              {/* Contact + Downloads */}
              <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mt-4">
                {/* Email — Gmail red */}
                <MagneticButton strength={0.25}>
                  <motion.div whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                    <Button
                      size="sm"
                      className="gap-1.5 text-[11px] sm:text-xs bg-white/60 backdrop-blur-sm text-foreground hover:bg-[#EA4335]/10 hover:text-[#EA4335] border border-[#EA4335]/20 hover:border-[#EA4335]/50 hover:shadow-[0_0_12px_2px_rgba(234,67,53,0.2)] ring-1 ring-inset ring-white/[0.08] shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-300 min-h-11"
                      asChild
                    >
                      <a href={`mailto:${personalInfo.mail}`}>
                        <Mail className="w-3.5 h-3.5" />
                        {texts.hero.contactLabel.email}
                      </a>
                    </Button>
                  </motion.div>
                </MagneticButton>

                {/* LinkedIn — LinkedIn blue */}
                <MagneticButton strength={0.25}>
                  <motion.div whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                    <Button
                      size="sm"
                      className="gap-1.5 text-[11px] sm:text-xs bg-white/60 backdrop-blur-sm text-foreground hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] border border-[#0A66C2]/20 hover:border-[#0A66C2]/50 hover:shadow-[0_0_12px_2px_rgba(10,102,194,0.2)] ring-1 ring-inset ring-white/[0.08] shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-300 min-h-11"
                      asChild
                    >
                      <a href={personalInfo.linkedinUrl} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="w-3.5 h-3.5" />
                        {texts.hero.contactLabel.linkedin}
                      </a>
                    </Button>
                  </motion.div>
                </MagneticButton>

                {/* GitHub — GitHub dark */}
                <MagneticButton strength={0.25}>
                  <motion.div whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                    <Button
                      size="sm"
                      className="gap-1.5 text-[11px] sm:text-xs bg-white/60 backdrop-blur-sm text-foreground hover:bg-[#24292e]/10 hover:text-[#24292e] border border-[#24292e]/15 hover:border-[#24292e]/40 hover:shadow-[0_0_12px_2px_rgba(36,41,46,0.15)] ring-1 ring-inset ring-white/[0.08] shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-300 min-h-11"
                      asChild
                    >
                      <a href={personalInfo.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="w-3.5 h-3.5" />
                        {texts.hero.contactLabel.github}
                      </a>
                    </Button>
                  </motion.div>
                </MagneticButton>

                <MagneticButton strength={0.3}>
                  <motion.div whileTap={{ scale: 0.94 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                    <Button
                      onClick={handleDownloadPDF}
                      disabled={pdfLoading}
                      size="sm"
                      className="gap-1.5 text-[11px] sm:text-xs bg-primary hover:bg-primary/90 text-primary-foreground hover:glow-primary-strong ring-1 ring-inset ring-white/15 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-300 min-h-11 disabled:opacity-50"
                    >
                      {pdfLoading ? (
                        <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      ) : (
                        <PdfIcon className="w-3.5 h-3.5" />
                      )}
                      {downloadButtons.pdf.label}
                    </Button>
                  </motion.div>
                </MagneticButton>

                <MagneticButton strength={0.3}>
                  <motion.div whileTap={{ scale: 0.94 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                    <Button
                      onClick={handleDownloadATS}
                      disabled={atsLoading}
                      size="sm"
                      className="gap-1.5 text-[11px] sm:text-xs text-primary bg-white/60 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground hover:glow-primary ring-1 ring-inset ring-primary/15 shadow-premium focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-300 min-h-11 disabled:opacity-50"
                    >
                      {atsLoading ? (
                        <span className="w-3.5 h-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      ) : (
                        <AtsIcon className="w-3.5 h-3.5" />
                      )}
                      {downloadButtons.ats.label}
                    </Button>
                  </motion.div>
                </MagneticButton>
              </motion.div>

              {downloadError && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-destructive mt-2">
                  {downloadError}
                </motion.p>
              )}
            </div>

            {/* RIGHT: Avatar */}
            <motion.div variants={itemVariants} className="shrink-0 sm:mx-auto self-start pt-1">
              <div className="relative group">
                {/* Neon glow ring — box-shadow (GPU), not filter:blur */}
                <div
                  className="glow-avatar absolute -inset-1 rounded-full transition-shadow duration-500 ease-out"
                  style={{
                    background: 'conic-gradient(from 0deg, #C36B4D 0%, #8DB4AD 33%, #E8D9A1 66%, #C36B4D 100%)',
                  }}
                />
                <div className="absolute -inset-[3px] rounded-full bg-background/80" />
                <Avatar className="relative w-24 h-24 sm:w-[11rem] sm:h-[11rem] lg:w-40 lg:h-40 border-[3px] border-card shadow-premium">
                  <Image
                    src={personalInfo.imageUrl}
                    alt={personalInfo.fullName}
                    fill
                    sizes="(max-width: 640px) 96px, (max-width: 1024px) 176px, 160px"
                    className="object-cover"
                    priority
                  />
                  <AvatarFallback className="text-lg sm:text-xl font-bold bg-primary text-primary-foreground">CP</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold bg-primary text-primary-foreground shadow-premium glow-primary-strong whitespace-nowrap ring-1 ring-inset ring-white/20">
                    <span className="relative flex w-1.5 h-1.5">
                      <span className="absolute inset-0 rounded-full bg-primary-foreground/60 animate-ping" />
                      <span className="relative rounded-full w-1.5 h-1.5 bg-primary-foreground" />
                    </span>
                    {texts.hero.openToWork}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Tags section — glass */}
        <div className="relative z-10 border-t border-white/20 bg-white/30 backdrop-blur-sm -mt-1">
          <div className="px-5 sm:px-7 pt-2.5 pb-4 sm:pt-3 sm:pb-4.5 lg:px-9 lg:pt-3 lg:pb-5">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-2 sm:space-y-2.5">
              {/* Core Stack */}
              {coreStackTag && (
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -1, transition: { duration: 0.2 } }}
                      className="group/tag relative flex items-start gap-2.5 p-3 sm:p-3.5 rounded-xl border-glow-sm bg-white/60 backdrop-blur-lg shadow-premium ring-1 ring-inset ring-white/[0.06] transition-all duration-300"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/[0.04] to-transparent opacity-0 group-hover/tag:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  {(() => {
                    const TagIcon = tagIcons[coreStackTag.title] || tagIcons['Core Stack'];
                    return (
                      <div className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10 ring-1 ring-inset ring-primary/15 shrink-0">
                        <TagIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                      </div>
                    );
                  })()}
                  <div className="relative min-w-0 flex-1">
                    <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-label mb-1.5">
                      {coreStackTag.title}
                    </p>
                    <div className="flex flex-wrap gap-1 sm:gap-1.5">
                      {coreStackChips.map((chip) => (
                        <span
                          key={chip}
                          className="inline-flex items-center text-[10px] sm:text-[11px] py-0.5 px-2 font-medium rounded-full bg-primary/8 border border-primary/15 text-primary ring-1 ring-inset ring-primary/[0.08] hover:bg-primary/15 hover:border-primary/35 hover:glow-primary transition-all duration-300"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Goal + Looking For */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                {otherTags.map((tag) => {
                  const TagIcon = tagIcons[tag.title] || tagIcons['Core Stack'];
                  return (
                    <motion.div
                      key={tag.title}
                      variants={itemVariants}
                      whileHover={{ y: -1, transition: { duration: 0.2 } }}
                  className="group/tag relative flex items-start gap-2.5 p-3 sm:p-3.5 rounded-xl border-glow-sm bg-white/60 backdrop-blur-lg shadow-premium ring-1 ring-inset ring-white/[0.06] transition-all duration-300"
                    >
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent/[0.04] to-transparent opacity-0 group-hover/tag:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      <div className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-accent/10 ring-1 ring-inset ring-accent/15 shrink-0">
                        <TagIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-foreground" />
                      </div>
                      <div className="relative min-w-0">
                        <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-label mb-0.5">
                          {tag.title}
                        </p>
                        <p className="text-[11px] sm:text-xs text-muted-foreground">{tag.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      </div>
    </motion.section>
  );
}
