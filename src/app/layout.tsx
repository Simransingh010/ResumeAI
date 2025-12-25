import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002"),
  title: "ATSense - AI-Powered Resume Analyzer & Builder",
  description: "Get instant resume scores, actionable fixes, and build ATS-friendly resumes with our AI-powered platform. Optimize your resume for Applicant Tracking Systems and land more interviews.",
  keywords: ["ATS", "resume checker", "resume builder", "AI resume analyzer", "job application", "career tools"],
  authors: [{ name: "ATSense" }],
  creator: "ATSense",
  publisher: "ATSense",
  icons: {
    icon: [
      { url: "/logo.png", sizes: "any" },
      { url: "/logo.png", type: "image/png" },
    ],
    apple: [
      { url: "/logo.png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://atsense.com",
    title: "ATSense - AI-Powered Resume Analyzer & Builder",
    description: "Get instant resume scores, actionable fixes, and build ATS-friendly resumes with our AI-powered platform.",
    siteName: "ATSense",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "ATSense Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ATSense - AI-Powered Resume Analyzer & Builder",
    description: "Get instant resume scores, actionable fixes, and build ATS-friendly resumes with our AI-powered platform.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#111827" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const stored = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (stored === 'dark' || (!stored && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
