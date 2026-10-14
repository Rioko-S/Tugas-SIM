import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import {
  ShoppingBag,
  Store,
  Bike,
  ShieldCheck,
  Crown,
  Smartphone,
  Maximize2,
  RotateCcw,
  Info,
  ChevronDown,
} from 'lucide-react';

export const RoleSwitcherBar: React.FC = () => {
  const {
    currentRole,
    switchRole,
    currentUser,
    orders,
    withdrawals,
    deviceFrame,
    setDeviceFrame,
    resetDemoData,
    activeCommissionScheme,
  } = useApp();

  const [showRoleInfo, setShowRoleInfo] = useState(false);
  const [isBarCollapsed, setIsBarCollapsed] = useState(false);

  // Calculate live badge counts
  const storePendingOrders = orders.filter((o) => ['paid', 'placed', 'accepted', 'preparing'].includes(o.status)).length;
  const driverActiveOrders = orders.filter((o) => ['ready_for_pickup', 'driver_assigned', 'picked_up', 'on_delivery'].includes(o.status)).length;
  const adminPendingWd = withdrawals.filter((w) => w.status === 'pending').length;

  const rolesConfig: {
    role: Role;
    label: string;
    sublabel: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    color: string;
  }[] = [
    {
      role: 'consumer',
      label: 'Konsumen',
      sublabel: 'Pesan & Lacak',
      icon: ShoppingBag,
      color: 'from-amber-500 to-orange-500',
    },
    {
      role: 'store_owner',
      label: 'Pemilik Toko',
      sublabel: 'Kelola Menu & Order',
      icon: Store,
      badge: storePendingOrders > 0 ? storePendingOrders : undefined,
      color: 'from-blue-600 to-indigo-600',
    },
    {
      role: 'driver',
      label: 'Driver',
      sublabel: 'Antar & Penghasilan',
      icon: Bike,
      badge: driverActiveOrders > 0 ? driverActiveOrders : undefined,
      color: 'from-emerald-600 to-teal-600',
    },
    {
      role: 'admin',
      label: 'Admin',
      sublabel: 'Verifikasi & CS',
      icon: ShieldCheck,
      badge: adminPendingWd > 0 ? adminPendingWd : undefined,
      color: 'from-purple-600 to-fuchsia-600',
    },
    {
      role: 'owner',
      label: 'Owner',
      sublabel: 'Komisi & Analitik',
      icon: Crown,
      color: 'from-amber-600 to-yellow-600',
    },
  ];

  if (isBarCollapsed) {
    return (
      <div className="fixed top-2.5 right-3 z-50 flex items-center gap-2 animate-in fade-in">
        <button
          onClick={() => setIsBarCollapsed(false)}
          className="px-3 py-1.5 rounded-full bg-slate-900/95 text-amber-300 font-bold text-xs border border-slate-700 shadow-xl backdrop-blur-md flex items-center gap-1.5 hover:bg-slate-800 transition active:scale-95"
          title="Tampilkan Bilah Pengembang"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Role: {currentRole.replace('_', ' ')}</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Left: Quick active role indicator + simulated user */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold uppercase tracking-wider text-amber-400 border border-slate-700">
            PRD Multi-Role
          </span>
          <div className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-700">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-5 h-5 rounded-full object-cover ring-1 ring-amber-400"
            />
            <div className="leading-tight">
              <span className="font-semibold text-slate-200 text-xs block">{currentUser.name}</span>
              <span className="text-[10px] text-slate-400 capitalize">{currentRole.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Center: The 5 Role Switcher Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {rolesConfig.map((item) => {
            const Icon = item.icon;
            const isActive = currentRole === item.role;
            return (
              <button
                key={item.role}
                onClick={() => switchRole(item.role)}
                className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-medium transition-all text-xs whitespace-nowrap active:scale-95 ${
                  isActive
                    ? 'bg-gradient-to-r ' + item.color + ' text-white font-bold shadow-md shadow-black/30 ring-1 ring-white/30'
                    : 'bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="ml-0.5 px-1.5 py-0.2 bg-rose-500 text-white text-[10px] font-black rounded-full animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right: View mode toggle, reset & minimize */}
        <div className="flex items-center gap-1.5 ml-auto">
          {/* Active Commission Scheme Tag */}
          <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 bg-amber-950/60 border border-amber-600/40 text-amber-300 rounded-lg text-[10px] font-semibold">
            Komisi: {activeCommissionScheme.percentage}%
          </span>

          {/* Toggle Device Frame */}
          <button
            onClick={() => setDeviceFrame(deviceFrame === 'mobile' ? 'fluid' : 'mobile')}
            title={deviceFrame === 'mobile' ? 'Beralih ke Tampilan Lebar' : 'Beralih ke Simulasi Smartphone'}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            {deviceFrame === 'mobile' ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] hidden lg:inline">Mode HP</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] hidden lg:inline">Mode Penuh</span>
              </>
            )}
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={resetDemoData}
            title="Reset Data Demo ke Kondisi Awal PRD"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/50 hover:text-rose-300 text-slate-400 border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Role info dropdown */}
          <button
            onClick={() => setShowRoleInfo(!showRoleInfo)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
            title="Informasi Alur PRD"
          >
            <Info className="w-3.5 h-3.5" />
          </button>

          {/* Minimize bar button */}
          <button
            onClick={() => setIsBarCollapsed(true)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
            title="Sembunyikan bilah (akses ganti role utama ada di Menu Akun)"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Expandable PRD Flow Explainer */}
      {showRoleInfo && (
        <div className="bg-slate-850 border-t border-slate-800 px-4 py-3 text-slate-300 text-xs animate-in slide-in-from-top-2">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 justify-between items-start">
            <div className="space-y-1">
              <p className="font-bold text-amber-400 flex items-center gap-1.5">
                <span>⚡ Alur End-to-End Transaksi AntarRasa (Sesuai PRD Bab 2 & 6):</span>
              </p>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                1. <strong>Konsumen</strong>: Pilih resto &rarr; keranjang &rarr; checkout &rarr; bayar QRIS/VA (simulasi webhook idempotent).<br />
                2. <strong>Toko</strong>: Terima pesanan &rarr; proses masak &rarr; klik "Siap Diambil".<br />
                3. <strong>Sistem</strong>: Otomatis <em>auto-assign</em> driver terdekat yang berstatus available.<br />
                4. <strong>Driver</strong>: Terima order &rarr; ambil di resto &rarr; antar ke lokasi &rarr; upload bukti serah terima foto/ttd.<br />
                5. <strong>Selesai</strong>: Order completed &rarr; kalkulasi komisi persentase otomatis & dicatat ke ledger tanpa duplikasi &rarr; Driver/Toko ajukan pencairan (manual withdrawal) &rarr; Admin approve.
              </p>
            </div>
            <button
              onClick={() => setShowRoleInfo(false)}
              className="text-slate-400 hover:text-white underline self-end md:self-center text-[11px]"
            >
              Tutup Info
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
