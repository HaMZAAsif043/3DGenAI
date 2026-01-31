import type { Metadata } from "next";
import "./globals.css";
// import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Gen3DAI | Professional Image to 3D Platform",
  description: "Generate high-quality 3D models from single or multiple images using AI.",
  icons: {
    icon: '/Gen3DAI_logo_1.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-zinc-900 selection:bg-accent/10">
        {children}
      </body>
    </html>
  );
}
