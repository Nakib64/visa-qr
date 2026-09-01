import React from 'react';
import { getVisaById } from '@/lib/db';
import { ResponsiveVisaViewer } from '@/components/ResponsiveVisaViewer';
import { notFound } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import PrintButton from './PrintButton';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function VisaViewPage({ params }: PageProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const visa = await getVisaById(decodedId);

  if (!visa) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center py-4 sm:py-8 px-2 sm:px-4 print:p-0 print:m-0 print:bg-white">
      
      {/* Top Floating Action Bar (Hidden during Print, NO Admin Link) */}
      <div className="w-full max-w-[794px] mb-4 sm:mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-xl print:hidden no-print">
        
        {/* Verification Status Badge */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide">
                Electronic Visa Verified
              </span>
              <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Active
              </span>
            </div>
            <div className="text-[11px] sm:text-xs text-slate-400">
              Immigration Agency of Mongolia • <span className="font-mono text-slate-300">{visa.electronicVisaNumber}</span>
            </div>
          </div>
        </div>

        {/* Print Action Only */}
        <div className="flex items-center justify-end w-full sm:w-auto">
          <PrintButton />
        </div>
      </div>

      {/* The Mongolia Electronic Visa Document (Fluid Responsive Container) */}
      <div className="w-full max-w-[794px] flex justify-center print:w-full print:max-w-none print:block">
        <ResponsiveVisaViewer visa={visa} />
      </div>

      {/* Bottom Footer Disclaimer */}
      <div className="mt-6 sm:mt-8 text-center text-[11px] sm:text-xs text-slate-500 print:hidden no-print">
        Official Document Verification Portal • Immigration Agency of Mongolia
      </div>
    </div>
  );
}
