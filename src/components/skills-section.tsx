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

function splitChips(chips: string[]): string[] {
  return chips.flatMap((chip) =>
    chip.split(/[|,]/).map((s) => s.trim()).filter(Boolean)
  );
}

function SkillCard({ skill }: { skill: Skill }) {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = skillIcons[skill.icon] || skillIcons[skill.area] || skillIcons['Server'];
  const theme = skillThemes[skill.area] || defaultSkillTheme;
  const individualChips = splitChips(skill.chips);

  return (
    <div>
      <motion.div
        whileHover={{ y: -2, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
        className="group relative"
      >
        {/* Card — white solid bg, premium shadow */}
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full text-left relative rounded-2xl border-glow bg-white/70 backdrop-blur-xl ring-1 ring-inset ring-white/[0.06] overflow-hidden transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
            isOpen ? 'shadow-premium-lg' : 'shadow-premium'
          }`}
        >
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
              <div className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${theme.iconBg} backdrop-blur-sm ring-1 ring-inset ring-white/[0.08]`}>
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
                    className={`inline-flex items-center text-[9px] sm:text-[10px] py-0.5 px-2 font-medium rounded-full ${theme.chipBg} ring-1 ring-inset ring-white/[0.08] shadow-sm backdrop-blur-sm`}
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
              <div className={`flex items-center justify-center w-8 h-8 rounded-full backdrop-blur-sm ring-1 ring-inset transition-all duration-300 ${
                isOpen
                  ? 'bg-primary/10 ring-primary/15'
                  : 'bg-white/40 ring-white/[0.08] group-hover:bg-white/60'
              }`}>
                <ChevronDown className={`w-4 h-4 transition-colors duration-200 ${isOpen ? 'text-primary' : 'text-muted-foreground'}`} />
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
      </motion.div>
    </div>
  );
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const sortedSkills = [...skills].sort((a, b) => a.order - b.order);
  const SectionIcon = sections.skills.icon;

  return (
    <section className="w-full space-y-3 sm:space-y-4">
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ rotate: 8, scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-accent/15 backdrop-blur-sm ring-1 ring-inset ring-accent/10 hover:glow-accent transition-shadow duration-300"
        >
          <SectionIcon className="w-4 h-4 sm:w-5 sm:h-5 text-accent-foreground" />
        </motion.div>
        <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">{sections.skills.title}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
          {sortedSkills.map((skill) => (
          <SkillCard key={skill.area} skill={skill} />
        ))}
      </div>
    </section>
  );
}
