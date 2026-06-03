import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Claudio Pedalino — Senior .NET Software Engineer",
  description:
    "Professional curriculum vitae of Claudio Pedalino. Senior .NET Software Engineer specializing in microservices, APIs, and distributed systems. Remote only.",
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
  authors: [{ name: "Claudio Pedalino" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Claudio Pedalino — Senior .NET Software Engineer",
    description:
      "Professional CV — Senior .NET Software Engineer specializing in microservices, APIs, and distributed systems.",
    type: "profile",
    firstName: "Claudio",
    lastName: "Pedalino",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
