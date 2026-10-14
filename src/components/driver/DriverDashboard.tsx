import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, DeliveryProof } from '../../types';
import {
  Bike,
  Power,
  MapPin,
  Phone,
  Navigation,
  CheckCircle2,
  DollarSign,
  Camera,
  Star,
  Clock,
  ShieldCheck,
  AlertCircle,
  FileCheck,
  ArrowRight,
  Edit2,
  Check,
} from 'lucide-react';
import { RoleAccountModal } from '../common/RoleAccountModal';

export const DriverDashboard: React.FC = () => {
  const {
    currentDriver,
    toggleDriverAvailability,
    updateDriverPlate,
    orders,
    acceptDriverAssignment,
    pickupOrder,
    startDelivery,
    deliverOrder,
    requestWithdrawal,
    switchRole,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'deliveries' | 'wallet' | 'profile'>('deliveries');
  const [showAccountModal, setShowAccountModal] = useState(false);

  // Edit vehicle plate state
  const [editingPlate, setEditingPlate] = useState(false);
  const [newPlate, setNewPlate] = useState(currentDriver?.vehiclePlate || 'B 4192 SYZ');

  // Proof Modal state
  const [showProofModal, setShowProofModal] = useState(false);
  const [proofRecipient, setProofRecipient] = useState('');
  const [proofNotes, setProofNotes] = useState('Diserahkan langsung ke penerima');

  // Withdrawal Modal state
  const [showWdModal, setShowWdModal] = useState(false);
  const [wdAmount, setWdAmount] = useState(100000);
  const [wdBank, setWdBank] = useState('BCA');
  const [wdAccNumber, setWdAccNumber] = useState('8839-1102-39');
  const [wdAccHolder, setWdAccHolder] = useState(currentDriver?.name || 'Budi Santoso');

  // Find active assigned order for this driver
  const assignedOrder = orders.find(
    (o) =>
      o.driverId === currentDriver?.userId &&
      ['ready_for_pickup', 'driver_assigned', 'picked_up', 'on_delivery'].includes(o.status)
  );

  const completedTrips = orders.filter(
    (o) => o.driverId === currentDriver?.userId && ['delivered', 'completed'].includes(o.status)
  );

  const handleSavePlate = () => {
    if (!newPlate) return;
    updateDriverPlate(newPlate);
    setEditingPlate(false);
  };

  const handleConfirmDelivered = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignedOrder) return;

    const proof: DeliveryProof = {
      photoUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80',
      recipientName: proofRecipient || assignedOrder.consumerName,
      deliveredAt: new Date().toISOString(),
      notes: proofNotes,
    };

    deliverOrder(assignedOrder.id, proof);
    setShowProofModal(false);
  };

  const handleWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDriver) return;
    const ok = requestWithdrawal('driver', Number(wdAmount), wdBank, wdAccNumber, wdAccHolder);
    if (ok) setShowWdModal(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
      {/* Driver Top Banner */}
      <div className="bg-slate-900 text-white p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black ring-2 ring-emerald-400">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-extrabold text-sm text-white">{currentDriver?.name}</h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-semibold">
                  Driver Aktif
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{currentDriver?.vehicleType}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowAccountModal(true)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-[11px] border border-slate-700 transition shadow-sm flex items-center gap-1"
              title="Menu Akun & Ganti Role"
            >
              <span>Akun / Ganti Role</span>
            </button>
            <button
              onClick={() =>
                toggleDriverAvailability(currentDriver?.status === 'available' ? 'offline' : 'available')
              }
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-sm ${
                currentDriver?.status === 'available'
                  ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{currentDriver?.status === 'available' ? 'On-Bid' : 'Off-Bid'}</span>
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center text-xs">
          <div className="bg-slate-800/80 p-2 rounded-xl">
            <span className="text-[10px] text-slate-400 block">Saldo Dompet</span>
            <span className="font-extrabold text-emerald-400">
              Rp {currentDriver?.walletBalance.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="bg-slate-800/80 p-2 rounded-xl">
            <span className="text-[10px] text-slate-400 block">Trip Sukses</span>
            <span className="font-extrabold text-white">{currentDriver?.totalDeliveries} Antaran</span>
          </div>
          <div className="bg-slate-800/80 p-2 rounded-xl">
            <span className="text-[10px] text-slate-400 block">Rating Driver</span>
            <span className="font-extrabold text-amber-400 flex items-center justify-center gap-0.5">
              <Star className="w-3 h-3 fill-amber-400" /> {currentDriver?.rating}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 flex px-4 text-xs font-bold sticky top-0 z-20">
        <button
          onClick={() => setActiveTab('deliveries')}
          className={`py-3 flex-1 text-center border-b-2 transition ${
            activeTab === 'deliveries' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-400'
          }`}
        >
          Pengantaran Aktif
          {assignedOrder && (
            <span className="ml-1.5 px-1.5 py-0.2 bg-emerald-500 text-white rounded-full text-[10px] animate-pulse">
              1
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('wallet')}
          className={`py-3 flex-1 text-center border-b-2 transition ${
            activeTab === 'wallet' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-400'
          }`}
        >
          Saldo & Penarikan
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-3 flex-1 text-center border-b-2 transition ${
            activeTab === 'profile' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-400'
          }`}
        >
          Profil Kendaraan
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-4 space-y-4 pb-20">
        {activeTab === 'deliveries' && (
          <div className="space-y-4">
            {assignedOrder ? (
              <div className="bg-white rounded-3xl p-4 border-2 border-emerald-400 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="font-black text-xs text-slate-900 uppercase">
                      Penugasan Auto-Assign Masuk
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full capitalize">
                    {assignedOrder.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Step 1: Lokasi Resto */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-amber-600 uppercase flex items-center gap-1">
                    <Navigation className="w-3 h-3" /> Ambil di Resto:
                  </span>
                  <h4 className="font-bold text-sm text-slate-900">{assignedOrder.storeName}</h4>
                  <p className="text-xs text-slate-600">{assignedOrder.storeAddress}</p>

                  <div className="pt-2 border-t border-slate-200 text-xs text-slate-700">
                    <span className="font-bold block text-[11px] mb-1">Menu yang diambil:</span>
                    {assignedOrder.items.map((it, idx) => (
                      <p key={idx} className="text-[11px] text-slate-600">
                        • {it.quantity}x {it.name} {it.notes ? `(${it.notes})` : ''}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Step 2: Lokasi Konsumen */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-rose-600 uppercase flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Antar ke Pelanggan:
                  </span>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{assignedOrder.consumerName}</h4>
                      <p className="text-xs text-slate-600">{assignedOrder.deliveryAddress.fullAddress}</p>
                      {assignedOrder.deliveryAddress.notes && (
                        <p className="text-[11px] text-amber-700 italic mt-0.5">
                          Patokan: {assignedOrder.deliveryAddress.notes}
                        </p>
                      )}
                    </div>
                    <a
                      href={`tel:${assignedOrder.consumerPhone}`}
                      className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Ongkir Earning for Driver */}
                <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-emerald-800 font-bold">Pendapatan Ongkir Trip Ini:</span>
                  <span className="font-black text-emerald-950 text-sm">
                    Rp {assignedOrder.deliveryFee.toLocaleString('id-ID')}
                  </span>
                </div>

                {/* Lifecycle action buttons for Driver */}
                <div className="pt-1 space-y-2">
                  {assignedOrder.status === 'ready_for_pickup' || assignedOrder.status === 'driver_assigned' ? (
                    <button
                      onClick={() => pickupOrder(assignedOrder.id)}
                      className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Konfirmasi Ambil Makanan dari Resto &rarr;</span>
                    </button>
                  ) : assignedOrder.status === 'picked_up' ? (
                    <button
                      onClick={() => startDelivery(assignedOrder.id)}
                      className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                    >
                      <Bike className="w-4 h-4" />
                      <span>Mulai Perjalanan Antar ke Konsumen &rarr;</span>
                    </button>
                  ) : assignedOrder.status === 'on_delivery' ? (
                    <button
                      onClick={() => {
                        setProofRecipient(assignedOrder.consumerName);
                        setShowProofModal(true);
                      }}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-1.5"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Sampai di Lokasi & Upload Bukti Serah Terima &rarr;</span>
                    </button>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
                <Bike className="w-12 h-12 mx-auto text-slate-300" />
                <h4 className="font-bold text-sm text-slate-800">Menunggu Penugasan Order</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Status Anda: <strong className="text-emerald-600">{currentDriver?.status.toUpperCase()}</strong>.
                  Sistem akan otomatis mengarahkan pesanan ketika resto mitra mengklik "Siap Diambil".
                </p>
              </div>
            )}

            {/* Riwayat Antaran Selesai */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3">
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                Riwayat Pengantaran Selesai ({completedTrips.length})
              </h4>
              <div className="space-y-2 divide-y divide-slate-100 text-xs">
                {completedTrips.map((trip) => (
                  <div key={trip.id} className="pt-2 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">{trip.storeName}</p>
                      <span className="text-[10px] text-slate-400">Tujuan: {trip.consumerName}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-emerald-600 block">
                        +Rp {trip.deliveryFee.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[10px] text-slate-400">Selesai</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WALLET & WITHDRAWAL */}
        {activeTab === 'wallet' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-5 shadow-lg border border-slate-700 space-y-3">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
                Saldo Dompet Driver
              </span>
              <h2 className="text-2xl font-black text-emerald-400">
                Rp {currentDriver?.walletBalance.toLocaleString('id-ID')}
              </h2>
              <p className="text-xs text-slate-300">
                Ongkos kirim langsung masuk ke dompet Anda setiap kali pengantaran selesai dan divalidasi.
              </p>

              <button
                onClick={() => setShowWdModal(true)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-md transition hover:from-emerald-400 hover:to-teal-400"
              >
                Tarik Saldo ke Rekening Bank &rarr;
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: PROFILE & PLAT NOMOR */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider">
                Informasi Kendaraan & Identitas
              </h4>

              <div className="space-y-2.5">
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500">Nama Driver</span>
                  <span className="font-bold text-slate-800">{currentDriver?.name}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500">Jenis Kendaraan</span>
                  <span className="font-bold text-slate-800">{currentDriver?.vehicleType}</span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Nomor Plat Kendaraan</span>
                  {editingPlate ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={newPlate}
                        onChange={(e) => setNewPlate(e.target.value.toUpperCase())}
                        className="p-1 text-xs font-mono font-bold uppercase rounded border border-amber-400 w-28 text-center"
                      />
                      <button
                        onClick={handleSavePlate}
                        className="p-1 bg-emerald-600 text-white rounded"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-900">
                        {currentDriver?.vehiclePlate}
                      </span>
                      <button
                        onClick={() => setEditingPlate(true)}
                        className="text-amber-600 hover:underline"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Proof of Delivery Modal (PRD Section 5.4 & 6 step 11) */}
      {showProofModal && assignedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-2xl text-xs">
            <h3 className="font-extrabold text-sm text-slate-900">Upload Bukti Serah Terima Makanan</h3>
            <p className="text-slate-500 text-[11px]">
              Sesuai PRD Section 5.4: Foto serah terima dan nama penerima untuk verifikasi ke Konsumen & Ledger.
            </p>

            <form onSubmit={handleConfirmDelivered} className="space-y-3">
              {/* Simulated camera capture preview */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-36 bg-slate-100 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80"
                  alt="Bukti foto"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] px-2 py-0.5 rounded-full font-mono">
                  TERVERIFIKASI GPS & KAMERA
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Penerima Langsung</label>
                <input
                  type="text"
                  value={proofRecipient}
                  onChange={(e) => setProofRecipient(e.target.value)}
                  placeholder={assignedOrder.consumerName}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Catatan Serah Terima</label>
                <input
                  type="text"
                  value={proofNotes}
                  onChange={(e) => setProofNotes(e.target.value)}
                  placeholder="Diterima pemesan di depan teras..."
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl text-xs shadow-md transition"
                >
                  Selesaikan Pengantaran
                </button>
                <button
                  type="button"
                  onClick={() => setShowProofModal(false)}
                  className="py-2.5 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Driver Withdrawal Modal */}
      {showWdModal && currentDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-2xl text-xs">
            <h3 className="font-extrabold text-sm text-slate-900">Tarik Saldo Dompet Driver</h3>
            <form onSubmit={handleWithdrawal} className="space-y-2.5">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Jumlah Tarik Dana (Rp)</label>
                <input
                  type="number"
                  value={wdAmount}
                  onChange={(e) => setWdAmount(Number(e.target.value))}
                  max={currentDriver.walletBalance}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
                  required
                />
                <span className="text-[10px] text-slate-400">
                  Saldo tersedia: Rp {currentDriver.walletBalance.toLocaleString('id-ID')}
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Bank / E-Wallet</label>
                <input
                  type="text"
                  value={wdBank}
                  onChange={(e) => setWdBank(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nomor Rekening / No. HP</label>
                <input
                  type="text"
                  value={wdAccNumber}
                  onChange={(e) => setWdAccNumber(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 transition"
                >
                  Kirim Pengajuan
                </button>
                <button
                  type="button"
                  onClick={() => setShowWdModal(false)}
                  className="py-2.5 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Role Account Modal */}
      <RoleAccountModal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
      />
    </div>
  );
};
