import React from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import {
  X,
  ShoppingBag,
  Store,
  Bike,
  ShieldCheck,
  Crown,
  Sun,
  Moon,
  Check,
  User,
  Phone,
  Mail,
  Heart,
  Smartphone,
  Maximize2,
  RotateCcw,
  LogOut,
} from 'lucide-react';

interface RoleAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleAccountModal: React.FC<RoleAccountModalProps> = ({ isOpen, onClose }) => {
  const {
    currentRole,
    currentUser,
    switchRole,
    theme,
    setTheme,
    orders,
    withdrawals,
    deviceFrame,
    setDeviceFrame,
    resetDemoData,
    logout,
  } = useApp();

  if (!isOpen) return null;

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
      description: 'Eksplorasi resto kuliner, keranjang belanja, bayar QRIS/VA, dan lacak status pesanan.',
      icon: ShoppingBag,
      color: 'from-amber-500 to-orange-500',
    },
    {
      role: 'store_owner',
      label: 'Pemilik Toko (Merchant Resto)',
      description: 'Kelola jam buka toko, menu kuliner, stok porsi, dan proses pesanan dapur (Siap Pickup).',
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
      description: 'Persetujuan withdrawal pencairan saldo, verifikasi mitra resto & driver, serta tiket CS.',
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

  const handleSelectRole = (role: Role) => {
    switchRole(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div
        className={`w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transition-colors ${
          theme === 'dark' ? 'bg-slate-900 text-slate-100 border border-slate-800' : 'bg-white text-slate-800'
        }`}
      >
        {/* Header */}
        <div className={`px-5 py-4 border-b flex items-center justify-between ${
          theme === 'dark' ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white'
        }`}>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="font-extrabold text-base leading-tight">Menu Akun & Profil</h3>
              <p className="text-[11px] text-slate-400">Pengaturan tema dan akses multi-role</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* User Profile Card */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-4 text-white shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-white/60 shadow"
              />
              <div>
                <h4 className="font-black text-sm">{currentUser.name}</h4>
                <p className="text-[11px] text-amber-100 flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3" /> {currentUser.phone}
                </p>
                <p className="text-[11px] text-amber-100 flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {currentUser.email}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] bg-black/25 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider block">
                {currentRole.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* 1. Pengaturan Mode Gelap & Mode Terang */}
          <div
            className={`rounded-2xl p-4 border shadow-sm space-y-2.5 ${
              theme === 'dark' ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 text-amber-500">
                <span>🌓 Tampilan Tema Aplikasi</span>
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                {theme === 'dark' ? 'Mode Gelap Aktif' : 'Mode Terang Aktif'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-3 rounded-2xl border flex items-center justify-center gap-2 font-bold text-xs transition active:scale-95 ${
                  theme === 'light'
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm ring-2 ring-amber-400/40'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
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

          {/* 2. Fitur Beralih Peran (Multi-Role) */}
          <div
            className={`rounded-2xl p-4 border shadow-sm space-y-2.5 ${
              theme === 'dark' ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 text-amber-500">
                <span>👥 Beralih Peran (Multi-Role)</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Pilih peran di bawah ini untuk beralih tampilan dan menguji alur kerja lengkap AntarRasa:
              </p>
            </div>

            <div className="space-y-2 pt-1">
              {roleCards.map((item) => {
                const Icon = item.icon;
                const isActive = currentRole === item.role;

                return (
                  <div
                    key={item.role}
                    onClick={() => handleSelectRole(item.role)}
                    className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-3 active:scale-98 ${
                      isActive
                        ? 'bg-amber-500/15 border-amber-500 ring-2 ring-amber-400/30'
                        : theme === 'dark'
                        ? 'bg-slate-900 border-slate-700/80 hover:border-amber-400/40'
                        : 'bg-white border-slate-200 hover:bg-amber-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                          isActive
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-slate-700 text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h5 className={`font-bold text-xs truncate ${isActive ? 'text-amber-500' : ''}`}>
                            {item.label}
                          </h5>
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
                        <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      {isActive ? (
                        <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <span className="text-[11px] font-bold text-amber-500 hover:underline">
                          Pilih
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Pengaturan Tampilan & Data Demo */}
          <div
            className={`rounded-2xl p-4 border shadow-sm space-y-2.5 ${
              theme === 'dark' ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <span className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 text-slate-400">
              <span>⚙️ Pengaturan Tampilan & Demo</span>
            </span>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDeviceFrame(deviceFrame === 'mobile' ? 'fluid' : 'mobile')}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 font-bold text-xs transition active:scale-95 ${
                  theme === 'dark'
                    ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {deviceFrame === 'mobile' ? (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-amber-500" />
                    <span>Layar Penuh</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-3.5 h-3.5 text-amber-500" />
                    <span>Simulasi HP</span>
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
                    : 'bg-white text-rose-600 border-slate-200 hover:bg-rose-50'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo</span>
              </button>
            </div>
          </div>

          {/* 4. Tombol Logout Akun */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Yakin ingin keluar dari akun ${currentUser.name}?`)) {
                logout();
                onClose();
              }
            }}
            className="w-full py-3 px-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 font-bold text-xs flex items-center justify-center gap-2 transition active:scale-98"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar dari Akun ({currentUser.name})</span>
          </button>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t text-center ${
          theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-50'
        }`}>
          <p className="text-[11px] text-slate-400">
            AntarRasa © 2026 • Platform Pesan-Antar Makanan Multi-Role
          </p>
        </div>
      </div>
    </div>
  );
};
