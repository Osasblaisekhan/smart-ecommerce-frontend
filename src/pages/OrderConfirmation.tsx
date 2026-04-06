import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/currency';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle, Package, ArrowRight, Truck } from 'lucide-react';

const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!orderId) return;
      try {
        const res = await api.getOrder(orderId);
        if (res.success && res.data) {
          setOrder(res.data);
        }
      } catch {}
      setLoading(false);
    };
    fetch();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <Header />
        <main className="pt-[88px] flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-[#8BC34A] border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />
      <main className="pt-[88px]">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-[#8BC34A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-[#8BC34A]" />
            </div>
            <h1 className="text-3xl font-bold text-[#333333] mb-2">Order Confirmed!</h1>
            <p className="text-[#666666]">
              Thank you for your purchase. Your order has been placed successfully.
            </p>
          </div>

          {order && (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-wrap gap-6">
                  <div>
                    <p className="text-xs text-[#666666] uppercase tracking-wider">Order ID</p>
                    <p className="text-sm font-semibold text-[#333333] mt-0.5">{order._id.slice(0, 8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#666666] uppercase tracking-wider">Status</p>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#8BC34A]/10 text-[#8BC34A] text-xs font-semibold rounded-full mt-0.5">
                      <Package className="w-3 h-3" /> {order.orderStatus}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-[#666666] uppercase tracking-wider">Date</p>
                    <p className="text-sm font-semibold text-[#333333] mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-[#333333] mb-4">Order Items</h3>
                <div className="space-y-3">
                  {order.orderItems?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center py-2">
                      <div>
                        <p className="text-sm font-medium text-[#333333]">{item.product_name}</p>
                        {item.variant_title && (
                          <p className="text-xs text-[#666666]">{item.variant_title}</p>
                        )}
                        <p className="text-xs text-[#666666]">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-[#333333]">{formatPrice(item.total)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="p-6 bg-[#F5F5F5]">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#666666]">Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#666666]">Shipping</span>
                    <span className="text-[#8BC34A]">{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#666666]">Tax</span>
                    <span>{formatPrice(order.tax || 0)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between">
                    <span className="font-bold text-[#333333]">Total</span>
                    <span className="font-bold text-lg text-[#333333]">{formatPrice(order.totalPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping */}
              {order.shippingAddress && (
                <div className="p-6 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-4 h-4 text-[#8BC34A]" />
                    <h3 className="text-sm font-semibold text-[#333333]">Shipping Address</h3>
                  </div>
                  <p className="text-sm text-[#666666]">
                    {order.shippingAddress.name}<br />
                    {order.shippingAddress.address}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <Link
              to="/orders"
              className="px-6 py-3 bg-white border border-gray-200 text-[#333333] font-semibold rounded-xl hover:border-[#8BC34A] transition-colors text-center"
            >
              View All Orders
            </Link>
            <Link
              to="/products"
              className="px-6 py-3 bg-[#8BC34A] text-white font-semibold rounded-xl hover:bg-[#7CB342] transition-colors flex items-center justify-center gap-2"
            >
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
