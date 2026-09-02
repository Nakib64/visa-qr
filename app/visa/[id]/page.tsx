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
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 text-slate-900 flex flex-col items-center py-4 sm:py-8 px-2 sm:px-4 print:p-0 print:m-0 print:bg-white">

      {/* Top Floating Action Bar (Hidden during Print, NO Admin Link) */}
      <div className="w-full max-w-[794px] mb-4 sm:mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-lg shadow-slate-200/60 print:hidden no-print">

        {/* Verification Status Badge */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 flex-shrink-0 shadow-xs">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
                Electronic Visa Verified
              </span>
              <span className="px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200/80">
                Active
              </span>
            </div>
            <div className="text-[11px] sm:text-xs text-slate-500">
              Immigration Agency of Mongolia • <span className=" font-medium text-slate-700">{visa.electronicVisaNumber}</span>
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
