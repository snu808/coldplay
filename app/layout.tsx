import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coldplay Playlist & Lyrics Game",
  description: "Explore the Coldplay concert setlist and memorize the lyrics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased 
                   bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 
                   text-gray-100`}
      >
        {children}
      </body>
    </html>
  );
}
