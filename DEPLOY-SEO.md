# Deploy & SEO checklist

## After deploying to Netlify

1. **Replace placeholder URL** in:
   - `robots.txt` — change `YOUR-SITE-URL.netlify.app` to your Netlify site URL (e.g. `claudiopedalino.netlify.app`).
   - `sitemap.xml` — same replacement in `<loc>`.

   Or use your custom domain in both (e.g. `https://claudiopedalino.com`).

2. **Verify** in Netlify dashboard:
   - Site URL (Domain management).
   - HTTPS is on.

3. **Submit** `https://YOUR-SITE-URL/sitemap.xml` in Google Search Console and (optional) Bing Webmaster Tools.

4. **LinkedIn preview**: Share your site URL; OG tags will show title, description, and profile image.

## What’s already done

- **SEO**: `<title>`, `<meta name="description">`, canonical (set at runtime from `location.origin`), Open Graph, Twitter Card, JSON-LD Person.
- **Semantics**: `<header>`, `<main>`, `<nav>`, `<section>`, `<article>`, heading hierarchy (h1 → h2 → h3 in ATS block).
- **Accessibility**: `lang="en"`, descriptive `alt`, ARIA on carousel (region, tabs), `role="main"`, `aria-labelledby` on sections.
- **Performance**: One font (DM Sans, `display=swap`), `loading="lazy"` on profile and flag images, no extra libraries.
- **Security headers**: `_headers` with X-Frame-Options, X-Content-Type-Options, Referrer-Policy, X-XSS-Protection.
- **ATS**: Linear block `#ats-content` (visually hidden) with Experience and Skills in plain HTML; section titles “Experience” and “Skills”.
