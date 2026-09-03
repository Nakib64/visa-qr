'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  FileText,
  Search,
  Globe,
  Lock,
  ChevronDown,
  ChevronRight,
  X,
  Menu,
  BookOpen,
  UserCheck,
  Home as HomeIcon,
  Flag,
  Building,
  HeartHandshake,
  Award,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { VisaSearchForm } from './VisaSearchForm';

interface CountryVisaInfo {
  name: string;
  code: string; // ISO 2-letter lowercase code for flagcdn
  duration: string;
  category: string;
  passportTypes: string[];
  region: 'Asia' | 'Africa' | 'Oceania' | 'Americas' | 'Europe';
}

const VISA_FREE_COUNTRIES: CountryVisaInfo[] = [
  {
    name: 'Armenia',
    code: 'am',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['Diplomatic Passport', 'Official Passport'],
    region: 'Asia',
  },
  {
    name: 'Azerbaijan',
    code: 'az',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['Diplomatic Passport', 'Official Passport'],
    region: 'Asia',
  },
  {
    name: 'BRUNEI DARUSSALAM',
    code: 'bn',
    duration: '14 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['All passport types', 'Ordinary Passport'],
    region: 'Asia',
  },
  {
    name: 'Cambodia',
    code: 'kh',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['Diplomatic Passport', 'Official Passport'],
    region: 'Asia',
  },
  {
    name: 'China',
    code: 'cn',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['Diplomatic Passport', 'Service Passport'],
    region: 'Asia',
  },
  {
    name: 'Cyprus',
    code: 'cy',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['Diplomatic Passport', 'Service Passport'],
    region: 'Asia',
  },
  {
    name: 'HONG KONG, SAR CHINA',
    code: 'hk',
    duration: '14 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['HKSAR Passport', 'All valid passports'],
    region: 'Asia',
  },
  {
    name: 'India',
    code: 'in',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['Diplomatic Passport', 'Official Passport'],
    region: 'Asia',
  },
  {
    name: 'Indonesia',
    code: 'id',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['Diplomatic Passport', 'Service Passport'],
    region: 'Asia',
  },
  {
    name: 'Israel',
    code: 'il',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['All passport types', 'National Passport'],
    region: 'Asia',
  },
  {
    name: 'Japan',
    code: 'jp',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['All passport types', 'Ordinary Passport'],
    region: 'Asia',
  },
  {
    name: 'Kazakhstan',
    code: 'kz',
    duration: '90 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['All passport types', 'National Passport'],
    region: 'Asia',
  },
  {
    name: 'Korea (North)',
    code: 'kp',
    duration: '90 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['Diplomatic Passport', 'Official Passport'],
    region: 'Asia',
  },
  {
    name: 'Kuwait',
    code: 'kw',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['Diplomatic Passport', 'Special Passport'],
    region: 'Asia',
  },
  {
    name: 'Kyrgyzstan',
    code: 'kg',
    duration: '90 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['All passport types', 'National Passport'],
    region: 'Asia',
  },
  {
    name: 'Laos',
    code: 'la',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['All passport types', 'National Passport'],
    region: 'Asia',
  },
  {
    name: 'MACAO, SAR CHINA',
    code: 'mo',
    duration: '90 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['MSAR Passport', 'All valid passports'],
    region: 'Asia',
  },
  {
    name: 'Malaysia',
    code: 'my',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['All passport types', 'Ordinary Passport'],
    region: 'Asia',
  },
  {
    name: 'Maldives',
    code: 'mv',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['All passport types', 'Ordinary Passport'],
    region: 'Asia',
  },
  {
    name: 'Myanmar',
    code: 'mm',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['Diplomatic Passport', 'Special Passport'],
    region: 'Asia',
  },
  {
    name: 'Nepal',
    code: 'np',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['Diplomatic Passport', 'Official Passport'],
    region: 'Asia',
  },
  {
    name: 'Oman',
    code: 'om',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['Diplomatic Passport', 'Special Passport', 'Service Passport'],
    region: 'Asia',
  },
  {
    name: 'Philippines',
    code: 'ph',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['All passport types', 'Regular Passport'],
    region: 'Asia',
  },
  {
    name: 'Socialist Republic of Vietnam',
    code: 'vn',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['All passport types', 'Ordinary Passport'],
    region: 'Asia',
  },
  {
    name: 'The Kingdom of Thailand',
    code: 'th',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['All passport types', 'Ordinary Passport'],
    region: 'Asia',
  },
  {
    name: 'The Republic of Korea',
    code: 'kr',
    duration: '90 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['All passport types', 'Ordinary Passport'],
    region: 'Asia',
  },
  {
    name: 'The Republic of Singapore',
    code: 'sg',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['All passport types', 'Ordinary Passport'],
    region: 'Asia',
  },
  {
    name: 'The Republic of Türkiye',
    code: 'tr',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['All passport types', 'Ordinary Passport'],
    region: 'Asia',
  },
  {
    name: 'The Republic of Uzbekistan',
    code: 'uz',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['All passport types', 'National Passport'],
    region: 'Asia',
  },
  {
    name: 'Turkmenistan',
    code: 'tm',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['Diplomatic Passport', 'Official Passport'],
    region: 'Asia',
  },
  {
    name: 'United Arab Emirates',
    code: 'ae',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['All passport types', 'Ordinary Passport'],
    region: 'Asia',
  },
  // Europe
  {
    name: 'Germany',
    code: 'de',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['All passport types', 'National Passport'],
    region: 'Europe',
  },
  {
    name: 'France',
    code: 'fr',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['All passport types', 'National Passport'],
    region: 'Europe',
  },
  {
    name: 'United Kingdom',
    code: 'gb',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['All passport types', 'British Citizen Passport'],
    region: 'Europe',
  },
  {
    name: 'Italy',
    code: 'it',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['All passport types', 'National Passport'],
    region: 'Europe',
  },
  {
    name: 'Spain',
    code: 'es',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['All passport types', 'National Passport'],
    region: 'Europe',
  },
  {
    name: 'Switzerland',
    code: 'ch',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['All passport types', 'National Passport'],
    region: 'Europe',
  },
  {
    name: 'Netherlands',
    code: 'nl',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['All passport types', 'National Passport'],
    region: 'Europe',
  },
  {
    name: 'Sweden',
    code: 'se',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['All passport types', 'National Passport'],
    region: 'Europe',
  },
  // Americas
  {
    name: 'United States of America',
    code: 'us',
    duration: '90 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['All passport types', 'US Passport'],
    region: 'Americas',
  },
  {
    name: 'Canada',
    code: 'ca',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['All passport types', 'Canadian Passport'],
    region: 'Americas',
  },
  {
    name: 'Brazil',
    code: 'br',
    duration: '90 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['All passport types', 'Ordinary Passport'],
    region: 'Americas',
  },
  {
    name: 'Argentina',
    code: 'ar',
    duration: '90 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['All passport types', 'National Passport'],
    region: 'Americas',
  },
  {
    name: 'Chile',
    code: 'cl',
    duration: '90 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['All passport types', 'National Passport'],
    region: 'Americas',
  },
  // Africa
  {
    name: 'Egypt',
    code: 'eg',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['Diplomatic Passport', 'Special Passport'],
    region: 'Africa',
  },
  {
    name: 'South Africa',
    code: 'za',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['Diplomatic Passport', 'Official Passport'],
    region: 'Africa',
  },
  // Oceania
  {
    name: 'Australia',
    code: 'au',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['All passport types', 'Australian Passport'],
    region: 'Oceania',
  },
  {
    name: 'New Zealand',
    code: 'nz',
    duration: '30 Days',
    category: 'Citizen of a visa-exempt country',
    passportTypes: ['All passport types', 'New Zealand Passport'],
    region: 'Oceania',
  },
];

const SERVICE_CATEGORIES = [
  {
    title: 'Visa permit',
    icon: BookOpen,
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Visa',
    icon: FileText,
    iconColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Registration of foreign national',
    icon: UserCheck,
    iconColor: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  {
    title: 'Residence permit',
    icon: HomeIcon,
    iconColor: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  {
    title: 'Citizenship',
    icon: Flag,
    iconColor: 'text-sky-600',
    bgColor: 'bg-sky-50',
  },
  {
    title: 'NGO branches and representative offices',
    icon: Building,
    iconColor: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
  {
    title: 'Adoption',
    icon: HeartHandshake,
    iconColor: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  {
    title: 'Certification/Statement',
    icon: Award,
    iconColor: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
  },
];

interface MongoliaPortalHomeProps {
  sampleVisaId?: string;
  sampleVisaName?: string;
}

export function MongoliaPortalHome({ sampleVisaId, sampleVisaName }: MongoliaPortalHomeProps) {
  const [selectedRegion, setSelectedRegion] = useState<'Asia' | 'Africa' | 'Oceania' | 'Americas' | 'Europe'>('Asia');
  const [selectedCountry, setSelectedCountry] = useState<CountryVisaInfo | null>(null);
  const [heroSearchCountry, setHeroSearchCountry] = useState('');
  const [heroSearchPurpose, setHeroSearchPurpose] = useState('');
  const [infoTab, setInfoTab] = useState<'permit' | 'visa' | 'residence'>('permit');
  const [activeHeroTab, setActiveHeroTab] = useState<'category' | 'verify'>('category');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredCountries = VISA_FREE_COUNTRIES.filter((c) => c.region === selectedRegion);

  const handleHeroCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearchCountry) {
      const match = VISA_FREE_COUNTRIES.find(
        (c) => c.name.toLowerCase() === heroSearchCountry.toLowerCase()
      );
      if (match) {
        setSelectedCountry(match);
      } else {
        setSelectedCountry({
          name: heroSearchCountry,
          code: 'un',
          duration: '30 Days',
          category: 'Electronic Visa (eVisa) Required',
          passportTypes: ['Ordinary Passport', 'Standard Travel Document'],
          region: 'Asia',
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans">
      
      {/* =========================================================================
          UNIFIED TOP BANNER & HERO WITH SEAMLESS COVER IMAGE
          ========================================================================= */}
      <div
        className="relative text-white overflow-hidden bg-[#0A163B]"
        style={{
          backgroundImage: "url('/mongolia_hero_cover.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Soft atmospheric gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A163B]/80 via-transparent to-[#0A163B]/20 pointer-events-none"></div>

        {/* =====================================================================
            TOP NAVIGATION BAR (Transparent, seamlessly matching hero background)
            ===================================================================== */}
        <header className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-3 flex items-center justify-between">
          
          {/* Mobile Hamburger Button + Logo Emblem */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-xl bg-[#00B7FE] hover:bg-[#00a3e3] text-white flex items-center justify-center shadow-md active:scale-95 transition cursor-pointer flex-shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo & Agency Header */}
            <Link href="/" className="flex items-center gap-3 group">
              {/* Official Mongolian Agency Emblem Logo */}
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden shadow-lg flex-shrink-0 group-hover:scale-105 transition">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/mongolia_agency_logo.png"
                  alt="Immigration Agency of Mongolia Emblem"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain select-none"
                />
              </div>
              <div className="hidden sm:block">
                <div className="text-[10px] text-blue-200/90 font-medium tracking-wide uppercase">
                  Government Implementing Agency
                </div>
                <div className="text-xs sm:text-sm font-black text-white tracking-wider uppercase font-serif">
                  IMMIGRATION AGENCY OF MONGOLIA
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold tracking-wider text-white uppercase">
            <Link href="/" className="text-white hover:text-cyan-300 transition">
              HOME
            </Link>
            <a href="#services" className="text-white hover:text-cyan-300 transition">
              SERVICE
            </a>
            <a href="#faq" className="text-white hover:text-cyan-300 transition">
              FAQ
            </a>
            <a href="#contact" className="text-white hover:text-cyan-300 transition">
              CONTACT
            </a>
          </nav>

          {/* Right Action Badges & Login */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <a
              href="#services"
              className="hidden xl:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00B7FE] hover:bg-[#00a3e3] text-white text-xs font-semibold shadow-sm transition"
            >
              <FileText className="w-3.5 h-3.5" />
              COP17 - User guide
            </a>

            <a
              href="#services"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00B7FE] hover:bg-[#00a3e3] text-white text-xs font-semibold shadow-sm transition"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Manuals and instructions
            </a>

            <div className="flex items-center gap-1 text-xs font-bold text-white px-2.5 py-1.5 bg-[#00B7FE] rounded-lg shadow-sm">
              <Globe className="w-3.5 h-3.5" />
              <span>EN</span>
              <ChevronDown className="w-3 h-3" />
            </div>

            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1 px-3 sm:px-4 py-1.5 bg-[#0B153D]/95 hover:bg-[#122055] text-white border border-[#233575] rounded-lg text-xs font-bold shadow-md transition active:scale-95 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Log In</span>
            </Link>
          </div>

        </header>

        {/* =====================================================================
            MOBILE SLIDE-OVER DRAWER (Matching Reference Screenshot)
            ===================================================================== */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop Overlay */}
            <div
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-2xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Left White Drawer Panel */}
            <div className="relative w-[270px] sm:w-[300px] max-w-[80vw] bg-white h-full shadow-2xl z-50 flex flex-col justify-between p-6 text-slate-800 animate-in slide-in-from-left duration-200">
              <div className="space-y-6">
                {/* Close Button Top Left */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 -ml-1 text-slate-500 hover:text-slate-900 transition cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Vertical Navigation Links */}
                <nav className="flex flex-col space-y-4 text-[15px] font-medium text-slate-800">
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-blue-600 transition"
                  >
                    Home
                  </Link>
                  <a
                    href="#services"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-blue-600 transition"
                  >
                    Service
                  </a>
                  <a
                    href="#faq"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-blue-600 transition"
                  >
                    FAQ
                  </a>
                  <a
                    href="#contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-blue-600 transition"
                  >
                    Contact
                  </a>
                </nav>

                {/* Blue Action Buttons */}
                <div className="pt-2 space-y-2.5">
                  <a
                    href="#services"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0052B4] hover:bg-[#004090] text-white text-xs font-semibold shadow-xs transition"
                  >
                    <FileText className="w-4 h-4" />
                    COP17 - User guide
                  </a>
                  <a
                    href="#services"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0052B4] hover:bg-[#004090] text-white text-xs font-semibold shadow-xs transition"
                  >
                    <BookOpen className="w-4 h-4" />
                    Manuals and instructions
                  </a>
                </div>
              </div>

            
            </div>
          </div>
        )}

        {/* =====================================================================
            HERO MAIN CONTENT SECTION
            ===================================================================== */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-6 sm:pt-8 pb-48 sm:pb-64 md:pb-80 space-y-5 sm:space-y-6 z-10">
          
          {/* Main Hero Header */}
          <div className="space-y-2.5 sm:space-y-3 pt-2">
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white font-sans leading-tight">
              Which category of visa is suitable for your travel?
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-blue-100/95 max-w-2xl mx-auto font-normal leading-relaxed">
              Please refer to the section below to conveniently identify the visa type relevant to your requirements.
            </p>
          </div>

          {/* Interactive Search Bar / Verification Engine Tabs */}
          <div className="max-w-2xl mx-auto pt-2 space-y-3">
            
            <div className="inline-flex rounded-xl p-1 bg-[#0A1B4F]/80 backdrop-blur-md border border-cyan-400/30 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveHeroTab('category')}
                className={`px-4 py-1.5 rounded-lg transition cursor-pointer ${
                  activeHeroTab === 'category'
                    ? 'bg-[#00B7FE] text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Find Visa Category
              </button>
              <button
                type="button"
                onClick={() => setActiveHeroTab('verify')}
                className={`px-4 py-1.5 rounded-lg transition cursor-pointer ${
                  activeHeroTab === 'verify'
                    ? 'bg-[#00B7FE] text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                🔍 Verify Issued eVisa
              </button>
            </div>

            {activeHeroTab === 'category' ? (
              <form onSubmit={handleHeroCheck} className="flex flex-col sm:flex-row items-center justify-center gap-2.5 bg-white/15 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl">
                {/* Select Country */}
                <div className="relative w-full sm:w-1/2">
                  <select
                    value={heroSearchCountry}
                    onChange={(e) => setHeroSearchCountry(e.target.value)}
                    className="w-full pl-4 pr-8 py-2.5 bg-white text-slate-800 text-xs sm:text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B7FE] appearance-none font-medium cursor-pointer shadow-inner"
                  >
                    <option value="">Select country</option>
                    {VISA_FREE_COUNTRIES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
                </div>

                {/* Purpose of Trip */}
                <div className="relative w-full sm:w-1/2">
                  <select
                    value={heroSearchPurpose}
                    onChange={(e) => setHeroSearchPurpose(e.target.value)}
                    className="w-full pl-4 pr-8 py-2.5 bg-white text-slate-800 text-xs sm:text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B7FE] appearance-none font-medium cursor-pointer shadow-inner"
                  >
                    <option value="">Purpose of trip</option>
                    <option value="Tourism (K2)">Tourism (K2)</option>
                    <option value="Business / Meeting (B)">Business / Meeting (B)</option>
                    <option value="Transit (J)">Transit (J)</option>
                    <option value="Employment (E)">Employment / Work (E)</option>
                    <option value="Study (S)">Study / Academic (S)</option>
                    <option value="Diplomatic / Official (A)">Diplomatic / Official (A)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
                </div>

                {/* Check Button */}
                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-2.5 bg-[#00B7FE] hover:bg-[#00a3e3] text-white rounded-xl text-xs sm:text-sm font-black transition active:scale-95 cursor-pointer flex-shrink-0 shadow-lg shadow-[#00B7FE]/40"
                >
                  Check
                </button>
              </form>
            ) : (
              <div className="bg-white rounded-2xl p-4 shadow-2xl text-left">
                <VisaSearchForm sampleVisaId={sampleVisaId} sampleVisaName={sampleVisaName} />
              </div>
            )}

          </div>

        </div>
      </div>

      {/* =========================================================================
          SECTION 1: SERVICE CATEGORY (2 rows of 4 cards)
          ========================================================================= */}
      <section id="services" className="py-12 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Service category
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICE_CATEGORIES.map((service) => {
              const IconComp = service.icon;
              return (
                <div
                  key={service.title}
                  className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs hover:shadow-md hover:border-blue-400 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl ${service.bgColor} flex items-center justify-center ${service.iconColor} shadow-xs flex-shrink-0 group-hover:scale-105 transition`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-600 transition leading-snug">
                      {service.title}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition flex-shrink-0" />
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 2: VISA FREE COUNTRIES (Tabs + 4-column High-Res Flag Grid)
          ========================================================================= */}
      <section id="visafree" className="py-12 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Visa free countries
          </h2>

          {/* Region Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {(['Asia', 'Africa', 'Oceania', 'Americas', 'Europe'] as const).map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  selectedRegion === region
                    ? 'bg-[#0A163B] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          {/* 4-Column Grid of Country Cards with Real National Flags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {filteredCountries.map((country) => (
              <button
                key={country.name}
                type="button"
                onClick={() => setSelectedCountry(country)}
                className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center justify-between gap-2.5 shadow-2xs hover:shadow-sm hover:border-blue-400 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://flagcdn.com/w40/${country.code}.png`}
                    srcSet={`https://flagcdn.com/w80/${country.code}.png 2x`}
                    alt={country.name}
                    width={24}
                    height={16}
                    className="w-6 h-4 object-cover rounded-xs border border-slate-200/90 shadow-2xs flex-shrink-0"
                    loading="lazy"
                  />
                  <span className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-600 transition">
                    {country.name}
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition flex-shrink-0" />
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3: INFORMATION & GUIDE BOX (Isometric Diagram + Tabbed Info)
          ========================================================================= */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Isometric Diagram Graphic Image */}
            <div className="lg:col-span-5 rounded-xl overflow-hidden shadow-sm border border-blue-900/30 bg-[#0A163B] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/visa_permit_diagram.jpg"
                alt="ВИЗИЙН ЗӨВШӨӨРӨЛ Flowchart Diagram"
                className="w-full h-auto object-contain rounded-xl block"
              />
            </div>

            {/* Right Tabbed Details */}
            <div className="lg:col-span-7 space-y-4 ">
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => setInfoTab('permit')}
                  className={`px-4 py-2 rounded-lg text-lg font-bold transition cursor-pointer ${
                    infoTab === 'permit'
                      ? 'bg-[#00B7FE] text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Visa permit
                </button>
                <button
                  type="button"
                  onClick={() => setInfoTab('visa')}
                  className={`px-4 py-2 rounded-lg text-lg font-bold transition cursor-pointer ${
                    infoTab === 'visa'
                      ? 'bg-[#00B7FE] text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Visa
                </button>
                <button
                  type="button"
                  onClick={() => setInfoTab('residence')}
                  className={`px-4 py-2 rounded-lg text-lg font-bold transition cursor-pointer ${
                    infoTab === 'residence'
                      ? 'bg-[#00B7FE] text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Residence permit
                </button>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                {infoTab === 'permit' && (
                  <p>
                    &ldquo;Visa permit&rdquo; means a document issued by the state administrative organization in charge of foreign affairs, or the central state administrative authority in charge of foreign affairs, to diplomatic missions abroad from Mongolia, or to branches of the state administrative organization in charge of foreign citizens, to issue visas to foreigners. Requests for visa approval are made by the inviting party.
                  </p>
                )}
                {infoTab === 'visa' && (
                  <p>
                    &ldquo;Electronic Visa (eVisa)&rdquo; allows international travelers to enter Mongolia for tourism, business, transit, or participating in events. Issued visas are verified automatically at all international border checkpoints and airlines using 2D scannable QR verification.
                  </p>
                )}
                {infoTab === 'residence' && (
                  <p>
                    &ldquo;Residence permit&rdquo; provides foreign citizens authorized permission to reside in Mongolia for long-term periods exceeding 90 days for business, employment, education, or family reunion purposes under official immigration registry.
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE COUNTRY MODAL POPUP (Matching Screenshot 2)
          ========================================================================= */}
      {selectedCountry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95">
            
            {/* Modal Header with High-Res Flag */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://flagcdn.com/w80/${selectedCountry.code}.png`}
                  alt={selectedCountry.name}
                  className="w-8 h-5.5 object-cover rounded-xs border border-slate-200 shadow-xs"
                />
                <h3 className="text-base font-bold text-slate-900">
                  {selectedCountry.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCountry(null)}
                className="text-slate-400 hover:text-slate-700 transition p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs text-slate-700">
              
              <div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Duration of stay in Mongolia (as per in visa or visa-free duration) :
                </div>
                <div className="text-sm font-black text-slate-900 mt-0.5">
                  {selectedCountry.duration}
                </div>
              </div>

              <div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Visa category :
                </div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">
                  {selectedCountry.category}
                </div>
              </div>

              <div>
                <div className="text-[11px] text-slate-500 font-medium mb-1">
                  Passport type :
                </div>
                <ul className="space-y-1 list-disc list-inside text-slate-800 font-semibold">
                  {selectedCountry.passportTypes.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCountry(null)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          FOOTER (Matching Official Agency Footer)
          ========================================================================= */}
      <footer id="contact" className="bg-[#071330] text-white py-4 border-t border-blue-950 text-[11px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400">
          <div>
            © 2026 - IMMIGRATION AGENCY OF MONGOLIA
          </div>

        </div>
      </footer>

      {/* Floating AI Chatbot Avatar in Bottom-Right Corner */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          type="button"
          onClick={() => {
            alert('Immigration Agency of Mongolia 24/7 AI Assistant is available to answer entry questions.');
          }}
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/30 hover:scale-105 transition cursor-pointer border-2 border-white/40"
          title="AI Chatbot Assistant"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      </div>

    </div>
  );
}
