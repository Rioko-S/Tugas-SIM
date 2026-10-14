import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import {
  User,
  MapPin,
  MessageSquare,
  HelpCircle,
  Plus,
  Send,
  CheckCircle2,
  Phone,
  Mail,
  Shield,
  ChevronRight,
  Sun,
  Moon,
  ShoppingBag,
  Store,
  Bike,
  ShieldCheck,
  Crown,
  Check,
  Heart,
  Smartphone,
  Maximize2,
  RotateCcw,
  LogOut,
} from 'lucide-react';

export const ConsumerProfile: React.FC = () => {
  const {
    currentUser,
    currentRole,
    switchRole,
    addresses,
    selectedAddress,
    setSelectedAddress,
    addAddress,
    tickets,
    createTicket,
    replyTicket,
    theme,
    setTheme,
    orders,
    withdrawals,
    defaultDriverTip,
    setDefaultDriverTip,
    deviceFrame,
    setDeviceFrame,
    resetDemoData,
    logout,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'support'>('profile');
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Support ticket form
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<'pesanan' | 'pembayaran' | 'driver' | 'aplikasi'>('pesanan');
  const [ticketMsg, setTicketMsg] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Role info configuration matching PRD
  const roleCards: {
    role: Role;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    badgeCount?: number;
  }[] = [
    {
      role: 'consumer',
      label: 'Konsumen (Customer)',
      description: 'Eksplorasi resto kuliner, keranjang, bayar QRIS/VA, dan lacak pesanan real-time.',
      icon: ShoppingBag,
      color: 'from-amber-500 to-orange-500',
    },
    {
      role: 'store_owner',
      label: 'Pemilik Toko (Merchant Resto)',
      description: 'Kelola jam buka toko, menu, stok porsi, dan proses pesanan dapur (Siap Pickup).',
      icon: Store,
      color: 'from-blue-600 to-indigo-600',
      badgeCount: orders.filter((o) => ['paid', 'placed', 'accepted', 'preparing'].includes(o.status)).length,
    },
    {
      role: 'driver',
      label: 'Mitra Driver (Kurir Antar)',
      description: 'Mode On-Bid/Off-Bid, penugasan auto-assign, ambil pesanan, & upload bukti serah terima.',
      icon: Bike,
      color: 'from-emerald-600 to-teal-600',
      badgeCount: orders.filter((o) => ['ready_for_pickup', 'driver_assigned', 'picked_up', 'on_delivery'].includes(o.status)).length,
    },
    {
      role: 'admin',
      label: 'Admin Operasional',
      description: 'Persetujuan manual withdrawal pencairan saldo, verifikasi mitra, moderasi, & CS tiket.',
      icon: ShieldCheck,
      color: 'from-purple-600 to-fuchsia-600',
      badgeCount: withdrawals.filter((w) => w.status === 'pending').length,
    },
    {
      role: 'owner',
      label: 'Owner Aplikasi (Super Admin)',
      description: 'Pantau Gross GMV, keuntungan komisi platform, skema komisi %, kategori global, & audit log.',
      icon: Crown,
      color: 'from-amber-600 to-yellow-600',
    },
  ];

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel || !newAddress) return;
    addAddress({
      userId: currentUser.id,
      label: newLabel,
      recipientName: currentUser.name,
      phone: currentUser.phone,
      fullAddress: newAddress,
      notes: newNotes,
      isDefault: false,
      lat: -6.2,
      lng: 106.8,
    });
    setShowNewAddress(false);
    setNewLabel('');
    setNewAddress('');
    setNewNotes('');
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMsg) return;
    createTicket(ticketSubject, ticketCategory, ticketMsg);
    setShowNewTicketModal(false);
    setTicketSubject('');
    setTicketMsg('');
  };

  const handleSendReply = (ticketId: string) => {
    if (!replyText.trim()) return;
    replyTicket(ticketId, replyText);
    setReplyText('');
  };

  return (
    <div className={`flex-1 flex flex-col overflow-y-auto ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      {/* Top Banner & Profile Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-white/50 shadow-md"
            />
            <div>
              <h2 className="font-black text-lg leading-tight">{currentUser.name}</h2>
              <p className="text-xs text-amber-100 flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3" /> {currentUser.phone}
              </p>
              <p className="text-xs text-amber-100 flex items-center gap-1">
                <Mail className="w-3 h-3" /> {currentUser.email}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] bg-black/25 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider block">
              Peran: {currentRole.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className={`border-b flex px-4 text-xs font-bold ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-3 flex-1 text-center border-b-2 transition ${
            activeTab === 'profile' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-400'
          }`}
        >
          Profil & Pengaturan
        </button>
        <button
          onClick={() => setActiveTab('addresses')}
          className={`py-3 flex-1 text-center border-b-2 transition ${
            activeTab === 'addresses' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-400'
          }`}
        >
          Alamat ({addresses.length})
        </button>
        <button
          onClick={() => setActiveTab('support')}
          className={`py-3 flex-1 text-center border-b-2 transition ${
            activeTab === 'support' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-400'
          }`}
        >
          Pusat Bantuan CS ({tickets.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4 space-y-4 pb-20">
        {activeTab === 'profile' && (
          <div className="space-y-4">
            {/* 1. Pengaturan Mode Gelap & Mode Terang */}
            <div className={`rounded-2xl p-4 border shadow-sm space-y-2.5 ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  <span>🌓 Tampilan Tema Aplikasi</span>
                </span>
                <span className="text-[11px] font-bold text-amber-500">
                  {theme === 'dark' ? 'Mode Gelap (Dark)' : 'Mode Terang (Light)'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`p-3 rounded-2xl border flex items-center justify-center gap-2 font-bold text-xs transition active:scale-95 ${
                    theme === 'light'
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm ring-2 ring-amber-400/40'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-950" />
                  <span>Mode Terang (Light)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`p-3 rounded-2xl border flex items-center justify-center gap-2 font-bold text-xs transition active:scale-95 ${
                    theme === 'dark'
                      ? 'bg-slate-800 text-white border-amber-400 ring-2 ring-amber-400/40 shadow-sm'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <Moon className="w-4 h-4 text-amber-400" />
                  <span>Mode Gelap (Dark)</span>
                </button>
              </div>
            </div>

            {/* 2. Fitur Multi-Role Pengguna (Sesuai Acuan Gambar & PRD) */}
            <div className={`rounded-2xl p-4 border shadow-sm space-y-3 ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    <span>👥 Beralih Peran (Multi-Role System)</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Ganti peran di bawah untuk menguji alur kerja end-to-end platform AntarRasa.
                  </p>
                </div>
              </div>

              {/* Role Cards List */}
              <div className="space-y-2 pt-1">
                {roleCards.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentRole === item.role;

                  return (
                    <div
                      key={item.role}
                      onClick={() => switchRole(item.role)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-3 active:scale-98 ${
                        isActive
                          ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-400/30'
                          : theme === 'dark'
                          ? 'bg-slate-800/80 border-slate-700 hover:border-amber-400/40'
                          : 'bg-slate-50 border-slate-200/90 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                            isActive
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : 'bg-slate-700/80 text-white'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className={`font-bold text-xs truncate ${isActive ? 'text-amber-500' : theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              {item.label}
                            </h4>
                            {isActive && (
                              <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded uppercase">
                                Aktif
                              </span>
                            )}
                            {item.badgeCount && item.badgeCount > 0 ? (
                              <span className="text-[9px] bg-rose-500 text-white font-black px-1.5 py-0.2 rounded-full animate-pulse">
                                {item.badgeCount}
                              </span>
                            ) : null}
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        {isActive ? (
                          <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                            <Check className="w-4 h-4" />
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-0.5">
                            Buka &rarr;
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Opsi Pemberian Tips Kepada Driver */}
            <div className={`rounded-2xl p-4 border shadow-sm space-y-3 ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    <span>Opsi Pemberian Tips Kepada Driver</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Atur besaran tips default yang otomatis terpilih saat checkout untuk mengapresiasi kurir/driver.
                  </p>
                </div>
              </div>

              {/* Tips Preset Pills */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 pt-1">
                {[
                  { amount: 0, label: 'Tanpa Tips' },
                  { amount: 2000, label: 'Rp 2.000' },
                  { amount: 5000, label: 'Rp 5.000 (Rekomendasi)' },
                  { amount: 10000, label: 'Rp 10.000' },
                  { amount: 20000, label: 'Rp 20.000 (Spesial)' },
                ].map((item) => (
                  <button
                    key={item.amount}
                    type="button"
                    onClick={() => setDefaultDriverTip(item.amount)}
                    className={`py-2 px-1.5 rounded-xl border text-center transition active:scale-95 flex flex-col items-center justify-center ${
                      defaultDriverTip === item.amount
                        ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold shadow-sm ring-2 ring-amber-400/30'
                        : theme === 'dark'
                        ? 'bg-slate-800 text-slate-300 border-slate-700 hover:border-amber-400/40'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-[11px] font-bold">
                      {item.amount === 0 ? 'Rp 0' : `Rp ${item.amount.toLocaleString('id-ID')}`}
                    </span>
                    <span className="text-[9px] opacity-75 truncate max-w-full">
                      {item.amount === 0 ? 'Nol' : item.amount === 5000 ? 'Favorit' : item.amount === 20000 ? 'Spesial' : 'Pilihan'}
                    </span>
                  </button>
                ))}
              </div>

              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] flex items-start gap-2 text-amber-700 dark:text-amber-300">
                <Bike className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                <p>
                  <strong>100% Transparan:</strong> Semua nominal tips disalurkan penuh langsung ke saldo dompet mitra driver tanpa potongan komisi platform AntarRasa.
                </p>
              </div>
            </div>

            {/* 4. Informasi Akun Detail */}
            <div className={`rounded-2xl p-4 border shadow-sm space-y-3 ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <h3 className={`font-bold text-xs uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Informasi Akun
              </h3>
              <div className="space-y-2 text-xs">
                <div className={`flex justify-between py-1 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                  <span className="text-slate-400">Nama Lengkap</span>
                  <span className="font-bold">{currentUser.name}</span>
                </div>
                <div className={`flex justify-between py-1 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                  <span className="text-slate-400">Nomor Telepon</span>
                  <span className="font-bold">{currentUser.phone}</span>
                </div>
                <div className={`flex justify-between py-1 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                  <span className="text-slate-400">Email</span>
                  <span className="font-bold">{currentUser.email}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Status Akun</span>
                  <span className="font-bold text-emerald-500">Aktif & Terverifikasi</span>
                </div>
              </div>
            </div>

            {/* 5. Pengaturan Tampilan & Demo */}
            <div className={`rounded-2xl p-4 border shadow-sm space-y-2.5 ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <h3 className={`font-bold text-xs uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                ⚙️ Pengaturan Tampilan & Demo
              </h3>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setDeviceFrame(deviceFrame === 'mobile' ? 'fluid' : 'mobile')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 font-bold text-xs transition active:scale-95 ${
                    theme === 'dark'
                      ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-750'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {deviceFrame === 'mobile' ? (
                    <>
                      <Maximize2 className="w-3.5 h-3.5 text-amber-500" />
                      <span>Mode Layar Lebar</span>
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-3.5 h-3.5 text-amber-500" />
                      <span>Mode HP Simulasi</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Reset data demo ke kondisi awal PRD?')) {
                      resetDemoData();
                    }
                  }}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 font-bold text-xs transition active:scale-95 ${
                    theme === 'dark'
                      ? 'bg-slate-800 text-rose-400 border-slate-700 hover:bg-rose-950/40'
                      : 'bg-slate-50 text-rose-600 border-slate-200 hover:bg-rose-50'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo PRD</span>
                </button>
              </div>
            </div>

            {/* 6. Tombol Keluar dari Akun (Log Out) */}
            <div className={`rounded-2xl p-4 border shadow-sm space-y-2.5 ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-rose-500 flex items-center gap-1.5">
                    <LogOut className="w-4 h-4" /> Keluar dari Akun
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Saat ini masuk sebagai <strong>{currentUser.name}</strong> ({currentUser.email}).
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Yakin ingin keluar dari akun ${currentUser.name}?`)) {
                    logout();
                  }
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-bold text-xs flex items-center justify-center gap-2 transition active:scale-98 shadow-xs"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar dari Akun Ini</span>
              </button>
            </div>

            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900 space-y-1">
              <h4 className="font-bold flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-amber-600" /> Jaminan Layanan AntarRasa
              </h4>
              <p className="text-[11px] text-amber-800/90 leading-relaxed">
                AntarRasa menjamin pengantaran tepat waktu dengan driver terlatih dan resto mitra kuliner terverifikasi nusantara.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                Daftar Alamat Pengiriman
              </span>
              <button
                onClick={() => setShowNewAddress(true)}
                className="text-xs font-bold text-amber-500 flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Baru
              </button>
            </div>

            {showNewAddress && (
              <form onSubmit={handleAddAddress} className={`p-4 rounded-2xl border border-amber-400 shadow-sm space-y-2.5 ${
                theme === 'dark' ? 'bg-slate-900' : 'bg-white'
              }`}>
                <h4 className="font-bold text-xs">Tambah Alamat Baru</h4>
                <input
                  type="text"
                  placeholder="Label Alamat (misal: Apartemen, Rumah Nenek)"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
                  }`}
                  required
                />
                <textarea
                  placeholder="Alamat Lengkap (Jalan, No, RT/RW, Kelurahan)..."
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border resize-none h-16 ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
                  }`}
                  required
                />
                <input
                  type="text"
                  placeholder="Patokan / Catatan Driver..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
                  }`}
                />
                <div className="flex gap-2 pt-1">
                  <button type="submit" className="flex-1 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">
                    Simpan Alamat
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewAddress(false)}
                    className="px-3 py-2 bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                  >
                    Batal
                  </button>
                </div>
              </form>
            )}

            {addresses.map((addr) => (
              <div
                key={addr.id}
                onClick={() => setSelectedAddress(addr)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                  selectedAddress.id === addr.id
                    ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500'
                    : theme === 'dark'
                    ? 'bg-slate-900 border-slate-800 hover:bg-slate-850'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <MapPin className={`w-4 h-4 mt-0.5 ${selectedAddress.id === addr.id ? 'text-amber-500' : 'text-slate-400'}`} />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`font-bold text-xs ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{addr.label}</span>
                      {selectedAddress.id === addr.id && (
                        <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 rounded">
                          Utama
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{addr.fullAddress}</p>
                    {addr.notes && (
                      <p className="text-[11px] text-amber-600 italic mt-0.5">Catatan: {addr.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'support' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`font-bold text-xs ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Tiket Bantuan CS</h3>
                <p className="text-[11px] text-slate-400">Sesuai PRD Section 5.2 & 5.3 (Keluhan & CS)</p>
              </div>
              <button
                onClick={() => setShowNewTicketModal(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-sm hover:bg-amber-600 transition"
              >
                + Buka Tiket
              </button>
            </div>

            {/* List tickets */}
            {tickets.map((t) => (
              <div
                key={t.id}
                className={`rounded-2xl p-3.5 border shadow-sm space-y-2 ${
                  theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/50 text-slate-700 dark:text-slate-300 uppercase">
                    {t.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.status === 'open'
                        ? 'bg-amber-100 text-amber-800'
                        : t.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {t.status.replace('_', ' ')}
                  </span>
                </div>

                <h4 className={`font-bold text-xs ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t.subject}</h4>
                {t.orderId && <p className="text-[11px] text-slate-400">Ref Order: {t.orderId}</p>}

                {/* Conversation Box */}
                <div className={`p-2.5 rounded-xl border space-y-2 max-h-40 overflow-y-auto ${
                  theme === 'dark' ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-100'
                }`}>
                  {t.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`text-xs p-2 rounded-xl ${
                        m.senderRole === 'consumer'
                          ? 'bg-amber-500/20 text-amber-200 ml-4'
                          : 'bg-slate-700 text-slate-100 mr-4 border border-slate-600'
                      }`}
                    >
                      <div className="flex justify-between text-[10px] font-bold opacity-75 mb-0.5">
                        <span>{m.senderName} ({m.senderRole})</span>
                        <span>{m.timestamp}</span>
                      </div>
                      <p className="leading-snug">{m.message}</p>
                    </div>
                  ))}
                </div>

                {/* Reply bar */}
                <div className="flex gap-1.5 pt-1">
                  <input
                    type="text"
                    placeholder="Ketik balasan untuk CS..."
                    value={selectedTicketId === t.id ? replyText : ''}
                    onFocus={() => setSelectedTicketId(t.id)}
                    onChange={(e) => {
                      setSelectedTicketId(t.id);
                      setReplyText(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendReply(t.id);
                    }}
                    className={`flex-1 text-xs p-2 rounded-xl border ${
                      theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  />
                  <button
                    onClick={() => handleSendReply(t.id)}
                    className="p-2 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-600 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-2xl">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Buka Tiket Bantuan CS</h3>
            <form onSubmit={handleCreateTicket} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">Kategori Masalah</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                >
                  <option value="pesanan">Pesanan & Makanan</option>
                  <option value="pembayaran">Pembayaran & Tagihan</option>
                  <option value="driver">Layanan Driver</option>
                  <option value="aplikasi">Masalah Teknis Aplikasi</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">Judul Keluhan</label>
                <input
                  type="text"
                  placeholder="Contoh: Sambal belum sampai, dll."
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">Pesan Lengkap</label>
                <textarea
                  placeholder="Jelaskan detail kendala Anda..."
                  value={ticketMsg}
                  onChange={(e) => setTicketMsg(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 resize-none h-20"
                  required
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-600 transition"
                >
                  Kirim Tiket
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="py-2.5 px-4 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
