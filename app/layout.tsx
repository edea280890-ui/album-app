import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AlbumGameProvider } from "@/context/AlbumGameContext";
import { CinematicAudioProvider } from "@/context/CinematicAudioContext";

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
  title: "Argentina Historica",
  description: "Album interactivo premium de figuritas historicas argentinas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CinematicAudioProvider>
          <AlbumGameProvider>{children}</AlbumGameProvider>
        </CinematicAudioProvider>
      </body>
    </html>
  );
}

