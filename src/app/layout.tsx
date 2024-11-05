import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "we.trsfrm transcript analysis",
  description: "For internal use of our organisation, using the X-AI Grok-Beta Version",
  openGraph: {
    title: "we.trsfrm transcript analysis",
    description: "AI-powered meeting transcript and document analysis tool",
    type: "website",
    siteName: "we.trsfrm",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "we.trsfrm transcript analysis",
    description: "AI-powered meeting transcript and document analysis tool",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
