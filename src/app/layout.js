import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GPN - Great Post News",
  description: "Video-first digital news platform",
  keywords: "news, live tv, breaking news, global news, world news, politics, technology, sports, entertainment",
  authors: [{ name: "GPN" }],
  robots: "index, follow",
  openGraph: {
    title: "GPN - Great Post News",
    description: "Your video-first news platform for breaking news and live updates",
    type: "website",
    locale: "en_US",
    siteName: "Great Post News",
  },
  twitter: {
    card: "summary_large_image",
    title: "GPN - Great Post News",
    description: "Your video-first news platform for breaking news and live updates",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
