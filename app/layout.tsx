import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";

import "./globals.css";

const SchibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const MartianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GrappleGo | Discover & Join BJJ Events Worldwide",
  description:
    "Find Brazilian Jiu-Jitsu seminars, retreats, open mats, and competitions on GrappleGo. Connect with the global BJJ community and plan your next roll.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${SchibstedGrotesk.variable} ${MartianMono.variable}  antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
