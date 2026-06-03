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

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function splitChips(chips: string[]): string[] {
  return chips.flatMap((chip) =>
    chip
      .split(/[|,]/)
      .map((s) => s.trim())
      .filter(Boolean)
  );
}

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = skillIcons[skill.icon] || skillIcons[skill.area] || skillIcons['Server'];
  const theme = skillThemes[skill.area] || defaultSkillTheme;
  const individualChips = splitChips(skill.chips);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] as const }}
    >
      <div
        className={`group relative rounded-xl border bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-md cursor-pointer select-none transition-all duration-300 ring-1 ring-inset ring-white/[0.05] ${theme.border} ${
          isOpen ? 'shadow-premium-lg' : 'shadow-premium hover:shadow-premium-lg'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Subtle gradient overlay on hover/open */}
        <div className={`absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-accent/[0.03] pointer-events-none rounded-xl transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />

        {/* Main row */}
        <div className="relative flex items-center gap-2.5 sm:gap-3 p-3.5 sm:p-4">
          {/* Icon */}
          <div className="shrink-0">
            <div className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg ${theme.iconBg} ring-1 ring-inset ring-white/[0.08] transition-transform duration-300 group-hover:scale-105 shadow-sm`}>
              <Icon className={`w-4 h-4 ${theme.iconText}`} />
            </div>
          </div>

          {/* Title + Chips */}
          <div className="flex-1 min-w-0">
            <p className="text-sm sm:text-base font-semibold text-foreground mb-1">{skill.area}</p>
            <div className="flex flex-wrap gap-1">
              {individualChips.map((chip) => (
                <span
                  key={chip}
                  className={`inline-flex items-center text-[9px] sm:text-[10px] py-0 px-1.5 font-medium rounded-full ${theme.chipBg} border border-border/25 ring-1 ring-inset ring-white/[0.04]`}
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
            <div className={`flex items-center justify-center w-7 h-7 rounded-full border ring-1 ring-inset transition-all duration-300 ${
              isOpen
                ? 'bg-primary/15 border-primary/25 ring-primary/15'
                : 'bg-card/50 border-border/40 ring-white/[0.06]'
            }`}>
              <ChevronDown className={`w-3.5 h-3.5 transition-colors duration-300 ${isOpen ? 'text-primary' : 'text-muted-foreground'}`} />
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
              <div className="relative px-3.5 sm:px-4 pb-3.5 sm:pb-4">
                <div className="border-t border-border/30 pt-3 space-y-1.5">
                  {skill.description.map((desc, i) => (
                    <p
                      key={i}
                      className="text-xs sm:text-sm text-muted-foreground"
                    >
                      {desc}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const sortedSkills = [...skills].sort((a, b) => a.order - b.order);
  const SectionIcon = sections.skills.icon;

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
        <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-accent/18 to-accent/5 ring-1 ring-inset ring-accent/15 shadow-premium">
          <SectionIcon className="w-4 h-4 sm:w-5 sm:h-5 text-accent-foreground" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">{sections.skills.title}</h2>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-2.5">
        {sortedSkills.map((skill, index) => (
          <SkillCard key={skill.area} skill={skill} index={index} />
        ))}
      </div>
    </motion.section>
  );
}
