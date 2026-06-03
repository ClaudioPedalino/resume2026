// ═══════════════════════════════════════════════════════════════════════════════
// 📌 SITE CONFIG — ALL YOUR EDITABLE CONTENT & SETTINGS IN ONE PLACE
// ═══════════════════════════════════════════════════════════════════════════════
// Edit this file to customize your CV/resume site.
// All icons use Lucide icon names — browse available icons at https://lucide.dev/icons
// ═══════════════════════════════════════════════════════════════════════════════

import {
  Mail, Linkedin, Github, MapPin, Calendar, Globe, Briefcase,
  Server, Cloud, Monitor, TestTube2, Database, Network, Users,
  GitBranch, Sparkles, Blocks, Code2, Target, Search, Building2,
  Layers, Rocket, FileText, FileDown, Heart, ChevronLeft, ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import cvData from './cv-data.json';
import type { CVData } from './types';

// ─── YOUR CV DATA ─────────────────────────────────────────────────────────────
// Content lives in cv-data.json. Edit that file for: personal info, experiences,
// skills, tags. This config file controls HOW that data is displayed.
export const data = cvData as CVData;

// ─── SECTION HEADERS ──────────────────────────────────────────────────────────
// Customize the title and icon for each section
export const sections = {
  experience: {
    title: 'Work Experience',
    icon: Briefcase as LucideIcon,
  },
  skills: {
    title: 'Skills & Expertise',
    icon: Sparkles as LucideIcon,
  },
} as const;

// ─── HERO SECTION ─────────────────────────────────────────────────────────────
// Icons for the info badges shown below your name
export const heroBadgeIcons: { key: string; icon: LucideIcon; label: string }[] = [
  { key: 'age', icon: Calendar, label: 'age' },           // shows calculated age
  { key: 'location', icon: MapPin, label: 'location' },   // shows personalInfo.location
  { key: 'remote', icon: Globe, label: 'remote' },        // shows personalInfo.remote
  { key: 'english', icon: Briefcase, label: 'english' },  // shows personalInfo.englishLevel
];

// Icons for each tag card (Core Stack, Goal, Looking For)
// The "key" must match the "title" field in your tags array in cv-data.json
export const tagIcons: Record<string, LucideIcon> = {
  'Core Stack': Code2,
  'Goal': Target,
  'Looking For': Search,
};

// Contact link buttons shown in the hero
export const heroContactLinks: {
  icon: LucideIcon;
  label: string;
  hrefKey: 'mail' | 'linkedinUrl' | 'githubUrl';
  external: boolean;
}[] = [
  { icon: Mail, label: 'Email', hrefKey: 'mail', external: false },
  { icon: Linkedin, label: 'LinkedIn', hrefKey: 'linkedinUrl', external: true },
  { icon: Github, label: 'GitHub', hrefKey: 'githubUrl', external: true },
];

// Download button labels and icons
export const downloadButtons = {
  pdf: { icon: FileDown, label: 'PDF' },
  ats: { icon: FileText, label: 'ATS' },
};

// ─── WORK EXPERIENCE CARDS ────────────────────────────────────────────────────
// Icon displayed next to the position/role title
export const experiencePositionIcon: LucideIcon = Layers;

// Icon displayed next to the business area
export const experienceBusinessAreaIcon: LucideIcon = Building2;

// ─── SKILL ICONS ──────────────────────────────────────────────────────────────
// Maps skill "area" names to their icons.
// The key must match the "area" field in your skills array in cv-data.json.
// Alternatively, if you set an "icon" field in cv-data.json, it maps here too.
export const skillIcons: Record<string, LucideIcon> = {
  'Server': Server,
  'Cloud': Cloud,
  'Monitor': Monitor,
  'TestTube2': TestTube2,
  'Database': Database,
  'Network': Network,
  'Users': Users,
  'GitBranch': GitBranch,
  'Sparkles': Sparkles,
  'Blocks': Blocks,
};

// ─── SKILL AREA THEMES ────────────────────────────────────────────────────────
// Visual theme for each skill card. Key must match the "area" field.
export const skillThemes: Record<
  string,
  {
    gradientFrom: string;   // Tailwind bg-gradient-from class
    gradientTo: string;     // Tailwind bg-gradient-to class
    iconBg: string;         // Background class for the icon circle
    iconText: string;       // Text color class for the icon
    border: string;         // Hover border class
    glow: string;           // Shadow glow class on hover
    chipBg: string;         // Background for tech chips
    accentLine: string;     // Left accent border color
  }
> = {
  'Backend': {
    gradientFrom: 'from-primary/10',
    gradientTo: 'to-primary/2',
    iconBg: 'bg-primary/15',
    iconText: 'text-primary',
    border: 'hover:border-primary/30',
    glow: 'group-hover:shadow-primary/10',
    chipBg: 'bg-primary/8',
    accentLine: 'border-l-primary/60',
  },
  'Infrastructure': {
    gradientFrom: 'from-accent/10',
    gradientTo: 'to-accent/2',
    iconBg: 'bg-accent/18',
    iconText: 'text-accent-foreground',
    border: 'hover:border-accent/30',
    glow: 'group-hover:shadow-accent/10',
    chipBg: 'bg-accent/8',
    accentLine: 'border-l-accent/60',
  },
  'Frontend': {
    gradientFrom: 'from-secondary/15',
    gradientTo: 'to-secondary/2',
    iconBg: 'bg-secondary/25',
    iconText: 'text-label',
    border: 'hover:border-secondary/40',
    glow: 'group-hover:shadow-secondary/10',
    chipBg: 'bg-secondary/10',
    accentLine: 'border-l-secondary/60',
  },
  'Testing': {
    gradientFrom: 'from-primary/8',
    gradientTo: 'to-primary/1',
    iconBg: 'bg-primary/12',
    iconText: 'text-primary',
    border: 'hover:border-primary/25',
    glow: 'group-hover:shadow-primary/10',
    chipBg: 'bg-primary/8',
    accentLine: 'border-l-primary/40',
  },
  'Data': {
    gradientFrom: 'from-accent/8',
    gradientTo: 'to-accent/1',
    iconBg: 'bg-accent/12',
    iconText: 'text-accent-foreground',
    border: 'hover:border-accent/25',
    glow: 'group-hover:shadow-accent/10',
    chipBg: 'bg-accent/8',
    accentLine: 'border-l-accent/40',
  },
  'Communication': {
    gradientFrom: 'from-secondary/10',
    gradientTo: 'to-secondary/2',
    iconBg: 'bg-secondary/20',
    iconText: 'text-label',
    border: 'hover:border-secondary/30',
    glow: 'group-hover:shadow-secondary/10',
    chipBg: 'bg-secondary/8',
    accentLine: 'border-l-secondary/40',
  },
  'Agile': {
    gradientFrom: 'from-primary/10',
    gradientTo: 'to-primary/2',
    iconBg: 'bg-primary/15',
    iconText: 'text-primary',
    border: 'hover:border-primary/30',
    glow: 'group-hover:shadow-primary/10',
    chipBg: 'bg-primary/8',
    accentLine: 'border-l-primary/50',
  },
  'Versioning': {
    gradientFrom: 'from-accent/10',
    gradientTo: 'to-accent/2',
    iconBg: 'bg-accent/15',
    iconText: 'text-accent-foreground',
    border: 'hover:border-accent/30',
    glow: 'group-hover:shadow-accent/10',
    chipBg: 'bg-accent/8',
    accentLine: 'border-l-accent/50',
  },
  'AI Tools': {
    gradientFrom: 'from-primary/12',
    gradientTo: 'to-primary/3',
    iconBg: 'bg-primary/18',
    iconText: 'text-primary',
    border: 'hover:border-primary/35',
    glow: 'group-hover:shadow-primary/12',
    chipBg: 'bg-primary/10',
    accentLine: 'border-l-primary/60',
  },
  'Blockchain': {
    gradientFrom: 'from-accent/12',
    gradientTo: 'to-accent/3',
    iconBg: 'bg-accent/18',
    iconText: 'text-accent-foreground',
    border: 'hover:border-accent/35',
    glow: 'group-hover:shadow-accent/12',
    chipBg: 'bg-accent/10',
    accentLine: 'border-l-accent/60',
  },
};

// Default theme fallback for any skill area not listed above
export const defaultSkillTheme = {
  gradientFrom: 'from-muted/10',
  gradientTo: 'to-muted/2',
  iconBg: 'bg-muted',
  iconText: 'text-muted-foreground',
  border: 'hover:border-border',
  glow: 'group-hover:shadow-muted/10',
  chipBg: 'bg-muted/50',
  accentLine: 'border-l-border',
};

// ─── FOOTER ───────────────────────────────────────────────────────────────────
export const footerLinks: {
  icon: LucideIcon;
  hrefKey: 'mail' | 'linkedinUrl' | 'githubUrl';
  external: boolean;
  ariaLabel: string;
}[] = [
  { icon: Mail, hrefKey: 'mail', external: false, ariaLabel: 'Email' },
  { icon: Linkedin, hrefKey: 'linkedinUrl', external: true, ariaLabel: 'LinkedIn' },
  { icon: Github, hrefKey: 'githubUrl', external: true, ariaLabel: 'GitHub' },
];

// ─── DOWNLOAD FILENAMES ───────────────────────────────────────────────────────
export const downloadFilenames = {
  pdf: `${data.personalInfo.fullName.replace(/\s+/g, '_')}_CV.pdf`,
  ats: `${data.personalInfo.fullName.replace(/\s+/g, '_')}_CV_ATS.txt`,
};
