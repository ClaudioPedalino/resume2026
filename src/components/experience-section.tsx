'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { WorkExperience } from '@/data/types';
import {
  sections,
  experiencePositionIcon,
  experienceBusinessAreaIcon,
} from '@/data/site.config';

interface ExperienceSectionProps {
  experiences: WorkExperience[];
}

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
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
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 200 : -200,
    opacity: 0,
    transition: { duration: 0.25, ease: [0.55, 0, 1, 0.45] },
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
    <div className="w-full rounded-xl border-l-4 border-l-primary bg-card/40 backdrop-blur-md hover:shadow-lg hover:border-l-accent transition-all duration-300 shadow-sm overflow-hidden">
      <div className="px-4 sm:px-5 pt-4 sm:pt-5 pb-2">
        {/* Row 1: Company + Flag | Period badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg sm:text-xl shrink-0" role="img" aria-label={experience.country}>
              {experience.countryFlag}
            </span>
            <h3 className="text-sm sm:text-base lg:text-lg font-bold text-foreground truncate">
              {experience.companyName}
            </h3>
          </div>
          <Badge
            variant="outline"
            className="text-[9px] sm:text-[10px] lg:text-xs font-medium whitespace-nowrap shrink-0 bg-muted/30 border-border/40"
          >
            {experience.from} — {experience.to}
          </Badge>
        </div>

        {/* Row 2: Position/Role — below company, on its own line */}
        <div className="flex items-center gap-1.5 mt-2">
          <PositionIcon className="w-3.5 h-3.5 text-primary shrink-0" />
          <p className="text-xs sm:text-sm font-semibold text-primary">{experience.position}</p>
        </div>

        {/* Row 3: Business area */}
        <div className="flex items-center gap-1.5 mt-1">
          <BusinessIcon className="w-3 h-3 text-muted-foreground shrink-0" />
          <span className="text-[11px] sm:text-xs text-muted-foreground">{experience.businessArea}</span>
        </div>
      </div>

      <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-3">
        {/* Tech chips */}
        <div className="flex flex-wrap gap-1 sm:gap-1.5 pt-1">
          {techList.map((tech) => (
            <Badge
              key={tech}
              variant="secondary"
              className="text-[9px] sm:text-[10px] lg:text-[11px] py-0.5 px-1.5 sm:px-2 font-medium bg-accent/8 text-accent-foreground border border-accent/10 hover:bg-accent/15 transition-colors duration-200"
            >
              {tech}
            </Badge>
          ))}
        </div>

        {/* Task descriptions */}
        <ul className="space-y-1.5">
          {experience.tasksDescriptions.map((task, i) => (
            <li
              key={i}
              className="text-[11px] sm:text-xs lg:text-sm text-muted-foreground leading-relaxed flex gap-2"
            >
              <span className="text-primary mt-1 sm:mt-1.5 shrink-0 text-[5px] sm:text-[6px]">●</span>
              <span>{task}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const sortedExperiences = [...experiences].sort((a, b) => {
    const parseDate = (dateStr: string) => {
      const parts = dateStr.replace('-', ' ').split(' ');
      const months: Record<string, number> = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
      };
      return new Date(parseInt(parts[1] || '0'), months[parts[0]] || 0);
    };
    return parseDate(b.to).getTime() - parseDate(a.to).getTime();
  });

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
        <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/8">
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
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goPrev}
            disabled={current === 0}
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-border/50 bg-card/50 shadow-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 disabled:opacity-25 disabled:pointer-events-none"
            aria-label="Previous experience"
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
                    ? 'w-5 h-1.5 sm:w-6 sm:h-2 bg-primary'
                    : 'w-1.5 h-1.5 sm:w-2 sm:h-2 bg-border hover:bg-muted-foreground'
                }`}
                aria-label={`Go to experience ${i + 1}`}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goNext}
            disabled={current === sortedExperiences.length - 1}
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-border/50 bg-card/50 shadow-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 disabled:opacity-25 disabled:pointer-events-none"
            aria-label="Next experience"
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
}
