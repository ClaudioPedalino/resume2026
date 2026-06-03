import type { Metadata } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import MotionProvider from "@/components/motion-provider";
import { texts } from "@/data/texts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://claudiopedalino.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: texts.site.title,
  description: texts.site.description,
  keywords: [...texts.site.keywords],
  authors: [{ name: texts.site.author }],
  openGraph: {
    type: "profile",
    title: texts.site.title,
    description: texts.site.shortDescription,
    siteName: texts.site.siteName,
  },
  twitter: {
    card: "summary_large_image",
    title: texts.site.title,
    description: texts.site.shortDescription,
  },
  alternates: {
    canonical: texts.site.canonical,
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: texts.site.shortTitle,
  jobTitle: texts.site.jsonLd.jobTitle,
  description: texts.site.jsonLd.description,
  url: siteUrl,
  image: `${siteUrl}/opengraph-image`,
  email: texts.site.jsonLd.email,
  address: {
    "@type": "PostalAddress",
    addressCountry: texts.site.jsonLd.addressCountry,
  },
  knowsAbout: [...texts.site.jsonLd.knowsAbout],
  sameAs: [...texts.site.jsonLd.sameAs],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} antialiased bg-background text-foreground`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
