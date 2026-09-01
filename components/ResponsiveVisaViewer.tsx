'use client';

import React, { useEffect, useRef, useState } from 'react';
import { VisaData } from '@/lib/types';
import { VisaDocument } from './VisaDocument';

interface ResponsiveVisaViewerProps {
  visa: VisaData;
  origin?: string;
}

export function ResponsiveVisaViewer({ visa, origin }: ResponsiveVisaViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const availableWidth = containerRef.current.clientWidth;
        const docWidth = 794; // approx 210mm at 96 DPI
        if (availableWidth < docWidth && availableWidth > 0) {
          const newScale = Math.max(0.32, availableWidth / docWidth);
          setScale(newScale);
        } else {
          setScale(1);
        }
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);

    // Print event listeners
    const handleBeforePrint = () => setIsPrinting(true);
    const handleAfterPrint = () => setIsPrinting(false);

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      window.removeEventListener('resize', updateScale);
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  // Native A4 height in px is approx 1123px (297mm at 96 DPI)
  const docHeight = 1123;
  const scaledHeight = scale < 1 && !isPrinting ? docHeight * scale : 'auto';

  return (
    <div
      ref={containerRef}
      className="w-full flex justify-center print:w-full print:block print:h-auto print:overflow-visible"
      style={{
        height: scaledHeight,
      }}
    >
      <div
        className="origin-top transition-transform duration-150 print:!transform-none"
        style={
          isPrinting || scale >= 1
            ? undefined
            : {
                transform: `scale(${scale})`,
              }
        }
      >
        <div className="shadow-2xl rounded-sm print:shadow-none print:rounded-none">
          <VisaDocument visa={visa} origin={origin} isPrintPreview={false} />
        </div>
      </div>
    </div>
  );
}
