'use client';

import React, { useState } from 'react';
import { VisaData, DEFAULT_VISA } from '@/lib/types';
import { VisaDocument } from './VisaDocument';
import { ResponsiveVisaViewer } from './ResponsiveVisaViewer';
import {
  Upload,
  User,
  FileText,
  CheckCircle,
  Eye,
  Save,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Printer,
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
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'personal' | 'passport' | 'visa'>('personal');
  const [showLivePreview, setShowLivePreview] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, photo: '' }));
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
        setSaveSuccess(`Visa saved successfully in PostgreSQL database! ID: ${json.data.id || json.data.idNumber}`);
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
        <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-xl flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span className="text-sm font-medium">{saveSuccess}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/visa/${encodeURIComponent(formData.id || formData.idNumber)}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition"
            >
              <Eye className="w-3.5 h-3.5" />
              View Public Page
            </Link>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition"
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
        <div className={`xl:col-span-${showLivePreview ? '6' : '12'} bg-slate-900/90 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-xl`}>
          
          {/* Header & Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                {formData.id ? 'Edit Electronic Visa' : 'Create New Electronic Visa'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Fill the fields matching the Mongolia eVisa form.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetToSample}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg transition"
                title="Reset all form fields"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear Form
              </button>

              <button
                type="button"
                onClick={() => setShowLivePreview(!showLivePreview)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg transition"
              >
                <Eye className="w-3.5 h-3.5 text-blue-400" />
                {showLivePreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            </div>
          </div>

          {/* Form Tabs */}
          <div className="flex border-b border-slate-800 mt-4 space-x-2">
            <button
              type="button"
              onClick={() => setActiveTab('personal')}
              className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'personal'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              1. Personal Info
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('passport')}
              className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'passport'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              2. Passport
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('visa')}
              className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'visa'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
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
                {/* Photo Upload */}
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex items-center gap-5">
                  <div className="w-20 h-24 bg-slate-900 border border-slate-700 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center relative">
                    {formData.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-slate-600" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="block text-xs font-semibold text-slate-300">
                      Applicant Photo (Portrait)
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg shadow transition">
                        <Upload className="w-3.5 h-3.5" />
                        Choose Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                      {formData.photo && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="px-3 py-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-medium rounded-lg transition"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Supported formats: JPG, PNG, WebP (Automatically optimized).
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* ID */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      ID (Applicant Identification Code)
                    </label>
                    <input
                      type="text"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleChange}
                      placeholder="e.g. V2605200900008"
                      required
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  {/* Surname */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Surname / Овог
                    </label>
                    <input
                      type="text"
                      name="surname"
                      value={formData.surname}
                      onChange={handleChange}
                      placeholder="e.g. ALI"
                      required
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 uppercase"
                    />
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Name / Нэр
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. MD AKASH"
                      required
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 uppercase"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Date of birth / Төрсөн огноо
                    </label>
                    <input
                      type="text"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      placeholder="e.g. 2006 FEB 01"
                      required
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Gender / Хүйс
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 uppercase"
                    >
                      <option value="MALE">MALE</option>
                      <option value="FEMALE">FEMALE</option>
                    </select>
                  </div>

                  {/* Nationality */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Nationality / Иргэний харьяалал
                    </label>
                    <input
                      type="text"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleChange}
                      placeholder="e.g. BANGLADESH"
                      required
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 uppercase"
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
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Passport number / Паспортын дугаар
                    </label>
                    <input
                      type="text"
                      name="passportNumber"
                      value={formData.passportNumber}
                      onChange={handleChange}
                      placeholder="e.g. A09653676"
                      required
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 font-mono uppercase"
                    />
                  </div>

                  {/* Passport Type */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Passport type / Паспортын төрөл
                    </label>
                    <select
                      name="passportType"
                      value={formData.passportType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 uppercase"
                    >
                      <option value="ORDINARY">ORDINARY</option>
                      <option value="OFFICIAL">OFFICIAL</option>
                      <option value="DIPLOMATIC">DIPLOMATIC</option>
                      <option value="SERVICE">SERVICE</option>
                    </select>
                  </div>

                  {/* Date of Expiry */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Date of expiry / Дуусах хугацаа
                    </label>
                    <input
                      type="text"
                      name="dateOfExpiry"
                      value={formData.dateOfExpiry}
                      onChange={handleChange}
                      placeholder="e.g. 12 OCT 2035"
                      required
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 font-mono uppercase"
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
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Electronic visa number (Цахим визийн дугаар)
                    </label>
                    <input
                      type="text"
                      name="electronicVisaNumber"
                      value={formData.electronicVisaNumber}
                      onChange={handleChange}
                      placeholder="e.g. MNG260504156"
                      required
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 font-mono uppercase"
                    />
                  </div>

                  {/* Inviter */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Inviter / Уригч
                    </label>
                    <input
                      type="text"
                      name="inviter"
                      value={formData.inviter}
                      onChange={handleChange}
                      placeholder="e.g. НЭЙШНЛБИЗНЕС МАРКЕТ ХХК"
                      required
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 uppercase"
                    />
                  </div>

                  {/* Classification */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Classification of visa / Визийн ангилал
                    </label>
                    <input
                      type="text"
                      name="classificationOfVisa"
                      value={formData.classificationOfVisa}
                      onChange={handleChange}
                      placeholder="e.g. C7"
                      required
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 font-mono uppercase"
                    />
                  </div>

                  {/* Entries */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Entries / Визийн төрөл
                    </label>
                    <select
                      name="entries"
                      value={formData.entries}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 uppercase"
                    >
                      <option value="SINGLE">SINGLE</option>
                      <option value="DOUBLE">DOUBLE</option>
                      <option value="MULTIPLE">MULTIPLE</option>
                    </select>
                  </div>

                  {/* Type of Visa */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Type of visa / Визийн зориулалт
                    </label>
                    <select
                      name="typeOfVisa"
                      value={formData.typeOfVisa}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 uppercase"
                    >
                      <option value="ENTRY">ENTRY</option>
                      <option value="TRANSIT">TRANSIT</option>
                      <option value="EXIT-ENTRY">EXIT-ENTRY</option>
                    </select>
                  </div>

                  {/* Date of Issue */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Date of issue / Олгосон огноо
                    </label>
                    <input
                      type="text"
                      name="dateOfIssue"
                      value={formData.dateOfIssue}
                      onChange={handleChange}
                      placeholder="e.g. 2026 MAY 27"
                      required
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 font-mono uppercase"
                    />
                  </div>

                  {/* Enter Before */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Enter before / Хүчинтэй хугацаа
                    </label>
                    <input
                      type="text"
                      name="enterBefore"
                      value={formData.enterBefore}
                      onChange={handleChange}
                      placeholder="e.g. 2026 OCT 24"
                      required
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 font-mono uppercase"
                    />
                  </div>

                  {/* Duration of Stay */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Duration of stay / Байх хугацаа
                    </label>
                    <input
                      type="text"
                      name="durationOfStay"
                      value={formData.durationOfStay}
                      onChange={handleChange}
                      placeholder="e.g. 0 DAY(S) or 30 DAY(S)"
                      required
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 font-mono uppercase"
                    />
                  </div>

                  {/* Inviter Phone Number */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Inviter&apos;s Phone Number
                    </label>
                    <input
                      type="text"
                      name="inviterPhone"
                      value={formData.inviterPhone}
                      onChange={handleChange}
                      placeholder="e.g. 80101507"
                      required
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Bar */}
            <div className="pt-5 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleResetToSample}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Defaults
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-lg transition"
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
          <div className="xl:col-span-6 sticky top-6 space-y-3">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Live Document Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Test
                </button>
              </div>
            </div>

            <div className="overflow-hidden p-2 sm:p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex justify-center shadow-2xl">
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
