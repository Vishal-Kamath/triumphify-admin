import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import AdminProviders from "@/components/providers/index.admin.providers";

export const metadata: Metadata = {
  title: "Triumphify - Admin Panel",
  description:
    "Discover Triumphify, a natural sexual health supplement for men. Enhance libido, improve performance, and boost satisfaction with our pure, high-quality herbal formula. Safe, effective, and free from artificial additives. Start your journey to better sexual health today!",
  keywords: [
    "men's sexual health",
    "natural supplement",
    "enhance libido",
    "improve performance",
    "boost satisfaction",
    "herbal formula",
    "sexual health support",
    "safe supplements",
    "Triumphify",
    "natural libido booster",
    "male performance enhancement",
  ],

  authors: [
    {
      name: "Triumphify",
      url: "https://admin.triumphify.com",
    },
  ],

  robots: {
    index: false,
    follow: false,
    nositelinkssearchbox: true,
    noimageindex: true,
    "max-image-preview": "none",
    "max-snippet": 0,
    "max-video-preview": 0,
    indexifembedded: false,
    nosnippet: true,
    noarchive: true,
    nocache: true,

    googleBot: {
      index: false,
      follow: false,
      nositelinkssearchbox: true,
      noimageindex: true,
      "max-image-preview": "none",
      "max-snippet": 0,
      "max-video-preview": 0,
      indexifembedded: false,
      nosnippet: true,
      noarchive: true,
      nocache: true,
    },
  },

  // Favicons
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", type: "image/png" }],
    other: [
      {
        url: "/favicon/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/favicon/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AdminProviders>
        {children}
        <Toaster />
      </AdminProviders>
    </html>
  );
}
