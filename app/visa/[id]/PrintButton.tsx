'use client';

import React from 'react';
import { Printer } from 'lucide-react';

export default function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg transition active:scale-95"
    >
      <Printer className="w-4 h-4" />
      Print Document (1 Page)
    </button>
  );
}
