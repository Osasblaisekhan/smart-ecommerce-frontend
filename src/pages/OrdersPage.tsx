import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/currency';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Package, ChevronRight, ShoppingCart, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';

const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
  pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  paid: { icon: CheckCircle, color: 'text-[#8BC34A]', bg: 'bg-[#8BC34A]/10' },
  processing: { icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
  shipped: { icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50' },
  delivered: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  cancelled: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
  refunded: { icon: XCircle, color: 'text-gray-600', bg: 'bg-gray-50' },
};

const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!user) { setLoading(false); return; }
      try {
        const res = await api.getMyOrders();
        if (res.success && res.data) {
          setOrders(res.data);
        }
      } catch {}
      setLoading(false);
    };
    fetch();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />
      <main className="pt-[88px]">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-[#333333] mb-8">My Orders</h1>

          {!user ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-[#333333] mb-2">Sign in to view orders</h2>
              <Link to="/auth" className="inline-flex items-center gap-2 px-6 py-3 bg-[#8BC34A] text-white font-semibold rounded-xl hover:bg-[#7CB342] transition-colors mt-4">
                Sign In
              </Link>
            </div>
          ) : loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-[#333333] mb-2">No orders yet</h2>
              <p className="text-[#666666] mb-6">Start shopping to see your orders here</p>
              <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-[#8BC34A] text-white font-semibold rounded-xl hover:bg-[#7CB342] transition-colors">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => {
                const config = statusConfig[order.orderStatus] || statusConfig.pending;
                const StatusIcon = config.icon;
                return (
                  <Link
                    key={order._id}
                    to={`/order-confirmation/${order._id}`}
                    className="block bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-[#8BC34A]/20 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 ${config.bg} rounded-xl flex items-center justify-center`}>
                          <StatusIcon className={`w-5 h-5 ${config.color}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-[#333333]">
                            Order #{order._id.slice(0, 8).toUpperCase()}
                          </p>
                          <p className="text-sm text-[#666666]">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'long', day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-[#333333]">{formatPrice(order.totalPrice)}</p>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 ${config.bg} ${config.color} text-xs font-semibold rounded-full capitalize`}>
                            {order.orderStatus}
                          </span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrdersPage;
