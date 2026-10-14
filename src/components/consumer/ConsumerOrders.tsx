import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  ChevronRight,
  Store,
  Bike,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

interface ConsumerOrdersProps {
  onSelectOrder: (order: Order) => void;
  onOpenStore: (storeId: string) => void;
}

export const ConsumerOrders: React.FC<ConsumerOrdersProps> = ({ onSelectOrder, onOpenStore }) => {
  const { orders, theme } = useApp();
  const [tab, setTab] = useState<'active' | 'history'>('active');

  const activeOrders = orders.filter((o) => !['completed', 'cancelled'].includes(o.status));
  const historyOrders = orders.filter((o) => ['completed', 'cancelled'].includes(o.status));

  const displayOrders = tab === 'active' ? activeOrders : historyOrders;

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending_payment':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Menunggu Bayar</span>;
      case 'paid':
      case 'placed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">Pesanan Masuk</span>;
      case 'accepted':
      case 'preparing':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">Sedang Dimasak</span>;
      case 'ready_for_pickup':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">Siap Pickup</span>;
      case 'driver_assigned':
      case 'picked_up':
      case 'on_delivery':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 animate-pulse">Diantar Driver</span>;
      case 'delivered':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">Tiba di Tujuan</span>;
      case 'completed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">Selesai</span>;
      case 'cancelled':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">Dibatalkan</span>;
    }
  };

  return (
    <div className={`flex-1 flex flex-col overflow-y-auto ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      {/* Header */}
      <div className={`px-4 py-3 border-b sticky top-0 z-10 flex items-center justify-between ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <h2 className="font-extrabold text-base">Riwayat Pesanan</h2>
        <span className="text-xs text-slate-400 font-semibold">{orders.length} Transaksi</span>
      </div>

      {/* Tabs */}
      <div className={`px-4 pt-1 border-b flex gap-4 text-xs font-bold ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <button
          onClick={() => setTab('active')}
          className={`pb-2.5 relative transition ${
            tab === 'active' ? 'text-amber-500' : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <span>Pesanan Berjalan ({activeOrders.length})</span>
          {tab === 'active' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-500" />}
        </button>

        <button
          onClick={() => setTab('history')}
          className={`pb-2.5 relative transition ${
            tab === 'history' ? 'text-amber-500' : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <span>Selesai & Riwayat ({historyOrders.length})</span>
          {tab === 'history' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-500" />}
        </button>
      </div>

      {/* Orders List */}
      <div className="p-4 space-y-3 pb-20">
        {displayOrders.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className={`w-16 h-16 mx-auto rounded-3xl flex items-center justify-center ${
              theme === 'dark' ? 'bg-slate-800 text-slate-500' : 'bg-amber-100/60 text-amber-600'
            }`}>
              <ClipboardList className="w-8 h-8 stroke-[1.5]" />
            </div>
            <div>
              <p className={`text-sm font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                {tab === 'active' ? 'Belum Ada Pesanan Berjalan' : 'Belum Ada Riwayat Pesanan'}
              </p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                Daftar pesanan Anda masih kosong. Silakan jelajahi resto kuliner pilihan di Beranda dan buat pesanan pertama Anda!
              </p>
            </div>
          </div>
        ) : (
          displayOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => onSelectOrder(order)}
              className={`rounded-2xl p-4 border shadow-sm hover:border-amber-400 transition cursor-pointer space-y-3 ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-800 hover:border-amber-400'
                  : 'bg-white border-slate-200/90'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs leading-tight">{order.storeName}</h4>
                    <span className="text-[10px] text-slate-400">{order.id}</span>
                  </div>
                </div>
                {getStatusBadge(order.status)}
              </div>

              {/* Items Summary */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                {order.items.slice(0, 2).map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="line-clamp-1">
                      {it.quantity}x {it.name}
                    </span>
                    <span className="text-slate-700 font-semibold shrink-0">
                      Rp {(it.price * it.quantity).toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
                {order.items.length > 2 && (
                  <p className="text-[10px] text-slate-400 italic">
                    +{order.items.length - 2} menu lainnya...
                  </p>
                )}
              </div>

              {/* Footer Total & Action */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-[10px] text-slate-400 block">Total Pembayaran</span>
                  <span className="font-extrabold text-sm text-slate-900">
                    Rp {order.total.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700">
                  <span>Lihat Detail</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
