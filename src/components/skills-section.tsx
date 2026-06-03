'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { Skill } from '@/data/types';
import {
  sections,
  skillIcons,
  skillThemes,
  defaultSkillTheme,
} from '@/data/site.config';

interface SkillsSectionProps {
  skills: Skill[];
}

/* Irregular border-radius presets — each card gets a unique shape */
const shapes = [
  '1.2rem 1.5rem 1.3rem 1.6rem',
  '1.5rem 1.2rem 1.6rem 1.3rem',
  '1.3rem 1.6rem 1.2rem 1.5rem',
  '1.6rem 1.3rem 1.5rem 1.2rem',
  '1.4rem 1.2rem 1.6rem 1.4rem',
] as const;

/* Hover mutation shapes — slightly different from resting */
const shapesHover = [
  '1.5rem 1.3rem 1.6rem 1.2rem',
  '1.2rem 1.6rem 1.3rem 1.5rem',
  '1.6rem 1.2rem 1.5rem 1.3rem',
  '1.3rem 1.5rem 1.2rem 1.6rem',
  '1.2rem 1.4rem 1.4rem 1.6rem',
] as const;

function splitChips(chips: string[]): string[] {
  return chips.flatMap((chip) =>
    chip.split(/[|,]/).map((s) => s.trim()).filter(Boolean)
  );
}

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = skillIcons[skill.icon] || skillIcons[skill.area] || skillIcons['Server'];
  const theme = skillThemes[skill.area] || defaultSkillTheme;
  const individualChips = splitChips(skill.chips);
  const shape = shapes[index % shapes.length];
  const shapeHover = shapesHover[index % shapesHover.length];

  return (
    <div>
      <div className="group relative">
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          style={{ borderRadius: shape }}
          className="w-full text-left relative border-glow bg-white/70 backdrop-blur-xl ring-1 ring-inset ring-white/[0.06] overflow-hidden transition-[border-radius,box-shadow,ring] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background shadow-premium"
          onMouseEnter={(e) => { e.currentTarget.style.borderRadius = shapeHover; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderRadius = shape; }}
        >
          {/* Inner refraction */}
          <div className="absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),inset_0_-1px_0_rgba(0,0,0,0.02)] pointer-events-none" />

          {/* Main row */}
          <div className="relative flex items-center gap-3 p-4 sm:p-4.5">
            {/* Icon — pulses on card hover */}
            <div className={`shrink-0 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 ${theme.iconBg} ring-1 ring-inset ring-white/[0.08] transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`} style={{ borderRadius: '0.65rem' }}>
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${theme.iconText} transition-all duration-300 group-hover:scale-110`} />
            </div>

            {/* Title + Chips */}
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base font-bold text-card-foreground tracking-tight mb-1.5">{skill.area}</p>
              <div className="flex flex-wrap gap-1">
                {individualChips.map((chip) => (
                  <span
                    key={chip}
                    className={`inline-flex items-center text-[9px] sm:text-[10px] py-0.5 px-2 font-semibold rounded-md ${theme.chipBg} ${theme.chipText} ring-1 ring-inset ring-black/[0.04] transition-all duration-300`}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            {/* Chevron */}
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="shrink-0"
            >
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ring-1 ring-inset transition-all duration-300 ${
                isOpen
                  ? 'bg-accent/15 ring-accent/20'
                  : 'bg-white/40 ring-white/[0.08] group-hover:bg-accent/10 group-hover:ring-accent/15'
              }`}>
                <ChevronDown className={`w-4 h-4 transition-colors duration-300 ${isOpen ? 'text-accent-foreground' : 'text-muted-foreground group-hover:text-accent-foreground'}`} />
              </div>
            </motion.div>
          </div>

          {/* Expandable description */}
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <div className="relative px-4 sm:px-4.5 pb-4 sm:pb-4.5">
                  <div className="border-t border-border/30 pt-3 space-y-2">
                    {skill.description.map((desc, i) => (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                        className="text-xs sm:text-sm text-muted-foreground leading-relaxed"
                      >
                        {desc}
                      </motion.p>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const sortedSkills = [...skills].sort((a, b) => a.order - b.order);
  const SectionIcon = sections.skills.icon;

  return (
    <section className="w-full space-y-3 sm:space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-accent/12 ring-1 ring-inset ring-white/[0.08]" style={{ borderRadius: '0.65rem' }}>
          <SectionIcon className="w-4 h-4 sm:w-5 sm:h-5 text-accent-foreground" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">{sections.skills.title}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
        {sortedSkills.map((skill, index) => (
          <SkillCard key={skill.area} skill={skill} index={index} />
        ))}
      </div>
    </section>
  );
}
