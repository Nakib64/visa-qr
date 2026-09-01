import Link from 'next/link';
import { ShieldCheck, FileText, Printer, QrCode, Database, ArrowRight } from 'lucide-react';
import { getAllVisas } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const visas = await getAllVisas();
  const sampleVisa = visas[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-wide">Mongolia eVisa System</span>
            </div>
          </div>

          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg transition"
          >
            Open Admin Panel
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-8 flex-1 flex flex-col justify-center items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          PostgreSQL Database & Dynamic QR Verification
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight max-w-3xl leading-tight">
          Mongolia Electronic Visa <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">
            Admin Panel & Document Generator
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
          Create, edit, and store electronic visas with automatic QR code generation, bilingual Mongolian/English layouts, realistic stamp overlays, and guaranteed 1-page printing.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-xl transition shadow-blue-600/20"
          >
            <FileText className="w-4 h-4" />
            Go to Admin Panel
          </Link>

          {sampleVisa && (
            <Link
              href={`/visa/${encodeURIComponent(sampleVisa.id || sampleVisa.idNumber)}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-sm font-bold shadow-md transition"
            >
              <QrCode className="w-4 h-4 text-purple-400" />
              View Sample Document ({sampleVisa.name})
            </Link>
          )}
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 text-left w-full">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
              <Database className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-white">PostgreSQL Free Tier</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Connect to 100% free PostgreSQL databases (Neon.tech / Supabase) or run locally with instant fallback sync.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
              <QrCode className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-white">Dynamic Scannable QR</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every document generates an embedded QR code that links directly to the browser verification page.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <Printer className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-white">Strict 1-Page Print</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Carefully engineered `@media print` layout ensures the document never overflows across 2 pages.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        Mongolia Electronic Visa Management System • Built with Next.js & PostgreSQL
      </footer>
    </div>
  );
}
