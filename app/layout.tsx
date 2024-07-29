import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import AudioProvider from "@/lib/providers/AudioProvider";
import ConvexClerkProvider from "@/lib/providers/ConvexClerkProvider";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Podcaster-AI",
  description:
    "A cutting-edge AI SaaS platform that enables users to create, discover, and enjoy podcasts with advanced features like text-to-audio conversion with multi-voice AI, podcast thumbnail Image generation and seamless playback.",
  icons: {
    icon: "/icons/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClerkProvider>
      <AudioProvider>
        <html lang="en">
          <body className={`${manrope.className}`}>{children}</body>
        </html>
      </AudioProvider>
    </ConvexClerkProvider>
  );
}
