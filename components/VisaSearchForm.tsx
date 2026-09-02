'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface VisaSearchFormProps {
  sampleVisaId?: string;
  sampleVisaName?: string;
}

export function VisaSearchForm({ sampleVisaId, sampleVisaName }: VisaSearchFormProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setErrorMessage('Please enter an Electronic Visa Number, ID Code, or Passport Number.');
      return;
    }
    setErrorMessage(null);
    setIsSearching(true);
    router.push(`/visa/${encodeURIComponent(trimmed)}`);
  };

  const handleUseSample = () => {
    if (sampleVisaId) {
      setQuery(sampleVisaId);
      router.push(`/visa/${encodeURIComponent(sampleVisaId)}`);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-lg shadow-blue-900/5 text-left">
      <div className="flex items-center gap-2.5 mb-3 text-blue-800">
        <ShieldCheck className="w-5 h-5 text-blue-600" />
        <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">
          Verify Document Authenticity
        </span>
      </div>

      <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
        Enter the Electronic Visa Number (e.g. <span className=" font-semibold text-slate-800">MNG260504156</span>), Applicant Identification Code, or Document ID to verify official clearance status.
      </p>

      <form onSubmit={handleSearch} className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="e.g. MNG260504156 or V2605200900008"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              className="w-full pl-10 pr-4 py-3 bg-slate-50/90 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100  transition"
            />
          </div>

          <button
            type="submit"
            disabled={isSearching}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 transition-all active:scale-95 cursor-pointer flex-shrink-0"
          >
            {isSearching ? 'Verifying...' : 'Verify Visa'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {errorMessage && (
          <p className="text-xs text-rose-600 font-medium pl-1">
            {errorMessage}
          </p>
        )}
      </form>

      {sampleVisaId && (
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-slate-600">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official Government Registry Online</span>
          </div>

          <button
            type="button"
            onClick={handleUseSample}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            Quick Test: View Demo Visa ({sampleVisaId}) →
          </button>
        </div>
      )}
    </div>
  );
}
