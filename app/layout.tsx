import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "JobBoard PK - Find Your Dream Job in Pakistan",
  description: "Discover thousands of job opportunities across Pakistan. From IT to healthcare, find the perfect career match with JobBoard PK.",
  keywords: "jobs Pakistan, employment Pakistan, careers Pakistan, job search Pakistan",
  authors: [{ name: "Nouman Sajid" }],
  creator: "Nouman Sajid",
  publisher: "JobBoard PK",
  openGraph: {
    title: "JobBoard PK - Find Your Dream Job in Pakistan",
    description: "Discover thousands of job opportunities across Pakistan",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "JobBoard PK - Find Your Dream Job in Pakistan",
    description: "Discover thousands of job opportunities across Pakistan",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
