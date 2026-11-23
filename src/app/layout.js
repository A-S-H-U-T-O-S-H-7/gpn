import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import Script from "next/script";

const GA_MEASUREMENT_ID = "G-MY7QV0281F";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GPN News – India's First Live Online News Channel",
  description: "Watch live TV, breaking news & political debates on GPN — India's first online news channel. Catch up on India politics, sports & entertainment 24x7.",
  keywords: "great post news, gpn, live, breaking, trending, latest, top 10, halchal, video, news",
  authors: [{ name: "Great Post News" }],
  robots: "index, follow",
  alternates: {
    canonical: "https://www.greatpostnews.com/",
  },
  openGraph: {
    title: "GPN News – India's First Live Online News Channel",
    description: "Watch live TV, breaking news & political debates on GPN — India's first online news channel.",
    url: "https://www.greatpostnews.com/",
    siteName: "Great Post News",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "GPN News – India's First Live Online News Channel",
    description: "Watch live TV, breaking news & political debates on GPN.",
  },
  verification: {
    // Google Search Console (both verification codes kept)
    google: [
      "qWSDEu_EFRORjEmGtEDprGbN_XGTyzkF-iC0AqrIxhg",
      "P9voAhPDghS781E1OFYTTHEqPgWkkt_DfLVBxztGZ2c",
    ],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Google Search Console verification tags come from `metadata.verification` above */}

        {/* Canonical URL */}
        <link rel="canonical" href="https://www.greatpostnews.com/" />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>

        {/* Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}