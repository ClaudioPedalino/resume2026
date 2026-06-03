'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { WorkExperience } from '@/data/types';
import {
  sections,
  experiencePositionIcon,
  experienceBusinessAreaIcon,
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
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 200 : -200,
    opacity: 0,
    transition: { duration: 0.25, ease: [0.55, 0, 1, 0.45] as const },
  }),
};

function splitTechs(techs: string): string[] {
  return techs
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

const PositionIcon = experiencePositionIcon;
const BusinessIcon = experienceBusinessAreaIcon;

function ExperienceCard({ experience }: { experience: WorkExperience }) {
  const techList = splitTechs(experience.techs);

  return (
    <div className="group relative w-full rounded-xl border border-border/40 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-md ring-1 ring-inset ring-white/[0.04] shadow-premium hover:shadow-premium-lg hover:border-primary/40 hover:from-card/70 transition-all duration-500 overflow-hidden">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-accent/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative px-5 sm:px-6 pt-5 sm:pt-6 pb-2">
        {/* Row 1: Company + Flag | Period badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="inline-flex items-center justify-center min-w-[1.85rem] sm:min-w-[2.1rem] h-7 sm:h-8 px-1 rounded-md bg-gradient-to-b from-muted/60 to-muted/30 border border-border/40 ring-1 ring-inset ring-white/[0.06] text-base sm:text-lg shrink-0 shadow-sm"
              role="img"
              aria-label={experience.country}
            >
              {experience.countryFlag}
            </span>
            <h3 className="text-sm sm:text-base lg:text-lg font-bold text-foreground truncate">
              {experience.companyName}
            </h3>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] lg:text-xs font-medium whitespace-nowrap shrink-0 bg-gradient-to-b from-muted/40 to-muted/20 border border-border/40 ring-1 ring-inset ring-white/[0.06] text-muted-foreground">
            {experience.from} — {experience.to}
          </span>
        </div>

        {/* Row 2: Position/Role — below company, on its own line */}
        <div className="flex items-center gap-1.5 mt-2">
          <PositionIcon className="w-3.5 h-3.5 text-primary shrink-0" />
          <p className="text-xs sm:text-sm font-semibold text-primary">{experience.position}</p>
        </div>

        {/* Row 3: Business area */}
        <div className="flex items-center gap-1.5 mt-1">
          <BusinessIcon className="w-3 h-3 text-muted-foreground shrink-0" />
          <span className="text-xs sm:text-[13px] text-muted-foreground">{experience.businessArea}</span>
        </div>
      </div>

      <div className="relative px-5 sm:px-6 pb-5 sm:pb-6 space-y-3">
        {/* Tech chips — premium gradient pills */}
        <div className="flex flex-wrap gap-1 sm:gap-1.5 pt-1">
          {techList.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center text-[10px] sm:text-[11px] lg:text-xs py-0.5 px-2 font-medium rounded-full bg-gradient-to-b from-accent/12 to-accent/4 text-accent-foreground border border-accent/15 ring-1 ring-inset ring-accent/[0.08] hover:from-accent/20 hover:to-accent/8 hover:border-accent/30 transition-all duration-200"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Task descriptions */}
        <ul className="space-y-1.5">
          {experience.tasksDescriptions.map((task, i) => (
            <li
              key={i}
              className="text-xs sm:text-sm lg:text-[15px] text-muted-foreground flex gap-2"
            >
              <span className="text-primary mt-1.5 sm:mt-2 shrink-0 text-[5px] sm:text-[6px]">●</span>
              <span>{task}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
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
      className="w-full space-y-3 sm:space-y-4"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 ring-1 ring-inset ring-primary/15 shadow-premium">
          <SectionIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">{sections.experience.title}</h2>
      </div>

      {/* Carousel */}
      <div className="relative w-full">
        <div className="overflow-hidden rounded-xl">
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

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-3">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            onClick={goPrev}
            disabled={current === 0}
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border/40 bg-gradient-to-b from-card/70 to-card/30 ring-1 ring-inset ring-white/[0.08] shadow-premium hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-premium-lg transition-colors duration-200 disabled:opacity-25 disabled:pointer-events-none"
            aria-label={texts.experience.aria.previous}
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>

          <div className="flex items-center gap-1.5">
            {sortedExperiences.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > current ? 1 : -1);
                  setCurrent(i);
                }}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? 'w-6 h-2 sm:w-7 sm:h-2.5 bg-gradient-to-r from-primary to-primary/80 shadow-sm shadow-primary/30'
                    : 'w-2 h-2 sm:w-2.5 sm:h-2.5 bg-border/60 hover:bg-muted-foreground'
                }`}
                aria-label={texts.experience.aria.goTo(i + 1)}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            onClick={goNext}
            disabled={current === sortedExperiences.length - 1}
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border/40 bg-gradient-to-b from-card/70 to-card/30 ring-1 ring-inset ring-white/[0.08] shadow-premium hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-premium-lg transition-colors duration-200 disabled:opacity-25 disabled:pointer-events-none"
            aria-label={texts.experience.aria.next}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
}
