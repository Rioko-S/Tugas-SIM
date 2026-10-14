import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import {
  ArrowLeft,
  Bike,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  Star,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Receipt,
  Store,
  HelpCircle,
} from 'lucide-react';
import { PaymentGatewayModal } from './PaymentGatewayModal';

interface OrderTrackingViewProps {
  order: Order;
  onBack: () => void;
  onOpenTicket?: (orderId: string) => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({ order, onBack, onOpenTicket }) => {
  const {
    switchRole,
    completeOrder,
    submitReview,
    cancelOrder,
    acceptOrder,
    startPreparingOrder,
    readyForPickupOrder,
    pickupOrder,
    startDelivery,
    deliverOrder,
    addDriverTip,
    theme,
  } = useApp();

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Status step index calculation
  const statusSteps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'pending_payment', label: 'Menunggu Bayar', desc: 'Selesaikan transaksi di gateway' },
    { key: 'paid', label: 'Lunas', desc: 'Webhook verifikasi berhasil' },
    { key: 'placed', label: 'Pesanan Masuk', desc: 'Diteruskan ke resto mitra' },
    { key: 'accepted', label: 'Diterima Resto', desc: 'Resto siap memproses' },
    { key: 'preparing', label: 'Sedang Dimasak', desc: 'Dapur menyiapkan hidangan' },
    { key: 'ready_for_pickup', label: 'Siap Diambil', desc: 'Makanan selesai dikemas' },
    { key: 'driver_assigned', label: 'Driver Ditugaskan', desc: 'Sistem auto-assign driver terdekat' },
    { key: 'picked_up', label: 'Pesanan Diambil', desc: 'Driver menuju lokasi resto' },
    { key: 'on_delivery', label: 'Dalam Pengantaran', desc: 'Driver menuju alamat Anda' },
    { key: 'delivered', label: 'Tiba di Tujuan', desc: 'Bukti serah terima terunggah' },
    { key: 'completed', label: 'Selesai', desc: 'Transaksi tuntas & komisi tercatat' },
  ];

  const currentStepIdx = statusSteps.findIndex((s) => s.key === order.status);

  // Quick simulation helper for tester to test flow immediately
  const handleQuickAdvance = () => {
    switch (order.status) {
      case 'pending_payment':
        setShowPaymentModal(true);
        break;
      case 'paid':
      case 'placed':
        acceptOrder(order.id);
        break;
      case 'accepted':
        startPreparingOrder(order.id);
        break;
      case 'preparing':
        readyForPickupOrder(order.id);
        break;
      case 'ready_for_pickup':
      case 'driver_assigned':
        pickupOrder(order.id);
        break;
      case 'picked_up':
        startDelivery(order.id);
        break;
      case 'on_delivery':
        deliverOrder(order.id, {
          photoUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80',
          recipientName: order.consumerName,
          deliveredAt: new Date().toISOString(),
          notes: 'Diterima langsung di teras depan',
        });
        break;
      case 'delivered':
        completeOrder(order.id);
        setShowReviewModal(true);
        break;
      default:
        break;
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReview(order.id, rating, reviewComment || 'Makanan enak dan sampai cepat!');
    setShowReviewModal(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
      {/* Top Bar */}
      <div className="bg-white px-4 py-3 border-b border-slate-200 sticky top-0 z-20 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-1.5 -ml-1 rounded-full text-slate-700 hover:bg-slate-100 transition flex items-center gap-1"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-xs font-semibold">Kembali</span>
        </button>

        <div className="text-center">
          <h2 className="font-bold text-sm text-slate-900 leading-tight">Lacak Pesanan</h2>
          <span className="text-[11px] text-slate-500 font-mono">{order.id}</span>
        </div>

        {onOpenTicket && (
          <button
            onClick={() => onOpenTicket(order.id)}
            title="Pusat Bantuan / CS"
            className="p-1.5 rounded-full text-amber-600 hover:bg-amber-50"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="p-4 space-y-4 max-w-lg mx-auto w-full pb-10">
        {/* Testing Shortcut Ribbon */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-3 text-white shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-black/20 px-1.5 py-0.5 rounded">
              Tester Fast-Forward
            </span>
            <p className="text-xs font-semibold mt-0.5">
              Status Saat Ini:{' '}
              <span className="underline decoration-white/60 capitalize font-bold">
                {order.status.replace(/_/g, ' ')}
              </span>
            </p>
          </div>
          {order.status !== 'completed' && order.status !== 'cancelled' ? (
            <button
              onClick={handleQuickAdvance}
              className="px-3 py-1.5 rounded-xl bg-white text-orange-600 font-bold text-xs shadow-sm hover:bg-orange-50 transition active:scale-95 shrink-0"
            >
              {order.status === 'pending_payment' ? 'Bayar Sekarang &rarr;' : 'Majukan Alur &rarr;'}
            </button>
          ) : (
            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">
              {order.status === 'completed' ? '✓ Tuntas' : '✗ Dibatalkan'}
            </span>
          )}
        </div>

        {/* Live Delivery Map Simulator */}
        <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-lg relative h-48 flex flex-col justify-between p-4">
          {/* Subtle Grid Map Graphics */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Road Path graphic */}
          <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-1.5 bg-slate-700/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-700"
              style={{
                width: `${
                  order.status === 'delivered' || order.status === 'completed'
                    ? 100
                    : order.status === 'on_delivery'
                    ? 70
                    : order.status === 'picked_up'
                    ? 45
                    : order.status === 'driver_assigned'
                    ? 25
                    : 5
                }%`,
              }}
            />
          </div>

          {/* Map Nodes */}
          {/* Node 1: Resto */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/30 ring-2 ring-white">
              <Store className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-amber-200 mt-1 line-clamp-1 max-w-[80px] text-center">
              {order.storeName}
            </span>
          </div>

          {/* Node 2: Driver animated icon along the line */}
          {['driver_assigned', 'picked_up', 'on_delivery'].includes(order.status) && (
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 -translate-x-1/2 z-10"
              style={{
                left:
                  order.status === 'on_delivery'
                    ? '65%'
                    : order.status === 'picked_up'
                    ? '40%'
                    : '22%',
              }}
            >
              <div className="w-11 h-11 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/50 ring-4 ring-emerald-300/40 animate-bounce">
                <Bike className="w-6 h-6" />
              </div>
            </div>
          )}

          {/* Node 3: Customer Location */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-black shadow-lg shadow-rose-500/30 ring-2 ring-white">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-rose-200 mt-1 text-center">
              Tujuan Anda
            </span>
          </div>

          {/* Map Top Floating Tag */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-200">
            <span className="bg-slate-800/90 backdrop-blur px-2.5 py-1 rounded-xl border border-slate-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {order.status === 'completed'
                  ? 'Pesanan Selesai'
                  : order.status === 'on_delivery'
                  ? 'Estimasi Tiba: 8 - 12 Menit'
                  : 'Proses Pesanan Berjalan'}
              </span>
            </span>

            <span className="bg-slate-800/90 backdrop-blur px-2.5 py-1 rounded-xl border border-slate-700 text-emerald-400 font-mono text-[11px]">
              Jarak: 1.8 km
            </span>
          </div>

          {/* Map Bottom Status Toast */}
          <div className="relative z-10 bg-slate-850/90 backdrop-blur p-2 rounded-xl border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
            <span className="font-semibold text-white">
              {order.statusHistory[order.statusHistory.length - 1]?.note || 'Menunggu pembaruan'}
            </span>
            <span className="text-[10px] text-slate-400">
              {order.statusHistory[order.statusHistory.length - 1]?.timestamp}
            </span>
          </div>
        </div>

        {/* Assigned Driver Card (If assigned) */}
        {order.driverName && (
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={order.driverAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
                alt={order.driverName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-slate-900">{order.driverName}</h4>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                    Mitra Driver
                  </span>
                </div>
                <p className="text-xs font-mono font-bold text-slate-700 mt-0.5">
                  {order.driverPlate || 'B 4192 SYZ'}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>4.9 (Driver Berpengalaman)</span>
                </div>
              </div>
            </div>

            <a
              href={`tel:${order.driverPhone}`}
              className="p-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-2xl transition flex items-center justify-center border border-emerald-200"
              title="Hubungi Driver"
            >
              <Phone className="w-5 h-5" />
            </a>
          </div>
        )}

        {/* Delivery Proof Card (When status is delivered or completed) */}
        {order.deliveryProof && (
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Bukti Serah Terima Pengantaran (Delivery Proof)</span>
            </div>
            <div className="flex gap-3 items-center bg-white p-2.5 rounded-xl border border-emerald-200">
              {order.deliveryProof.photoUrl && (
                <img
                  src={order.deliveryProof.photoUrl}
                  alt="Bukti Pengantaran"
                  className="w-16 h-16 rounded-lg object-cover border border-slate-200"
                />
              )}
              <div className="text-xs space-y-0.5 text-slate-700">
                <p>
                  <strong>Penerima:</strong> {order.deliveryProof.recipientName || order.consumerName}
                </p>
                <p className="text-[11px] text-slate-500">
                  Waktu:{' '}
                  {new Date(order.deliveryProof.deliveredAt).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                {order.deliveryProof.notes && (
                  <p className="text-[11px] italic text-slate-600">Catatan: {order.deliveryProof.notes}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Order Lifecycle Progress Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center justify-between">
            <span>Riwayat Status Sesuai PRD</span>
            <span className="text-[10px] text-slate-400">{order.statusHistory.length} Tahap</span>
          </h3>

          <div className="space-y-3">
            {order.statusHistory.map((hist, idx) => (
              <div key={idx} className="flex items-start gap-3 relative">
                {idx !== order.statusHistory.length - 1 && (
                  <div className="absolute left-2.5 top-5 bottom-0 w-0.5 bg-slate-200" />
                )}
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 z-10">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 capitalize">
                      {hist.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400">{hist.timestamp}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">{hist.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Item Details and Pricing Breakdown */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
            Rincian Pesanan ({order.items.length} Menu)
          </h3>

          <div className="divide-y divide-slate-100">
            {order.items.map((item, i) => (
              <div key={i} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                  <div>
                    <h5 className="font-bold text-slate-900 leading-tight">{item.name}</h5>
                    <span className="text-[11px] text-slate-500">
                      {item.quantity}x @ Rp {item.price.toLocaleString('id-ID')}
                    </span>
                    {item.notes && <p className="text-[10px] text-amber-700 italic">"{item.notes}"</p>}
                  </div>
                </div>
                <span className="font-bold text-slate-800">
                  Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>

          {/* Price Calculation breakdown matching PRD */}
          <div className="pt-2 border-t border-slate-200 space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal Makanan</span>
              <span>Rp {order.subtotal.toLocaleString('id-ID')}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Diskon Promo</span>
                <span>-Rp {order.discount.toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Ongkos Kirim</span>
              <span>Rp {order.deliveryFee.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span>Biaya Layanan Aplikasi</span>
              <span>Rp {order.serviceFee.toLocaleString('id-ID')}</span>
            </div>
            {order.driverTip && order.driverTip > 0 ? (
              <div className="flex justify-between text-amber-700 font-bold">
                <span>Tips Driver</span>
                <span>+Rp {order.driverTip.toLocaleString('id-ID')}</span>
              </div>
            ) : null}
            <div className="flex justify-between pt-2 border-t border-slate-200 font-black text-sm text-slate-900">
              <span>Total Pembayaran</span>
              <span className="text-amber-600">Rp {order.total.toLocaleString('id-ID')}</span>
            </div>

            {/* Commission Scheme Tag (Auditability) */}
            <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Skema Komisi: {order.commissionScheme.percentage}%</span>
              <span>Bagi Hasil Resto: Rp {order.commissionScheme.storeShare.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        {/* Opsi Pemberian Tips Driver pada Layar Pelacakan */}
        {['driver_assigned', 'picked_up', 'on_delivery', 'delivered', 'completed'].includes(order.status) && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-850 border border-amber-200 dark:border-slate-700 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <Bike className="w-4 h-4 text-amber-600" />
                <span>Tips Mitra Driver ({order.driverName || 'Kurir Antar'})</span>
              </span>
              {order.driverTip && order.driverTip > 0 ? (
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                  Terpasang Rp {order.driverTip.toLocaleString('id-ID')}
                </span>
              ) : null}
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Apresiasi perjalanan pengantaran driver Anda. 100% nominal tips langsung masuk ke saldo driver:
            </p>
            <div className="flex gap-2">
              {[2000, 5000, 10000].map((tip) => (
                <button
                  key={tip}
                  type="button"
                  onClick={() => addDriverTip(order.id, tip)}
                  className="flex-1 py-1.5 px-2 bg-white dark:bg-slate-700 hover:bg-amber-100 dark:hover:bg-slate-600 border border-amber-300 dark:border-slate-600 rounded-xl font-bold text-xs text-slate-800 dark:text-slate-100 transition active:scale-95 shadow-sm text-center"
                >
                  +Rp {tip.toLocaleString('id-ID')}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Existing Review or Review Button */}
        {order.review ? (
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900">Ulasan Anda</span>
              <div className="flex text-amber-500">
                {Array.from({ length: order.review.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                ))}
              </div>
            </div>
            <p className="text-xs text-slate-700 italic mt-1.5">"{order.review.comment}"</p>
          </div>
        ) : order.status === 'delivered' ? (
          <div className="space-y-2">
            <button
              onClick={() => {
                completeOrder(order.id);
                setShowReviewModal(true);
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-md hover:from-emerald-700 hover:to-teal-700 transition"
            >
              Konfirmasi Pesanan Diterima & Beri Ulasan
            </button>
          </div>
        ) : null}

        {/* Cancel Button (allowed only before store processes per PRD 5.3) */}
        {['pending_payment', 'paid', 'placed'].includes(order.status) && (
          <button
            onClick={() => {
              const reason = prompt('Masukkan alasan pembatalan pesanan:') || 'Ingin mengganti menu';
              cancelOrder(order.id, reason);
            }}
            className="w-full py-2.5 rounded-2xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 font-semibold text-xs transition"
          >
            Batalkan Pesanan Sebelum Diproses Resto
          </button>
        )}
      </div>

      {/* Payment Gateway Modal */}
      {showPaymentModal && (
        <PaymentGatewayModal
          order={order}
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => setShowPaymentModal(false)}
        />
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-slate-900">Bagaimana Makanan & Pengantaran?</h3>
              <p className="text-xs text-slate-500">Berikan bintang dan ulasan untuk resto & driver</p>
            </div>

            <div className="flex justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  className="p-1 transition transform hover:scale-125"
                >
                  <Star
                    className={`w-8 h-8 ${
                      s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Ceritakan rasa makanan, porsi, dan keramahan driver..."
              className="w-full text-xs p-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none h-24"
            />

            <div className="flex gap-2">
              <button
                onClick={handleReviewSubmit}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition shadow-md"
              >
                Kirim Ulasan
              </button>
              <button
                onClick={() => setShowReviewModal(false)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Lewati
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
