import React from 'react';
import { Home, ClipboardList, ShoppingCart, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface BottomNavProps {
  currentTab: 'home' | 'orders' | 'cart' | 'profile';
  onTabChange: (tab: 'home' | 'orders' | 'cart' | 'profile') => void;
  onOpenCart?: () => void;
}

export const ConsumerBottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange, onOpenCart }) => {
  const { cart, orders, theme } = useApp();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const activeOrdersCount = orders.filter((o) =>
    !['completed', 'cancelled'].includes(o.status)
  ).length;

  return (
    <nav className={`shrink-0 border-t px-4 py-2 flex items-center justify-around z-30 select-none shadow-lg backdrop-blur-md ${
      theme === 'dark' ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-200/80'
    }`}>
      {/* Home */}
      <button
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center gap-1 transition-colors ${
          currentTab === 'home' ? 'text-amber-600 font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Home className={`w-5 h-5 ${currentTab === 'home' ? 'stroke-[2.5]' : ''}`} />
        <span className="text-[10px]">Beranda</span>
      </button>

      {/* Orders */}
      <button
        onClick={() => onTabChange('orders')}
        className={`relative flex flex-col items-center gap-1 transition-colors ${
          currentTab === 'orders' ? 'text-amber-600 font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <div className="relative">
          <ClipboardList className={`w-5 h-5 ${currentTab === 'orders' ? 'stroke-[2.5]' : ''}`} />
          {activeOrdersCount > 0 && (
            <span className="absolute -top-1 -right-2 w-4 h-4 bg-amber-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
              {activeOrdersCount}
            </span>
          )}
        </div>
        <span className="text-[10px]">Pesanan</span>
      </button>

      {/* Cart */}
      <button
        onClick={() => {
          if (onOpenCart) onOpenCart();
          else onTabChange('cart');
        }}
        className={`relative flex flex-col items-center gap-1 transition-colors ${
          currentTab === 'cart' ? 'text-amber-600 font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <div className="relative">
          <ShoppingCart className={`w-5 h-5 ${currentTab === 'cart' ? 'stroke-[2.5]' : ''}`} />
          {totalCartCount > 0 && (
            <span className="absolute -top-1 -right-2 px-1.5 h-4 bg-orange-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
              {totalCartCount}
            </span>
          )}
        </div>
        <span className="text-[10px]">Keranjang</span>
      </button>

      {/* Profile */}
      <button
        onClick={() => onTabChange('profile')}
        className={`flex flex-col items-center gap-1 transition-colors ${
          currentTab === 'profile' ? 'text-amber-600 font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <User className={`w-5 h-5 ${currentTab === 'profile' ? 'stroke-[2.5]' : ''}`} />
        <span className="text-[10px]">Akun</span>
      </button>
    </nav>
  );
};
