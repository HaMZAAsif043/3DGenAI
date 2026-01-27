import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 3D Gen | Image to 3D Platform",
  description: "Generate high-quality 3D models from single or multiple images using AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen bg-white text-black">
        {children}
      </body>
    </html>
  );
}
