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
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-primary/50" />

      {/* Center ornament — conic gradient with subtle glow */}
      <div className="flex items-center gap-1.5">
        <div className="w-1 h-1 rounded-full bg-primary/40" />
        <motion.div
          className="w-2.5 h-2.5 rounded-full shadow-md shadow-primary/30"
          style={{
            background:
              'conic-gradient(from 0deg, #C36B4D, #8DB4AD, #E8D9A1, #C36B4D)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        />
        <div className="w-1 h-1 rounded-full bg-accent/40" />
      </div>

      {/* Right gradient line */}
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-accent/30 to-accent/50" />
    </motion.div>
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

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
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
