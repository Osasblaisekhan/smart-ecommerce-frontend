import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Lock, ArrowLeft, Truck, CreditCard, Clock, Package } from 'lucide-react';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [address, setAddress] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  });

  // Show coming soon if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <Header />
        <main className="pt-[88px]">
          <div className="max-w-2xl mx-auto px-4 py-20 text-center">
            <div className="bg-white rounded-3xl border border-gray-100 p-12">
              <div className="w-20 h-20 bg-[#8BC34A]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-[#8BC34A]" />
              </div>
              <h1 className="text-3xl font-bold text-[#333333] mb-4">Checkout Coming Soon!</h1>
              <p className="text-[#666666] text-lg mb-8">
                We are working hard to bring you a seamless checkout experience. 
                This feature will be available shortly.
              </p>
              <div className="flex items-center justify-center gap-2 text-[#8BC34A] font-semibold mb-8">
                <Package className="w-5 h-5" />
                <span>Stay tuned for updates!</span>
              </div>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#8BC34A] text-white font-semibold rounded-xl hover:bg-[#7CB342] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  useEffect(() => {
    if (cart.length === 0) navigate('/cart');
  }, [cart, navigate]);

  const shipping = 0; // Free shipping
  const tax = 0; // Simplified
  const total = cartTotal + shipping + tax;

  const handleAddressChange = (field: string, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = address.name && address.email && address.address && address.city && address.state && address.zip;

  const handlePlaceOrder = async () => {
    if (!isFormValid) return;
    setLoading(true);
    setError('');

    try {
      const orderItems = cart.map(item => ({
        product: item.product_id,
        product_name: item.name,
        variant_title: item.variant_title || undefined,
        sku: item.sku || undefined,
        quantity: item.quantity,
        unit_price: item.price,
        total: item.price * item.quantity,
        image: item.image || undefined,
      }));

      const res = await api.createOrder({
        orderItems,
        shippingAddress: address,
        paymentMethod: 'card',
        subtotal: cartTotal,
        tax,
        shipping,
        totalPrice: total,
      });

      if (res.success && res.data) {
        clearCart();
        navigate(`/order-confirmation/${res.data._id}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to place order');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />
      <main className="pt-[88px]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-[#666666] hover:text-[#8BC34A] mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </Link>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3">
              {/* Steps */}
              <div className="flex items-center gap-4 mb-8">
                <button
                  onClick={() => setStep('shipping')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    step === 'shipping' ? 'bg-[#8BC34A] text-white' : 'bg-white text-[#666666] border border-gray-200'
                  }`}
                >
                  <Truck className="w-4 h-4" /> 1. Shipping
                </button>
                <div className="w-8 h-px bg-gray-300" />
                <button
                  onClick={() => isFormValid && setStep('payment')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    step === 'payment' ? 'bg-[#8BC34A] text-white' : 'bg-white text-[#666666] border border-gray-200'
                  }`}
                >
                  <CreditCard className="w-4 h-4" /> 2. Payment
                </button>
              </div>

              {step === 'shipping' && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-[#333333] mb-6">Shipping Address</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-[#333333] mb-1">Full Name</label>
                      <input
                        type="text"
                        value={address.name}
                        onChange={e => handleAddressChange('name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8BC34A] focus:ring-2 focus:ring-[#8BC34A]/20"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-[#333333] mb-1">Email</label>
                      <input
                        type="email"
                        value={address.email}
                        onChange={e => handleAddressChange('email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8BC34A] focus:ring-2 focus:ring-[#8BC34A]/20"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-[#333333] mb-1">Street Address</label>
                      <input
                        type="text"
                        value={address.address}
                        onChange={e => handleAddressChange('address', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8BC34A] focus:ring-2 focus:ring-[#8BC34A]/20"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#333333] mb-1">City</label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={e => handleAddressChange('city', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8BC34A] focus:ring-2 focus:ring-[#8BC34A]/20"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#333333] mb-1">State</label>
                      <input
                        type="text"
                        value={address.state}
                        onChange={e => handleAddressChange('state', e.target.value)}
                        placeholder="e.g. CA"
                        maxLength={2}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8BC34A] focus:ring-2 focus:ring-[#8BC34A]/20 uppercase"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#333333] mb-1">ZIP Code</label>
                      <input
                        type="text"
                        value={address.zip}
                        onChange={e => handleAddressChange('zip', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8BC34A] focus:ring-2 focus:ring-[#8BC34A]/20"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#333333] mb-1">Country</label>
                      <select
                        value={address.country}
                        onChange={e => handleAddressChange('country', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8BC34A]"
                      >
                        <option value="US">United States</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep('payment')}
                    disabled={!isFormValid}
                    className="w-full mt-6 py-4 bg-[#8BC34A] hover:bg-[#7CB342] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Payment <CreditCard className="w-4 h-4" />
                  </button>
                </div>
              )}

              {step === 'payment' && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-[#333333] mb-6">Payment</h2>

                  <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl mb-6">
                    <p className="text-blue-800 font-semibold mb-1">Demo Mode</p>
                    <p className="text-blue-600 text-sm">This is a demo checkout. Click "Place Order" to complete your purchase.</p>
                  </div>

                  {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full py-4 bg-[#8BC34A] hover:bg-[#7CB342] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-[#8BC34A]/25"
                  >
                    <Lock className="w-4 h-4" />
                    {loading ? 'Processing...' : `Place Order - CFA${(total / 100).toFixed(0)}`}
                  </button>
                </div>
              )}
            </div>

            {/* Order summary */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-28">
                <h2 className="text-lg font-bold text-[#333333] mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {cart.map(item => (
                    <div key={`${item.product_id}-${item.variant_id}`} className="flex gap-3">
                      <div className="w-14 h-14 bg-[#F5F5F5] rounded-lg overflow-hidden flex-shrink-0">
                        {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#333333] truncate">{item.name}</p>
                        {item.variant_title && <p className="text-xs text-[#666666]">{item.variant_title}</p>}
                        <p className="text-xs text-[#666666]">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-[#333333]">CFA{((item.price * item.quantity) / 100).toFixed(0)}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#666666]">Subtotal</span>
                    <span className="font-medium">CFA{(cartTotal / 100).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#666666]">Shipping</span>
                    <span className="font-medium text-[#8BC34A]">Free</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between">
                    <span className="font-bold text-[#333333]">Total</span>
                    <span className="font-bold text-xl text-[#333333]">CFA{(total / 100).toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
