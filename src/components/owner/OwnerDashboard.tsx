import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CommissionScheme } from '../../types';
import {
  Crown,
  TrendingUp,
  Percent,
  Layers,
  Users,
  ShieldAlert,
  Plus,
  CheckCircle2,
  DollarSign,
  ArrowUpRight,
  Sparkles,
  FileSpreadsheet,
} from 'lucide-react';
import { RoleAccountModal } from '../common/RoleAccountModal';

export const OwnerDashboard: React.FC = () => {
  const {
    orders,
    commissionSchemes,
    activeCommissionScheme,
    setActiveCommissionScheme,
    createCommissionScheme,
    categories,
    addCategory,
    auditLogs,
    ledger,
    users,
    stores,
    drivers,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'finance' | 'commission' | 'categories' | 'admins' | 'audit'>('finance');
  const [showAccountModal, setShowAccountModal] = useState(false);

  // New Commission Scheme modal state
  const [showSchemeModal, setShowSchemeModal] = useState(false);
  const [schemeName, setSchemeName] = useState('');
  const [schemePercent, setSchemePercent] = useState(12);
  const [schemeDesc, setSchemeDesc] = useState('');

  // New Category state
  const [newCatName, setNewCatName] = useState('');

  // Financial Metrics
  const completedOrders = orders.filter((o) => o.status === 'completed');
  const gmv = orders.reduce((sum, o) => sum + o.total, 0);
  const totalPlatformCommission = ledger
    .filter((l) => l.referenceType === 'platform_commission')
    .reduce((sum, l) => sum + l.amount, 0);
  const totalStorePayouts = ledger
    .filter((l) => l.referenceType === 'store_payout')
    .reduce((sum, l) => sum + l.amount, 0);
  const totalDriverFees = ledger
    .filter((l) => l.referenceType === 'delivery_fee')
    .reduce((sum, l) => sum + l.amount, 0);

  const handleCreateScheme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schemeName || schemePercent <= 0) return;
    createCommissionScheme(schemeName, Number(schemePercent), schemeDesc);
    setShowSchemeModal(false);
    setSchemeName('');
    setSchemeDesc('');
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim());
    setNewCatName('');
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
      {/* Owner Header */}
      <div className="bg-slate-900 text-white p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white">Owner Aplikasi AntarRasa</h2>
              <p className="text-[11px] text-slate-400">Kendali Finansial, Skema Komisi & Kebijakan Global</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowAccountModal(true)}
              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-[11px] border border-slate-700 transition shadow-sm"
              title="Menu Akun & Ganti Role"
            >
              Akun / Ganti Role
            </button>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
              Owner
            </span>
          </div>
        </div>

        {/* Global Key Metrics (PRD 5.1 & 9) */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center text-xs">
          <div className="bg-slate-800/80 p-2 rounded-xl">
            <span className="text-[10px] text-slate-400 block">Gross GMV</span>
            <span className="font-extrabold text-white text-xs">
              Rp {gmv.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="bg-slate-800/80 p-2 rounded-xl">
            <span className="text-[10px] text-slate-400 block">Net Fee Platform</span>
            <span className="font-extrabold text-amber-400 text-xs">
              Rp {totalPlatformCommission.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="bg-slate-800/80 p-2 rounded-xl">
            <span className="text-[10px] text-slate-400 block">Komisi Aktif</span>
            <span className="font-extrabold text-emerald-400 text-xs">
              {activeCommissionScheme.percentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 flex px-2 text-xs font-bold sticky top-0 z-20 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('finance')}
          className={`py-3 px-3 border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === 'finance' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-400'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Keuangan & Ledger</span>
        </button>

        <button
          onClick={() => setActiveTab('commission')}
          className={`py-3 px-3 border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === 'commission' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-400'
          }`}
        >
          <Percent className="w-4 h-4" />
          <span>Skema Komisi (%)</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`py-3 px-3 border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === 'categories' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-400'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Kategori Global</span>
        </button>

        <button
          onClick={() => setActiveTab('admins')}
          className={`py-3 px-3 border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === 'admins' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-400'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Kelola Admin</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`py-3 px-3 border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === 'audit' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-400'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Audit Log</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-4 space-y-4 pb-20">
        {/* TAB 1: FINANCE & LEDGER */}
        {activeTab === 'finance' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Bagi Hasil Resto (90%)</span>
                <p className="text-sm font-black text-slate-900">
                  Rp {totalStorePayouts.toLocaleString('id-ID')}
                </p>
                <span className="text-[10px] text-slate-400 block">{stores.length} Mitra Resto</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Total Ongkir Driver</span>
                <p className="text-sm font-black text-slate-900">
                  Rp {totalDriverFees.toLocaleString('id-ID')}
                </p>
                <span className="text-[10px] text-slate-400 block">{drivers.length} Driver Aktif</span>
              </div>
            </div>

            {/* Platform Master Ledger Entries (PRD Section 9 & 16) */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-xs text-slate-900 uppercase">
                    Master Ledger Finansial (Audit Sesuai PRD)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Pencatatan kredit/debit immutable tanpa duplikasi transaksi
                  </p>
                </div>
                <span className="text-xs bg-slate-100 px-2 py-0.5 rounded font-mono font-bold text-slate-700">
                  {ledger.length} Entri
                </span>
              </div>

              <div className="space-y-2 divide-y divide-slate-100 text-xs max-h-80 overflow-y-auto">
                {ledger.map((item) => (
                  <div key={item.id} className="pt-2 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800">{item.userName}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1 py-0.2 rounded font-mono">
                          {item.referenceType}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-0.5">{item.description}</p>
                      <span className="text-[10px] text-slate-400">Ref: {item.referenceId}</span>
                    </div>

                    <span
                      className={`font-black shrink-0 ml-2 ${
                        item.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {item.type === 'credit' ? '+' : '-'}Rp {item.amount.toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COMMISSION SCHEMES (PRD Section 9) */}
        {activeTab === 'commission' && (
          <div className="space-y-4">
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 text-xs text-amber-900 space-y-1">
              <h4 className="font-bold">Ketentuan PRD Bab 9 (Skema Komisi):</h4>
              <p className="text-[11px] text-amber-800/90 leading-relaxed">
                Owner dapat membuat dan mengaktifkan skema komisi persentase. Setiap transaksi selesai
                mengambil skema yang berlaku saat transaksi berlangsung tanpa memodifikasi catatan historis.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-xs text-slate-900">Daftar Skema Komisi Platform</h3>
              <button
                onClick={() => setShowSchemeModal(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-sm hover:bg-amber-600 transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Skema Baru
              </button>
            </div>

            <div className="space-y-3">
              {commissionSchemes.map((scheme) => (
                <div
                  key={scheme.id}
                  className={`bg-white rounded-2xl p-4 border transition ${
                    scheme.isActive
                      ? 'border-amber-500 ring-2 ring-amber-400/30 shadow-md'
                      : 'border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">{scheme.name}</h4>
                        {scheme.isActive && (
                          <span className="text-[10px] font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full">
                            SEDANG AKTIF
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{scheme.description}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-2xl font-black text-amber-600 block">
                        {scheme.percentage}%
                      </span>
                    </div>
                  </div>

                  {!scheme.isActive && (
                    <div className="pt-3 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={() => setActiveCommissionScheme(scheme.id)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition"
                      >
                        Aktifkan Skema Ini &rarr;
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CATEGORIES (PRD 5.1) */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <form onSubmit={handleAddCategory} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2 text-xs">
              <h4 className="font-bold text-slate-900">Tambah Kategori Bisnis Kuliner Global</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Misal: Dimsum & Chinese Food, Pastry..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl border border-slate-200"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-600 transition"
                >
                  Tambah
                </button>
              </div>
            </form>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-xs text-slate-900 uppercase">
                Daftar Kategori Terdaftar ({categories.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ADMIN ACCOUNTS (PRD 5.1) */}
        {activeTab === 'admins' && (
          <div className="space-y-3">
            <h3 className="font-extrabold text-xs text-slate-900">Daftar Akun Administrator Sistem</h3>
            <div className="space-y-2.5">
              {users
                .filter((u) => u.role === 'admin' || u.role === 'owner')
                .map((admin) => (
                  <div
                    key={admin.id}
                    className="bg-white rounded-2xl p-3.5 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img src={admin.avatar} alt={admin.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <h4 className="font-bold text-slate-900">{admin.name}</h4>
                        <p className="text-[11px] text-slate-500">{admin.email} • {admin.phone}</p>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded uppercase font-bold">
                      {admin.role}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 5: AUDIT LOGS (PRD Section 12 & 22) */}
        {activeTab === 'audit' && (
          <div className="space-y-3">
            <div>
              <h3 className="font-extrabold text-xs text-slate-900">Jejak Audit Keamanan & Finansial</h3>
              <p className="text-[11px] text-slate-500">
                Pencatatan aktivitas sensitif admin dan owner sesuai regulasi sistem
              </p>
            </div>

            <div className="space-y-2 text-xs">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-white rounded-2xl p-3.5 border border-slate-200 space-y-1 shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-[11px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-800 font-semibold">{log.details}</p>
                  <p className="text-[11px] text-slate-500">
                    Aktor: {log.actorName} ({log.actorRole}) • Target: {log.targetResource}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Commission Scheme Modal */}
      {showSchemeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-2xl text-xs">
            <h3 className="font-extrabold text-sm text-slate-900">Buat Skema Komisi Platform Baru</h3>
            <form onSubmit={handleCreateScheme} className="space-y-2.5">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Skema</label>
                <input
                  type="text"
                  placeholder="Contoh: Mitra Prioritas 12%"
                  value={schemeName}
                  onChange={(e) => setSchemeName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Persentase Potongan Platform (%)</label>
                <input
                  type="number"
                  placeholder="10"
                  value={schemePercent}
                  onChange={(e) => setSchemePercent(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Deskripsi Kebijakan</label>
                <textarea
                  placeholder="Rincian peruntukan komisi..."
                  value={schemeDesc}
                  onChange={(e) => setSchemeDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 resize-none h-16"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-600 transition"
                >
                  Simpan Skema
                </button>
                <button
                  type="button"
                  onClick={() => setShowSchemeModal(false)}
                  className="py-2.5 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Role Account Modal */}
      <RoleAccountModal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
      />
    </div>
  );
};
