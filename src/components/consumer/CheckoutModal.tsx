import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import {
  X,
  MapPin,
  Tag,
  CreditCard,
  QrCode,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  Percent,
  Plus,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderCreated,
}) => {
  const {
    cart,
    cartStoreId,
    stores,
    addresses,
    selectedAddress,
    setSelectedAddress,
    addAddress,
    promotions,
    createOrder,
    theme,
    defaultDriverTip,
  } = useApp();

  const [promoCode, setPromoCode] = useState('ANTARHEMAT');
  const [promoApplied, setPromoApplied] = useState(true);
  const [driverTip, setDriverTip] = useState<number>(defaultDriverTip);
  const [customTipActive, setCustomTipActive] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    'qris' | 'gopay' | 'ovo' | 'shopeepay' | 'bca_va' | 'mandiri_va'
  >('qris');
  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const [newAddressLabel, setNewAddressLabel] = useState('');
  const [newAddressText, setNewAddressText] = useState('');
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);

  if (!isOpen) return null;

  const currentStore = stores.find((s) => s.id === cartStoreId);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Calculate discount
  let discount = 0;
  if (promoApplied && promoCode) {
    const promo = promotions.find((p) => p.code.toUpperCase() === promoCode.toUpperCase() && p.isActive);
    if (promo && subtotal >= promo.minOrder) {
      if (promo.discountPercent > 0) {
        discount = Math.min((subtotal * promo.discountPercent) / 100, promo.maxDiscount);
      } else {
        discount = promo.maxDiscount;
      }
    }
  }

  const deliveryFee = 10000;
  const serviceFee = 2000;
  const total = Math.max(0, subtotal - discount + deliveryFee + serviceFee + driverTip);

  const handleApplyPromo = () => {
    const promo = promotions.find((p) => p.code.toUpperCase() === promoCode.trim().toUpperCase() && p.isActive);
    if (!promo) {
      alert('Kode promo tidak valid atau telah berakhir.');
      setPromoApplied(false);
      return;
    }
    if (subtotal < promo.minOrder) {
      alert(`Minimum pesanan untuk promo ini adalah Rp ${promo.minOrder.toLocaleString('id-ID')}`);
      setPromoApplied(false);
      return;
    }
    setPromoApplied(true);
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressLabel || !newAddressText) return;
    addAddress({
      userId: 'user_consumer_1',
      label: newAddressLabel,
      recipientName: selectedAddress.recipientName,
      phone: selectedAddress.phone,
      fullAddress: newAddressText,
      notes: 'Alamat baru',
      isDefault: false,
      lat: -6.2,
      lng: 106.8,
    });
    setShowAddAddressForm(false);
    setNewAddressLabel('');
    setNewAddressText('');
  };

  const handleCheckoutSubmit = () => {
    const newOrder = createOrder(paymentMethod, promoApplied ? promoCode : undefined, driverTip);
    if (newOrder) {
      onOrderCreated(newOrder);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className={`w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden ${
        theme === 'dark' ? 'bg-slate-900 text-slate-100 border border-slate-800' : 'bg-white text-slate-800'
      }`}>
        {/* Header */}
        <div className={`px-5 py-3.5 border-b flex items-center justify-between ${
          theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
        }`}>
          <h3 className={`font-extrabold text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Konfirmasi Pemesanan</h3>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-slate-700">
          {/* 1. Alamat Pengantaran */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-600" /> Alamat Pengantaran
              </span>
              <button
                onClick={() => setShowAddressPicker(!showAddressPicker)}
                className="text-amber-700 font-bold hover:underline"
              >
                Ganti Alamat
              </button>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <span>{selectedAddress.label}</span>
                <span className="text-slate-400 font-normal">| {selectedAddress.recipientName} ({selectedAddress.phone})</span>
              </div>
              <p className="text-slate-600 mt-1 line-clamp-2">{selectedAddress.fullAddress}</p>
              {selectedAddress.notes && (
                <p className="text-[11px] text-amber-700 italic mt-0.5">Catatan: {selectedAddress.notes}</p>
              )}
            </div>

            {/* Address Picker Dropdown / Form */}
            {showAddressPicker && (
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <p className="font-bold text-[11px] text-slate-500">Pilih Alamat Tersimpan:</p>
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => {
                      setSelectedAddress(addr);
                      setShowAddressPicker(false);
                    }}
                    className={`p-2 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition ${
                      selectedAddress.id === addr.id
                        ? 'bg-amber-50 border-amber-400 font-bold'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-slate-800">{addr.label}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{addr.fullAddress}</p>
                    </div>
                    {selectedAddress.id === addr.id && (
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 ml-2" />
                    )}
                  </div>
                ))}

                {!showAddAddressForm ? (
                  <button
                    onClick={() => setShowAddAddressForm(true)}
                    className="w-full py-1.5 rounded-xl bg-white border border-dashed border-amber-400 text-amber-700 font-bold text-xs flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Alamat Baru
                  </button>
                ) : (
                  <form onSubmit={handleSaveNewAddress} className="space-y-2 bg-white p-2.5 rounded-xl border border-slate-200">
                    <input
                      type="text"
                      placeholder="Label (misal: Kosan, Apartemen)"
                      value={newAddressLabel}
                      onChange={(e) => setNewAddressLabel(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-200"
                    />
                    <textarea
                      placeholder="Alamat lengkap..."
                      value={newAddressText}
                      onChange={(e) => setNewAddressText(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-200 resize-none h-14"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
                      >
                        Simpan
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddAddressForm(false)}
                        className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs"
                      >
                        Batal
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* 2. Ringkasan Pesanan Resto */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span>{currentStore?.name}</span>
              <span className="text-[11px] text-slate-500">{cart.length} Menu</span>
            </div>
            <div className="divide-y divide-slate-200 text-xs">
              {cart.map((c) => (
                <div key={c.productId} className="py-1.5 flex justify-between">
                  <span>
                    {c.quantity}x {c.name}
                  </span>
                  <span className="font-semibold">
                    Rp {(c.price * c.quantity).toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Promo Voucher Input */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-amber-600" /> Voucher & Kode Promo
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => {
                  setPromoCode(e.target.value.toUpperCase());
                  setPromoApplied(false);
                }}
                placeholder="Masukkan kode promo (misal: ANTARHEMAT)"
                className="flex-1 bg-white p-2 rounded-xl border border-slate-200 text-xs font-mono uppercase focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs"
              >
                {promoApplied ? 'Terpasang' : 'Terapkan'}
              </button>
            </div>
            {promoApplied && discount > 0 && (
              <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Berhasil hemat Rp {discount.toLocaleString('id-ID')}!
              </p>
            )}
          </div>

          {/* 4. Metode Pembayaran (Sesuai PRD Section 1) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-amber-600" /> Metode Pembayaran
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'qris', name: 'QRIS AntarRasa', badge: 'Instan' },
                { id: 'gopay', name: 'GoPay', badge: 'E-Wallet' },
                { id: 'ovo', name: 'OVO', badge: 'E-Wallet' },
                { id: 'shopeepay', name: 'ShopeePay', badge: 'E-Wallet' },
                { id: 'bca_va', name: 'BCA Virtual Account', badge: 'VA' },
                { id: 'mandiri_va', name: 'Mandiri VA', badge: 'VA' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition ${
                    paymentMethod === m.id
                      ? 'bg-amber-500/10 border-amber-500 font-bold ring-1 ring-amber-500'
                      : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-[11px] text-slate-900">{m.name}</span>
                    <span className="text-[9px] bg-slate-100 text-slate-600 px-1 py-0.2 rounded font-mono">
                      {m.badge}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 5. Tips untuk Driver */}
          <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-transparent border border-amber-300/80 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <span>🛵 Apresiasi & Tips untuk Driver</span>
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                100% untuk Driver
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">
              Bantu berikan semangat bagi driver yang mengantarkan makanan Anda dengan aman dan tepat waktu.
            </p>

            {/* Tip Preset Buttons */}
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { amount: 0, label: 'Tanpa Tips' },
                { amount: 2000, label: 'Rp 2.000' },
                { amount: 5000, label: 'Rp 5.000' },
                { amount: 10000, label: 'Rp 10.000' },
              ].map((tip) => (
                <button
                  key={tip.amount}
                  type="button"
                  onClick={() => {
                    setDriverTip(tip.amount);
                    setCustomTipActive(false);
                  }}
                  className={`py-2 px-1 rounded-xl text-center text-xs font-bold transition border ${
                    !customTipActive && driverTip === tip.amount
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="block text-[11px]">{tip.label}</span>
                </button>
              ))}
            </div>

            {/* Optional larger tips & custom */}
            <div className="flex gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={() => {
                  setDriverTip(20000);
                  setCustomTipActive(false);
                }}
                className={`flex-1 py-1.5 rounded-xl text-center text-xs font-bold transition border ${
                  !customTipActive && driverTip === 20000
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Rp 20.000 (Spesial)
              </button>
              <button
                type="button"
                onClick={() => setCustomTipActive(!customTipActive)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                  customTipActive
                    ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                Nominal Lain
              </button>
            </div>

            {customTipActive && (
              <div className="flex items-center gap-2 pt-1 animate-in fade-in">
                <span className="font-bold text-xs text-slate-600">Rp</span>
                <input
                  type="number"
                  step="1000"
                  min="0"
                  value={driverTip}
                  onChange={(e) => setDriverTip(Math.max(0, Number(e.target.value)))}
                  placeholder="Ketik nominal tips kustom..."
                  className="flex-1 bg-white p-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            )}
          </div>

          {/* 6. Rincian Biaya */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-2">
            <h4 className="font-bold text-slate-900 text-xs">Rincian Pembayaran</h4>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal Pesanan</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Diskon Promo ({promoCode})</span>
                  <span>-Rp {discount.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Ongkos Kirim (Flat 2-3km)</span>
                <span>Rp {deliveryFee.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Layanan Platform</span>
                <span>Rp {serviceFee.toLocaleString('id-ID')}</span>
              </div>
              {driverTip > 0 && (
                <div className="flex justify-between text-amber-700 font-bold">
                  <span>Tips Driver (100% Driver)</span>
                  <span>+Rp {driverTip.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-slate-200 font-black text-sm text-slate-900">
                <span>Total Tagihan</span>
                <span className="text-amber-600">Rp {total.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Submit Button */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <button
            onClick={handleCheckoutSubmit}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition active:scale-98"
          >
            <span>Bayar Sekarang (Rp {total.toLocaleString('id-ID')})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
