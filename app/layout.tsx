import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";

import "./globals.css";
import LightRays from "@/components/LightRays";

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
        <div className="absolute z-[-1] inset-0 top-0  min-h-screen overflow-hidden">
          <LightRays
            raysOrigin="top-center-offset"
            raysColor="#5dfeca"
            raysSpeed={0.5}
            lightSpread={0.9}
            rayLength={1.4}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0.0}
            distortion={0.01}
          />
        </div>
        <main>{children}</main>
      </body>
    </html>
  );
}
