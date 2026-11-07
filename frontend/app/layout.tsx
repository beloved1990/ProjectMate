
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ServiceWorkerRegister from "./ServiceWorkerRegister";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://project-mate-gamma.vercel.app"),

  title: {
    default: "ProjectMate – AI-Powered Academic Project & Research Assistant",
    template: "%s | ProjectMate",
  },

  description:
    "ProjectMate helps students plan, organize, write, and manage academic research projects with AI-powered research assistance, project tracking, citation checking, and progress monitoring.",

  applicationName: "ProjectMate",

  keywords: [
    "ProjectMate",
    "student project management",
    "academic project management",
    "AI research assistant",
    "research project writing",
    "final year project support",
    "academic writing assistance",
    "citation checker",
    "project progress tracking",
  ],

  openGraph: {
    title: "ProjectMate – Your Academic Project Workspace",
    description:
      "Plan, manage, and improve your academic research projects with AI-powered assistance and smart project management tools.",
    url: "https://project-mate-gamma.vercel.app",
    siteName: "ProjectMate",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ProjectMate – Your Academic Project Workspace",
    description:
      "Manage academic projects, access AI research assistance, check citations, and track your research progress.",
  },

  manifest: "/manifest.webmanifest",

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ProjectMate",
  },

  formatDetection: {
    telephone: false,
  },
};


export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
  <ServiceWorkerRegister />
  {children}
</body>
    </html>
  );
}
