export type Role = 'consumer' | 'store_owner' | 'driver' | 'admin' | 'owner';

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'placed'
  | 'accepted'
  | 'preparing'
  | 'ready_for_pickup'
  | 'driver_assigned'
  | 'picked_up'
  | 'on_delivery'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  avatar: string;
  status: 'active' | 'suspended';
  password?: string;
}

export interface Store {
  id: string;
  ownerId: string;
  name: string;
  category: string;
  rating: number;
  totalReviews: number;
  address: string;
  distanceKm: number;
  banner: string;
  logo: string;
  isOpen: boolean;
  openingHours: string;
  isVerified: boolean;
  description: string;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  stock: number;
  isAvailable: boolean;
  salesCount: number;
}

export interface Address {
  id: string;
  userId: string;
  label: string; // e.g., 'Rumah', 'Kantor', 'Kos'
  recipientName: string;
  phone: string;
  fullAddress: string;
  notes?: string;
  isDefault: boolean;
  lat: number;
  lng: number;
}

export interface CartItem {
  productId: string;
  storeId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  notes?: string;
}

export interface CommissionScheme {
  id: string;
  name: string;
  percentage: number; // e.g. 10 for 10%
  description: string;
  isActive: boolean;
  createdAt: string;
}

export interface DriverProfile {
  id: string;
  userId: string;
  name: string;
  phone: string;
  vehiclePlate: string;
  vehicleType: string;
  status: 'available' | 'busy' | 'offline' | 'suspended';
  isVerified: boolean;
  rating: number;
  totalDeliveries: number;
  walletBalance: number;
  currentLat: number;
  currentLng: number;
}

export interface DeliveryProof {
  photoUrl?: string;
  recipientName?: string;
  signatureSvg?: string;
  deliveredAt: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  image: string;
}

export interface Order {
  id: string; // e.g. AR-202610-8821
  consumerId: string;
  consumerName: string;
  consumerPhone: string;
  storeId: string;
  storeName: string;
  storeAddress: string;
  storeBanner: string;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  driverPlate?: string;
  driverAvatar?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  serviceFee: number;
  driverTip?: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'qris' | 'gopay' | 'ovo' | 'shopeepay' | 'bca_va' | 'mandiri_va';
  paymentStatus: 'pending' | 'success' | 'failed';
  paymentId?: string;
  deliveryAddress: Address;
  deliveryProof?: DeliveryProof;
  commissionScheme: {
    percentage: number;
    platformFee: number;
    storeShare: number;
    driverFee: number;
    driverTip?: number;
  };
  review?: {
    rating: number;
    comment: string;
    createdAt: string;
  };
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface LedgerEntry {
  id: string;
  userId: string;
  userName: string;
  role: Role;
  type: 'credit' | 'debit';
  amount: number;
  referenceType: 'order_payment' | 'platform_commission' | 'store_payout' | 'delivery_fee' | 'driver_tip' | 'withdrawal' | 'refund';
  referenceId: string;
  description: string;
  timestamp: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  role: 'driver' | 'store_owner';
  amount: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  requestedAt: string;
  processedAt?: string;
  adminNotes?: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  role: Role;
  orderId?: string;
  subject: string;
  category: 'pesanan' | 'pembayaran' | 'driver' | 'aplikasi';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  messages: {
    id: string;
    senderId: string;
    senderName: string;
    senderRole: Role;
    message: string;
    timestamp: string;
  }[];
}

export interface Promotion {
  id: string;
  code: string;
  title: string;
  discountPercent: number;
  maxDiscount: number;
  minOrder: number;
  validUntil: string;
  scope: 'platform' | 'store';
  storeId?: string;
  isActive: boolean;
}

export interface BroadcastMessage {
  id: string;
  title: string;
  content: string;
  targetRole: 'all' | 'consumer' | 'store_owner' | 'driver';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: Role;
  action: string;
  targetResource: string;
  details: string;
  timestamp: string;
}
