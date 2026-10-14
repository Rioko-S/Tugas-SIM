import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DeviceFrame } from './components/common/DeviceFrame';
import { NotificationToast } from './components/common/NotificationToast';
import { ConsumerHome } from './components/consumer/ConsumerHome';
import { StoreDetailModal } from './components/consumer/StoreDetailModal';
import { CartDrawer } from './components/consumer/CartDrawer';
import { CheckoutModal } from './components/consumer/CheckoutModal';
import { PaymentGatewayModal } from './components/consumer/PaymentGatewayModal';
import { OrderTrackingView } from './components/consumer/OrderTrackingView';
import { ConsumerOrders } from './components/consumer/ConsumerOrders';
import { ConsumerProfile } from './components/consumer/ConsumerProfile';
import { ConsumerBottomNav } from './components/consumer/ConsumerBottomNav';
import { StoreDashboard } from './components/store/StoreDashboard';
import { DriverDashboard } from './components/driver/DriverDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { OwnerDashboard } from './components/owner/OwnerDashboard';
import { AuthView } from './components/auth/AuthView';
import { Store, Order } from './types';

const MainAppContent: React.FC = () => {
  const { currentRole, orders, stores, isAuthenticated } = useApp();

  // Consumer view internal routing
  const [consumerTab, setConsumerTab] = useState<'home' | 'orders' | 'cart' | 'profile'>('home');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [pendingPaymentOrder, setPendingPaymentOrder] = useState<Order | null>(null);

  // If selectedOrder was updated in context, sync it
  const currentTrackedOrder = selectedOrder
    ? orders.find((o) => o.id === selectedOrder.id) || selectedOrder
    : null;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
      {/* Global Toast Notifications */}
      <NotificationToast />

      {/* Smartphone App Frame Wrapper (Mobile-first responsive container) */}
      <DeviceFrame>
        {!isAuthenticated ? (
          <AuthView />
        ) : (
          <>
            {/* ROLE 1: KONSUMEN */}
            {currentRole === 'consumer' && (
              <div className="flex-1 flex flex-col h-full relative">
                {/* View Switching */}
                {selectedStore ? (
                  <StoreDetailModal
                    store={selectedStore}
                    onBack={() => setSelectedStore(null)}
                    onOpenCart={() => setIsCartOpen(true)}
                  />
                ) : currentTrackedOrder ? (
                  <OrderTrackingView
                    order={currentTrackedOrder}
                    onBack={() => setSelectedOrder(null)}
                    onOpenTicket={() => {
                      setSelectedOrder(null);
                      setConsumerTab('profile');
                    }}
                  />
                ) : consumerTab === 'home' ? (
                  <ConsumerHome
                    onSelectStore={(st) => setSelectedStore(st)}
                    onOpenOrderTracking={(ord) => setSelectedOrder(ord)}
                    onOpenCart={() => setIsCartOpen(true)}
                  />
                ) : consumerTab === 'orders' ? (
                  <ConsumerOrders
                    onSelectOrder={(ord) => setSelectedOrder(ord)}
                    onOpenStore={(stId) => {
                      const target = stores.find((s) => s.id === stId);
                      if (target) setSelectedStore(target);
                    }}
                  />
                ) : consumerTab === 'profile' ? (
                  <ConsumerProfile />
                ) : null}

                {/* Bottom Nav (when not inside store detail or order tracking) */}
                {!selectedStore && !currentTrackedOrder && (
                  <ConsumerBottomNav
                    currentTab={consumerTab}
                    onTabChange={(tab) => {
                      if (tab === 'cart') {
                        setIsCartOpen(true);
                      } else {
                        setConsumerTab(tab);
                      }
                    }}
                    onOpenCart={() => setIsCartOpen(true)}
                  />
                )}

                {/* Modals */}
                <CartDrawer
                  isOpen={isCartOpen}
                  onClose={() => setIsCartOpen(false)}
                  onProceedToCheckout={() => setIsCheckoutOpen(true)}
                />

                <CheckoutModal
                  isOpen={isCheckoutOpen}
                  onClose={() => setIsCheckoutOpen(false)}
                  onOrderCreated={(newOrd) => {
                    setPendingPaymentOrder(newOrd);
                    setSelectedOrder(newOrd);
                  }}
                />

                {pendingPaymentOrder && (
                  <PaymentGatewayModal
                    order={pendingPaymentOrder}
                    isOpen={!!pendingPaymentOrder}
                    onClose={() => setPendingPaymentOrder(null)}
                    onSuccess={() => setPendingPaymentOrder(null)}
                  />
                )}
              </div>
            )}

            {/* ROLE 2: PEMILIK TOKO (PRD 5.5) */}
            {currentRole === 'store_owner' && <StoreDashboard />}

            {/* ROLE 3: DRIVER (PRD 5.4 & 10) */}
            {currentRole === 'driver' && <DriverDashboard />}

            {/* ROLE 4: ADMIN OPERASIONAL (PRD 5.2 & 11) */}
            {currentRole === 'admin' && <AdminDashboard />}

            {/* ROLE 5: OWNER APLIKASI (PRD 5.1 & 9) */}
            {currentRole === 'owner' && <OwnerDashboard />}
          </>
        )}
      </DeviceFrame>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
