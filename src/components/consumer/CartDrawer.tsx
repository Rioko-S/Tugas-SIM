import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onProceedToCheckout }) => {
  const { cart, updateCartQty, removeFromCart, clearCart, stores, cartStoreId } = useApp();

  if (!isOpen) return null;

  const currentStore = stores.find((s) => s.id === cartStoreId);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Keranjang Belanja</h3>
              {currentStore && (
                <p className="text-[11px] text-slate-500 line-clamp-1">{currentStore.name}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-slate-400 hover:text-rose-600 p-1 transition"
                title="Kosongkan Keranjang"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 divide-y divide-slate-100">
          {cart.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <ShoppingBag className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
              <p className="text-xs font-semibold">Keranjang masih kosong</p>
              <p className="text-[11px] text-slate-400">Pilih menu favorit Anda dan tambahkan ke sini.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.productId} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 leading-tight line-clamp-1">
                      {item.name}
                    </h4>
                    <span className="text-[11px] font-semibold text-slate-700">
                      Rp {item.price.toLocaleString('id-ID')}
                    </span>
                    {item.notes && (
                      <p className="text-[10px] text-amber-700 italic line-clamp-1">"{item.notes}"</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 px-2 py-1 rounded-xl">
                  <button
                    onClick={() => updateCartQty(item.productId, item.quantity - 1)}
                    className="p-0.5 text-slate-600 hover:text-slate-900"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-bold text-xs w-4 text-center text-slate-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQty(item.productId, item.quantity + 1)}
                    className="p-0.5 text-amber-700 hover:text-amber-800"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>Subtotal</span>
              <span className="text-sm font-black text-slate-950">
                Rp {subtotal.toLocaleString('id-ID')}
              </span>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition active:scale-98"
            >
              <span>Lanjut ke Pembayaran</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
