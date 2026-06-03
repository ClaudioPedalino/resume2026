---
Task ID: 2
Agent: Main Agent
Task: Fix 4 UI issues — skills styling, experience card layout, hero tags layout, mobile responsiveness

Work Log:
- Rewrote skills-section.tsx: removed heavy cardHoverVariants (boxShadow animation caused stuttering), removed glassmorphism shimmer overlay, changed from gradient backgrounds to flat bg-card/40 backdrop-blur-md, simplified chip animations (removed per-chip framer-motion whileHover), reduced icon glow effects, cleaner expand/collapse
- Rewrote experience-section.tsx: removed CardHeader/CardTitle/CardAction components (the CardAction CSS grid caused position to appear beside period badge), used plain div layout with explicit rows: Row 1 (flag+company | period), Row 2 (position with Layers icon), Row 3 (business area with Building2 icon). Simplified carousel animation (removed rotateY 3D effect)
- Rewrote hero-section.tsx: split tags into Core Stack (full-width with individual tech chips split by "·") and Goal+Looking For (side-by-side via grid sm:grid-cols-2). Added splitByMiddleDot() helper. Reduced decorative gradient blob sizes and opacity. Simplified avatar glow. Cleaner button sizing.
- All components use more translucent colors (bg-card/40, bg-primary/8, border-border/25, etc.)
- Verified with agent browser at both desktop and mobile (375px) widths — all 4 requirements pass

Stage Summary:
- Skills: clean, subtle, no stutter — translucent bg-card/40, simple CSS transitions instead of heavy framer-motion animations
- Experience: position is definitively on its own row below company name, not next to period badge
- Hero: Core Stack full-width with individual tech chips, Goal + Looking For side-by-side below
- Mobile: responsive at 375px, all sections work properly
