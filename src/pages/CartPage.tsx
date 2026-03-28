import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, Truck, Shield } from 'lucide-react';

const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <Header />
        <main className="pt-[88px]">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-[#333333] mb-8">Shopping Cart</h1>
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-[#333333] mb-2">Please sign in to view your cart</h2>
              <p className="text-[#666666] mb-6">Sign in to access your saved items</p>
              <button
                onClick={() => navigate('/auth')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#8BC34A] text-white font-semibold rounded-xl hover:bg-[#7CB342] transition-colors"
              >
                Sign In <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />
      <main className="pt-[88px]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-[#333333] mb-8">Shopping Cart</h1>

          {cart.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-[#333333] mb-2">Your cart is empty</h2>
              <p className="text-[#666666] mb-6">Discover smart devices to transform your home</p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#8BC34A] text-white font-semibold rounded-xl hover:bg-[#7CB342] transition-colors"
              >
                Browse Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map(item => (
                  <div
                    key={`${item.product_id}-${item.variant_id}`}
                    className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 flex gap-4"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#F5F5F5] rounded-xl overflow-hidden flex-shrink-0">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-[#333333] text-sm sm:text-base">{item.name}</h3>
                          {item.variant_title && (
                            <p className="text-xs text-[#666666] mt-0.5">{item.variant_title}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product_id, item.variant_id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity - 1)}
                            className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center hover:border-[#8BC34A] transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity + 1)}
                            className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center hover:border-[#8BC34A] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="font-bold text-[#333333]">
                          CFA{((item.price * item.quantity) / 100).toFixed(0)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-28">
                  <h2 className="text-lg font-bold text-[#333333] mb-4">Order Summary</h2>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#666666]">Subtotal ({cartCount} items)</span>
                      <span className="font-semibold text-[#333333]">CFA{(cartTotal / 100).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#666666]">Shipping</span>
                      <span className="font-semibold text-[#8BC34A]">Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#666666]">Tax</span>
                      <span className="text-[#666666]">Calculated at checkout</span>
                    </div>
                    <div className="border-t border-gray-100 pt-3 flex justify-between">
                      <span className="font-bold text-[#333333]">Estimated Total</span>
                      <span className="font-bold text-lg text-[#333333]">CFA{(cartTotal / 100).toFixed(0)}</span>
                    </div>
                  </div>

                  <Link
                    to="/checkout"
                    className="w-full py-4 bg-[#8BC34A] hover:bg-[#7CB342] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#8BC34A]/25"
                  >
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/products"
                    className="w-full mt-3 py-3 border border-gray-200 text-[#666666] font-medium rounded-xl hover:border-[#8BC34A] hover:text-[#8BC34A] transition-all flex items-center justify-center gap-2"
                  >
                    Continue Shopping
                  </Link>

                  <div className="mt-6 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-[#666666]">
                      <Truck className="w-4 h-4 text-[#8BC34A]" />
                      Free shipping on all orders
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#666666]">
                      <Shield className="w-4 h-4 text-[#8BC34A]" />
                      Secure checkout with SSL encryption
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
