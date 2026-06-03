'use client';

import { motion } from 'framer-motion';
import HeroSection from '@/components/hero-section';
import ExperienceSection from '@/components/experience-section';
import SkillsSection from '@/components/skills-section';
import Footer from '@/components/footer';
import { data } from '@/data/site.config';

const lineVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const centerVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function SectionDivider() {
  return (
    <div className="relative flex items-center justify-center py-1">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={lineVariants}
        className="flex-1 h-px bg-gradient-to-r from-transparent via-border/30 to-border/40 origin-right"
      />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={centerVariants}
        className="relative mx-3 shrink-0"
      >
        <motion.div
          className="w-2 h-2 rounded-full bg-gradient-to-br from-primary/60 to-accent/30"
          animate={{ opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={lineVariants}
        className="flex-1 h-px bg-gradient-to-r from-border/40 via-border/30 to-transparent origin-left"
      />
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      {/* Decorative top gradient bar — premium mesh */}
      <div className="relative w-full h-1 shrink-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 lg:py-9">
        <div className="space-y-5 sm:space-y-6">
          <HeroSection personalInfo={data.personalInfo} tags={data.tags} />
          <SectionDivider />
          <ExperienceSection experiences={data.workExperiences} />
          <SectionDivider />
          <SkillsSection skills={data.skills} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
