'use client';

import React, { useState } from 'react';
import { VisaData, DEFAULT_VISA } from '@/lib/types';
import { ResponsiveVisaViewer } from './ResponsiveVisaViewer';
import {
  User,
  FileText,
  CheckCircle,
  Eye,
  Save,
  RotateCcw,
  Sparkles,
  Printer,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import Link from 'next/link';

interface AdminFormProps {
  initialData?: VisaData;
  onSaved?: (savedVisa: VisaData) => void;
}

export function AdminForm({ initialData, onSaved }: AdminFormProps) {
  const [formData, setFormData] = useState<VisaData>(
    initialData || {
      id: '',
      ...DEFAULT_VISA,
    }
  );

  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'personal' | 'passport' | 'visa'>('personal');
  const [showLivePreview, setShowLivePreview] = useState(true);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError(null);

    // 1. Strict Image-only check
    if (!file.type.startsWith('image/')) {
      setPhotoError('Invalid file type. Please upload an image file (JPG, PNG, WEBP).');
      e.target.value = '';
      return;
    }

    // 2. Strict 2MB max size check (2 * 1024 * 1024 bytes)
    const MAX_SIZE_BYTES = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
      setPhotoError(`Selected file is too large (${sizeInMb} MB). Maximum allowed size is 2MB.`);
      e.target.value = '';
      return;
    }

    try {
      setUploadingPhoto(true);
      const uploadData = new FormData();
      uploadData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      const json = await res.json();

      if (json.success && json.url) {
        setFormData((prev) => ({ ...prev, photo: json.url }));
        setPhotoError(null);
      } else {
        setPhotoError(json.error || 'Failed to upload image file.');
      }
    } catch (err: any) {
      setPhotoError('Network error uploading image: ' + err.message);
    } finally {
      setUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const handleResetToSample = () => {
    setFormData({
      id: formData.id || '',
      ...DEFAULT_VISA,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(null);

    try {
      const isUpdating = Boolean(formData.id && formData.id.length > 0);
      const url = isUpdating ? `/api/visas/${formData.id}` : '/api/visas';
      const method = isUpdating ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (json.success) {
        setFormData(json.data);
        const docId = json.data.electronicVisaNumber || json.data.id;
        setSaveSuccess(`Visa document saved successfully! Document ID: ${docId}`);
        if (onSaved) onSaved(json.data);
      } else {
        alert('Failed to save visa: ' + json.error);
      }
    } catch (err: any) {
      alert('Error saving visa: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Save Notification Banner */}
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-sm font-semibold">{saveSuccess}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/visa/${encodeURIComponent(formData.electronicVisaNumber || formData.id || formData.idNumber)}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
            >
              <Eye className="w-3.5 h-3.5" />
              View Public Page
            </Link>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Form on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

        {/* Form Container */}
        <div className={`xl:col-span-${showLivePreview ? '6' : '12'} bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm`}>

          {/* Header & Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                {formData.id ? 'Edit Electronic Visa' : 'Create New Electronic Visa'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Fill the fields matching the official Mongolia eVisa document.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetToSample}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition cursor-pointer"
                title="Reset all form fields"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear Form
              </button>

              <button
                type="button"
                onClick={() => setShowLivePreview(!showLivePreview)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                {showLivePreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            </div>
          </div>

          {/* Form Tabs */}
          <div className="flex border-b border-slate-200 mt-4 space-x-2">
            <button
              type="button"
              onClick={() => setActiveTab('personal')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${activeTab === 'personal'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
            >
              <User className="w-3.5 h-3.5" />
              1. Personal Info
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('passport')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${activeTab === 'passport'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
            >
              <FileText className="w-3.5 h-3.5" />
              2. Passport
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('visa')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${activeTab === 'visa'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              3. Visa Details
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-5">

            {/* Tab 1: Personal Info */}
            {activeTab === 'personal' && (
              <div className="space-y-4">
                {/* Photo Upload & Preview Row */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-16 h-20 bg-slate-200 rounded border border-slate-300 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-xs">
                    {formData.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700">
                        Applicant Photo (Зураг)
                      </label>
                      <span className="text-[10.5px] text-slate-500 font-medium">
                        Max 2MB • JPG, PNG, WEBP
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <label
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 shadow-xs transition ${uploadingPhoto ? 'opacity-50 cursor-wait' : 'cursor-pointer'
                          }`}
                      >
                        {uploadingPhoto ? (
                          <>
                            <svg className="animate-spin h-3.5 w-3.5 text-blue-600" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5 text-blue-600" />
                            Choose Image File
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/webp, image/jpg"
                          onChange={handlePhotoUpload}
                          disabled={uploadingPhoto}
                          className="hidden"
                        />
                      </label>
                      {formData.photo && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, photo: '' }));
                            setPhotoError(null);
                          }}
                          className="text-xs text-rose-600 hover:underline font-medium cursor-pointer"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>

                    {photoError && (
                      <div className="text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-2.5 py-1.5 animate-in fade-in">
                        ⚠ {photoError}
                      </div>
                    )}

                    <input
                      type="text"
                      name="photo"
                      value={formData.photo || ''}
                      onChange={handleChange}
                      placeholder="Or paste image URL / Base64 Data URL"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* ID */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      ID (Applicant Identification Code)
                    </label>
                    <input
                      type="text"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleChange}
                      placeholder="e.g. V2605200900008"
                      required
                      className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 "
                    />
                  </div>

                  {/* Surname */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Surname / Овог
                    </label>
                    <input
                      type="text"
                      name="surname"
                      value={formData.surname}
                      onChange={handleChange}
                      placeholder="e.g. ALI"
                      required
                      className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 uppercase"
                    />
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Name / Нэр
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. MD AKASH"
                      required
                      className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 uppercase"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Date of birth / Төрсөн огноо
                    </label>
                    <input
                      type="text"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      placeholder="e.g. 2006 FEB 01"
                      required
                      className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 "
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Gender / Хүйс
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 uppercase"
                    >
                      <option value="MALE">MALE</option>
                      <option value="FEMALE">FEMALE</option>
                    </select>
                  </div>

                  {/* Nationality */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nationality / Иргэний харьяалал
                    </label>
                    <input
                      type="text"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleChange}
                      placeholder="e.g. BANGLADESH"
                      required
                      className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 uppercase"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Passport Information */}
            {activeTab === 'passport' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Passport Number */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Passport number / Паспортын дугаар
                    </label>
                    <input
                      type="text"
                      name="passportNumber"
                      value={formData.passportNumber}
                      onChange={handleChange}
                      placeholder="e.g. A09653676"
                      required
                      className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50  uppercase"
                    />
                  </div>

                  {/* Passport Type */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Passport type / Паспортын төрөл
                    </label>
                    <select
                      name="passportType"
                      value={formData.passportType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 uppercase"
                    >
                      <option value="ORDINARY">ORDINARY</option>
                      <option value="OFFICIAL">OFFICIAL</option>
                      <option value="DIPLOMATIC">DIPLOMATIC</option>
                      <option value="SERVICE">SERVICE</option>
                    </select>
                  </div>

                  {/* Date of Expiry */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Date of expiry / Дуусах хугацаа
                    </label>
                    <input
                      type="text"
                      name="dateOfExpiry"
                      value={formData.dateOfExpiry}
                      onChange={handleChange}
                      placeholder="e.g. 12 OCT 2035"
                      required
                      className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50  uppercase"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Visa Details */}
            {activeTab === 'visa' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Electronic Visa Number */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Electronic visa number (Цахим визийн дугаар)
                    </label>
                    <input
                      type="text"
                      name="electronicVisaNumber"
                      value={formData.electronicVisaNumber}
                      onChange={handleChange}
                      placeholder="e.g. MNG260504156"
                      required
                      className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50  uppercase"
                    />
                  </div>

                  {/* Inviter */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Inviter / Уригч
                    </label>
                    <input
                      type="text"
                      name="inviter"
                      value={formData.inviter}
                      onChange={handleChange}
                      placeholder="e.g. НЭЙШНЛБИЗНЕС МАРКЕТ ХХК"
                      required
                      className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 uppercase"
                    />
                  </div>

                  {/* Classification */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Classification of visa / Визийн ангилал
                    </label>
                    <input
                      type="text"
                      name="classificationOfVisa"
                      value={formData.classificationOfVisa}
                      onChange={handleChange}
                      placeholder="e.g. C7"
                      required
                      className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50  uppercase"
                    />
                  </div>

                  {/* Entries */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Entries / Визийн төрөл
                    </label>
                    <select
                      name="entries"
                      value={formData.entries}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 uppercase"
                    >
                      <option value="SINGLE">SINGLE</option>
                      <option value="DOUBLE">DOUBLE</option>
                      <option value="MULTIPLE">MULTIPLE</option>
                    </select>
                  </div>

                  {/* Type of Visa */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Type of visa / Визийн зориулалт
                    </label>
                    <select
                      name="typeOfVisa"
                      value={formData.typeOfVisa}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 uppercase"
                    >
                      <option value="ENTRY">ENTRY</option>
                      <option value="TRANSIT">TRANSIT</option>
                      <option value="EXIT-ENTRY">EXIT-ENTRY</option>
                    </select>
                  </div>

                  {/* Date of Issue */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Date of issue / Олгосон огноо
                    </label>
                    <input
                      type="text"
                      name="dateOfIssue"
                      value={formData.dateOfIssue}
                      onChange={handleChange}
                      placeholder="e.g. 2026 MAY 27"
                      required
                      className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50  uppercase"
                    />
                  </div>

                  {/* Enter Before */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Enter before / Хүчинтэй хугацаа
                    </label>
                    <input
                      type="text"
                      name="enterBefore"
                      value={formData.enterBefore}
                      onChange={handleChange}
                      placeholder="e.g. 2026 OCT 24"
                      required
                      className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50  uppercase"
                    />
                  </div>

                  {/* Duration of Stay */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Duration of stay / Байх хугацаа
                    </label>
                    <input
                      type="text"
                      name="durationOfStay"
                      value={formData.durationOfStay}
                      onChange={handleChange}
                      placeholder="e.g. 0 DAY(S) or 30 DAY(S)"
                      required
                      className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50  uppercase"
                    />
                  </div>

                  {/* Inviter Phone Number */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Inviter&apos;s Phone Number
                    </label>
                    <input
                      type="text"
                      name="inviterPhone"
                      value={formData.inviterPhone}
                      onChange={handleChange}
                      placeholder="e.g. 80101507"
                      required
                      className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 "
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Bar */}
            <div className="pt-5 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleResetToSample}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Defaults
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-600/20 transition-all active:scale-95 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving to Database...' : 'Save Visa & Generate QR'}
                </button>
              </div>
            </div>

          </form>
        </div>

        {/* Live Preview Container */}
        {showLivePreview && (
          <div className="xl:col-span-6 sticky top-22 space-y-3">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Live Document Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-medium rounded-lg transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Test
                </button>
              </div>
            </div>

            <div className="overflow-hidden p-2 sm:p-4 bg-slate-100/80 rounded-2xl border border-slate-200/90 flex justify-center shadow-xs">
              <div className="w-full">
                <ResponsiveVisaViewer visa={formData} />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
