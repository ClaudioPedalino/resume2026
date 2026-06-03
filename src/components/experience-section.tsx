'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { WorkExperience } from '@/data/types';
import {
  sections,
  experiencePositionIcon,
  experienceBusinessAreaIcon,
  flagImages,
} from '@/data/site.config';
import { parseMonthYear } from '@/lib/date';
import { texts } from '@/data/texts';

interface ExperienceSectionProps {
  experiences: WorkExperience[];
}

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const cardVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 180 : -180,
    opacity: 0,
    scale: 0.97,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 200, damping: 24 },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

function splitTechs(techs: string): string[] {
  return techs.split(',').map((t) => t.trim()).filter(Boolean);
}

const PositionIcon = experiencePositionIcon;
const BusinessIcon = experienceBusinessAreaIcon;

function ExperienceCard({ experience }: { experience: WorkExperience }) {
  const techList = splitTechs(experience.techs);

  return (
    <motion.div
      whileHover={{ y: -3, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
      className="group relative w-full"
    >
      {/* Card — white solid bg, premium shadow, inner refraction */}
      <div className="relative rounded-2xl bg-card shadow-premium ring-1 ring-inset ring-white/[0.06] overflow-hidden transition-shadow duration-300 group-hover:shadow-premium-lg">
        {/* Inner refraction — liquid glass edge highlight */}
        <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.8),inset_0_-1px_0_rgba(0,0,0,0.02)] pointer-events-none" />
        {/* Top accent line — brand color */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/60 via-primary/30 to-transparent" />

        <div className="relative px-5 sm:px-6 pt-5 sm:pt-6 pb-2">
          {/* Row 1: Company + Flag | Period badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-muted/60 ring-1 ring-inset ring-black/[0.04] overflow-hidden shrink-0">
                {flagImages[experience.countryFlag] ? (
                  <Image
                    src={flagImages[experience.countryFlag]}
                    alt={experience.country}
                    width={36}
                    height={36}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-sm" role="img" aria-label={experience.country}>
                    {experience.countryFlag}
                  </span>
                )}
              </span>
              <h3 className="text-sm sm:text-base lg:text-lg font-bold text-card-foreground truncate tracking-tight">
                {experience.companyName}
              </h3>
            </div>
            <span className="inline-flex items-center px-3.5 py-1 rounded-full text-[10px] sm:text-[11px] lg:text-xs font-medium whitespace-nowrap tracking-wide shrink-0 bg-muted/50 ring-1 ring-inset ring-black/[0.04] text-muted-foreground">
              {experience.from} — {experience.to}
            </span>
          </div>

          {/* Row 2: Position/Role */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-primary/10 ring-1 ring-inset ring-primary/10 shrink-0">
              <PositionIcon className="w-3 h-3 text-primary" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-primary">{experience.position}</p>
          </div>

          {/* Row 3: Business area */}
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-muted/50 ring-1 ring-inset ring-black/[0.04] shrink-0">
              <BusinessIcon className="w-3 h-3 text-muted-foreground" />
            </div>
            <span className="text-xs sm:text-[13px] text-muted-foreground">Business area: {experience.businessArea}</span>
          </div>
        </div>

        <div className="relative px-5 sm:px-6 pb-5 sm:pb-6 space-y-3">
          {/* Tech chips — colored, visible, tactile */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {techList.map((tech) => (
              <motion.span
                key={tech}
                whileHover={{ scale: 1.06, y: -1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="inline-flex items-center text-[10px] sm:text-[11px] lg:text-xs py-0.5 px-2.5 font-medium rounded-full bg-gradient-to-b from-secondary/50 to-secondary/30 text-secondary-foreground ring-1 ring-inset ring-black/[0.04] shadow-sm cursor-default"
              >
                {tech}
              </motion.span>
            ))}
          </div>

          {/* Task descriptions */}
          <ul className="space-y-2">
            {experience.tasksDescriptions.map((task, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
                className="text-xs sm:text-sm text-muted-foreground flex gap-2.5 leading-relaxed"
              >
                <span className="text-primary mt-1.5 shrink-0 text-[6px]">●</span>
                <span>{task}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const sortedExperiences = [...experiences].sort(
    (a, b) => parseMonthYear(b.to).getTime() - parseMonthYear(a.to).getTime()
  );

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const goNext = useCallback(() => {
    if (current < sortedExperiences.length - 1) {
      setDirection(1);
      setCurrent((prev) => prev + 1);
    }
  }, [current, sortedExperiences.length]);

  const goPrev = useCallback(() => {
    if (current > 0) {
      setDirection(-1);
      setCurrent((prev) => prev - 1);
    }
  }, [current]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  const SectionIcon = sections.experience.icon;

  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-30px' }}
      className="w-full space-y-4"
    >
      {/* Section Header + Navigation */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: -8, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 ring-1 ring-inset ring-primary/10"
          >
            <SectionIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </motion.div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">{sections.experience.title}</h2>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9, y: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            onClick={goPrev}
            disabled={current === 0}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-card shadow-premium ring-1 ring-inset ring-black/[0.04] hover:shadow-premium-lg hover:bg-primary hover:text-primary-foreground transition-colors duration-200 disabled:opacity-25 disabled:pointer-events-none"
            aria-label={texts.experience.aria.previous}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </motion.button>

          <div className="flex items-center gap-1.5">
            {sortedExperiences.map((_, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                onClick={() => {
                  setDirection(i > current ? 1 : -1);
                  setCurrent(i);
                }}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? 'w-5 h-1.5 bg-primary shadow-sm shadow-primary/30'
                    : 'w-1.5 h-1.5 bg-border hover:bg-muted-foreground'
                }`}
                aria-label={texts.experience.aria.goTo(i + 1)}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9, y: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            onClick={goNext}
            disabled={current === sortedExperiences.length - 1}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-card shadow-premium ring-1 ring-inset ring-black/[0.04] hover:shadow-premium-lg hover:bg-primary hover:text-primary-foreground transition-colors duration-200 disabled:opacity-25 disabled:pointer-events-none"
            aria-label={texts.experience.aria.next}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative w-full">
        <div className="overflow-hidden rounded-2xl">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full"
            >
              <ExperienceCard experience={sortedExperiences[current]} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}
