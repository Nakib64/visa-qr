'use client';

import React, { useEffect, useState } from 'react';
import { VisaData } from '@/lib/types';
import { generateQrDataUrl } from '@/lib/qr';

interface VisaDocumentProps {
  visa: VisaData;
  origin?: string;
  isPrintPreview?: boolean;
}

export function VisaDocument({ visa, origin = '', isPrintPreview = false }: VisaDocumentProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [photoFailed, setPhotoFailed] = useState<boolean>(false);

  useEffect(() => {
    setPhotoFailed(false);
  }, [visa.photo]);

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
      className={`relative bg-white text-black font-sans box-border overflow-hidden select-text flex flex-col justify-between ${isPrintPreview ? 'shadow-2xl border border-gray-200' : ''
        }`}
      style={{
        width: '210mm',
        minHeight: '296.5mm',
        maxHeight: '296.5mm',
        padding: 0,
        margin: '0 auto',
        boxSizing: 'border-box',
        position: 'relative',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Top Header Section with Official Mongolia Electronic Visa Banner */}
      <div className="relative w-full border-b-2 border-slate-300 overflow-hidden flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/mongolia-header-banner.png"
          alt="MONGOLIA Electronic Visa"
          className="w-full h-auto block select-none"
        />
      </div>

      {/* Main Content Area - Expands Vertically to Fill Full Page */}
      <div
        className="relative z-10 flex-1 flex flex-col justify-between space-y-4"
        style={{
          padding: '14px 16mm 14mm 16mm',
        }}
      >
        {/* Personal Details Section */}
        <div className="flex gap-7 items-start">
          {/* Photo & ID Box */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-[137px] h-[170px] bg-slate-100 overflow-hidden relative">
              {visa.photo && !photoFailed ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={visa.photo}
                  alt={visa.name}
                  onError={() => setPhotoFailed(true)}
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
            <div className="mt-2 text-[13px] font-bold text-black text-center tracking-wider">
              ID: {visa.idNumber}
            </div>
          </div>

          {/* Personal Info Grid */}
          <div className="flex-1 grid grid-cols-12 gap-y-2.5 pt-0.5">
            {/* Surname */}
            <div className="col-span-5">
              <div className="text-[13.5px] font-bold text-black leading-tight">Surname:</div>
              <div className="text-[11.5px] text-gray-500 leading-none italic mt-0.5">Овог</div>
            </div>
            <div className="col-span-7 flex items-center">
              <div className="text-[14px] font-bold text-black uppercase tracking-wide">
                {visa.surname || '-'}
              </div>
            </div>

            {/* Name */}
            <div className="col-span-5">
              <div className="text-[13.5px] font-bold text-black leading-tight">Name:</div>
              <div className="text-[11.5px] text-gray-500 leading-none italic mt-0.5">Нэр</div>
            </div>
            <div className="col-span-7 flex items-center">
              <div className="text-[14px] font-bold text-black uppercase tracking-wide">
                {visa.name || '-'}
              </div>
            </div>

            {/* Date of Birth */}
            <div className="col-span-5">
              <div className="text-[13.5px] font-bold text-black leading-tight">Date of birth:</div>
              <div className="text-[11.5px] text-gray-500 leading-none italic mt-0.5">Төрсөн огноо</div>
            </div>
            <div className="col-span-7 flex items-center">
              <div className="text-[14px] font-bold text-black uppercase">
                {visa.dateOfBirth || '-'}
              </div>
            </div>

            {/* Gender */}
            <div className="col-span-5">
              <div className="text-[13.5px] font-bold text-black leading-tight">Gender:</div>
              <div className="text-[11.5px] text-gray-500 leading-none italic mt-0.5">Хүйс</div>
            </div>
            <div className="col-span-7 flex items-center">
              <div className="text-[14px] font-bold text-black uppercase">
                {visa.gender || '-'}
              </div>
            </div>

            {/* Nationality */}
            <div className="col-span-5">
              <div className="text-[13.5px] font-bold text-black leading-tight">Nationality:</div>
              <div className="text-[11.5px] text-gray-500 leading-none italic mt-0.5">Иргэний харьяалал</div>
            </div>
            <div className="col-span-7 flex items-center">
              <div className="text-[14px] font-bold text-black uppercase">
                {visa.nationality || '-'}
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Passport info + QR Code */}
        <div className="pt-2">
          <div className="grid grid-cols-12 gap-6 items-start">
            {/* Passport Info Left Side */}
            <div className="col-span-7 space-y-1.5">
              <h2 className="text-[14px] font-normal text-black mb-1">
                Passport information
              </h2>

              <div className="space-y-0.5">
                {/* Passport number (Grey Row) */}
                <div className="grid grid-cols-12 bg-[#ececec] px-2 py-1 items-center">
                  <div className="col-span-6">
                    <div className="text-[13px] font-bold text-black leading-tight">Passport number:</div>
                    <div className="text-[11px] text-gray-500 leading-none italic mt-0.5">Паспортын дугаар</div>
                  </div>
                  <div className="col-span-6 text-[13px] font-bold text-black uppercase">
                    {visa.passportNumber}
                  </div>
                </div>

                {/* Passport type (White Row) */}
                <div className="grid grid-cols-12 px-2 py-1 items-center">
                  <div className="col-span-6">
                    <div className="text-[13px] font-bold text-black leading-tight">Passport type:</div>
                    <div className="text-[11px] text-gray-500 leading-none italic mt-0.5">Паспортын төрөл</div>
                  </div>
                  <div className="col-span-6 text-[13px] font-bold text-black uppercase">
                    {visa.passportType}
                  </div>
                </div>

                {/* Date of expiry (Grey Row) */}
                <div className="grid grid-cols-12 bg-[#ececec] px-2 py-1 items-center">
                  <div className="col-span-6">
                    <div className="text-[13px] font-bold text-black leading-tight">Date of expiry:</div>
                    <div className="text-[11px] text-gray-500 leading-none italic mt-0.5">Дуусах хугацаа</div>
                  </div>
                  <div className="col-span-6 text-[13px] font-bold text-black uppercase">
                    {visa.dateOfExpiry}
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code on the Right */}
            <div className="col-span-5 flex flex-col items-center justify-center -mt-6">
              <div className="bg-white">
                {qrCodeUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qrCodeUrl}
                    alt="Mongolia eVisa QR Code"
                    className="w-[138px] h-[138px] block"
                  />
                ) : (
                  <div className="w-[138px] h-[138px] bg-slate-100 flex items-center justify-center text-[10px] text-slate-400">
                    Loading QR...
                  </div>
                )}
              </div>
              <div className="mt-1 text-[12px] text-black text-center">
                Electronic visa number: <span className="font-bold">{visa.electronicVisaNumber}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Electronic Visa Information Section */}
        <div className="pt-2 space-y-1.5">
          <h2 className="text-[14px] font-normal text-black mb-1">
            Electronic visa information
          </h2>

          {/* Inviter (White Row) */}
          <div className="grid grid-cols-12 px-2 py-0.5 items-center">
            <div className="col-span-4">
              <div className="text-[13px] font-bold text-black leading-tight">Inviter:</div>
              <div className="text-[11px] text-gray-500 leading-none italic mt-0.5">Уригч</div>
            </div>
            <div className="col-span-8 text-[13px] font-bold text-black uppercase tracking-wide">
              {visa.inviter}
            </div>
          </div>

          {/* 2-Column Table with Full-Width Alternating Striped Rows */}
          <div className="space-y-0.5">
            {/* Row 1 (Grey Row) */}
            <div className="grid grid-cols-12 bg-[#ececec] px-2 py-1 items-center">
              {/* Classification of visa */}
              <div className="col-span-3">
                <div className="text-[13px] font-bold text-black leading-tight">Classification of visa:</div>
                <div className="text-[11px] text-gray-500 leading-none italic mt-0.5">Визийн ангилал</div>
              </div>
              <div className="col-span-3 text-[13px] font-bold text-black uppercase">
                {visa.classificationOfVisa}
              </div>

              {/* Date of issue */}
              <div className="col-span-3">
                <div className="text-[13px] font-bold text-black leading-tight">Date of issue:</div>
                <div className="text-[11px] text-gray-500 leading-none italic mt-0.5">Олгосон огноо</div>
              </div>
              <div className="col-span-3 text-[13px] font-bold text-black uppercase">
                {visa.dateOfIssue}
              </div>
            </div>

            {/* Row 2 (White Row) */}
            <div className="grid grid-cols-12 px-2 py-1 items-center">
              {/* Entries */}
              <div className="col-span-3">
                <div className="text-[13px] font-bold text-black leading-tight">Entries:</div>
                <div className="text-[11px] text-gray-500 leading-none italic mt-0.5">Визийн төрөл</div>
              </div>
              <div className="col-span-3 text-[13px] font-bold text-black uppercase">
                {visa.entries}
              </div>

              {/* Enter before */}
              <div className="col-span-3">
                <div className="text-[13px] font-bold text-black leading-tight">Enter before:</div>
                <div className="text-[11px] text-gray-500 leading-none italic mt-0.5">Хүчинтэй хугацаа</div>
              </div>
              <div className="col-span-3 text-[13px] font-bold text-black uppercase">
                {visa.enterBefore}
              </div>
            </div>

            {/* Row 3 (Grey Row) */}
            <div className="grid grid-cols-12 bg-[#ececec] px-2 py-1 items-center">
              {/* Type of visa */}
              <div className="col-span-3">
                <div className="text-[13px] font-bold text-black leading-tight">Type of visa:</div>
                <div className="text-[11px] text-gray-500 leading-none italic mt-0.5">Визийн зориулалт</div>
              </div>
              <div className="col-span-3 text-[13px] font-bold text-black uppercase">
                {visa.typeOfVisa}
              </div>

              {/* Duration of stay */}
              <div className="col-span-3">
                <div className="text-[13px] font-bold text-black leading-tight">Duration of stay:</div>
                <div className="text-[11px] text-gray-500 leading-none italic mt-0.5">Байх хугацаа</div>
              </div>
              <div className="col-span-3 text-[13px] font-bold text-black uppercase">
                {visa.durationOfStay}
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="pt-2 text-[11px] leading-relaxed text-black">
          <div className="font-bold text-[12.5px] text-black mb-1">Notes:</div>
          <ul className="space-y-0.5 list-disc list-outside pl-4 marker:text-black">
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
        <div className="pt-2">
          <div className="text-[10px] text-center text-black font-bold leading-tight px-2">
            Contact us: +976-1800-1882, www.immigration.gov.mn, immigration Agency of Mongolia, Government Implementing Agency, Ulaanbaatar Mongolia
          </div>
          <div className="flex flex-col items-end text-right pt-2 text-[11px] text-gray-600 font-normal leading-snug">
            <div>Inviter&apos;s Phone Number:</div>
            <div>{visa.inviterPhone}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
