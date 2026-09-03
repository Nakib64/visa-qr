import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mongolia Electronic Visa (eVisa) Verification & Management Portal",
  description: "Official verification portal and document management system for Mongolia Electronic Visas (eVisa).",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/mongolia_agency_logo.png', type: 'image/png' },
    ],
    apple: '/mongolia_agency_logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full antialiased ${montserrat.variable}`}>
      <body className={`${montserrat.className} min-h-full flex flex-col font-sans`}>{children}</body>
    </html>
  );
}
