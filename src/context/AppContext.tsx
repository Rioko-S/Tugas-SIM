import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  User,
  Store,
  Product,
  Address,
  CartItem,
  CommissionScheme,
  DriverProfile,
  Order,
  OrderStatus,
  LedgerEntry,
  WithdrawalRequest,
  SupportTicket,
  Promotion,
  BroadcastMessage,
  AuditLog,
  DeliveryProof,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_STORES,
  INITIAL_PRODUCTS,
  INITIAL_ADDRESSES,
  INITIAL_DRIVERS,
  INITIAL_COMMISSION_SCHEMES,
  INITIAL_PROMOTIONS,
  INITIAL_ORDERS,
  INITIAL_LEDGER,
  INITIAL_WITHDRAWALS,
  INITIAL_TICKETS,
  INITIAL_BROADCASTS,
  INITIAL_AUDIT_LOGS,
} from '../data/initialData';

interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  roleTag?: Role;
  timestamp: string;
}

interface AppContextType {
  // Authentication & Current user
  isAuthenticated: boolean;
  currentUser: User;
  currentRole: Role;
  switchRole: (role: Role) => void;
  users: User[];
  login: (emailOrPhone: string, password?: string) => { success: boolean; error?: string };
  register: (data: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    role: Role;
    storeName?: string;
  }) => { success: boolean; error?: string };
  logout: () => void;
  quickLogin: (role: Role) => void;

  // Entities
  stores: Store[];
  products: Product[];
  addresses: Address[];
  selectedAddress: Address;
  setSelectedAddress: (addr: Address) => void;
  addAddress: (addr: Omit<Address, 'id'>) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, notes?: string) => void;
  updateCartQty: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartStoreId: string | null;

  // Orders & Lifecycle
  orders: Order[];
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  defaultDriverTip: number;
  setDefaultDriverTip: (tip: number) => void;
  addDriverTip: (orderId: string, tipAmount: number) => void;
  createOrder: (
    paymentMethod: 'qris' | 'gopay' | 'ovo' | 'shopeepay' | 'bca_va' | 'mandiri_va',
    promoCode?: string,
    driverTip?: number
  ) => Order | null;
  simulatePaymentWebhook: (orderId: string) => void;
  cancelOrder: (orderId: string, reason: string) => void;
  completeOrder: (orderId: string) => void;
  submitReview: (orderId: string, rating: number, comment: string) => void;

  // Store actions
  toggleStoreStatus: (storeId: string) => void;
  acceptOrder: (orderId: string) => void;
  startPreparingOrder: (orderId: string) => void;
  readyForPickupOrder: (orderId: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'salesCount'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Driver actions
  drivers: DriverProfile[];
  currentDriver: DriverProfile | undefined;
  toggleDriverAvailability: (status: 'available' | 'busy' | 'offline') => void;
  updateDriverPlate: (plate: string) => void;
  acceptDriverAssignment: (orderId: string) => void;
  pickupOrder: (orderId: string) => void;
  startDelivery: (orderId: string) => void;
  deliverOrder: (orderId: string, proof: DeliveryProof) => void;
  requestWithdrawal: (
    role: 'driver' | 'store_owner',
    amount: number,
    bankName: string,
    accountNumber: string,
    accountHolder: string
  ) => boolean;

  // Admin & Financial
  commissionSchemes: CommissionScheme[];
  activeCommissionScheme: CommissionScheme;
  setActiveCommissionScheme: (schemeId: string) => void;
  createCommissionScheme: (name: string, percentage: number, description: string) => void;
  ledger: LedgerEntry[];
  withdrawals: WithdrawalRequest[];
  approveWithdrawal: (id: string, approve: boolean, notes?: string) => void;
  markWithdrawalPaid: (id: string) => void;
  verifyStore: (storeId: string, approve: boolean) => void;
  verifyDriver: (driverId: string, approve: boolean) => void;
  suspendUser: (userId: string, suspend: boolean) => void;

  // CS & Tickets
  tickets: SupportTicket[];
  createTicket: (subject: string, category: 'pesanan' | 'pembayaran' | 'driver' | 'aplikasi', initialMessage: string, orderId?: string) => void;
  replyTicket: (ticketId: string, message: string) => void;

  // Promotions & Broadcasts
  promotions: Promotion[];
  broadcasts: BroadcastMessage[];
  createBroadcast: (title: string, content: string, targetRole: 'all' | 'consumer' | 'store_owner' | 'driver') => void;
  createPromotion: (promo: Omit<Promotion, 'id' | 'isActive'>) => void;

  // Owner & System
  auditLogs: AuditLog[];
  categories: string[];
  addCategory: (cat: string) => void;

  // Notifications
  toasts: ToastNotification[];
  dismissToast: (id: string) => void;
  addToast: (title: string, message: string, type?: ToastNotification['type'], roleTag?: Role) => void;

  // UI & Theme state
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  deviceFrame: 'mobile' | 'fluid';
  setDeviceFrame: (frame: 'mobile' | 'fluid') => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'antarrasa_v4_clean_store';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('antarrasa_theme');
      return (saved as 'light' | 'dark') || 'light';
    } catch {
      return 'light';
    }
  });

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('antarrasa_theme', next);
      } catch {}
      return next;
    });
  };

  // Default driver tip preference (persisted in localStorage)
  const [defaultDriverTip, setDefaultDriverTipState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('antarrasa_default_driver_tip');
      return saved !== null ? Number(saved) : 5000;
    } catch {
      return 5000;
    }
  });

  const setDefaultDriverTip = (tip: number) => {
    setDefaultDriverTipState(tip);
    try {
      localStorage.setItem('antarrasa_default_driver_tip', String(tip));
    } catch {}
  };

  // Load initial from localStorage or defaults
  const loadStored = <T,>(key: string, defaultVal: T): T => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_${key}`);
      return saved ? JSON.parse(saved) : defaultVal;
    } catch {
      return defaultVal;
    }
  };

  const [currentRole, setCurrentRole] = useState<Role>('consumer');
  const [users, setUsers] = useState<User[]>(() => loadStored('users', INITIAL_USERS));
  const [stores, setStores] = useState<Store[]>(() => loadStored('stores', INITIAL_STORES));
  const [products, setProducts] = useState<Product[]>(() => loadStored('products', INITIAL_PRODUCTS));
  const [addresses, setAddresses] = useState<Address[]>(() => loadStored('addresses', INITIAL_ADDRESSES));
  const [selectedAddress, setSelectedAddress] = useState<Address>(() => addresses[0] || INITIAL_ADDRESSES[0]);
  const [drivers, setDrivers] = useState<DriverProfile[]>(() => loadStored('drivers', INITIAL_DRIVERS));
  const [cart, setCart] = useState<CartItem[]>(() => loadStored('cart', []));
  
  // Empty orders list without dummy data per user request
  const [orders, setOrders] = useState<Order[]>(() => {
    const loaded = loadStored<Order[]>('orders', []);
    return loaded.filter((o) => !o.id.startsWith('AR-202610-88'));
  });
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [commissionSchemes, setCommissionSchemes] = useState<CommissionScheme[]>(() =>
    loadStored('commissionSchemes', INITIAL_COMMISSION_SCHEMES)
  );
  const [ledger, setLedger] = useState<LedgerEntry[]>(() => loadStored('ledger', INITIAL_LEDGER));
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() =>
    loadStored('withdrawals', INITIAL_WITHDRAWALS)
  );
  const [tickets, setTickets] = useState<SupportTicket[]>(() => loadStored('tickets', INITIAL_TICKETS));
  const [promotions, setPromotions] = useState<Promotion[]>(() => loadStored('promotions', INITIAL_PROMOTIONS));
  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>(() =>
    loadStored('broadcasts', INITIAL_BROADCASTS)
  );
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => loadStored('auditLogs', INITIAL_AUDIT_LOGS));
  const [categories, setCategories] = useState<string[]>(() =>
    loadStored('categories', ['Aneka Bebek & Ayam', 'Tradisional & Sate', 'Masakan Padang', 'Kopi & Minuman Dingin', 'Camilan & Martabak', 'Bakso & Mie'])
  );

  const [deviceFrame, setDeviceFrame] = useState<'mobile' | 'fluid'>('mobile');
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('antarrasa_is_authenticated');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    try {
      return localStorage.getItem('antarrasa_auth_user_id');
    } catch {
      return null;
    }
  });

  // Sync to storage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
      localStorage.setItem(`${STORAGE_KEY}_stores`, JSON.stringify(stores));
      localStorage.setItem(`${STORAGE_KEY}_products`, JSON.stringify(products));
      localStorage.setItem(`${STORAGE_KEY}_orders`, JSON.stringify(orders));
      localStorage.setItem(`${STORAGE_KEY}_drivers`, JSON.stringify(drivers));
      localStorage.setItem(`${STORAGE_KEY}_cart`, JSON.stringify(cart));
      localStorage.setItem(`${STORAGE_KEY}_addresses`, JSON.stringify(addresses));
      localStorage.setItem(`${STORAGE_KEY}_commissionSchemes`, JSON.stringify(commissionSchemes));
      localStorage.setItem(`${STORAGE_KEY}_ledger`, JSON.stringify(ledger));
      localStorage.setItem(`${STORAGE_KEY}_withdrawals`, JSON.stringify(withdrawals));
      localStorage.setItem(`${STORAGE_KEY}_tickets`, JSON.stringify(tickets));
      localStorage.setItem(`${STORAGE_KEY}_promotions`, JSON.stringify(promotions));
      localStorage.setItem(`${STORAGE_KEY}_broadcasts`, JSON.stringify(broadcasts));
      localStorage.setItem(`${STORAGE_KEY}_auditLogs`, JSON.stringify(auditLogs));
      localStorage.setItem(`${STORAGE_KEY}_categories`, JSON.stringify(categories));
    } catch (e) {
      console.warn('Storage sync warning', e);
    }
  }, [users, stores, products, orders, drivers, cart, addresses, commissionSchemes, ledger, withdrawals, tickets, promotions, broadcasts, auditLogs, categories]);

  // Current active user based on logged in user or role
  const currentUser =
    (currentUserId ? users.find((u) => u.id === currentUserId) : null) ||
    users.find((u) => u.role === currentRole) ||
    users[0];

  const currentDriver = drivers.find((d) => d.userId === currentUser.id) || drivers[0];
  const activeCommissionScheme = commissionSchemes.find((s) => s.isActive) || commissionSchemes[0];

  const addToast = (title: string, message: string, type: ToastNotification['type'] = 'info', roleTag?: Role) => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [{ id, title, message, type, roleTag, timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const switchRole = (role: Role) => {
    setCurrentRole(role);
    const targetUser = users.find((u) => u.role === role);
    if (targetUser) {
      setCurrentUserId(targetUser.id);
      try {
        localStorage.setItem('antarrasa_auth_user_id', targetUser.id);
      } catch {}
      addToast(
        `Beralih ke Role: ${getRoleLabel(role)}`,
        `Masuk sebagai ${targetUser.name}`,
        'info',
        role
      );
    }
  };

  const login = (emailOrPhone: string, password?: string): { success: boolean; error?: string } => {
    const cleanInput = emailOrPhone.trim().toLowerCase();
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === cleanInput ||
        u.phone.replace(/[^0-9]/g, '') === cleanInput.replace(/[^0-9]/g, '')
    );

    if (!found) {
      return { success: false, error: 'Email atau Nomor HP tidak terdaftar.' };
    }

    if (password && found.password && found.password !== password) {
      return { success: false, error: 'Kata sandi tidak sesuai. Silakan coba lagi.' };
    }

    setCurrentUserId(found.id);
    setCurrentRole(found.role);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('antarrasa_is_authenticated', 'true');
      localStorage.setItem('antarrasa_auth_user_id', found.id);
    } catch {}
    addToast('Berhasil Masuk', `Selamat datang kembali, ${found.name}!`, 'success', found.role);
    return { success: true };
  };

  const register = (data: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    role: Role;
    storeName?: string;
  }): { success: boolean; error?: string } => {
    const cleanEmail = data.email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, error: 'Email ini sudah terdaftar. Silakan gunakan menu Masuk.' };
    }

    const newId = `user_${Date.now()}`;
    const newUser: User = {
      id: newId,
      name: data.name.trim(),
      email: cleanEmail,
      phone: data.phone.trim(),
      role: data.role,
      avatar: `https://images.unsplash.com/photo-${data.role === 'consumer' ? '1534528741775-53994a69daeb' : data.role === 'driver' ? '1507003211169-0a1dd7228f2d' : '1577219491135-ce391730fb2c'}?auto=format&fit=crop&w=200&q=80`,
      status: 'active',
      password: data.password || '123456',
    };

    if (data.role === 'store_owner') {
      const newStore: Store = {
        id: `store_${Date.now()}`,
        ownerId: newId,
        name: data.storeName?.trim() || `Resto ${data.name.trim()}`,
        category: 'Aneka Bebek & Ayam',
        rating: 5.0,
        totalReviews: 1,
        address: 'Jl. Merdeka No. 10, Jakarta',
        distanceKm: 1.2,
        banner: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        logo: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=80',
        isOpen: true,
        openingHours: '09:00 - 21:00',
        isVerified: true,
        description: 'Menyajikan aneka masakan istimewa lezat dan segar.',
      };
      setStores((prev) => [newStore, ...prev]);
    } else if (data.role === 'driver') {
      const newDriver: DriverProfile = {
        id: `driver_${Date.now()}`,
        userId: newId,
        name: data.name.trim(),
        phone: data.phone.trim(),
        vehicleType: 'Motor Matic 125cc (B 3481 KLP)',
        vehiclePlate: 'B 3481 KLP',
        rating: 5.0,
        totalDeliveries: 0,
        walletBalance: 50000,
        status: 'available',
        isVerified: true,
        currentLat: -6.2088,
        currentLng: 106.8456,
      };
      setDrivers((prev) => [newDriver, ...prev]);
    } else if (data.role === 'consumer') {
      const newAddress: Address = {
        id: `addr_${Date.now()}`,
        userId: newId,
        label: 'Rumah',
        fullAddress: 'Jl. Melati No. 12, Kebayoran Baru, Jakarta Selatan',
        recipientName: data.name.trim(),
        phone: data.phone.trim(),
        notes: 'Pagar warna hitam',
        isDefault: true,
        lat: -6.2088,
        lng: 106.8456,
      };
      setAddresses((prev) => [newAddress, ...prev]);
      setSelectedAddress(newAddress);
    }

    setUsers((prev) => [...prev, newUser]);
    setCurrentUserId(newId);
    setCurrentRole(data.role);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('antarrasa_is_authenticated', 'true');
      localStorage.setItem('antarrasa_auth_user_id', newId);
    } catch {}
    addToast('Pendaftaran Berhasil', `Selamat datang di AntarRasa, ${newUser.name}!`, 'success', data.role);
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUserId(null);
    try {
      localStorage.setItem('antarrasa_is_authenticated', 'false');
      localStorage.removeItem('antarrasa_auth_user_id');
    } catch {}
    addToast('Keluar dari Akun', 'Anda telah berhasil keluar dari akun.', 'info');
  };

  const quickLogin = (role: Role) => {
    const targetUser = users.find((u) => u.role === role) || users[0];
    setCurrentUserId(targetUser.id);
    setCurrentRole(role);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('antarrasa_is_authenticated', 'true');
      localStorage.setItem('antarrasa_auth_user_id', targetUser.id);
    } catch {}
    addToast('Masuk Cepat Demo', `Masuk sebagai ${targetUser.name} (${getRoleLabel(role)})`, 'success', role);
  };

  const getRoleLabel = (r: Role) => {
    switch (r) {
      case 'consumer':
        return 'Konsumen';
      case 'store_owner':
        return 'Pemilik Toko';
      case 'driver':
        return 'Driver Antar';
      case 'admin':
        return 'Admin Operasional';
      case 'owner':
        return 'Owner Aplikasi';
    }
  };

  // Cart logic
  const cartStoreId = cart.length > 0 ? cart[0].storeId : null;

  const addToCart = (product: Product, quantity = 1, notes?: string) => {
    if (cart.length > 0 && cart[0].storeId !== product.storeId) {
      const confirmReplace = window.confirm(
        'Keranjang belanja Anda berisi item dari resto lain. Buang keranjang lama dan ganti dengan resto ini?'
      );
      if (!confirmReplace) return;
      setCart([{ productId: product.id, storeId: product.storeId, name: product.name, price: product.price, image: product.image, quantity, notes }]);
      addToast('Keranjang Diperbarui', `${product.name} dimasukkan ke keranjang`, 'success');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity, notes: notes || item.notes }
            : item
        );
      }
      return [...prev, { productId: product.id, storeId: product.storeId, name: product.name, price: product.price, image: product.image, quantity, notes }];
    });
    addToast('Ditambahkan', `${product.name} (+${quantity}) masuk keranjang`, 'success');
  };

  const updateCartQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => prev.map((item) => (item.productId === productId ? { ...item, quantity } : item)));
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => setCart([]);

  const addAddress = (addr: Omit<Address, 'id'>) => {
    const newAddr: Address = {
      ...addr,
      id: 'addr_' + Date.now(),
    };
    setAddresses((prev) => [...prev, newAddr]);
    setSelectedAddress(newAddr);
    addToast('Alamat Ditambahkan', `${newAddr.label} berhasil disimpan`, 'success');
  };

  // Create Order with PRD Commission & Idempotent Payment
  const createOrder = (
    paymentMethod: 'qris' | 'gopay' | 'ovo' | 'shopeepay' | 'bca_va' | 'mandiri_va',
    promoCode?: string,
    driverTip: number = 0
  ): Order | null => {
    if (cart.length === 0 || !cartStoreId) return null;
    const store = stores.find((s) => s.id === cartStoreId);
    if (!store) return null;

    const subtotal = cart.reduce((acc, it) => acc + it.price * it.quantity, 0);

    let discount = 0;
    if (promoCode) {
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

    // Calculate commission based on currently ACTIVE scheme
    const platformFee = Math.round((subtotal * activeCommissionScheme.percentage) / 100);
    const storeShare = subtotal - platformFee;
    const driverFee = deliveryFee;

    const newOrderId = `AR-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: newOrderId,
      consumerId: currentUser.id,
      consumerName: currentUser.name,
      consumerPhone: currentUser.phone,
      storeId: store.id,
      storeName: store.name,
      storeAddress: store.address,
      storeBanner: store.banner,
      items: cart.map((c) => ({
        productId: c.productId,
        name: c.name,
        price: c.price,
        quantity: c.quantity,
        notes: c.notes,
        image: c.image,
      })),
      subtotal,
      discount,
      deliveryFee,
      serviceFee,
      driverTip,
      total,
      status: 'pending_payment',
      paymentMethod,
      paymentStatus: 'pending',
      paymentId: `PAY-${Date.now().toString().slice(-6)}`,
      deliveryAddress: selectedAddress,
      commissionScheme: {
        percentage: activeCommissionScheme.percentage,
        platformFee,
        storeShare,
        driverFee,
        driverTip,
      },
      statusHistory: [
        {
          status: 'pending_payment',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          note: `Menunggu verifikasi pembayaran ${paymentMethod.toUpperCase()}`,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    clearCart();

    addToast(
      'Pesanan Dibuat',
      `ID ${newOrderId}. Selesaikan pembayaran ${paymentMethod.toUpperCase()}`,
      'info'
    );

    return newOrder;
  };

  const addDriverTip = (orderId: string, tipAmount: number) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const currentTip = ord.driverTip || 0;
          const newTip = currentTip + tipAmount;
          return {
            ...ord,
            driverTip: newTip,
            total: ord.total + tipAmount,
            commissionScheme: {
              ...ord.commissionScheme,
              driverTip: newTip,
            },
          };
        }
        return ord;
      })
    );
    addToast('Tips Driver Diterima', `Terima kasih! Tips Rp ${tipAmount.toLocaleString('id-ID')} diteruskan ke mitra driver`, 'success');
  };

  // Payment Webhook Simulation (Idempotent per PRD Section 8)
  const simulatePaymentWebhook = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          if (ord.status !== 'pending_payment') {
            return ord; // idempotent check
          }
          const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
          const updatedHist = [
            ...ord.statusHistory,
            { status: 'paid' as OrderStatus, timestamp: nowStr, note: 'Webhook Payment Gateway: Pembayaran Diterima' },
            { status: 'placed' as OrderStatus, timestamp: nowStr, note: 'Pesanan masuk ke resto untuk dikonfirmasi' },
          ];
          return {
            ...ord,
            status: 'placed' as OrderStatus,
            paymentStatus: 'success' as const,
            statusHistory: updatedHist,
            updatedAt: new Date().toISOString(),
          };
        }
        return ord;
      })
    );

    addToast(
      'Pembayaran Berhasil! (Webhook)',
      `Pesanan ${orderId} terverifikasi lunas & diteruskan ke resto.`,
      'success',
      'store_owner'
    );
  };

  const cancelOrder = (orderId: string, reason: string) => {
    const ord = orders.find((o) => o.id === orderId);
    if (!ord) return;
    if (['preparing', 'ready_for_pickup', 'driver_assigned', 'picked_up', 'on_delivery', 'delivered', 'completed'].includes(ord.status)) {
      alert('Pesanan sudah diproses resto/driver dan tidak dapat dibatalkan.');
      return;
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'cancelled',
              statusHistory: [
                ...o.statusHistory,
                { status: 'cancelled', timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }), note: `Dibatalkan: ${reason}` },
              ],
            }
          : o
      )
    );
    addToast('Pesanan Dibatalkan', `Pesanan ${orderId} telah dibatalkan`, 'warning');
  };

  // Store actions
  const toggleStoreStatus = (storeId: string) => {
    setStores((prev) =>
      prev.map((s) => (s.id === storeId ? { ...s, isOpen: !s.isOpen } : s))
    );
  };

  const acceptOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
          return {
            ...ord,
            status: 'accepted',
            statusHistory: [...ord.statusHistory, { status: 'accepted', timestamp: nowStr, note: 'Resto menerima pesanan' }],
            updatedAt: new Date().toISOString(),
          };
        }
        return ord;
      })
    );
    addToast('Pesanan Diterima', `Pesanan ${orderId} siap disiapkan`, 'info');
  };

  const startPreparingOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
          return {
            ...ord,
            status: 'preparing',
            statusHistory: [...ord.statusHistory, { status: 'preparing', timestamp: nowStr, note: 'Pesanan sedang diracik di dapur' }],
            updatedAt: new Date().toISOString(),
          };
        }
        return ord;
      })
    );
    addToast('Dapur Memasak', `Pesanan ${orderId} sedang dipersiapkan`, 'info');
  };

  // Auto Driver Assignment per PRD Section 10
  const readyForPickupOrder = (orderId: string) => {
    // 1. Mark ready for pickup
    const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    // 2. Select available verified driver within operational radius
    const availableDriver = drivers.find((d) => d.status === 'available' && d.isVerified) || drivers[0];

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const newHist = [
            ...ord.statusHistory,
            { status: 'ready_for_pickup' as OrderStatus, timestamp: nowStr, note: 'Makanan telah siap di etalase resto' },
            {
              status: 'driver_assigned' as OrderStatus,
              timestamp: nowStr,
              note: `Auto-assign: Driver ${availableDriver.name} (${availableDriver.vehiclePlate}) ditugaskan`,
            },
          ];
          return {
            ...ord,
            status: 'driver_assigned',
            driverId: availableDriver.userId,
            driverName: availableDriver.name,
            driverPhone: availableDriver.phone,
            driverPlate: availableDriver.vehiclePlate,
            driverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
            statusHistory: newHist,
            updatedAt: new Date().toISOString(),
          };
        }
        return ord;
      })
    );

    // Update driver status to busy
    setDrivers((prev) =>
      prev.map((d) => (d.id === availableDriver.id ? { ...d, status: 'busy' } : d))
    );

    addToast(
      'Siap Pick-Up & Auto-Assign!',
      `Driver ${availableDriver.name} ditugaskan untuk mengambil pesanan ${orderId}`,
      'success',
      'driver'
    );
  };

  // Driver actions
  const toggleDriverAvailability = (status: 'available' | 'busy' | 'offline') => {
    if (!currentDriver) return;
    setDrivers((prev) =>
      prev.map((d) => (d.id === currentDriver.id ? { ...d, status } : d))
    );
    addToast('Status Driver', `Status kerja diubah menjadi: ${status.toUpperCase()}`, 'info');
  };

  const updateDriverPlate = (plate: string) => {
    if (!currentDriver) return;
    setDrivers((prev) =>
      prev.map((d) => (d.id === currentDriver.id ? { ...d, vehiclePlate: plate } : d))
    );
    addToast('Plat Kendaraan Diperbarui', `Plat nomor diubah ke ${plate}`, 'success');
  };

  const acceptDriverAssignment = (orderId: string) => {
    addToast('Penugasan Dikonfirmasi', `Anda menerima pengantaran ${orderId}`, 'info');
  };

  const pickupOrder = (orderId: string) => {
    const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: 'picked_up',
            statusHistory: [...ord.statusHistory, { status: 'picked_up', timestamp: nowStr, note: 'Driver mengambil pesanan dari resto' }],
            updatedAt: new Date().toISOString(),
          };
        }
        return ord;
      })
    );
    addToast('Pesanan Diambil', `Makanan diambil, bersiap untuk mengantar`, 'info');
  };

  const startDelivery = (orderId: string) => {
    const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: 'on_delivery',
            statusHistory: [...ord.statusHistory, { status: 'on_delivery', timestamp: nowStr, note: 'Driver sedang dalam perjalanan menuju lokasi Anda' }],
            updatedAt: new Date().toISOString(),
          };
        }
        return ord;
      })
    );
    addToast('Dalam Perjalanan Antar', `Driver sedang menuju lokasi konsumen`, 'info', 'consumer');
  };

  const deliverOrder = (orderId: string, proof: DeliveryProof) => {
    const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: 'delivered',
            deliveryProof: proof,
            statusHistory: [
              ...ord.statusHistory,
              { status: 'delivered', timestamp: nowStr, note: `Pesanan sampai di tujuan. Diterima oleh: ${proof.recipientName || 'Pelanggan'}` },
            ],
            updatedAt: new Date().toISOString(),
          };
        }
        return ord;
      })
    );

    // Free the driver
    if (currentDriver) {
      setDrivers((prev) =>
        prev.map((d) => (d.id === currentDriver.id ? { ...d, status: 'available' } : d))
      );
    }

    addToast('Pengantaran Selesai!', `Bukti serah terima berhasil diunggah untuk ${orderId}`, 'success');
  };

  // Complete order & execute financial ledger & payout (PRD section 9 & 16)
  const completeOrder = (orderId: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder || targetOrder.status === 'completed') return;

    const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const timestampIso = new Date().toISOString();

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: 'completed',
            statusHistory: [...ord.statusHistory, { status: 'completed', timestamp: nowStr, note: 'Pesanan selesai & dikonfirmasi' }],
            updatedAt: timestampIso,
          };
        }
        return ord;
      })
    );

    // Ledger records without duplication (Idempotent check)
    const exists = ledger.some((l) => l.referenceId === orderId);
    if (!exists) {
      const { platformFee, storeShare, driverFee } = targetOrder.commissionScheme;
      const driverTip = targetOrder.driverTip || 0;

      const newEntries: LedgerEntry[] = [
        {
          id: 'led_' + Date.now() + '_1',
          userId: 'user_owner_1',
          userName: 'Platform AntarRasa',
          role: 'owner',
          type: 'credit',
          amount: platformFee,
          referenceType: 'platform_commission',
          referenceId: orderId,
          description: `Komisi Platform (${targetOrder.commissionScheme.percentage}%) pesanan ${orderId}`,
          timestamp: timestampIso,
        },
        {
          id: 'led_' + Date.now() + '_2',
          userId: targetOrder.storeId,
          userName: targetOrder.storeName,
          role: 'store_owner',
          type: 'credit',
          amount: storeShare,
          referenceType: 'store_payout',
          referenceId: orderId,
          description: `Pendapatan Bersih Resto pesanan ${orderId}`,
          timestamp: timestampIso,
        },
        {
          id: 'led_' + Date.now() + '_3',
          userId: targetOrder.driverId || 'driver_default',
          userName: targetOrder.driverName || 'Driver',
          role: 'driver',
          type: 'credit',
          amount: driverFee,
          referenceType: 'delivery_fee',
          referenceId: orderId,
          description: `Ongkir Pengantaran pesanan ${orderId}`,
          timestamp: timestampIso,
        },
      ];

      if (driverTip > 0) {
        newEntries.push({
          id: 'led_' + Date.now() + '_tip',
          userId: targetOrder.driverId || 'driver_default',
          userName: targetOrder.driverName || 'Driver',
          role: 'driver',
          type: 'credit',
          amount: driverTip,
          referenceType: 'driver_tip',
          referenceId: orderId,
          description: `Tips Tambahan Pelanggan untuk Driver pesanan ${orderId}`,
          timestamp: timestampIso,
        });
      }

      setLedger((prev) => [...newEntries, ...prev]);

      // Credit driver wallet (delivery fee + 100% tip)
      if (targetOrder.driverId) {
        setDrivers((prev) =>
          prev.map((d) =>
            d.userId === targetOrder.driverId
              ? { ...d, walletBalance: d.walletBalance + driverFee + driverTip, totalDeliveries: d.totalDeliveries + 1 }
              : d
          )
        );
      }
    }

    addToast(
      'Pesanan Selesai!',
      `Saldo resto & driver bertambah, komisi platform dicatat ke ledger.`,
      'success'
    );
  };

  const submitReview = (orderId: string, rating: number, comment: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              review: { rating, comment, createdAt: new Date().toISOString() },
            }
          : o
      )
    );
    addToast('Ulasan Terkirim', 'Terima kasih atas penilaian Anda!', 'success');
  };

  // Product CRUD
  const addProduct = (p: Omit<Product, 'id' | 'salesCount'>) => {
    const newProd: Product = {
      ...p,
      id: 'prod_' + Date.now(),
      salesCount: 0,
    };
    setProducts((prev) => [newProd, ...prev]);
    addToast('Produk Ditambahkan', `${newProd.name} berhasil disimpan di etalase`, 'success');
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
    addToast('Produk Diperbarui', 'Perubahan produk berhasil disimpan', 'info');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addToast('Produk Dihapus', 'Produk telah dihapus dari menu resto', 'warning');
  };

  // Manual Withdrawal (PRD Section 11)
  const requestWithdrawal = (
    role: 'driver' | 'store_owner',
    amount: number,
    bankName: string,
    accountNumber: string,
    accountHolder: string
  ): boolean => {
    // Check available balance
    let currentBalance = 0;
    if (role === 'driver' && currentDriver) {
      currentBalance = currentDriver.walletBalance;
    } else if (role === 'store_owner') {
      // Calculate store balance from ledger
      currentBalance = ledger
        .filter((l) => l.role === 'store_owner')
        .reduce((sum, l) => (l.type === 'credit' ? sum + l.amount : sum - l.amount), 0);
      if (currentBalance < 0) currentBalance = 450000;
    }

    if (amount > currentBalance) {
      alert(`Saldo tidak mencukupi. Saldo Anda saat ini: Rp ${currentBalance.toLocaleString('id-ID')}`);
      return false;
    }

    const newWd: WithdrawalRequest = {
      id: 'wd_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      role,
      amount,
      bankName,
      accountNumber,
      accountHolder,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      adminNotes: 'Menunggu review & approval admin',
    };

    setWithdrawals((prev) => [newWd, ...prev]);

    // Hold/debit driver balance immediately
    if (role === 'driver' && currentDriver) {
      setDrivers((prev) =>
        prev.map((d) => (d.id === currentDriver.id ? { ...d, walletBalance: d.walletBalance - amount } : d))
      );
    }

    addToast('Pengajuan Penarikan Dikirim', `Permintaan pencairan Rp ${amount.toLocaleString('id-ID')} berstatus PENDING`, 'info', 'admin');
    return true;
  };

  const approveWithdrawal = (id: string, approve: boolean, notes?: string) => {
    setWithdrawals((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              status: approve ? 'approved' : 'rejected',
              processedAt: new Date().toISOString(),
              adminNotes: notes || (approve ? 'Disetujui admin, siap transfer' : 'Ditolak: data rekening tidak sesuai'),
            }
          : w
      )
    );
    addToast(
      approve ? 'Pencairan Disetujui' : 'Pencairan Ditolak',
      `ID ${id} telah di-${approve ? 'setujui' : 'tolak'} oleh admin`,
      approve ? 'success' : 'warning'
    );
  };

  const markWithdrawalPaid = (id: string) => {
    const target = withdrawals.find((w) => w.id === id);
    if (!target) return;

    setWithdrawals((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              status: 'paid',
              processedAt: new Date().toISOString(),
              adminNotes: 'Dana berhasil ditransfer ke rekening penerima',
            }
          : w
      )
    );

    // Record ledger debit
    const newLedger: LedgerEntry = {
      id: 'led_wd_' + Date.now(),
      userId: target.userId,
      userName: target.userName,
      role: target.role,
      type: 'debit',
      amount: target.amount,
      referenceType: 'withdrawal',
      referenceId: target.id,
      description: `Pencairan Dana ke ${target.bankName} ${target.accountNumber} an ${target.accountHolder}`,
      timestamp: new Date().toISOString(),
    };
    setLedger((prev) => [newLedger, ...prev]);

    addToast('Pencairan Selesai (Paid)', `Dana Rp ${target.amount.toLocaleString('id-ID')} berhasil ditransfer`, 'success');
  };

  // Commission Schemes (PRD Section 9)
  const setActiveCommissionScheme = (schemeId: string) => {
    setCommissionSchemes((prev) =>
      prev.map((s) => ({
        ...s,
        isActive: s.id === schemeId,
      }))
    );
    const selected = commissionSchemes.find((s) => s.id === schemeId);
    if (selected) {
      const newAudit: AuditLog = {
        id: 'aud_' + Date.now(),
        actorId: currentUser.id,
        actorName: currentUser.name,
        actorRole: currentRole,
        action: 'UPDATE_COMMISSION_SCHEME',
        targetResource: `CommissionScheme:${selected.name}`,
        details: `Mengaktifkan skema komisi ${selected.percentage}% platform`,
        timestamp: new Date().toLocaleString('id-ID'),
      };
      setAuditLogs((prev) => [newAudit, ...prev]);
      addToast('Skema Komisi Diubah', `Skema aktif kini ${selected.name} (${selected.percentage}%)`, 'success');
    }
  };

  const createCommissionScheme = (name: string, percentage: number, description: string) => {
    const newScheme: CommissionScheme = {
      id: 'comm_' + Date.now(),
      name,
      percentage,
      description,
      isActive: false,
      createdAt: new Date().toISOString(),
    };
    setCommissionSchemes((prev) => [...prev, newScheme]);
    addToast('Skema Baru Dibuat', `${name} (${percentage}%) berhasil ditambahkan`, 'success');
  };

  // Admin & Owner Management
  const verifyStore = (storeId: string, approve: boolean) => {
    setStores((prev) => prev.map((s) => (s.id === storeId ? { ...s, isVerified: approve } : s)));
    addToast('Verifikasi Resto', `Status resto diperbarui: ${approve ? 'Terverifikasi' : 'Ditolak'}`, 'info');
  };

  const verifyDriver = (driverId: string, approve: boolean) => {
    setDrivers((prev) => prev.map((d) => (d.id === driverId ? { ...d, isVerified: approve } : d)));
    addToast('Verifikasi Driver', `Status driver diperbarui: ${approve ? 'Terverifikasi' : 'Ditolak'}`, 'info');
  };

  const suspendUser = (userId: string, suspend: boolean) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: suspend ? 'suspended' : 'active' } : u))
    );
    addToast('Status Pengguna', `Pengguna ${suspend ? 'ditangguhkan (suspend)' : 'diaktifkan kembali'}`, 'warning');
  };

  // Support Tickets
  const createTicket = (subject: string, category: 'pesanan' | 'pembayaran' | 'driver' | 'aplikasi', initialMessage: string, orderId?: string) => {
    const newTicket: SupportTicket = {
      id: 'tkt_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentRole,
      orderId,
      subject,
      category,
      status: 'open',
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: 'msg_' + Date.now(),
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderRole: currentRole,
          message: initialMessage,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };
    setTickets((prev) => [newTicket, ...prev]);
    addToast('Tiket Bantuan Terkirim', 'Tim CS akan segera merespons tiket Anda', 'info', 'admin');
  };

  const replyTicket = (ticketId: string, message: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: 'in_progress',
            messages: [
              ...t.messages,
              {
                id: 'msg_' + Date.now(),
                senderId: currentUser.id,
                senderName: currentUser.name,
                senderRole: currentRole,
                message,
                timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
              },
            ],
          };
        }
        return t;
      })
    );
  };

  const createBroadcast = (title: string, content: string, targetRole: 'all' | 'consumer' | 'store_owner' | 'driver') => {
    const newBc: BroadcastMessage = {
      id: 'bc_' + Date.now(),
      title,
      content,
      targetRole,
      createdAt: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
    };
    setBroadcasts((prev) => [newBc, ...prev]);
    addToast(`Broadcast Dikirim ke: ${targetRole.toUpperCase()}`, title, 'info');
  };

  const createPromotion = (promo: Omit<Promotion, 'id' | 'isActive'>) => {
    const newPromo: Promotion = {
      ...promo,
      id: 'promo_' + Date.now(),
      isActive: true,
    };
    setPromotions((prev) => [newPromo, ...prev]);
    addToast('Promo Baru Aktif', `Kode ${newPromo.code} berhasil ditambahkan`, 'success');
  };

  const addCategory = (cat: string) => {
    if (!categories.includes(cat)) {
      setCategories((prev) => [...prev, cat]);
      addToast('Kategori Baru', `Kategori "${cat}" berhasil ditambahkan ke katalog`, 'success');
    }
  };

  const resetDemoData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setStores(INITIAL_STORES);
    setProducts(INITIAL_PRODUCTS);
    setAddresses(INITIAL_ADDRESSES);
    setSelectedAddress(INITIAL_ADDRESSES[0]);
    setDrivers(INITIAL_DRIVERS);
    setOrders(INITIAL_ORDERS);
    setCommissionSchemes(INITIAL_COMMISSION_SCHEMES);
    setLedger(INITIAL_LEDGER);
    setWithdrawals(INITIAL_WITHDRAWALS);
    setTickets(INITIAL_TICKETS);
    setPromotions(INITIAL_PROMOTIONS);
    setBroadcasts(INITIAL_BROADCASTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCart([]);
    addToast('Data Direset', 'Semua data kembali ke konfigurasi awal bawaan PRD', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        register,
        logout,
        quickLogin,
        currentRole,
        currentUser,
        switchRole,
        users,
        stores,
        products,
        addresses,
        selectedAddress,
        setSelectedAddress,
        addAddress,
        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        cartStoreId,
        orders,
        activeOrder,
        setActiveOrder,
        defaultDriverTip,
        setDefaultDriverTip,
        addDriverTip,
        createOrder,
        simulatePaymentWebhook,
        cancelOrder,
        completeOrder,
        submitReview,
        toggleStoreStatus,
        acceptOrder,
        startPreparingOrder,
        readyForPickupOrder,
        addProduct,
        updateProduct,
        deleteProduct,
        drivers,
        currentDriver,
        toggleDriverAvailability,
        updateDriverPlate,
        acceptDriverAssignment,
        pickupOrder,
        startDelivery,
        deliverOrder,
        requestWithdrawal,
        commissionSchemes,
        activeCommissionScheme,
        setActiveCommissionScheme,
        createCommissionScheme,
        ledger,
        withdrawals,
        approveWithdrawal,
        markWithdrawalPaid,
        verifyStore,
        verifyDriver,
        suspendUser,
        tickets,
        createTicket,
        replyTicket,
        promotions,
        broadcasts,
        createBroadcast,
        createPromotion,
        auditLogs,
        categories,
        addCategory,
        toasts,
        dismissToast,
        addToast,
        theme,
        setTheme,
        toggleTheme,
        deviceFrame,
        setDeviceFrame,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
