'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
        className={`group relative rounded-xl border bg-card/40 backdrop-blur-md cursor-pointer select-none transition-all duration-300 ${theme.border} ${
          isOpen ? 'shadow-md' : 'shadow-sm hover:shadow-md'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Main row */}
        <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-3.5">
          {/* Icon */}
          <div className="shrink-0">
            <div className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg ${theme.iconBg} transition-transform duration-300 group-hover:scale-105`}>
              <Icon className={`w-4 h-4 ${theme.iconText}`} />
            </div>
          </div>

          {/* Title + Chips */}
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-foreground mb-1">{skill.area}</p>
            <div className="flex flex-wrap gap-1">
              {individualChips.map((chip) => (
                <Badge
                  key={chip}
                  variant="secondary"
                  className={`text-[9px] sm:text-[10px] py-0 px-1.5 font-medium ${theme.chipBg} border border-border/20`}
                >
                  {chip}
                </Badge>
              ))}
            </div>
          </div>

          {/* Chevron */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="shrink-0"
          >
            <div className={`flex items-center justify-center w-7 h-7 rounded-full border transition-colors duration-300 ${
              isOpen
                ? 'bg-primary/10 border-primary/15'
                : 'bg-card/50 border-border/40'
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
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
            >
              <div className="px-3 sm:px-3.5 pb-3 sm:pb-3.5">
                <div className="border-t border-border/30 pt-2.5 space-y-1.5">
                  {skill.description.map((desc, i) => (
                    <p
                      key={i}
                      className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed"
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
        <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-accent/8">
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
