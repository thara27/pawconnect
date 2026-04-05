import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";

import Footer from "@/app/components/Footer";
import { Header } from "@/app/components/Header";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PawConnect",
  description: "Pet community platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs text-amber-800">
          🚧 PawConnect is currently in <span className="font-semibold">beta</span> — some features may be incomplete or change without notice.{" "}
          <a href="/contact" className="underline underline-offset-2 hover:text-amber-900 font-medium">
            Contact us
          </a>{" "}
          if you run into anything.
        </div>
        <Header />
        <div className="flex flex-1 flex-col">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
