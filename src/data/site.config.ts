// ═══════════════════════════════════════════════════════════════════════════════
// SITE CONFIG — UI/UX & VISUAL SETTINGS IN ONE PLACE
// ═══════════════════════════════════════════════════════════════════════════════
// Edit this file to control HOW your CV is displayed (icons, themes, layout).
// All text/labels live in ./texts.ts.
// All CV content (personal info, experiences, skills) lives in ./cv-data.json.
// All icons use Lucide icon names — browse available icons at https://lucide.dev/icons
// ═══════════════════════════════════════════════════════════════════════════════

import {
  Mail, Linkedin, Github, MapPin, Calendar, Globe, Briefcase,
  Server, Cloud, Monitor, FlaskConical, Database, Handshake, Users,
  GitBranch, Wrench,   Link, Code2, Target, Search, Building2,
  Layers, FileText, FileDown, Brain,
  type LucideIcon,
} from 'lucide-react';
import cvData from './cv-data.json';
import type { CVData } from './types';
import { texts } from './texts';

// ─── YOUR CV DATA ─────────────────────────────────────────────────────────────
// Content lives in cv-data.json. Edit that file for: personal info, experiences,
// skills, tags. This config file controls HOW that data is displayed.
export const data = cvData as CVData;

// ─── SECTION HEADERS ──────────────────────────────────────────────────────────
// Customize the icon for each section. Title text comes from texts.ts.
export const sections = {
  experience: {
    title: texts.experience.title,
    icon: Briefcase as LucideIcon,
  },
  skills: {
    title: texts.skills.title,
    icon: Wrench as LucideIcon,
  },
} as const;

// ─── HERO SECTION ─────────────────────────────────────────────────────────────
// Icons for the info badges shown below your name
export const heroBadgeIcons: { key: string; icon: LucideIcon }[] = [
  { key: texts.hero.badgeKey.age, icon: Calendar },
  { key: texts.hero.badgeKey.location, icon: MapPin },
  { key: texts.hero.badgeKey.remote, icon: Globe },
  { key: texts.hero.badgeKey.english, icon: Briefcase },
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
  { icon: Mail, label: texts.hero.contactLabel.email, hrefKey: 'mail', external: false },
  { icon: Linkedin, label: texts.hero.contactLabel.linkedin, hrefKey: 'linkedinUrl', external: true },
  { icon: Github, label: texts.hero.contactLabel.github, hrefKey: 'githubUrl', external: true },
];

// Download button icons. Labels come from texts.ts.
export const downloadButtons = {
  pdf: { icon: FileDown, label: texts.hero.download.pdf },
  ats: { icon: FileText, label: texts.hero.download.ats },
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
  'FlaskConical': FlaskConical,
  'Database': Database,
  'Handshake': Handshake,
  'Users': Users,
  'GitBranch': GitBranch,
  'Wrench': Wrench,
  'Link': Link,
  'Brain': Brain,
};

// ─── SKILL AREA THEMES ────────────────────────────────────────────────────────
// Visual theme for each skill card. Key must match the "area" field.
export const skillThemes: Record<
  string,
  {
    gradientFrom: string;
    gradientTo: string;
    iconBg: string;
    iconText: string;
    chipBg: string;
  }
> = {
  'Backend': {
    gradientFrom: 'from-primary/10',
    gradientTo: 'to-primary/2',
    iconBg: 'bg-primary/15',
    iconText: 'text-primary',
    chipBg: 'bg-primary/8',
  },
  'Infrastructure': {
    gradientFrom: 'from-accent/10',
    gradientTo: 'to-accent/2',
    iconBg: 'bg-accent/18',
    iconText: 'text-accent-foreground',
    chipBg: 'bg-accent/8',
  },
  'Frontend': {
    gradientFrom: 'from-secondary/15',
    gradientTo: 'to-secondary/2',
    iconBg: 'bg-secondary/25',
    iconText: 'text-label',
    chipBg: 'bg-secondary/10',
  },
  'Testing': {
    gradientFrom: 'from-primary/8',
    gradientTo: 'to-primary/1',
    iconBg: 'bg-primary/12',
    iconText: 'text-primary',
    chipBg: 'bg-primary/8',
  },
  'Data': {
    gradientFrom: 'from-accent/8',
    gradientTo: 'to-accent/1',
    iconBg: 'bg-accent/12',
    iconText: 'text-accent-foreground',
    chipBg: 'bg-accent/8',
  },
  'Communication': {
    gradientFrom: 'from-secondary/10',
    gradientTo: 'to-secondary/2',
    iconBg: 'bg-secondary/20',
    iconText: 'text-label',
    chipBg: 'bg-secondary/8',
  },
  'Agile': {
    gradientFrom: 'from-primary/10',
    gradientTo: 'to-primary/2',
    iconBg: 'bg-primary/15',
    iconText: 'text-primary',
    chipBg: 'bg-primary/8',
  },
  'Versioning': {
    gradientFrom: 'from-accent/10',
    gradientTo: 'to-accent/2',
    iconBg: 'bg-accent/15',
    iconText: 'text-accent-foreground',
    chipBg: 'bg-accent/8',
  },
  'AI Tools': {
    gradientFrom: 'from-primary/12',
    gradientTo: 'to-primary/3',
    iconBg: 'bg-primary/18',
    iconText: 'text-primary',
    chipBg: 'bg-primary/10',
  },
  'Blockchain': {
    gradientFrom: 'from-accent/12',
    gradientTo: 'to-accent/3',
    iconBg: 'bg-accent/18',
    iconText: 'text-accent-foreground',
    chipBg: 'bg-accent/10',
  },
};

// Default theme fallback for any skill area not listed above
export const defaultSkillTheme = {
  gradientFrom: 'from-muted/10',
  gradientTo: 'to-muted/2',
  iconBg: 'bg-muted',
  iconText: 'text-muted-foreground',
  chipBg: 'bg-muted/50',
};

// ─── DOWNLOAD FILENAMES ───────────────────────────────────────────────────────
export const downloadFilenames = {
  pdf: texts.pdf.filename,
  ats: texts.ats.filename,
};

// ─── COUNTRY FLAG IMAGES ─────────────────────────────────────────────────────
export const flagImages: Record<string, string> = {
  AR: '/assets/flags/ar.png',
  CL: '/assets/flags/cl.png',
  BR: '/assets/flags/br.png',
  PA: '/assets/flags/pa.png',
};
