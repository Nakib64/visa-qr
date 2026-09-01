'use client';

import React, { useEffect, useState } from 'react';
import { VisaData } from '@/lib/types';
import { MongoliaEmblem, HeaderBannerGraphic } from './MongoliaEmblem';
import { generateQrDataUrl } from '@/lib/qr';

interface VisaDocumentProps {
  visa: VisaData;
  origin?: string;
  isPrintPreview?: boolean;
}

export function VisaDocument({ visa, origin = '', isPrintPreview = false }: VisaDocumentProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    // Generate verification URL encoded in the QR code
    const baseUrl = origin || (typeof window !== 'undefined' ? window.location.origin : '');
    const verificationUrl = `${baseUrl}/visa/${encodeURIComponent(visa.id || visa.idNumber || visa.electronicVisaNumber)}`;
    
    generateQrDataUrl(verificationUrl).then((url) => {
      setQrCodeUrl(url);
    });
  }, [visa, origin]);

  return (
    <div
      id="visa-print-container"
      className={`relative bg-white text-black font-sans box-border overflow-hidden select-text flex flex-col justify-between ${
        isPrintPreview ? 'shadow-2xl border border-gray-200' : ''
      }`}
      style={{
        width: '210mm',
        minHeight: '296.5mm',
        maxHeight: '296.5mm',
        padding: '16mm 18mm 14mm 18mm',
        margin: '0 auto',
        boxSizing: 'border-box',
        position: 'relative',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Top Header Section */}
      <div className="relative flex items-center justify-between pb-3.5 border-b-2 border-slate-200 overflow-hidden flex-shrink-0">
        <HeaderBannerGraphic />
        <div className="relative z-10 flex items-center gap-4">
          <MongoliaEmblem className="w-[68px] h-[68px] flex-shrink-0 drop-shadow-xs" />
          <div className="flex flex-col">
            <h1 className="text-[28px] leading-tight font-black tracking-wider text-[#0A3C74] font-serif uppercase">
              MONGOLIA
            </h1>
            <span className="text-[18px] leading-none font-bold text-[#1E5692] tracking-wide">
              Electronic Visa
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area - Expands Vertically to Fill Full Page */}
      <div className="relative z-10 flex-1 flex flex-col justify-between pt-4 space-y-4">
        
        {/* Personal Details Section */}
        <div className="flex gap-8 items-start">
          {/* Photo & ID Box */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-[148px] h-[185px] bg-slate-100 border border-slate-400 overflow-hidden relative shadow-xs">
              {visa.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={visa.photo}
                  alt={visa.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-200 to-slate-300 text-slate-500">
                  <svg className="w-16 h-16 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  <span className="text-[11px] uppercase font-semibold mt-1">Photo</span>
                </div>
              )}
            </div>
            <div className="mt-2 text-[13.5px] font-extrabold tracking-tight text-black text-center font-mono">
              ID: {visa.idNumber}
            </div>
          </div>

          {/* Personal Info Grid */}
          <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-3 pt-0.5">
            {/* Surname */}
            <div className="col-span-1">
              <div className="text-[14px] font-bold text-gray-900 leading-tight">Surname:</div>
              <div className="text-[11.5px] text-gray-500 leading-none">Овог</div>
            </div>
            <div className="col-span-1 flex items-center">
              <div className="text-[15px] font-extrabold text-black uppercase tracking-wide">
                {visa.surname || '-'}
              </div>
            </div>

            {/* Name */}
            <div className="col-span-1">
              <div className="text-[14px] font-bold text-gray-900 leading-tight">Name:</div>
              <div className="text-[11.5px] text-gray-500 leading-none">Нэр</div>
            </div>
            <div className="col-span-1 flex items-center">
              <div className="text-[15px] font-extrabold text-black uppercase tracking-wide">
                {visa.name || '-'}
              </div>
            </div>

            {/* Date of Birth */}
            <div className="col-span-1">
              <div className="text-[14px] font-bold text-gray-900 leading-tight">Date of birth:</div>
              <div className="text-[11.5px] text-gray-500 leading-none">Төрсөн огноо</div>
            </div>
            <div className="col-span-1 flex items-center">
              <div className="text-[15px] font-extrabold text-black uppercase tracking-wide font-mono">
                {visa.dateOfBirth || '-'}
              </div>
            </div>

            {/* Gender */}
            <div className="col-span-1">
              <div className="text-[14px] font-bold text-gray-900 leading-tight">Gender:</div>
              <div className="text-[11.5px] text-gray-500 leading-none">Хүйс</div>
            </div>
            <div className="col-span-1 flex items-center">
              <div className="text-[15px] font-extrabold text-black uppercase tracking-wide">
                {visa.gender || '-'}
              </div>
            </div>

            {/* Nationality */}
            <div className="col-span-1">
              <div className="text-[14px] font-bold text-gray-900 leading-tight">Nationality:</div>
              <div className="text-[11.5px] text-gray-500 leading-none">Иргэний харьяалал</div>
            </div>
            <div className="col-span-1 flex items-center">
              <div className="text-[15px] font-extrabold text-black uppercase tracking-wide">
                {visa.nationality || '-'}
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Passport info + QR Code */}
        <div className="pt-2">
          <div className="grid grid-cols-12 gap-4 items-start">
            {/* Passport Info Left Side */}
            <div className="col-span-7">
              <h2 className="text-[15.5px] font-bold text-gray-900 mb-2.5 tracking-tight">
                Passport information
              </h2>
              
              <div className="grid grid-cols-2 gap-x-2 gap-y-2.5">
                {/* Passport number */}
                <div>
                  <div className="text-[13.5px] font-bold text-gray-900 leading-tight">Passport number:</div>
                  <div className="text-[11px] text-gray-500 leading-none italic">Паспортын дугаар</div>
                </div>
                <div className="flex items-center">
                  <div className="text-[14.5px] font-extrabold text-black font-mono">
                    {visa.passportNumber}
                  </div>
                </div>

                {/* Passport type */}
                <div>
                  <div className="text-[13.5px] font-bold text-gray-900 leading-tight">Passport type:</div>
                  <div className="text-[11px] text-gray-500 leading-none italic">Паспортын төрөл</div>
                </div>
                <div className="flex items-center">
                  <div className="text-[14.5px] font-extrabold text-black uppercase">
                    {visa.passportType}
                  </div>
                </div>

                {/* Date of expiry */}
                <div>
                  <div className="text-[13.5px] font-bold text-gray-900 leading-tight">Date of expiry:</div>
                  <div className="text-[11px] text-gray-500 leading-none italic">Дуусах хугацаа</div>
                </div>
                <div className="flex items-center">
                  <div className="text-[14.5px] font-extrabold text-black font-mono">
                    {visa.dateOfExpiry}
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code on the Right */}
            <div className="col-span-5 flex flex-col items-center justify-center -mt-8">
              <div className="p-1 border border-slate-900 bg-white shadow-xs">
                {qrCodeUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qrCodeUrl}
                    alt="Mongolia eVisa QR Code"
                    className="w-[148px] h-[148px] block"
                  />
                ) : (
                  <div className="w-[148px] h-[148px] bg-slate-100 flex items-center justify-center text-[10px] text-slate-400">
                    Loading QR...
                  </div>
                )}
              </div>
              <div className="mt-1.5 text-[12px] font-extrabold text-gray-900 tracking-tight text-center">
                Electronic visa number: <span className="font-mono">{visa.electronicVisaNumber}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Electronic Visa Information Section */}
        <div className="pt-2.5 border-t border-slate-200">
          <h2 className="text-[15.5px] font-bold text-gray-900 mb-2 tracking-tight">
            Electronic visa information
          </h2>

          {/* Inviter */}
          <div className="grid grid-cols-12 gap-2 mb-2.5 items-center">
            <div className="col-span-3">
              <div className="text-[13.5px] font-bold text-gray-900 leading-tight">Inviter:</div>
              <div className="text-[11px] text-gray-500 leading-none italic">Уригч</div>
            </div>
            <div className="col-span-9 text-[14.5px] font-extrabold text-black tracking-wide">
              {visa.inviter}
            </div>
          </div>

          {/* 2-Column Grid for Visa Details */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
            {/* Left Column */}
            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[13px] font-bold text-gray-900 leading-tight">Classification of visa:</div>
                  <div className="text-[10.5px] text-gray-500 leading-none italic">Визийн ангилал</div>
                </div>
                <div className="text-[14px] font-extrabold text-black flex items-center">
                  {visa.classificationOfVisa}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[13px] font-bold text-gray-900 leading-tight">Entries:</div>
                  <div className="text-[10.5px] text-gray-500 leading-none italic">Визийн төрөл</div>
                </div>
                <div className="text-[14px] font-extrabold text-black flex items-center uppercase">
                  {visa.entries}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[13px] font-bold text-gray-900 leading-tight">Type of visa:</div>
                  <div className="text-[10.5px] text-gray-500 leading-none italic">Визийн зориулалт</div>
                </div>
                <div className="text-[14px] font-extrabold text-black flex items-center uppercase">
                  {visa.typeOfVisa}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[13px] font-bold text-gray-900 leading-tight">Date of issue:</div>
                  <div className="text-[10.5px] text-gray-500 leading-none italic">Олгосон огноо</div>
                </div>
                <div className="text-[14px] font-extrabold text-black flex items-center font-mono">
                  {visa.dateOfIssue}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[13px] font-bold text-gray-900 leading-tight">Enter before:</div>
                  <div className="text-[10.5px] text-gray-500 leading-none italic">Хүчинтэй хугацаа</div>
                </div>
                <div className="text-[14px] font-extrabold text-black flex items-center font-mono">
                  {visa.enterBefore}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[13px] font-bold text-gray-900 leading-tight">Duration of stay:</div>
                  <div className="text-[10.5px] text-gray-500 leading-none italic">Байх хугацаа</div>
                </div>
                <div className="text-[14px] font-extrabold text-black flex items-center uppercase font-mono">
                  {visa.durationOfStay}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="pt-2.5 border-t border-slate-200 text-[11.5px] leading-relaxed text-gray-800">
          <div className="font-bold text-[13px] text-black mb-1">Notes:</div>
          <ul className="space-y-1 list-disc list-outside pl-4 marker:text-black">
            <li>The validity of this electronic visa can be verified by QR code.</li>
            <li>In case that the records in your electronic visa and passport differ, your electronic visa will be considered invalid.</li>
            <li>In exceptional circumstances, it is possible that relevant authorities may refuse your entry to Mongolia.</li>
            <li>During your stay in Mongolia you are obliged to comply with the laws and regulations of Mongolia.</li>
            <li>Your biometric details are required to be provided at the border control officer at the time of your arrival.</li>
            <li>You are required to be registered online within 48 hours after your arrival through www.immigration.gov.mn.</li>
            <li>Enjoy your visit to Mongolia and please do not exceed the duration of your visa so that we can welcome you again!</li>
          </ul>
        </div>

        {/* Footer with Contact & Inviter Phone */}
        <div className="pt-3 border-t border-slate-300">
          <div className="text-[10.5px] text-center text-gray-800 font-semibold leading-tight px-4">
            Contact us: <span className="font-bold">+976-1800-1882</span>, <span className="underline">www.immigration.gov.mn</span>, immigration Agency of Mongolia, Government Implementing Agency, Ulaanbaatar Mongolia
          </div>
          <div className="flex justify-end pt-1.5 pr-2">
            <div className="text-[11px] text-gray-700 font-medium">
              Inviter&apos;s Phone Number: <span className="font-bold text-black font-mono">{visa.inviterPhone}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
