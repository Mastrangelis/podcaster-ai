import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

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
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string}
      appearance={{
        layout: {
          socialButtonsVariant: "iconButton",
          logoImageUrl: "/icons/auth-logo.svg",
        },
        elements: {
          socialButtonsIconButton: {
            border: "1px solid rgba(255, 255, 255, 0.2) !important",
          },
          dividerLine: {
            textColor: "white",
            borderColor: "white",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
          },
          input: {
            backgroundColor: "#1b1f29",
            textColor: "white",
            placeholderColor: "#15171C",
          },
        },
        variables: {
          colorBackground: "#15171c",
          colorPrimary: "",
          colorText: "white",
        },
      }}
    >
      <html lang="en">
        <body className={`${manrope.className}`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
