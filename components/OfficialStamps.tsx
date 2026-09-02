import React from 'react';

interface OfficialStampsProps {
  notaryNumber?: string;
  notaryDate?: string;
  showStamps?: boolean;
}

export function OfficialStamps({
  notaryNumber = '7798',
  notaryDate = '2026-08-24',
  showStamps = true,
}: OfficialStampsProps) {
  if (!showStamps) return null;

  return (
    <>
      {/* 1. Rectangular Issue & Entry Red Stamp (over Date of Issue / Enter before box) */}
      <div
        className="absolute pointer-events-none select-none z-10 opacity-75 mix-blend-multiply"
        style={{
          top: '550px',
          left: '495px',
          transform: 'rotate(-2deg)',
        }}
      >
        <div className="border-[2px] border-red-700/80 rounded-sm p-2 w-[165px] h-[115px] flex flex-col justify-between items-center text-center text-red-700/80 font-bold text-[10px] tracking-tight bg-red-500/[0.04]">
          <div className="text-[9px] uppercase border-b border-dashed border-red-600/50 pb-0.5 w-full">
            Олгосон огноо
          </div>
          <div className="text-[9px] uppercase border-b border-dashed border-red-600/50 pb-0.5 w-full">
            Хүчинтэй хугацаа
          </div>
          <div className="text-[14px] font-black tracking-widest text-red-800/90 py-0.5">
            169
          </div>
          <div className="text-[8px] uppercase tracking-tighter">
            Байх хугацаа
          </div>
        </div>
      </div>

      {/* 2. Official Round Consular Red Seal (Bottom Left over Notes & Contact) */}
      <div
        className="absolute pointer-events-none select-none z-20 opacity-80 mix-blend-multiply"
        style={{
          top: '700px',
          left: '145px',
          transform: 'rotate(7deg)',
        }}
      >
        <svg width="220" height="220" viewBox="0 0 220 220" className="drop-shadow-sm">
          {/* Distressed Outer & Inner Rings */}
          <circle cx="110" cy="110" r="100" stroke="#b91c1c" strokeWidth="2.5" strokeDasharray="35 1" fill="none" opacity="0.85" />
          <circle cx="110" cy="110" r="92" stroke="#b91c1c" strokeWidth="1.2" fill="none" opacity="0.75" />
          <circle cx="110" cy="110" r="62" stroke="#b91c1c" strokeWidth="1.5" strokeDasharray="6 2" fill="none" opacity="0.8" />

          {/* Curved Text along path */}
          <defs>
            <path id="consularCircleTop" d="M 30,110 A 80,80 0 0,1 190,110" fill="none" />
            <path id="consularCircleBottom" d="M 190,110 A 80,80 0 0,1 30,110" fill="none" />
          </defs>

          <text fill="#b91c1c" fontSize="10" fontWeight="bold" letterSpacing="1.2" opacity="0.9">
            <textPath href="#consularCircleTop" startOffset="50%" textAnchor="middle">
              CONSULAR DEPARTMENT
            </textPath>
          </text>

          <text fill="#b91c1c" fontSize="9.5" fontWeight="bold" letterSpacing="1" opacity="0.9">
            <textPath href="#consularCircleBottom" startOffset="50%" textAnchor="middle">
              MINISTRY OF FOREIGN AFFAIRS
            </textPath>
          </text>

          {/* Central Soyombo / Emblem Silhouette */}
          <g transform="translate(85, 80) scale(0.5)" opacity="0.85">
            <path d="M25 5 L20 18 L30 18 Z M25 22 C20 22 20 30 25 30 C30 30 30 22 25 22 Z M15 35 L35 35 L25 45 Z" fill="#b91c1c" />
            <circle cx="25" cy="55" r="10" fill="#b91c1c" />
            <rect x="10" y="30" width="30" height="40" stroke="#b91c1c" strokeWidth="2" fill="none" />
          </g>

          <text x="110" y="148" textAnchor="middle" fill="#b91c1c" fontSize="9" fontWeight="bold" letterSpacing="0.8" opacity="0.9">
            OF MONGOLIA
          </text>
        </svg>
      </div>

      {/* 3. Notary Certification Stamp with Pen Signature (Bottom Right over Notes) */}
      <div
        className="absolute pointer-events-none select-none z-20 opacity-85 mix-blend-multiply"
        style={{
          top: '685px',
          left: '500px',
          transform: 'rotate(-0.5deg)',
        }}
      >
        <div className="relative border-[2px] border-red-700/85 rounded p-2.5 w-[370px] bg-red-50/10 text-red-700/90 font-semibold text-[11px] leading-tight shadow-xs">
          {/* Top Date and Registration Header */}
          <div className="flex justify-between items-center text-[12px] font-bold pb-1 border-b border-red-600/30">
            <span className="tracking-wide ">{notaryDate}</span>
            <span>
              Бүртгэлийн № <span className="font-serif italic text-[16px] text-red-900 font-extrabold px-1">{notaryNumber}</span>
            </span>
          </div>
          <div className="pt-1 text-[11px] text-red-800/95 font-medium">
            Нийслэлийн тойргийн нотариатч
          </div>
          <div className="text-[10.5px] text-red-700/90 py-0.5">
            Үнэн зөвийг гэрчлэв.
          </div>
          <div className="flex justify-between items-end pt-1">
            <span className="text-[11px] font-bold text-red-800">Нотариатч:</span>
            <span className="text-[9px] text-red-600/70 italic">Тэмдэг, гарын үсэг</span>
          </div>

          {/* Authentic Ink Pen Signature Stroke Overlay */}
          <svg
            className="absolute top-2 right-6 w-32 h-20 pointer-events-none"
            viewBox="0 0 160 80"
            fill="none"
          >
            <path
              d="M15 50 C25 25, 40 10, 55 20 C65 28, 50 65, 70 55 C90 45, 110 15, 125 35 C135 48, 120 70, 145 60 C155 55, 158 50, 160 48"
              stroke="#0f172a"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.9"
            />
            <path
              d="M35 55 Q75 68 140 52"
              stroke="#0f172a"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.85"
            />
            <circle cx="120" cy="45" r="14" stroke="#0f172a" strokeWidth="1.8" fill="none" opacity="0.8" />
          </svg>
        </div>
      </div>
    </>
  );
}
