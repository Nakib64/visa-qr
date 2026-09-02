import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  QrCode,
  FileCheck2,
  Clock,
  Phone,
  Globe,
  AlertCircle,
  Building2,
  Lock,
} from 'lucide-react';
import { getAllVisas } from '@/lib/db';
import { VisaSearchForm } from '@/components/VisaSearchForm';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const visas = await getAllVisas();
  const sampleVisa = visas[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-sky-50/20 to-slate-100/70 text-slate-900 flex flex-col justify-between">


      {/* Main Header */}
      <header className="border-b border-slate-200/90 bg-white/90 backdrop-blur-md sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shadow-xs flex-shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="text-base font-black text-[#0A3C74] tracking-tight uppercase font-serif">
                MONGOLIA
              </div>
              <div className="text-xs font-bold text-slate-700 -mt-0.5 tracking-wide">
                Electronic Visa Verification Portal
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                Иргэний Харьяалал, Шилжилт Хөдөлгөөний Ерөнхий Газар
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#verify" className="hover:text-blue-700 transition">Verify eVisa</a>
            <a href="#guidelines" className="hover:text-blue-700 transition">Traveler Guidelines</a>
            <a href="#notices" className="hover:text-blue-700 transition">Entry Regulations</a>
            <a href="#contact" className="hover:text-blue-700 transition">Contact & Help</a>
          </div>
        </div>
      </header>

      {/* Hero & Verification Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12 flex-1 w-full">
        
        {/* Banner Graphic Frame */}
        <div className="w-full  hidden md:block bg-white rounded-2xl border border-slate-200/90 p-2 sm:p-3 shadow-sm overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/mongolia-header-banner.png"
            alt="Mongolia Electronic Visa Official Banner"
            className="w-full h-auto object-contain rounded-xl select-none block"
          />
        </div>

        {/* Hero Copy & Search Section */}
        <div id="verify" className="text-center space-y-6 max-w-4xl mx-auto pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Official Visa Authentication & Clearance Engine
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Official Mongolia Electronic Visa <br className="hidden sm:inline" />
            <span className="text-[#0A3C74]">
              Document Verification Portal
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Verify the validity, status, and biometric clearance of Electronic Visas issued by the Immigration Agency of Mongolia for international airlines and border inspection authorities.
          </p>

          {/* Interactive Search / Verification Form */}
          <div className="pt-2">
            <VisaSearchForm
              sampleVisaId={sampleVisa?.electronicVisaNumber || sampleVisa?.idNumber || sampleVisa?.id}
              sampleVisaName={sampleVisa ? `${sampleVisa.name} ${sampleVisa.surname}` : undefined}
            />
          </div>
        </div>

        {/* Core Verification Features */}
        <div id="guidelines" className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-sm hover:shadow-md hover:border-blue-300 transition-all">
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shadow-xs">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h2 className="text-sm font-bold text-slate-900">Official Central Registry</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every document is validated against the live government database of the Immigration Agency of Mongolia for verified clearance.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-sm hover:shadow-md hover:border-purple-300 transition-all">
            <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 shadow-xs">
              <QrCode className="w-6 h-6" />
            </div>
            <h2 className="text-sm font-bold text-slate-900">Encrypted 2D QR Verification</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Scannable cryptographic QR codes enable airlines, consulates, and border checkpoints to confirm authenticity in seconds.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
              <Clock className="w-6 h-6" />
            </div>
            <h2 className="text-sm font-bold text-slate-900">Instant Online Verification</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instantaneous electronic permit inspection accessible 24/7 across all international ports of entry into Mongolia.
            </p>
          </div>
        </div>

        {/* Important Regulatory Notices Section */}
        <div id="notices" className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-xs flex-shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Important Entry Guidelines & Regulations for Foreign Travelers
              </h3>
              <p className="text-xs text-slate-500">
                Please review official immigration compliance requirements before arrival.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                Biometric Border Inspection
              </div>
              <p className="leading-relaxed text-slate-600">
                Your biometric details (facial recognition and digital fingerprinting) are required to be provided to border control officers upon arrival at Mongolian international ports.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                48-Hour Foreigner Online Registration
              </div>
              <p className="leading-relaxed text-slate-600">
                Foreign nationals staying in Mongolia for over 30 days are required to register online within 48 hours of arrival through the official portal at <span className="font-semibold text-blue-700">www.immigration.gov.mn</span>.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                Passport Match Requirement
              </div>
              <p className="leading-relaxed text-slate-600">
                All personal records and passport numbers in your electronic visa must exactly match your travel document. Discrepancies may result in denial of boarding or entry.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                Compliance with Mongolian Laws
              </div>
              <p className="leading-relaxed text-slate-600">
                During your stay in Mongolia, you are obliged to comply with all laws and regulations and must not exceed the permitted duration of stay indicated on your eVisa.
              </p>
            </div>
          </div>
        </div>

        {/* Contact & Support Section */}
        <div id="contact" className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-bold">Need Assistance with Document Verification?</h3>
            <p className="text-xs sm:text-sm text-blue-200 max-w-xl">
              Contact the Immigration Agency of Mongolia 24/7 hotline or visit the official government web portal for consular support.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:+97618001882"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-blue-950 rounded-xl text-xs font-bold shadow hover:bg-blue-50 transition"
            >
              <Phone className="w-4 h-4 text-blue-700" />
              Hotline: +976-1800-1882
            </a>
            <a
              href="https://www.immigration.gov.mn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-800/80 hover:bg-blue-800 text-white border border-blue-700 rounded-xl text-xs font-bold transition"
            >
              <Globe className="w-4 h-4 text-blue-300" />
              immigration.gov.mn
            </a>
          </div>
        </div>

      </main>

      {/* Official Footer */}
      <footer className="border-t border-slate-200/90 bg-white/90 py-8 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Building2 className="w-4 h-4 text-slate-600" />
              <span className="font-semibold text-slate-700">
                Immigration Agency of Mongolia • Government Implementing Agency
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              Buyant-Ukhaa, Khan-Uul District, Ulaanbaatar 17120, Mongolia
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <div>
              © {new Date().getFullYear()} Immigration Agency of Mongolia. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin" className="hover:text-slate-600 underline">
                Administrative Portal
              </Link>
              <span>•</span>
              <a href="https://www.immigration.gov.mn" target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 underline">
                Official Agency Website
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
