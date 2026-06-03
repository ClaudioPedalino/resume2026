'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import HeroSection from '@/components/hero-section';
import ExperienceSection from '@/components/experience-section';
import SkillsSection from '@/components/skills-section';
import Footer from '@/components/footer';
import { data } from '@/data/site.config';

/* ─── SCROLL PROGRESS BAR ────────────────────────────────────────────────────
 * Pure transform — no spring, no blur, no shimmer. Just scaleX.
 * Works with mouse, touch, trackpad, keyboard.
 */
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="relative z-10 w-full h-1 shrink-0 bg-muted/20">
      <motion.div
        className="absolute inset-y-0 left-0 origin-left bg-gradient-to-r from-primary via-accent to-secondary"
        style={{ scaleX, willChange: 'transform' }}
      />
    </div>
  );
}

/* ─── SECTION DIVIDER ────────────────────────────────────────────────────────
 * One-shot entrance: lines expand from center, dot fades in.
 * No perpetual animation. No blur. No springs. Just ease + opacity + scaleX.
 */
function SectionDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <div ref={ref} className="relative flex items-center justify-center py-1">
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/20 to-primary/40 origin-right"
      />

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
        className="mx-3 sm:mx-4 shrink-0 w-2 h-2 rounded-full bg-gradient-to-br from-primary/70 to-accent/50"
      />

      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.05, ease: [0.23, 1, 0.32, 1] }}
        className="flex-1 h-px bg-gradient-to-r from-primary/40 via-primary/20 to-transparent origin-left"
      />
    </div>
  );
}

/* ─── SCROLL REVEAL ──────────────────────────────────────────────────────────
 * Raw transform from scrollYProgress. No spring wrapper.
 * Opacity + translateY only. GPU-composited.
 */
function ScrollReveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 0.8'],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [30, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, y, willChange: 'transform,opacity' }} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── HERO PARALLAX ──────────────────────────────────────────────────────────
 * Subtle y-shift + opacity fade on scroll. No scale, no spring.
 */
function HeroParallax({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.3]);

  return (
    <motion.div ref={ref} style={{ y, opacity, willChange: 'transform,opacity' }}>
      {children}
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background relative">
      {/* Atmospheric radial gradient — static, no GPU cost */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(195,107,77,0.04), transparent 60%), radial-gradient(ellipse 60% 50% at 80% 100%, rgba(141,180,173,0.03), transparent 50%)',
        }}
      />

      <ScrollProgressBar />

      <main id="main-content" className="relative z-10 flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 lg:py-9">
        <div className="space-y-5 sm:space-y-6">
          <HeroParallax>
            <HeroSection personalInfo={data.personalInfo} tags={data.tags} />
          </HeroParallax>

          <SectionDivider />

          <ScrollReveal>
            <ExperienceSection experiences={data.workExperiences} />
          </ScrollReveal>

          <SectionDivider />

          <ScrollReveal>
            <SkillsSection skills={data.skills} />
          </ScrollReveal>
        </div>
      </main>

      <Footer />
    </div>
  );
}
