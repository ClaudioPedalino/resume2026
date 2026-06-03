'use client';

import { motion } from 'framer-motion';
import HeroSection from '@/components/hero-section';
import ExperienceSection from '@/components/experience-section';
import SkillsSection from '@/components/skills-section';
import Footer from '@/components/footer';
import { data } from '@/data/site.config';

const dividerVariants = {
  hidden: { opacity: 0, scaleX: 0.2 },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function SectionDivider() {
  return (
    <motion.div
      variants={dividerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex items-center gap-2 py-1"
    >
      {/* Left gradient line */}
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/25 to-primary/40" />

      {/* Center ornament */}
      <div className="flex items-center gap-1.5">
        <div className="w-1 h-1 rounded-full bg-primary/30" />
        <div className="w-2 h-2 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 backdrop-blur-sm shadow-sm shadow-primary/20" />
        <div className="w-1 h-1 rounded-full bg-accent/30" />
      </div>

      {/* Right gradient line */}
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-accent/25 to-accent/40" />
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Decorative top gradient bar */}
      <div className="w-full h-1 bg-gradient-to-r from-primary via-accent to-secondary shrink-0" />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 lg:py-10">
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
