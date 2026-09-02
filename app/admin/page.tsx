'use client';

import React, { useEffect, useState } from 'react';
import { VisaData, AdminUser } from '@/lib/types';
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
  LogOut,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [visas, setVisas] = useState<VisaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVisa, setSelectedVisa] = useState<VisaData | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);

  const fetchAdminInfo = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const json = await res.json();
      if (json.success) {
        setCurrentAdmin(json.data);
      } else if (res.status === 401) {
        router.push('/admin/login');
      }
    } catch (err) {
      console.error('Failed to load admin profile:', err);
    }
  };

  const fetchVisas = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/visas');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
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
    fetchAdminInfo();
    fetchVisas();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

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
    const docId = visa.electronicVisaNumber || visa.id || visa.idNumber;
    const url = `${origin}/visa/${encodeURIComponent(docId)}`;
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-sky-50/20 to-slate-100/70 text-slate-900 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-200/90 bg-white/90 backdrop-blur-md sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 tracking-tight">Mongolia Electronic Visa</div>
              <div className="text-[10.5px] text-slate-500 font-medium">Administration & Records Portal</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
            >
              Public Portal
            </Link>

            {currentAdmin && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-100/90 border border-slate-200/80 rounded-xl text-xs">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {currentAdmin.name?.charAt(0) || 'A'}
                </div>
                <div className="text-left">
                  <div className="text-[11px] font-bold text-slate-900 leading-tight">
                    {currentAdmin.name}
                  </div>
                  <div className="text-[9.5px] text-blue-700 font-semibold uppercase">
                    {currentAdmin.role}
                  </div>
                </div>
              </div>
            )}

            {!isCreating && !selectedVisa && (
              <button
                onClick={() => {
                  setSelectedVisa(null);
                  setIsCreating(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/20 transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                New Visa
              </button>
            )}

            <button
              onClick={handleLogout}
              title="Sign out of administrative portal"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

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
                className="text-xs font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1.5 transition cursor-pointer"
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
              <div className="bg-white/90 border border-slate-200/90 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">{visas.length}</div>
                  <div className="text-xs text-slate-500 font-medium">Total Visas Registered</div>
                </div>
              </div>

              <div className="bg-white/90 border border-slate-200/90 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Registry Status: Active</div>
                  <div className="text-xs text-slate-500 mt-0.5">Immigration Agency Central Database</div>
                </div>
              </div>

              <div className="bg-white/90 border border-slate-200/90 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shadow-xs">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-purple-700 uppercase tracking-wider">Cryptographic QR Verification</div>
                  <div className="text-xs text-slate-500 mt-0.5">Real-time Border Control & Airline Verification</div>
                </div>
              </div>
            </div>

            {/* Search & Actions Bar */}
            <div className="bg-white/90 border border-slate-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by name, ID, passport or visa number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={() => {
                    setSelectedVisa(null);
                    setIsCreating(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-600/20 transition-all active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Visa
                </button>
              </div>
            </div>

            {/* Visas Table */}
            <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm">
              {loading ? (
                <div className="py-16 text-center text-slate-400 text-xs">
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
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create Your First eVisa
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/90 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[10.5px]">
                      <tr>
                        <th className="py-3.5 px-4">Applicant</th>
                        <th className="py-3.5 px-4">ID / Visa No.</th>
                        <th className="py-3.5 px-4">Passport No.</th>
                        <th className="py-3.5 px-4">Nationality</th>
                        <th className="py-3.5 px-4">Validity</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredVisas.map((visa) => (
                        <tr key={visa.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-12 bg-slate-100 rounded border border-slate-300 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-xs">
                                {visa.photo ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={visa.photo} alt={visa.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-[9px] font-bold text-slate-400 uppercase">PHOTO</span>
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 text-sm uppercase">
                                  {visa.name} {visa.surname}
                                </div>
                                <div className="text-[11px] text-slate-500 font-mono">
                                  DOB: {visa.dateOfBirth} • {visa.gender}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-mono font-bold text-blue-700 text-xs">
                              {visa.electronicVisaNumber}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              ID: {visa.idNumber}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                            {visa.passportNumber}
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-md text-[10.5px] font-semibold uppercase text-slate-700">
                              {visa.nationality}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="text-slate-800 font-mono text-[11.5px] font-medium">
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
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer shadow-xs"
                              >
                                {copiedId === visa.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>

                              {/* View Public Page */}
                              <Link
                                href={`/visa/${encodeURIComponent(visa.electronicVisaNumber || visa.id || visa.idNumber)}`}
                                target="_blank"
                                title="Open document page"
                                className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 rounded-lg transition shadow-xs"
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
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg transition cursor-pointer shadow-xs"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDelete(visa.id, `${visa.name} ${visa.surname}`)}
                                title="Delete visa"
                                className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 rounded-lg transition cursor-pointer shadow-xs"
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
