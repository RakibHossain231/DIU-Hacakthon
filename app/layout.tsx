import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "upay Shield | Trust & Risk Intelligence Command Center",
  description: "Next-generation AI-powered Trust & Risk Intelligence platform for Mobile Financial Services (MFS).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} ${mono.variable} min-h-screen flex flex-col bg-[#070b14] text-slate-100 antialiased selection:bg-blue-500/30 selection:text-blue-200`}>
        <Header />
        <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
