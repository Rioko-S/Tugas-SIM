import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { X, ShieldCheck, Copy, Check, QrCode, CreditCard, Sparkles, AlertCircle } from 'lucide-react';

interface PaymentGatewayModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  order,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { simulatePaymentWebhook } = useApp();
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(890); // ~15 mins countdown

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const vaNumber = `8291 0812 3456 ${order.id.slice(-4)}`;

  const handleCopyVA = () => {
    navigator.clipboard.writeText(vaNumber.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTriggerWebhook = () => {
    setIsProcessing(true);
    setTimeout(() => {
      simulatePaymentWebhook(order.id);
      setIsProcessing(false);
      onSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header with Gateway Branding */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black text-sm shadow">
              AR
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-white">AntarRasa Pay Gateway</h3>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Enkripsi 256-bit
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Order ID: {order.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-800 text-sm">
          {/* Total Amount Box */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-amber-800 font-medium">Total Tagihan</span>
              <p className="text-2xl font-black text-amber-950 mt-0.5">
                Rp {order.total.toLocaleString('id-ID')}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-amber-700">Selesaikan Dalam</span>
              <p className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 mt-0.5">
                {formattedTime}
              </p>
            </div>
          </div>

          {/* Payment Method UI */}
          {order.paymentMethod === 'qris' ? (
            <div className="flex flex-col items-center bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-700">QRIS AntarRasa</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">NMID: ID10293847</span>
              </div>

              {/* Simulated QR Code Canvas Graphic */}
              <div className="relative p-3 bg-white rounded-2xl shadow-sm border border-slate-200 my-2">
                <div className="w-44 h-44 bg-slate-900 rounded-xl p-2 flex flex-col justify-between relative overflow-hidden">
                  {/* QR Grid pattern simulation */}
                  <div className="grid grid-cols-6 gap-1 w-full h-full p-1 opacity-90">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm ${
                          (i % 2 === 0 && i % 3 !== 0) || i === 0 || i === 5 || i === 30 || i === 14 || i === 21
                            ? 'bg-white'
                            : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                  {/* Center Badge */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-slate-950 text-xs shadow-md border-2 border-white">
                      QRIS
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-2 max-w-xs">
                Scan QR di atas menggunakan aplikasi BCA, Mandiri, GoPay, OVO, ShopeePay, atau DANA.
              </p>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Metode Pembayaran</span>
                <span className="font-bold uppercase text-slate-800">{order.paymentMethod.replace('_', ' ')}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Nomor Virtual Account</span>
                  <span className="font-mono font-bold text-base tracking-wide text-slate-900">{vaNumber}</span>
                </div>
                <button
                  onClick={handleCopyVA}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Webhook Verification Notice according to PRD section 8 */}
          <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-3 text-xs text-blue-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[11px]">Sesuai PRD Bab 8 (Aturan Pembayaran):</p>
              <p className="text-[11px] text-blue-800/90 leading-tight mt-0.5">
                Status order <code className="bg-blue-100 px-1 rounded font-mono">paid</code> diverifikasi melalui webhook resmi gateway yang bersifat <strong>idempotent</strong> untuk mencegah duplikasi pembayaran.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleTriggerWebhook}
            disabled={isProcessing}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Memverifikasi Webhook...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Simulasikan Webhook Bayar Sukses</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 font-semibold text-xs"
          >
            Nanti Saja
          </button>
        </div>
      </div>
    </div>
  );
};
