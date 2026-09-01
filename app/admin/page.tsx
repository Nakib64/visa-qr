'use client';

import React, { useEffect, useState } from 'react';
import { VisaData } from '@/lib/types';
import { AdminForm } from '@/components/AdminForm';
import {
  Plus,
  Search,
  Printer,
  Eye,
  Trash2,
  Edit,
  QrCode,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Database,
  Layers,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [visas, setVisas] = useState<VisaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVisa, setSelectedVisa] = useState<VisaData | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchVisas = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/visas');
      const json = await res.json();
      if (json.success) {
        setVisas(json.data);
      }
    } catch (err) {
      console.error('Failed to load visas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisas();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete visa for "${name}"?`)) return;
    try {
      const res = await fetch(`/api/visas/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setVisas((prev) => prev.filter((v) => v.id !== id));
        if (selectedVisa?.id === id) {
          setSelectedVisa(null);
          setIsCreating(false);
        }
      } else {
        alert('Failed to delete');
      }
    } catch (e: any) {
      alert('Error deleting: ' + e.message);
    }
  };

  const handleCopyLink = (visa: VisaData) => {
    const origin = window.location.origin;
    const url = `${origin}/visa/${encodeURIComponent(visa.id || visa.idNumber)}`;
    navigator.clipboard.writeText(url);
    setCopiedId(visa.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredVisas = visas.filter((v) => {
    const query = searchQuery.toLowerCase();
    return (
      v.name?.toLowerCase().includes(query) ||
      v.surname?.toLowerCase().includes(query) ||
      v.passportNumber?.toLowerCase().includes(query) ||
      v.idNumber?.toLowerCase().includes(query) ||
      v.electronicVisaNumber?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
    

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        
        {/* If creating or editing a visa */}
        {isCreating || selectedVisa ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setIsCreating(false);
                  setSelectedVisa(null);
                  fetchVisas();
                }}
                className="text-xs font-semibold text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition"
              >
                ← Back to Visa Records List
              </button>
            </div>

            <AdminForm
              initialData={selectedVisa || undefined}
              onSaved={(saved) => {
                fetchVisas();
              }}
            />
          </div>
        ) : (
          /* Visa Records List Dashboard */
          <div className="space-y-6">
            
            {/* Quick Stats & Database Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">{visas.length}</div>
                  <div className="text-xs text-slate-400 font-medium">Total Visas Registered</div>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">PostgreSQL Active</div>
                  <div className="text-xs text-slate-400 mt-0.5">Dual-Engine Free Postgres & Local Sync</div>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Dynamic QR Verification</div>
                  <div className="text-xs text-slate-400 mt-0.5">Direct 1-Page Browser Document Link</div>
                </div>
              </div>
            </div>

            {/* Search & Actions Bar */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by name, ID, passport or visa number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={() => {
                    setSelectedVisa(null);
                    setIsCreating(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Visa
                </button>
              </div>
            </div>

            {/* Visas Table */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              {loading ? (
                <div className="py-16 text-center text-slate-500 text-xs">
                  Loading visa records from database...
                </div>
              ) : filteredVisas.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="text-slate-500 text-sm">No electronic visas found.</div>
                  <button
                    onClick={() => {
                      setSelectedVisa(null);
                      setIsCreating(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create Your First eVisa
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10.5px]">
                      <tr>
                        <th className="py-3.5 px-4">Applicant</th>
                        <th className="py-3.5 px-4">ID / Visa No.</th>
                        <th className="py-3.5 px-4">Passport No.</th>
                        <th className="py-3.5 px-4">Nationality</th>
                        <th className="py-3.5 px-4">Validity</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredVisas.map((visa) => (
                        <tr key={visa.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-12 bg-slate-800 rounded border border-slate-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                {visa.photo ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={visa.photo} alt={visa.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-[9px] font-bold text-slate-500 uppercase">PHOTO</span>
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-white text-sm uppercase">
                                  {visa.name} {visa.surname}
                                </div>
                                <div className="text-[11px] text-slate-400 font-mono">
                                  DOB: {visa.dateOfBirth} • {visa.gender}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-mono font-bold text-blue-400 text-xs">
                              {visa.electronicVisaNumber}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              ID: {visa.idNumber}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                            {visa.passportNumber}
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded-md text-[10.5px] font-medium uppercase text-slate-300">
                              {visa.nationality}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="text-slate-300 font-mono text-[11.5px]">
                              {visa.dateOfIssue} → {visa.enterBefore}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              Stay: {visa.durationOfStay}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Copy QR Link */}
                              <button
                                onClick={() => handleCopyLink(visa)}
                                title="Copy verification URL"
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                              >
                                {copiedId === visa.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>

                              {/* View Public Page */}
                              <Link
                                href={`/visa/${encodeURIComponent(visa.id || visa.idNumber)}`}
                                target="_blank"
                                title="Open document page"
                                className="p-1.5 bg-blue-900/60 hover:bg-blue-800 text-blue-300 rounded-lg transition"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </Link>

                              {/* Edit */}
                              <button
                                onClick={() => {
                                  setSelectedVisa(visa);
                                  setIsCreating(false);
                                }}
                                title="Edit visa details"
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDelete(visa.id, `${visa.name} ${visa.surname}`)}
                                title="Delete visa"
                                className="p-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-lg transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
