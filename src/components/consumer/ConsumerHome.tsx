import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Store, Order } from '../../types';
import { Logo } from '../common/Logo';
import {
  MapPin,
  Search,
  Star,
  Clock,
  Sparkles,
  ShoppingBag,
  Bike,
  ShieldCheck,
  ChevronRight,
  Tag,
  ArrowRight,
  Flame,
} from 'lucide-react';

interface ConsumerHomeProps {
  onSelectStore: (store: Store) => void;
  onOpenOrderTracking: (order: Order) => void;
  onOpenCart: () => void;
}

export const ConsumerHome: React.FC<ConsumerHomeProps> = ({
  onSelectStore,
  onOpenOrderTracking,
  onOpenCart,
}) => {
  const {
    stores,
    selectedAddress,
    orders,
    cart,
    categories,
    broadcasts,
    promotions,
    theme,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Local state for search history (persisted in local state & localStorage)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('antarrasa_recent_searches');
      return saved ? JSON.parse(saved) : ['Bebek Sinjay', 'Kopi Kenangan', 'Sate Senayan'];
    } catch {
      return ['Bebek Sinjay', 'Kopi Kenangan', 'Sate Senayan'];
    }
  });

  const saveRecentSearches = (items: string[]) => {
    setRecentSearches(items);
    try {
      localStorage.setItem('antarrasa_recent_searches', JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save search history', e);
    }
  };

  const handleExecuteSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setSearchQuery(trimmed);
    const updated = [trimmed, ...recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 8);
    saveRecentSearches(updated);
  };

  const handleRemoveRecentSearch = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== term);
    saveRecentSearches(updated);
  };

  const handleClearAllSearches = () => {
    saveRecentSearches([]);
  };

  // Find active orders
  const activeOrder = orders.find((o) => !['completed', 'cancelled'].includes(o.status));

  // Filter stores
  const filteredStores = stores.filter((s) => {
    const matchesCat = selectedCategory === 'Semua' || s.category === selectedCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const consumerBroadcasts = broadcasts.filter((b) => b.targetRole === 'all' || b.targetRole === 'consumer');
  const totalCartCount = cart.reduce((acc, c) => acc + c.quantity, 0);

  return (
    <div className={`flex-1 flex flex-col overflow-y-auto ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      {/* Top Mobile App Bar */}
      <div className={`px-4 pt-3 pb-3 border-b sticky top-0 z-20 space-y-2.5 shadow-sm ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        {/* Row 1: Logo & Address Pin */}
        <div className="flex items-center justify-between gap-2">
          <Logo size="sm" />

          {/* Delivery Address Pill */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border max-w-[200px] ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-amber-50 border-amber-200/80'}`}>
            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <div className="leading-none truncate text-left">
              <span className="text-[9px] text-slate-400 font-bold uppercase block">Antar Ke</span>
              <span className={`text-[11px] font-bold truncate block ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                {selectedAddress.label}: {selectedAddress.fullAddress.slice(0, 18)}...
              </span>
            </div>
          </div>
        </div>

        {/* Row 2: Search Input & Riwayat Pencarian */}
        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleExecuteSearch(searchQuery);
                    setIsSearchFocused(false);
                  }
                }}
                placeholder="Cari bebek sinjay, sate, kopi, padang..."
                className={`w-full pl-9 ${searchQuery ? 'pr-8' : 'pr-3'} py-2 rounded-2xl text-xs placeholder:text-slate-400 border focus:border-amber-400 focus:outline-none transition ${
                  theme === 'dark'
                    ? 'bg-slate-800 text-white border-slate-700 focus:bg-slate-850'
                    : 'bg-slate-100 text-slate-800 border-transparent focus:bg-white'
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                  }}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Tombol Batal/Tutup saat bar pencarian sedang dipakai */}
            {isSearchFocused && (
              <button
                type="button"
                onClick={() => setIsSearchFocused(false)}
                className="text-xs font-bold text-amber-500 hover:text-amber-400 transition shrink-0 px-1"
              >
                Batal
              </button>
            )}
          </div>

          {/* Riwayat Pencarian: HANYA muncul saat bar/menu search sedang dipakai (isSearchFocused) */}
          {isSearchFocused && (
            <div
              onMouseDown={(e) => e.preventDefault()}
              className={`mt-2 p-3 rounded-2xl border shadow-xl space-y-2.5 animate-in fade-in slide-in-from-top-1 ${
                theme === 'dark' ? 'bg-slate-900 border-slate-750 text-white' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold flex items-center gap-1.5 text-amber-500">
                  <Clock className="w-3.5 h-3.5" /> Riwayat Pencarian
                </span>
                {recentSearches.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllSearches}
                    className="text-[10px] text-slate-400 hover:text-rose-500 font-semibold transition"
                  >
                    Hapus Semua
                  </button>
                )}
              </div>

              {recentSearches.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {recentSearches.map((term, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        handleExecuteSearch(term);
                        setIsSearchFocused(false);
                      }}
                      className={`group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold cursor-pointer border transition active:scale-95 ${
                        searchQuery.toLowerCase() === term.toLowerCase()
                          ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold shadow-sm'
                          : theme === 'dark'
                          ? 'bg-slate-800 text-slate-200 border-slate-700 hover:border-amber-400'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:border-amber-400'
                      }`}
                    >
                      <span>{term}</span>
                      <button
                        type="button"
                        onClick={(e) => handleRemoveRecentSearch(e, term)}
                        className="opacity-50 group-hover:opacity-100 hover:text-rose-500 text-[10px] ml-0.5"
                        title="Hapus kata kunci ini"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 py-1 text-center">
                  Belum ada riwayat pencarian.
                </p>
              )}

              {/* Rekomendasi kata kunci cepat */}
              <div className={`pt-2 border-t flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px] ${
                theme === 'dark' ? 'border-slate-800' : 'border-slate-100'
              }`}>
                <span className="shrink-0 text-[10px] font-semibold text-slate-400">Pencarian Populer:</span>
                {['Bebek Sinjay', 'Kopi Kenangan', 'Sate Padang', 'Ayam Geprek'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      handleExecuteSearch(term);
                      setIsSearchFocused(false);
                    }}
                    className={`shrink-0 px-2 py-0.5 rounded-lg text-[10px] font-medium transition ${
                      theme === 'dark'
                        ? 'bg-slate-800 text-amber-300 hover:bg-slate-700'
                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/50'
                    }`}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4 pb-24">
        {/* Platform Broadcast Alert (PRD section 5.2) */}
        {consumerBroadcasts.length > 0 && (
          <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/15 border border-amber-300 rounded-2xl p-3 flex items-start gap-2.5 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0 text-xs">
              <span className="font-bold text-amber-950 block">{consumerBroadcasts[0].title}</span>
              <p className="text-[11px] text-amber-900/90 leading-tight mt-0.5">
                {consumerBroadcasts[0].content}
              </p>
            </div>
          </div>
        )}

        {/* Sticky Active Order Tracker Card (If any order in progress) */}
        {activeOrder && (
          <div
            onClick={() => onOpenOrderTracking(activeOrder)}
            className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-3.5 shadow-lg border border-slate-700 flex items-center justify-between cursor-pointer hover:scale-[1.01] transition active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0 animate-bounce">
                <Bike className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded uppercase">
                    Pesanan Aktif
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{activeOrder.id}</span>
                </div>
                <h4 className="font-bold text-xs text-white mt-0.5 line-clamp-1">
                  {activeOrder.storeName}
                </h4>
                <p className="text-[11px] text-amber-300 capitalize font-medium">
                  Status: {activeOrder.status.replace(/_/g, ' ')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-amber-400 shrink-0">
              <span>Lacak</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* Promo Banner Card */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-4 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-[210px] space-y-1">
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
              Promo Spesial Hari Ini
            </span>
            <h3 className="text-base font-black leading-tight drop-shadow">
              Diskon Ongkir & Kuliner s/d 20%!
            </h3>
            <p className="text-[11px] text-amber-100 font-medium">
              Gunakan kode <code className="bg-black/30 px-1.5 py-0.5 rounded font-mono font-bold">ANTARHEMAT</code> saat checkout.
            </p>
          </div>
          <div className="absolute right-[-10px] bottom-[-10px] opacity-25 pointer-events-none">
            <Logo size="xl" showText={false} />
          </div>
        </div>

        {/* Category Carousel */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-bold text-xs flex items-center gap-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              <Flame className="w-3.5 h-3.5 text-orange-500" /> Kategori Kuliner
            </h3>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {['Semua', ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition active:scale-95 ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : theme === 'dark'
                    ? 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stores List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className={`font-extrabold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Resto Mitra Pilihan</h3>
            <span className="text-[11px] text-slate-400 font-medium">
              {filteredStores.length} Resto
            </span>
          </div>

          {/* Active Search Filter Info */}
          {searchQuery && (
            <div className={`p-2.5 rounded-2xl flex items-center justify-between gap-2 border text-xs ${
              theme === 'dark' ? 'bg-amber-950/30 border-amber-500/30 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              <div className="flex items-center gap-1.5 truncate">
                <Search className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="truncate">
                  Hasil untuk: <strong>"{searchQuery}"</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[11px] font-bold text-amber-500 hover:text-amber-600 underline shrink-0"
              >
                Hapus Filter
              </button>
            </div>
          )}

          {filteredStores.length === 0 ? (
            <div className={`p-8 rounded-3xl border text-center space-y-2.5 ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 dark:bg-slate-800 flex items-center justify-center text-amber-600">
                <Search className="w-6 h-6" />
              </div>
              <p className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Resto Tidak Ditemukan
              </p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Tidak ada resto kuliner yang cocok dengan kata kunci "{searchQuery}".
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-1 px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-sm hover:bg-amber-400 transition"
              >
                Reset Pencarian
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredStores.map((store) => (
                <div
                  key={store.id}
                  onClick={() => onSelectStore(store)}
                  className={`rounded-3xl overflow-hidden border shadow-sm hover:border-amber-400 transition cursor-pointer group ${
                    theme === 'dark'
                      ? 'bg-slate-900 border-slate-800 hover:border-amber-500/60'
                      : 'bg-white border-slate-200/80'
                  }`}
                >
                  {/* Store Banner */}
                  <div className="relative h-32 w-full overflow-hidden">
                    <img
                      src={store.banner}
                      alt={store.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Operational tag */}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md ${
                          store.isOpen
                            ? 'bg-emerald-500/90 text-white'
                            : 'bg-rose-500/90 text-white'
                        }`}
                      >
                        {store.isOpen ? 'Buka' : 'Tutup'}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 text-white backdrop-blur-md">
                        {store.distanceKm} km
                      </span>
                    </div>

                    {/* Rating Tag */}
                    <div className="absolute bottom-2.5 right-3 bg-white/95 px-2 py-0.5 rounded-full text-slate-900 font-black text-xs flex items-center gap-1 shadow">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{store.rating}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({store.totalReviews})</span>
                    </div>
                  </div>

                  {/* Store Body Details */}
                  <div className="p-3.5 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className={`font-bold text-sm truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{store.name}</h4>
                        {store.isVerified && (
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{store.category} • {store.address}</p>
                      <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" /> 20-30 min
                        </span>
                        <span>•</span>
                        <span className="text-emerald-500 font-semibold bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                          Gratis Ongkir s/d Rp 8rb
                        </span>
                      </div>
                    </div>

                    <div className={`w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition shrink-0 ${
                      theme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
