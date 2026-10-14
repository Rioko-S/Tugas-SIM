import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, Order, OrderStatus } from '../../types';
import {
  Store as StoreIcon,
  ShoppingBag,
  UtensilsCrossed,
  DollarSign,
  Star,
  Plus,
  CheckCircle2,
  Clock,
  Bike,
  AlertCircle,
  Eye,
  Trash2,
  Edit,
  Power,
  ArrowUpRight,
  Send,
  Building,
} from 'lucide-react';
import { RoleAccountModal } from '../common/RoleAccountModal';

export const StoreDashboard: React.FC = () => {
  const {
    currentUser,
    stores,
    products,
    orders,
    toggleStoreStatus,
    acceptOrder,
    startPreparingOrder,
    readyForPickupOrder,
    addProduct,
    updateProduct,
    deleteProduct,
    requestWithdrawal,
    ledger,
    withdrawals,
    activeCommissionScheme,
  } = useApp();

  // Find store owned by current user or default to store_1
  const store = stores.find((s) => s.ownerId === currentUser.id) || stores[0];
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'finance' | 'reviews'>('orders');

  // New Product Modal state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('Makanan Utama');
  const [prodPrice, setProdPrice] = useState(35000);
  const [prodStock, setProdStock] = useState(25);
  const [prodDesc, setProdDesc] = useState('');
  const [prodImage, setProdImage] = useState('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80');

  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [wdAmount, setWdAmount] = useState(250000);
  const [bankName, setBankName] = useState('Bank Mandiri');
  const [accNumber, setAccNumber] = useState('142-00-9921-881');
  const [accHolder, setAccHolder] = useState('Hendra Sinjay PT');

  // Filter store orders & products
  const storeOrders = orders.filter((o) => o.storeId === store.id);
  const storeProducts = products.filter((p) => p.storeId === store.id);

  // Store Wallet Calculation from ledger
  const storeLedger = ledger.filter((l) => l.userId === store.id || l.userId === currentUser.id || l.role === 'store_owner');
  const storeBalance = storeLedger.reduce((sum, l) => (l.type === 'credit' ? sum + l.amount : sum - l.amount), 450000);

  // Group incoming orders
  const newOrders = storeOrders.filter((o) => ['paid', 'placed'].includes(o.status));
  const preparingOrders = storeOrders.filter((o) => ['accepted', 'preparing'].includes(o.status));
  const readyOrders = storeOrders.filter((o) => ['ready_for_pickup', 'driver_assigned', 'picked_up', 'on_delivery'].includes(o.status));
  const completedOrders = storeOrders.filter((o) => o.status === 'completed');

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: prodName,
        category: prodCategory,
        price: Number(prodPrice),
        stock: Number(prodStock),
        description: prodDesc,
        image: prodImage,
      });
      setEditingProduct(null);
    } else {
      addProduct({
        storeId: store.id,
        name: prodName,
        category: prodCategory,
        price: Number(prodPrice),
        stock: Number(prodStock),
        description: prodDesc,
        image: prodImage,
        isAvailable: true,
      });
    }

    setShowAddProductModal(false);
    setProdName('');
    setProdDesc('');
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdCategory(p.category);
    setProdPrice(p.price);
    setProdStock(p.stock);
    setProdDesc(p.description);
    setProdImage(p.image);
    setShowAddProductModal(true);
  };

  const handleSubmitWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    if (wdAmount <= 0) return;
    const ok = requestWithdrawal('store_owner', Number(wdAmount), bankName, accNumber, accHolder);
    if (ok) {
      setShowWithdrawalModal(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
      {/* Store Header Banner */}
      <div className="bg-slate-900 text-white p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={store.logo}
              alt={store.name}
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-amber-400"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-sm text-white">{store.name}</h2>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.2 rounded font-semibold">
                  Mitra Merchant
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{store.address}</p>
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
              onClick={() => toggleStoreStatus(store.id)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-sm ${
                store.isOpen
                  ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                  : 'bg-rose-600 text-white hover:bg-rose-500'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{store.isOpen ? 'Buka' : 'Tutup'}</span>
            </button>
          </div>
        </div>

        {/* Quick Summary Cards */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800 text-center">
          <div className="bg-slate-800/80 p-2 rounded-xl">
            <span className="text-[10px] text-slate-400 block">Pesanan Aktif</span>
            <span className="font-extrabold text-sm text-amber-400">
              {newOrders.length + preparingOrders.length} Order
            </span>
          </div>
          <div className="bg-slate-800/80 p-2 rounded-xl">
            <span className="text-[10px] text-slate-400 block">Saldo Resto</span>
            <span className="font-extrabold text-sm text-emerald-400">
              Rp {storeBalance.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="bg-slate-800/80 p-2 rounded-xl">
            <span className="text-[10px] text-slate-400 block">Rating Resto</span>
            <span className="font-extrabold text-sm text-amber-300 flex items-center justify-center gap-0.5">
              <Star className="w-3 h-3 fill-amber-400" /> {store.rating}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white border-b border-slate-200 flex px-2 text-xs font-bold sticky top-0 z-20 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3 px-3 border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === 'orders' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-400'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Pesanan Masuk</span>
          {newOrders.length > 0 && (
            <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-black animate-pulse">
              {newOrders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('menu')}
          className={`py-3 px-3 border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === 'menu' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-400'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Menu & Stok ({storeProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('finance')}
          className={`py-3 px-3 border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === 'finance' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-400'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Keuangan & Saldo</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`py-3 px-3 border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === 'reviews' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-400'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Ulasan Pembeli</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-4 space-y-4 pb-20">
        {/* TAB 1: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* 1. Baru Masuk (Paid/Placed) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-xs text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  Pesanan Baru Masuk ({newOrders.length})
                </h3>
                <span className="text-[10px] text-slate-400">Harap segera konfirmasi</span>
              </div>

              {newOrders.length === 0 ? (
                <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                  Belum ada pesanan baru masuk saat ini.
                </div>
              ) : (
                newOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-2xl p-4 border border-rose-300 shadow-md space-y-3 ring-1 ring-rose-200"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 font-mono">{ord.id}</span>
                      <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                        Lunas ({ord.paymentMethod.toUpperCase()})
                      </span>
                    </div>

                    <div className="text-xs space-y-1">
                      <p className="font-semibold text-slate-800">
                        Pemesan: {ord.consumerName} ({ord.consumerPhone})
                      </p>
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 space-y-1">
                        {ord.items.map((it, i) => (
                          <div key={i} className="flex justify-between text-xs">
                            <span>
                              {it.quantity}x {it.name}
                            </span>
                            <span className="font-semibold">
                              Rp {(it.price * it.quantity).toLocaleString('id-ID')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => acceptOrder(ord.id)}
                        className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition"
                      >
                        Terima & Siapkan Pesanan &rarr;
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 2. Sedang Dimasak (Accepted / Preparing) */}
            <div className="space-y-2">
              <h3 className="font-black text-xs text-amber-700 uppercase tracking-wider">
                Sedang Diproses Dapur ({preparingOrders.length})
              </h3>

              {preparingOrders.length === 0 ? (
                <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                  Tidak ada pesanan yang sedang dimasak.
                </div>
              ) : (
                preparingOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-2xl p-4 border border-amber-300 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-xs text-slate-900 font-mono">{ord.id}</span>
                        <p className="text-[11px] text-slate-500">{ord.consumerName}</p>
                      </div>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                        {ord.status === 'accepted' ? 'Diterima Resto' : 'Sedang Dimasak'}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      {ord.items.map((it, i) => (
                        <div key={i} className="flex justify-between">
                          <span>
                            {it.quantity}x {it.name}
                          </span>
                          {it.notes && <span className="text-[10px] text-amber-700 italic">"{it.notes}"</span>}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      {ord.status === 'accepted' && (
                        <button
                          onClick={() => startPreparingOrder(ord.id)}
                          className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
                        >
                          Mulai Masak di Dapur
                        </button>
                      )}
                      <button
                        onClick={() => readyForPickupOrder(ord.id)}
                        className="flex-1 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                      >
                        <Bike className="w-3.5 h-3.5" />
                        <span>Siap Diambil & Auto-Assign Driver &rarr;</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 3. Siap Pickup / Menuju Driver (Ready / Driver Assigned) */}
            <div className="space-y-2">
              <h3 className="font-black text-xs text-emerald-700 uppercase tracking-wider">
                Siap Ambil & Dalam Pengantaran ({readyOrders.length})
              </h3>
              {readyOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white rounded-2xl p-3.5 border border-slate-200 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs font-mono">{ord.id}</span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full capitalize">
                      {ord.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 flex items-center justify-between">
                    <span>Driver: <strong>{ord.driverName || 'Menunggu Assign'}</strong></span>
                    <span>Plat: {ord.driverPlate || '-'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: MENU & PRODUCTS CRUD */}
        {activeTab === 'menu' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-xs text-slate-900">Katalog Menu Toko</h3>
                <p className="text-[11px] text-slate-500">Kelola harga, stok, dan ketersediaan menu</p>
              </div>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProdName('');
                  setProdDesc('');
                  setProdPrice(30000);
                  setProdStock(30);
                  setShowAddProductModal(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-sm hover:bg-amber-600 transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Menu
              </button>
            </div>

            <div className="space-y-2.5">
              {storeProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-sm flex items-center justify-between gap-3"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0 text-xs">
                    <h4 className="font-bold text-slate-900 truncate">{p.name}</h4>
                    <p className="text-amber-600 font-extrabold">
                      Rp {p.price.toLocaleString('id-ID')}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                      <span>Stok: <strong>{p.stock}</strong></span>
                      <span>•</span>
                      <span>Terjual: <strong>{p.salesCount}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      title="Edit Menu"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                      title="Hapus Menu"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: FINANCE & WITHDRAWAL */}
        {activeTab === 'finance' && (
          <div className="space-y-4">
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-5 shadow-lg border border-slate-700 space-y-3">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
                Saldo Tersedia Resto (Net Payout)
              </span>
              <h2 className="text-2xl font-black text-amber-400">
                Rp {storeBalance.toLocaleString('id-ID')}
              </h2>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800 text-slate-300">
                <span>Skema Potongan Platform: {activeCommissionScheme.percentage}%</span>
                <span className="text-emerald-400 font-bold">90% Bagian Resto</span>
              </div>

              <button
                onClick={() => setShowWithdrawalModal(true)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-md transition hover:from-amber-600 hover:to-orange-600"
              >
                Tarik Saldo ke Rekening Bank (Withdrawal) &rarr;
              </button>
            </div>

            {/* Mutasi Ledger Riwayat */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                Riwayat Mutasi Saldo & Ledger (PRD Section 16)
              </h4>

              <div className="space-y-2 text-xs divide-y divide-slate-100">
                {storeLedger.slice(0, 5).map((l) => (
                  <div key={l.id} className="pt-2 flex items-start justify-between">
                    <div>
                      <p className="font-bold text-slate-800 leading-tight">{l.description}</p>
                      <span className="text-[10px] text-slate-400">
                        {new Date(l.timestamp).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </div>
                    <span
                      className={`font-black ${
                        l.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {l.type === 'credit' ? '+' : '-'}Rp {l.amount.toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-3">
            <h3 className="font-extrabold text-xs text-slate-900">Ulasan & Rating dari Konsumen</h3>
            <div className="space-y-2.5">
              {completedOrders
                .filter((o) => o.review)
                .map((o) => (
                  <div
                    key={o.id}
                    className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{o.consumerName}</span>
                      <div className="flex text-amber-500">
                        {Array.from({ length: o.review?.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 italic">"{o.review?.comment}"</p>
                    <span className="text-[10px] text-slate-400 font-mono">Ref Order: {o.id}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-2xl">
            <h3 className="font-extrabold text-sm text-slate-900">
              {editingProduct ? 'Edit Menu' : 'Tambah Menu Baru'}
            </h3>
            <form onSubmit={handleSaveProduct} className="space-y-2.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Menu</label>
                <input
                  type="text"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="Contoh: Bebek Goreng Kremes Sambal Ijo"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Kategori</label>
                <input
                  type="text"
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Harga (Rp)</label>
                  <input
                    type="number"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Stok Porsi</label>
                  <input
                    type="number"
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Deskripsi & Bahan</label>
                <textarea
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Bebek empuk goreng rempah..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 resize-none h-16"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-600 transition"
                >
                  Simpan Menu
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="py-2.5 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Withdrawal Request Modal (PRD Section 11) */}
      {showWithdrawalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-2xl text-xs">
            <h3 className="font-extrabold text-sm text-slate-900">Pengajuan Pencairan Saldo (Withdrawal)</h3>
            <p className="text-slate-500 text-[11px]">
              Sesuai PRD Section 11: Permintaan penarikan akan diverifikasi dan disetujui admin sebelum ditransfer.
            </p>

            <form onSubmit={handleSubmitWithdrawal} className="space-y-2.5">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Jumlah Tarik Dana (Rp)</label>
                <input
                  type="number"
                  value={wdAmount}
                  onChange={(e) => setWdAmount(Number(e.target.value))}
                  max={storeBalance}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-sm"
                  required
                />
                <span className="text-[10px] text-slate-400">
                  Maksimal saldo: Rp {storeBalance.toLocaleString('id-ID')}
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Bank</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nomor Rekening</label>
                <input
                  type="text"
                  value={accNumber}
                  onChange={(e) => setAccNumber(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Atas Nama Pemilik</label>
                <input
                  type="text"
                  value={accHolder}
                  onChange={(e) => setAccHolder(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-600 transition"
                >
                  Ajukan Penarikan
                </button>
                <button
                  type="button"
                  onClick={() => setShowWithdrawalModal(false)}
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
