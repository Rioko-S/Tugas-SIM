import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Store, Product } from '../../types';
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Plus,
  Minus,
  Check,
  ShoppingBag,
  Info,
  ShieldCheck,
  Search,
} from 'lucide-react';

interface StoreDetailModalProps {
  store: Store;
  onBack: () => void;
  onOpenCart: () => void;
}

export const StoreDetailModal: React.FC<StoreDetailModalProps> = ({ store, onBack, onOpenCart }) => {
  const { products, cart, addToCart, cartStoreId } = useApp();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const storeProducts = products.filter((p) => p.storeId === store.id);

  // Group unique categories
  const categories = ['Semua', ...Array.from(new Set(storeProducts.map((p) => p.category)))];

  const filteredProducts = storeProducts.filter((p) => {
    const matchCat = activeCategory === 'Semua' || p.category === activeCategory;
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const cartFromThisStore = cart.filter((c) => c.storeId === store.id);
  const totalItemCount = cartFromThisStore.reduce((acc, c) => acc + c.quantity, 0);
  const subtotal = cartFromThisStore.reduce((acc, c) => acc + c.price * c.quantity, 0);

  const handleOpenAdd = (p: Product) => {
    setSelectedProduct(p);
    setQuantity(1);
    setNotes('');
  };

  const handleConfirmAddToCart = () => {
    if (!selectedProduct) return;
    addToCart(selectedProduct, quantity, notes);
    setSelectedProduct(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
      {/* Hero Banner Header */}
      <div className="relative h-48 sm:h-56 w-full shrink-0">
        <img
          src={store.banner}
          alt={store.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30" />

        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2 rounded-full bg-white/90 hover:bg-white text-slate-800 backdrop-blur-md shadow-md z-10 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 uppercase">
              {store.category}
            </span>
            {store.isVerified && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/90 text-white flex items-center gap-1 backdrop-blur-sm">
                <ShieldCheck className="w-3 h-3" /> Mitra Terverifikasi
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-black leading-tight drop-shadow-md">
            {store.name}
          </h1>
          <p className="text-xs text-slate-200 line-clamp-1 mt-0.5 opacity-90">{store.description}</p>
        </div>
      </div>

      {/* Store Quick Info Ribbon */}
      <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-amber-600 font-bold">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{store.rating}</span>
            <span className="text-slate-400 font-normal">({store.totalReviews}+)</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{store.distanceKm} km</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>20 - 30 mnt</span>
          </div>
        </div>

        <span
          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
            store.isOpen
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}
        >
          {store.isOpen ? 'Buka' : 'Tutup'}
        </span>
      </div>

      {/* Category Filter Pills & Search */}
      <div className="bg-white px-4 py-2.5 border-b border-slate-200 sticky top-0 z-10 space-y-2">
        {/* Search menu */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari menu di resto ini..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-100 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Categories scroll */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                activeCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4 space-y-3 pb-24">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            Tidak ada produk yang cocok dengan pencarian Anda.
          </div>
        ) : (
          filteredProducts.map((product) => {
            const inCart = cart.find((c) => c.productId === product.id);

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-sm flex items-center justify-between gap-3 hover:border-amber-300 transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">
                      {product.category}
                    </span>
                    {product.stock <= 5 && (
                      <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded">
                        Sisa {product.stock}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 leading-tight">{product.name}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-snug">
                    {product.description}
                  </p>

                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-extrabold text-sm text-slate-900">
                      Rp {product.price.toLocaleString('id-ID')}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[11px] text-slate-400 line-through">
                        Rp {product.originalPrice.toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Image & Add button */}
                <div className="relative shrink-0 flex flex-col items-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 rounded-2xl object-cover shadow-inner"
                  />
                  <button
                    onClick={() => handleOpenAdd(product)}
                    disabled={!store.isOpen || !product.isAvailable || product.stock <= 0}
                    className={`mt-1.5 px-3 py-1 rounded-xl text-xs font-bold shadow transition flex items-center gap-1 active:scale-95 ${
                      !store.isOpen || !product.isAvailable || product.stock <= 0
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : inCart
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                    }`}
                  >
                    {inCart ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{inCart.quantity}x</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Bottom Cart Bar */}
      {totalItemCount > 0 && (
        <div className="fixed bottom-0 inset-x-0 p-3 bg-gradient-to-t from-white via-white/95 to-transparent z-20 pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto">
            <button
              onClick={onOpenCart}
              className="w-full bg-slate-950 hover:bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between transition transform active:scale-98"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                  {totalItemCount}
                </div>
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Keranjang</span>
                  <p className="font-extrabold text-sm text-amber-400">
                    Rp {subtotal.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 font-bold text-xs text-white">
                <span>Lihat Pesanan &rarr;</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Add Item Bottom Sheet Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-600 uppercase">
                  {selectedProduct.category}
                </span>
                <h3 className="font-extrabold text-base text-slate-900 mt-0.5">
                  {selectedProduct.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  {selectedProduct.description}
                </p>
              </div>
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-16 h-16 rounded-2xl object-cover shrink-0 ml-3"
              />
            </div>

            {/* Price & Quantity Selector */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
              <span className="font-black text-base text-slate-900">
                Rp {(selectedProduct.price * quantity).toLocaleString('id-ID')}
              </span>

              <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-1 text-slate-500 hover:text-slate-900 transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-sm text-slate-900 w-5 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-1 text-amber-600 hover:text-amber-700 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Special Instructions Notes Input */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Catatan Khusus (Opsional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Sambal dipisah, tidak pakai daun bawang..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleConfirmAddToCart}
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md transition"
              >
                Masukkan ke Keranjang
              </button>
              <button
                onClick={() => setSelectedProduct(null)}
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
