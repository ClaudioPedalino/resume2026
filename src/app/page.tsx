'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
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
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const dotConfigs = [
  { size: 3, offsetX: -40, offsetY: 0, factor: 0.2 },
  { size: 2, offsetX: -20, offsetY: -4, factor: 0.5 },
  { size: 5, offsetX: 0, offsetY: 0, factor: 1.0 },
  { size: 2, offsetX: 20, offsetY: 4, factor: 0.5 },
  { size: 3, offsetX: 40, offsetY: 0, factor: 0.2 },
];

function DividerDot({
  config,
  mouseX,
  index,
}: {
  config: (typeof dotConfigs)[number];
  mouseX: ReturnType<typeof useMotionValue<number>>;
  index: number;
}) {
  const x = useTransform(mouseX, (v) => v * config.factor);
  const springX = useSpring(x, { stiffness: 120, damping: 12 });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 + index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ x: springX }}
      className="absolute rounded-full bg-foreground/50"
      aria-hidden
    >
      <div
        className="rounded-full bg-foreground/60"
        style={{ width: config.size, height: config.size, marginLeft: config.offsetX, marginTop: config.offsetY }}
      />
    </motion.div>
  );
}

function SectionDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    mouseX.set((e.clientX - center) * 0.2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-20px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex items-center justify-center py-4 cursor-default"
    >
      {/* Left line */}
      <motion.div
        variants={lineVariants}
        className="flex-1 h-px bg-gradient-to-r from-transparent to-border/50 origin-right"
      />

      {/* Dots cluster — follows mouse X */}
      <div className="relative mx-4 shrink-0 w-[90px] h-4 flex items-center justify-center">
        {dotConfigs.map((config, i) => (
          <DividerDot key={i} config={config} mouseX={mouseX} index={i} />
        ))}
      </div>

      {/* Right line */}
      <motion.div
        variants={lineVariants}
        className="flex-1 h-px bg-gradient-to-r from-border/50 to-transparent origin-left"
      />
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
