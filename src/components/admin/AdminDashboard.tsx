import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  CreditCard,
  UserCheck,
  MessageSquare,
  Radio,
  Tag,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Send,
  Plus,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { RoleAccountModal } from '../common/RoleAccountModal';

export const AdminDashboard: React.FC = () => {
  const {
    withdrawals,
    approveWithdrawal,
    markWithdrawalPaid,
    stores,
    verifyStore,
    drivers,
    verifyDriver,
    tickets,
    replyTicket,
    broadcasts,
    createBroadcast,
    promotions,
    createPromotion,
    orders,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'withdrawals' | 'verifications' | 'tickets' | 'broadcasts' | 'transactions'>('withdrawals');
  const [showAccountModal, setShowAccountModal] = useState(false);

  // Broadcast form state
  const [bcTitle, setBcTitle] = useState('');
  const [bcContent, setBcContent] = useState('');
  const [bcTarget, setBcTarget] = useState<'all' | 'consumer' | 'store_owner' | 'driver'>('all');

  // Promo form state
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoTitle, setPromoTitle] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(20);
  const [promoMaxDiscount, setPromoMaxDiscount] = useState(15000);
  const [promoMinOrder, setPromoMinOrder] = useState(30000);

  // Ticket reply state
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');

  const pendingWdCount = withdrawals.filter((w) => w.status === 'pending').length;
  const unverifiedStores = stores.filter((s) => !s.isVerified);
  const unverifiedDrivers = drivers.filter((d) => !d.isVerified);
  const openTicketsCount = tickets.filter((t) => t.status !== 'resolved').length;

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bcTitle || !bcContent) return;
    createBroadcast(bcTitle, bcContent, bcTarget);
    setBcTitle('');
    setBcContent('');
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode || !promoTitle) return;
    createPromotion({
      code: promoCode.toUpperCase(),
      title: promoTitle,
      discountPercent: Number(promoDiscount),
      maxDiscount: Number(promoMaxDiscount),
      minOrder: Number(promoMinOrder),
      validUntil: '31 Des 2026',
      scope: 'platform',
    });
    setShowPromoModal(false);
    setPromoCode('');
    setPromoTitle('');
  };

  const handleSendTicketReply = (ticketId: string) => {
    if (!adminReplyText.trim()) return;
    replyTicket(ticketId, adminReplyText);
    setAdminReplyText('');
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-600 text-white font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white">Panel Operasional Admin</h2>
              <p className="text-[11px] text-slate-400">Verifikasi, Moderasi, CS & Pencairan Saldo</p>
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
            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
              Operasional
            </span>
          </div>
        </div>

        {/* 4 Status Badges */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-center text-[11px]">
          <div className="bg-slate-800/80 p-2 rounded-xl">
            <span className="text-slate-400 block text-[10px]">Tarik Saldo</span>
            <span className="font-extrabold text-amber-400">{pendingWdCount} Pending</span>
          </div>
          <div className="bg-slate-800/80 p-2 rounded-xl">
            <span className="text-slate-400 block text-[10px]">Verifikasi</span>
            <span className="font-extrabold text-blue-400">{unverifiedStores.length + unverifiedDrivers.length} Mitra</span>
          </div>
          <div className="bg-slate-800/80 p-2 rounded-xl">
            <span className="text-slate-400 block text-[10px]">Tiket CS</span>
            <span className="font-extrabold text-rose-400">{openTicketsCount} Terbuka</span>
          </div>
          <div className="bg-slate-800/80 p-2 rounded-xl">
            <span className="text-slate-400 block text-[10px]">Transaksi</span>
            <span className="font-extrabold text-emerald-400">{orders.length} Total</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 flex px-2 text-xs font-bold sticky top-0 z-20 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`py-3 px-3 border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === 'withdrawals' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-400'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Pencairan Dana</span>
          {pendingWdCount > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 font-black rounded-full text-[10px]">
              {pendingWdCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('verifications')}
          className={`py-3 px-3 border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === 'verifications' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-400'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Verifikasi Mitra</span>
        </button>

        <button
          onClick={() => setActiveTab('tickets')}
          className={`py-3 px-3 border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === 'tickets' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-400'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Tiket Bantuan CS</span>
        </button>

        <button
          onClick={() => setActiveTab('broadcasts')}
          className={`py-3 px-3 border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === 'broadcasts' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-400'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Broadcast & Promo</span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`py-3 px-3 border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === 'transactions' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-400'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Live Transaksi</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 pb-20">
        {/* TAB 1: WITHDRAWALS (PRD Section 11) */}
        {activeTab === 'withdrawals' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-xs text-slate-900">
                  Antrean Pencairan Dana (Manual Withdrawal)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Validasi rekening & tandai paid setelah transfer bank sukses
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {withdrawals.map((wd) => (
                <div
                  key={wd.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-slate-400 block">{wd.id}</span>
                      <h4 className="font-bold text-slate-900">{wd.userName} ({wd.role.replace('_', ' ')})</h4>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        wd.status === 'pending'
                          ? 'bg-amber-100 text-amber-800 animate-pulse'
                          : wd.status === 'approved'
                          ? 'bg-blue-100 text-blue-800'
                          : wd.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      Status: {wd.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Nominal Penarikan:</span>
                      <span className="font-black text-slate-900 text-sm">
                        Rp {wd.amount.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Bank & No. Rekening:</span>
                      <span className="font-mono font-bold text-slate-800">
                        {wd.bankName} - {wd.accountNumber}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Atas Nama:</span>
                      <span className="font-semibold text-slate-800">{wd.accountHolder}</span>
                    </div>
                  </div>

                  {wd.adminNotes && (
                    <p className="text-[11px] text-slate-500 italic">Catatan: {wd.adminNotes}</p>
                  )}

                  {/* Actions according to PRD section 11:
                      18. Admin memeriksa dan menyetujui atau menolak.
                      19. Transfer dilakukan secara manual.
                      20. Admin menandai request sebagai paid setelah transfer berhasil.
                  */}
                  <div className="flex gap-2 pt-1">
                    {wd.status === 'pending' && (
                      <>
                        <button
                          onClick={() => approveWithdrawal(wd.id, true)}
                          className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition"
                        >
                          Setujui Penarikan
                        </button>
                        <button
                          onClick={() => approveWithdrawal(wd.id, false)}
                          className="px-3 py-2 bg-rose-100 hover:bg-rose-200 text-rose-700 font-semibold rounded-xl text-xs transition"
                        >
                          Tolak
                        </button>
                      </>
                    )}

                    {wd.status === 'approved' && (
                      <button
                        onClick={() => markWithdrawalPaid(wd.id)}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Tandai Sudah Ditransfer (Mark Paid & Catat Debit Ledger) &rarr;</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: VERIFIKASI MITRA */}
        {activeTab === 'verifications' && (
          <div className="space-y-4">
            {/* Toko */}
            <div className="space-y-2">
              <h3 className="font-extrabold text-xs text-slate-900 uppercase">
                Verifikasi Mitra Resto
              </h3>
              {stores.map((s) => (
                <div
                  key={s.id}
                  className="bg-white rounded-2xl p-3.5 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={s.logo} alt={s.name} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-slate-900">{s.name}</h4>
                      <p className="text-[11px] text-slate-500">{s.category} • {s.address}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => verifyStore(s.id, !s.isVerified)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                      s.isVerified
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-500 text-slate-950 shadow'
                    }`}
                  >
                    {s.isVerified ? '✓ Terverifikasi' : 'Verifikasi Sekarang'}
                  </button>
                </div>
              ))}
            </div>

            {/* Driver */}
            <div className="space-y-2 pt-2">
              <h3 className="font-extrabold text-xs text-slate-900 uppercase">
                Verifikasi Mitra Driver
              </h3>
              {drivers.map((d) => (
                <div
                  key={d.id}
                  className="bg-white rounded-2xl p-3.5 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <h4 className="font-bold text-slate-900">{d.name}</h4>
                    <p className="text-[11px] text-slate-500">{d.vehiclePlate} • {d.vehicleType}</p>
                  </div>

                  <button
                    onClick={() => verifyDriver(d.id, !d.isVerified)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                      d.isVerified
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-500 text-slate-950 shadow'
                    }`}
                  >
                    {d.isVerified ? '✓ Terverifikasi' : 'Verifikasi'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TICKETS CS */}
        {activeTab === 'tickets' && (
          <div className="space-y-3">
            <h3 className="font-extrabold text-xs text-slate-900">Tiket Bantuan Konsumen & Mitra</h3>
            {tickets.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{t.userName} ({t.role})</span>
                  <span className="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded-full capitalize">
                    {t.status.replace('_', ' ')}
                  </span>
                </div>
                <h4 className="font-semibold text-slate-800">{t.subject}</h4>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-2 max-h-40 overflow-y-auto">
                  {t.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-2 rounded-xl text-xs ${
                        m.senderRole === 'admin'
                          ? 'bg-purple-100 text-purple-950 ml-4'
                          : 'bg-white text-slate-800 mr-4 border border-slate-200'
                      }`}
                    >
                      <div className="flex justify-between text-[10px] opacity-75 font-bold mb-0.5">
                        <span>{m.senderName} ({m.senderRole})</span>
                        <span>{m.timestamp}</span>
                      </div>
                      <p>{m.message}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Balas tiket sebagai Admin CS..."
                    value={activeTicketId === t.id ? adminReplyText : ''}
                    onFocus={() => setActiveTicketId(t.id)}
                    onChange={(e) => {
                      setActiveTicketId(t.id);
                      setAdminReplyText(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendTicketReply(t.id);
                    }}
                    className="flex-1 text-xs p-2 rounded-xl border border-slate-200"
                  />
                  <button
                    onClick={() => handleSendTicketReply(t.id)}
                    className="p-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: BROADCASTS & PROMOTIONS (PRD 5.2) */}
        {activeTab === 'broadcasts' && (
          <div className="space-y-4">
            {/* Create Broadcast */}
            <form onSubmit={handleSendBroadcast} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2.5 text-xs">
              <h4 className="font-bold text-slate-900">Kirim Siaran (Broadcast Alert)</h4>
              <input
                type="text"
                placeholder="Judul Siaran (misal: Maintenance Jam 02:00, Promo Weekend)"
                value={bcTitle}
                onChange={(e) => setBcTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200"
                required
              />
              <textarea
                placeholder="Isi pesan siaran untuk pengguna/mitra..."
                value={bcContent}
                onChange={(e) => setBcContent(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 resize-none h-16"
                required
              />
              <div className="flex items-center gap-2">
                <select
                  value={bcTarget}
                  onChange={(e) => setBcTarget(e.target.value as any)}
                  className="p-2 rounded-xl border border-slate-200 bg-white text-xs"
                >
                  <option value="all">Semua Pengguna</option>
                  <option value="consumer">Konsumen Saja</option>
                  <option value="store_owner">Mitra Resto Saja</option>
                  <option value="driver">Driver Saja</option>
                </select>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition"
                >
                  Kirim Broadcast Sekarang
                </button>
              </div>
            </form>

            {/* List Active Promos & Add Promo */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900">Kode Promo Platform Aktif</h4>
                <button
                  onClick={() => setShowPromoModal(true)}
                  className="text-purple-600 font-bold hover:underline"
                >
                  + Tambah Promo
                </button>
              </div>

              <div className="space-y-2">
                {promotions.map((p) => (
                  <div key={p.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded text-[11px]">
                        {p.code}
                      </span>
                      <p className="text-[11px] text-slate-600 mt-1">{p.title}</p>
                    </div>
                    <span className="text-[10px] text-slate-400">Min: Rp {p.minOrder.toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: LIVE TRANSACTIONS */}
        {activeTab === 'transactions' && (
          <div className="space-y-3">
            <h3 className="font-extrabold text-xs text-slate-900">Semua Transaksi Masuk Sistem</h3>
            <div className="space-y-2">
              {orders.map((o) => (
                <div key={o.id} className="bg-white rounded-2xl p-3.5 border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-slate-900">{o.id}</span>
                    <span className="font-bold text-slate-700">Rp {o.total.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>{o.storeName} &rarr; {o.consumerName}</span>
                    <span className="font-bold uppercase text-amber-700">{o.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Promo Modal */}
      {showPromoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-2xl text-xs">
            <h3 className="font-extrabold text-sm text-slate-900">Buat Kode Promo Platform Baru</h3>
            <form onSubmit={handleCreatePromo} className="space-y-2.5">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Kode Voucher (KAPITAL)</label>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="MISAL: LAPARKENYANG"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Judul Promo</label>
                <input
                  type="text"
                  value={promoTitle}
                  onChange={(e) => setPromoTitle(e.target.value)}
                  placeholder="Diskon 20% s/d Rp 15.000"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Diskon (%)</label>
                  <input
                    type="number"
                    value={promoDiscount}
                    onChange={(e) => setPromoDiscount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Maks. Diskon (Rp)</label>
                  <input
                    type="number"
                    value={promoMaxDiscount}
                    onChange={(e) => setPromoMaxDiscount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 text-white font-bold rounded-xl text-xs hover:bg-purple-700 transition"
                >
                  Aktifkan Promo
                </button>
                <button
                  type="button"
                  onClick={() => setShowPromoModal(false)}
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
