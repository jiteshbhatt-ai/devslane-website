import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import { LiquidBackground } from "@/components/ui/LiquidBackground";
import { RobotGuide } from "@/components/ui/RobotGuide";
import { PageTransition } from "@/components/providers/PageTransition";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
});

export const metadata: Metadata = {
  title: "DEVSLANE | Innovation Through Code",
  description:
    "We break complexity into clarity. Web Development, AI Solutions, and SaaS Products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${dmSerif.variable} font-sans antialiased`}
      >
        <LiquidBackground />
        <RobotGuide />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
