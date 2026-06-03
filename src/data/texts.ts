// ═══════════════════════════════════════════════════════════════════════════════
// 📝 TEXTS — ALL USER-FACING TEXT IN ONE PLACE
// ═══════════════════════════════════════════════════════════════════════════════
// Edit this file to change any text, label, or microcopy across the site.
// Components and routes import from here — never hardcode text elsewhere.
// ═══════════════════════════════════════════════════════════════════════════════

export const texts = {
  // ─── SITE METADATA (layout.tsx + JSON-LD) ───────────────────────────────────
  site: {
    title: "Claudio Pedalino — Senior .NET Software Engineer",
    shortTitle: "Claudio Pedalino",
    description:
      "Professional curriculum vitae of Claudio Pedalino. Senior .NET Software Engineer specializing in microservices, APIs, and distributed systems. Remote only.",
    shortDescription:
      "Professional CV — Senior .NET Software Engineer specializing in microservices, APIs, and distributed systems.",
    keywords: [
      "Claudio Pedalino",
      "Senior .NET Software Engineer",
      "Microservices",
      "APIs",
      "Distributed Systems",
      "Remote",
      "Argentina",
      "Software Engineer",
      "CV",
      "Resume",
    ],
    author: "Claudio Pedalino",
    siteName: "Claudio Pedalino",
    canonical: "/",
    jsonLd: {
      jobTitle: "Senior .NET Software Engineer",
      description:
        "Senior .NET Software Engineer specializing in microservices, APIs, and distributed systems.",
      email: "mailto:claudio.dpedalino@gmail.com",
      addressCountry: "AR",
      knowsAbout: [
        ".NET",
        "Microservices",
        "Distributed Systems",
        "APIs",
        "Azure",
        "Docker",
        "Kubernetes",
        "SQL Server",
        "PostgreSQL",
      ],
      sameAs: [
        "https://www.linkedin.com/in/claudio-pedalino/",
        "https://github.com/ClaudioPedalino",
      ],
    },
  },

  // ─── HERO SECTION ───────────────────────────────────────────────────────────
  hero: {
    openToWork: "Open to work",
    ageSuffix: "yrs",
    englishPrefix: "EN",
    badgeKey: {
      age: "age",
      location: "location",
      remote: "remote",
      english: "english",
    },
    contactLabel: {
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
    },
    download: {
      pdf: "PDF",
      ats: "ATS",
    },
  },

  // ─── EXPERIENCE SECTION ─────────────────────────────────────────────────────
  experience: {
    title: "Work Experience",
    aria: {
      previous: "Previous experience",
      next: "Next experience",
      goTo: (i: number) => `Go to experience ${i}`,
    },
  },

  // ─── SKILLS SECTION ─────────────────────────────────────────────────────────
  skills: {
    title: "Skills & Expertise",
  },

  // ─── FOOTER ─────────────────────────────────────────────────────────────────
  footer: {
    builtWith: "Built with",
    by: "by",
    rightsReserved: "All rights reserved",
  },

  // ─── PDF EXPORT ROUTE ───────────────────────────────────────────────────────
  pdf: {
    workExperience: "WORK EXPERIENCE",
    skillsExpertise: "SKILLS & EXPERTISE",
    technologies: "Technologies:",
    curriculumVitae: "Curriculum Vitae",
    englishLabel: "English:",
    contactLinks: "LinkedIn  |  GitHub",
    contactSeparator: "  |  ",
    page: (fullName: string, current: number, total: number) =>
      `${fullName} — Curriculum Vitae — Page ${current} of ${total}`,
    filename: "Claudio_Pedalino_CV.pdf",
  },

  // ─── ATS EXPORT ROUTE ───────────────────────────────────────────────────────
  ats: {
    workExperience: "WORK EXPERIENCE",
    skills: "SKILLS",
    technologies: "Technologies:",
    englishLabel: "English:",
    linkedinLabel: "LinkedIn:",
    githubLabel: "GitHub:",
    dividerLength: 60,
    filename: "Claudio_Pedalino_CV_ATS.txt",
  },

  // ─── OPENGRAPH IMAGE ───────────────────────────────────────────────────────
  og: {
    alt: "Claudio Pedalino — Senior .NET Software Engineer",
    eyebrow: "CURRICULUM VITAE",
    badge: "Open to work",
    location: "REMOTE · ARGENTINA",
    stack: "Microservices · APIs · Distributed Systems",
    monogram: "CP",
  },
} as const;
