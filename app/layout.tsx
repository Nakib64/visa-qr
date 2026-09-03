import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
