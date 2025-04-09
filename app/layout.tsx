import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coldplay Playlist & Lyrics Game",
  description: "Explore the Coldplay concert setlist and memorize the lyrics.",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased 
                   bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 
                   text-gray-100`}
      >
        {children}
      </body>
    </html>
  );
}
