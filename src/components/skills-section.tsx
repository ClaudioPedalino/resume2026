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
    chip.split(/[|,]/).map((s) => s.trim()).filter(Boolean)
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
      <motion.div
        whileHover={{ y: -2, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
        className="group relative cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Card — white solid bg, premium shadow */}
        <div className={`relative rounded-2xl bg-card ring-1 ring-inset ring-white/[0.06] overflow-hidden transition-shadow duration-300 ${
          isOpen ? 'shadow-premium-lg' : 'shadow-premium group-hover:shadow-premium-lg'
        }`}>
          {/* Inner refraction */}
          <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.8),inset_0_-1px_0_rgba(0,0,0,0.02)] pointer-events-none" />
          {/* Top accent — themed per skill area */}
          <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${theme.gradientFrom} via-primary/30 to-transparent`} />

          {/* Main row */}
          <div className="relative flex items-center gap-3 p-4 sm:p-4.5">
            {/* Icon */}
            <motion.div
              whileHover={{ rotate: -8, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="shrink-0"
            >
              <div className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${theme.iconBg} ring-1 ring-inset ring-white/[0.08]`}>
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${theme.iconText}`} />
              </div>
            </motion.div>

            {/* Title + Chips */}
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base font-bold text-card-foreground tracking-tight mb-1.5">{skill.area}</p>
              <div className="flex flex-wrap gap-1">
                {individualChips.map((chip) => (
                  <span
                    key={chip}
                    className={`inline-flex items-center text-[9px] sm:text-[10px] py-0.5 px-2 font-medium rounded-full ${theme.chipBg} ring-1 ring-inset ring-black/[0.04] shadow-sm`}
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
                  ? 'bg-primary/10 ring-primary/15'
                  : 'bg-muted/50 ring-black/[0.04] group-hover:bg-muted/80'
              }`}>
                <ChevronDown className={`w-4 h-4 transition-colors duration-300 ${isOpen ? 'text-primary' : 'text-muted-foreground'}`} />
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
                  <div className="border-t border-border/40 pt-3 space-y-2">
                    {skill.description.map((desc, i) => (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
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
        </div>
      </motion.div>
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
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ rotate: 8, scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-accent/15 ring-1 ring-inset ring-accent/10"
        >
          <SectionIcon className="w-4 h-4 sm:w-5 sm:h-5 text-accent-foreground" />
        </motion.div>
        <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">{sections.skills.title}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
        {sortedSkills.map((skill, index) => (
          <SkillCard key={skill.area} skill={skill} index={index} />
        ))}
      </div>
    </motion.section>
  );
}
