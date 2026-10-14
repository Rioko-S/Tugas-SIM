import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import { Logo } from '../common/Logo';
import {
  ShoppingBag,
  Store,
  Bike,
  ShieldCheck,
  Crown,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  UtensilsCrossed,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const AuthView: React.FC = () => {
  const { login, register, quickLogin, theme } = useApp();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('siti.rahma@gmail.com');
  const [loginPassword, setLoginPassword] = useState('123456');
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<Role>('consumer');
  const [regStoreName, setRegStoreName] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginIdentifier.trim()) {
      setErrorMessage('Silakan masukkan Email atau Nomor HP Anda.');
      return;
    }
    if (!loginPassword) {
      setErrorMessage('Silakan masukkan kata sandi.');
      return;
    }

    const result = login(loginIdentifier, loginPassword);
    if (!result.success && result.error) {
      setErrorMessage(result.error);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regName.trim()) {
      setErrorMessage('Nama lengkap wajib diisi.');
      return;
    }
    if (!regEmail.trim()) {
      setErrorMessage('Alamat email wajib diisi.');
      return;
    }
    if (!regPhone.trim()) {
      setErrorMessage('Nomor HP/WhatsApp wajib diisi.');
      return;
    }
    if (regPassword.length < 4) {
      setErrorMessage('Kata sandi minimal 4 karakter.');
      return;
    }
    if (regRole === 'store_owner' && !regStoreName.trim()) {
      setErrorMessage('Nama Resto / Usaha kuliner wajib diisi untuk Mitra Toko.');
      return;
    }

    const result = register({
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      role: regRole,
      storeName: regStoreName,
    });

    if (!result.success && result.error) {
      setErrorMessage(result.error);
    }
  };

  const demoAccounts: {
    role: Role;
    label: string;
    sublabel: string;
    name: string;
    email: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }[] = [
    {
      role: 'consumer',
      label: 'Konsumen',
      sublabel: 'Pesan kuliner & promo',
      name: 'Siti Rahmawati',
      email: 'siti.rahma@gmail.com',
      icon: ShoppingBag,
      color: 'from-amber-500 to-orange-500 text-white',
    },
    {
      role: 'store_owner',
      label: 'Mitra Resto',
      sublabel: 'Kelola pesanan & menu',
      name: 'Chef Hendra (Bebek Sinjay)',
      email: 'hendra.sinjay@resto.id',
      icon: Store,
      color: 'from-blue-600 to-indigo-600 text-white',
    },
    {
      role: 'driver',
      label: 'Mitra Driver',
      sublabel: 'Antar & terima pesanan',
      name: 'Budi Santoso',
      email: 'budi.driver@antarrasa.id',
      icon: Bike,
      color: 'from-emerald-600 to-teal-600 text-white',
    },
    {
      role: 'admin',
      label: 'Admin Operasional',
      sublabel: 'Verifikasi & pencairan',
      name: 'Rian Operasional',
      email: 'admin.rian@antarrasa.id',
      icon: ShieldCheck,
      color: 'from-purple-600 to-fuchsia-600 text-white',
    },
    {
      role: 'owner',
      label: 'Owner Aplikasi',
      sublabel: 'GMV & komisi platform',
      name: 'Pak Irwan CEO',
      email: 'irwan.owner@antarrasa.id',
      icon: Crown,
      color: 'from-amber-600 to-yellow-600 text-white',
    },
  ];

  return (
    <div
      className={`flex-1 flex flex-col justify-between p-5 min-h-full overflow-y-auto no-scrollbar transition-colors ${
        theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-gradient-to-b from-amber-50/40 via-white to-slate-50 text-slate-800'
      }`}
    >
      <div className="space-y-5 max-w-sm mx-auto w-full pt-2">
        {/* Top Logo and Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <Logo size="lg" />
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Pesan-Antar Kuliner Nusantara Cepat, Hangat & Tepat Rasa
          </p>

          {/* Tab Switcher: Masuk vs Daftar */}
          <div
            className={`p-1 rounded-2xl flex border shadow-inner ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                authMode === 'login'
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Masuk (Log In)
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                authMode === 'register'
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Daftar Akun Baru
            </button>
          </div>
        </div>

        {/* Error Alert if any */}
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {authMode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                Email atau No. Handphone
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="contoh: nama@gmail.com / 0812..."
                  className={`w-full pl-10 pr-3 py-2.5 rounded-2xl text-xs border focus:border-amber-400 focus:outline-none transition ${
                    theme === 'dark'
                      ? 'bg-slate-900 border-slate-800 text-white focus:bg-slate-850'
                      : 'bg-white border-slate-200 text-slate-800 shadow-sm'
                  }`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                  Kata Sandi
                </label>
                <button
                  type="button"
                  onClick={() => alert('Untuk akun demo, gunakan kata sandi: 123456')}
                  className="text-[10px] text-amber-500 hover:underline font-bold"
                >
                  Lupa Sandi?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Masukkan kata sandi..."
                  className={`w-full pl-10 pr-10 py-2.5 rounded-2xl text-xs border focus:border-amber-400 focus:outline-none transition ${
                    theme === 'dark'
                      ? 'bg-slate-900 border-slate-800 text-white focus:bg-slate-850'
                      : 'bg-white border-slate-200 text-slate-800 shadow-sm'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400 text-[11px]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-400"
                />
                <span>Ingat akun saya</span>
              </label>
              <span className="text-[11px] text-slate-500">Sandi demo: 123456</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition active:scale-98"
            >
              <span>Masuk Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* REGISTER FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                Nama Lengkap
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="contoh: Dian Ayu Permata"
                  className={`w-full pl-10 pr-3 py-2 rounded-2xl text-xs border focus:border-amber-400 focus:outline-none transition ${
                    theme === 'dark'
                      ? 'bg-slate-900 border-slate-800 text-white focus:bg-slate-850'
                      : 'bg-white border-slate-200 text-slate-800 shadow-sm'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className={`w-full pl-10 pr-2 py-2 rounded-2xl text-xs border focus:border-amber-400 focus:outline-none transition ${
                      theme === 'dark'
                        ? 'bg-slate-900 border-slate-800 text-white'
                        : 'bg-white border-slate-200 text-slate-800 shadow-sm'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                  No. WhatsApp / HP
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className={`w-full pl-10 pr-2 py-2 rounded-2xl text-xs border focus:border-amber-400 focus:outline-none transition ${
                      theme === 'dark'
                        ? 'bg-slate-900 border-slate-800 text-white'
                        : 'bg-white border-slate-200 text-slate-800 shadow-sm'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Minimal 4 karakter"
                  className={`w-full pl-10 pr-10 py-2 rounded-2xl text-xs border focus:border-amber-400 focus:outline-none transition ${
                    theme === 'dark'
                      ? 'bg-slate-900 border-slate-800 text-white'
                      : 'bg-white border-slate-200 text-slate-800 shadow-sm'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                Daftar Sebagai Peran Apa?
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { r: 'consumer' as Role, label: 'Konsumen', icon: ShoppingBag },
                  { r: 'store_owner' as Role, label: 'Mitra Resto', icon: Store },
                  { r: 'driver' as Role, label: 'Mitra Driver', icon: Bike },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSel = regRole === item.r;
                  return (
                    <button
                      key={item.r}
                      type="button"
                      onClick={() => setRegRole(item.r)}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-center transition active:scale-95 ${
                        isSel
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-500 shadow-sm ring-1 ring-amber-400/40'
                          : theme === 'dark'
                          ? 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[10px]">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* If store_owner selected, show store name field */}
            {regRole === 'store_owner' && (
              <div className="space-y-1 pt-0.5 animate-in fade-in">
                <label className="text-[11px] font-bold text-amber-500 block uppercase tracking-wider">
                  Nama Resto / Usaha Kuliner
                </label>
                <div className="relative">
                  <UtensilsCrossed className="w-4 h-4 absolute left-3.5 top-3 text-amber-500" />
                  <input
                    type="text"
                    value={regStoreName}
                    onChange={(e) => setRegStoreName(e.target.value)}
                    placeholder="contoh: Sate Maranggi Pak Kumis"
                    className={`w-full pl-10 pr-3 py-2 rounded-2xl text-xs border focus:border-amber-400 focus:outline-none transition ${
                      theme === 'dark'
                        ? 'bg-slate-900 border-amber-500/50 text-white'
                        : 'bg-white border-amber-300 text-slate-800 shadow-sm'
                    }`}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition active:scale-98 mt-2"
            >
              <span>Daftar & Masuk ke Aplikasi</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* DEMO ACCOUNTS QUICK LOGIN */}
        <div className="pt-2 border-t border-dashed border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold flex items-center gap-1.5 text-amber-500">
              <Sparkles className="w-3.5 h-3.5" /> ⚡ Masuk Cepat Akun Demo (1-Klik)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Bebas Kata Sandi</span>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {demoAccounts.map((acc) => {
              const Icon = acc.icon;
              return (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => quickLogin(acc.role)}
                  className={`p-2 px-3 rounded-xl border flex items-center justify-between gap-2.5 transition active:scale-98 text-left ${
                    theme === 'dark'
                      ? 'bg-slate-900/90 border-slate-800 hover:border-amber-400/50 hover:bg-slate-850'
                      : 'bg-white border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg bg-gradient-to-br ${acc.color} flex items-center justify-center shrink-0 shadow-xs`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 leading-tight">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs truncate">{acc.label}</span>
                        <span className="text-[10px] text-slate-400 truncate">({acc.name})</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block truncate">{acc.sublabel}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-500 shrink-0">Masuk &rarr;</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 pb-1 text-center text-slate-400 text-[10px]">
        AntarRasa © 2026 • Platform Pesan-Antar Makanan Multi-Role
      </div>
    </div>
  );
};
