import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/currency';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Zap, DollarSign, ShoppingCart, Users, Package, TrendingUp, LogOut, Search,
  Check, X, Eye, ArrowUpRight, ArrowDownRight,
  LayoutDashboard, Box, ClipboardList, UserCheck, Lock, Mail, Shield, Plus, Edit3, Trash2
} from 'lucide-react';
import { toast } from 'sonner';

function AdminLoginGate({ onAuth }: { onAuth: () => void }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.login({ email, password });
      if (res.success && res.data) {
        if (res.data.role !== 'admin') {
          setError('Access denied. Admin privileges required.');
          setLoading(false);
          return;
        }
        localStorage.setItem('smarthome_user', JSON.stringify(res.data));
        localStorage.setItem('smarthome_token', res.data.token || '');
        onAuth();
      } else {
        setError('Invalid credentials');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#333333] to-[#1a1a2e] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#8BC34A] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#8BC34A]/30">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in with your admin credentials</p>
        </div>
        <form onSubmit={handleLogin} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="katewinslet@gmail.com"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#8BC34A]" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#8BC34A]" required />
            </div>
          </div>
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl"><p className="text-red-400 text-sm">{error}</p></div>}
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-[#8BC34A] hover:bg-[#7CB342] text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Lock className="w-4 h-4" /> Sign In</>}
          </button>
        </form>
        <p className="text-center text-gray-500 text-xs mt-6">
          <Link to="/" className="hover:text-[#8BC34A] transition-colors">Back to Store</Link>
        </p>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, change, color }: { icon: any; label: string; value: string; change?: number; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {change !== undefined && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-[#333333]">{value}</p>
      <p className="text-xs text-[#666666] mt-0.5">{label}</p>
    </div>
  );
}

const AdminDashboard: React.FC = () => {
  const [authed, setAuthed] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem('smarthome_user') || '{}');
      return u.role === 'admin';
    } catch { return false; }
  });
  const [tab, setTab] = useState<'dashboard' | 'products' | 'orders' | 'customers'>('dashboard');
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<any>({});
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', price: '', category: 'Smart Lighting',
    stock: '50', brand: '', vendor: '', sku: '', tags: 'featured',
    images: 'https://placehold.co/400x400/8BC34A/white?text=Product',
    compatibility: 'Alexa,Google Home',
  });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersRes, productsRes, customersRes] = await Promise.all([
        api.getOrders(),
        api.getAdminProducts(),
        api.getUsers(),
      ]);
      setOrders(ordersRes.data || []);
      setProducts(productsRes.data || []);
      setCustomers(customersRes.data || []);

      const now = new Date();
      const days: any[] = [];
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        days.push({ date: key, label: `${d.getMonth() + 1}/${d.getDate()}`, revenue: 0, orders: 0 });
      }
      (ordersRes.data || []).forEach((o: any) => {
        if (o.orderStatus === 'cancelled' || o.orderStatus === 'refunded') return;
        const key = new Date(o.createdAt).toISOString().split('T')[0];
        const day = days.find(d => d.date === key);
        if (day) { day.revenue += (o.totalPrice || 0) / 100; day.orders += 1; }
      });
      setChartData(days);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { if (authed) fetchAll(); }, [authed, fetchAll]);

  const totalRevenue = useMemo(() => orders.filter(o => o.orderStatus !== 'cancelled' && o.orderStatus !== 'refunded').reduce((s, o) => s + (o.totalPrice || 0), 0), [orders]);
  const paidOrders = useMemo(() => orders.filter(o => o.orderStatus !== 'cancelled' && o.orderStatus !== 'refunded').length, [orders]);

  const customerOrderCounts = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach(o => { if (o.user?._id) map[o.user._id] = (map[o.user._id] || 0) + 1; });
    return map;
  }, [orders]);

  const startEdit = (p: any) => {
    setEditingProduct(p._id);
    setEditValues({ price: (p.price / 100).toFixed(2), stock: p.stock ?? 0, status: p.status });
  };
  const cancelEdit = () => { setEditingProduct(null); setEditValues({}); };
  const saveEdit = async (id: string) => {
    try {
      await api.updateProduct(id, {
        price: Math.round(parseFloat(editValues.price) * 100),
        stock: parseInt(editValues.stock),
        status: editValues.status,
      });
      toast.success('Product updated');
      setEditingProduct(null);
      fetchAll();
    } catch { toast.error('Failed to update product'); }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.deleteProduct(id);
      toast.success('Product deleted');
      fetchAll();
    } catch { toast.error('Failed to delete product'); }
  };

  const addProduct = async () => {
    try {
      await api.createProduct({
        name: newProduct.name,
        description: newProduct.description,
        price: Math.round(parseFloat(newProduct.price) * 100),
        category: newProduct.category,
        stock: parseInt(newProduct.stock),
        brand: newProduct.brand,
        vendor: newProduct.vendor,
        sku: newProduct.sku,
        tags: newProduct.tags.split(',').map(t => t.trim()).filter(Boolean),
        images: newProduct.images.split(',').map(i => i.trim()).filter(Boolean),
        compatibility: newProduct.compatibility.split(',').map(c => c.trim()).filter(Boolean),
        status: 'active',
      });
      toast.success('Product created');
      setShowAddProduct(false);
      setNewProduct({ name: '', description: '', price: '', category: 'Smart Lighting', stock: '50', brand: '', vendor: '', sku: '', tags: 'featured', images: 'https://placehold.co/400x400/8BC34A/white?text=Product', compatibility: 'Alexa,Google Home' });
      fetchAll();
    } catch { toast.error('Failed to create product'); }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await api.updateOrderStatus(id, status);
      toast.success(`Order marked as ${status}`);
      fetchAll();
    } catch { toast.error('Failed to update order'); }
  };

  const handleLogout = () => { localStorage.removeItem('smarthome_user'); localStorage.removeItem('smarthome_token'); setAuthed(false); };

  if (!authed) return <AdminLoginGate onAuth={() => setAuthed(true)} />;

  const admin = JSON.parse(localStorage.getItem('smarthome_user') || '{}');

  const filteredProducts = products.filter(p => !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase()));
  const filteredOrders = orders.filter(o => !orderSearch || o._id.toLowerCase().includes(orderSearch.toLowerCase()) || o.orderStatus.includes(orderSearch.toLowerCase()));
  const filteredCustomers = customers.filter(c => !customerSearch || c.email?.toLowerCase().includes(customerSearch.toLowerCase()) || c.name?.toLowerCase().includes(customerSearch.toLowerCase()));

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700', paid: 'bg-green-100 text-green-700',
    processing: 'bg-blue-100 text-blue-700', shipped: 'bg-blue-100 text-blue-700',
    delivered: 'bg-emerald-100 text-emerald-700', cancelled: 'bg-red-100 text-red-700',
    refunded: 'bg-gray-100 text-gray-600',
  };
  const productStatusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-700', draft: 'bg-yellow-100 text-yellow-700', archived: 'bg-gray-100 text-gray-600',
  };

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products' as const, label: 'Products', icon: Box },
    { id: 'orders' as const, label: 'Orders', icon: ClipboardList },
    { id: 'customers' as const, label: 'Customers', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <aside className="w-64 bg-[#333333] text-white flex-shrink-0 hidden lg:flex flex-col">
        <div className="p-5 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#8BC34A] rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold">Nexa<span className="text-[#8BC34A]">Home</span></span>
          </Link>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${tab === t.id ? 'bg-[#8BC34A] text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-[#8BC34A] rounded-full flex items-center justify-center text-xs font-bold">{(admin.name || 'A')[0]}</div>
            <div className="min-w-0"><p className="text-sm font-medium truncate">{admin.name || 'Admin'}</p><p className="text-[10px] text-gray-500 truncate">{admin.email}</p></div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors">
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#8BC34A] rounded-lg flex items-center justify-center"><Zap className="w-4 h-4 text-white" /></div>
            <span className="font-bold text-sm text-[#333333]">Admin</span>
          </div>
          <div className="flex gap-1">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`p-2 rounded-lg ${tab === t.id ? 'bg-[#8BC34A] text-white' : 'text-[#666666]'}`}>
                <t.icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 lg:p-8 max-w-[1400px] mx-auto">
          {tab === 'dashboard' && (
            <>
              <div className="mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-[#333333]">Dashboard</h1>
                <p className="text-[#666666] text-sm mt-1">Overview of your store performance</p>
              </div>
              {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-28 animate-pulse" />)}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard icon={DollarSign} label="Total Revenue" value={`$${(totalRevenue / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`} change={12} color="bg-[#8BC34A]" />
                    <StatCard icon={ShoppingCart} label="Total Orders" value={paidOrders.toString()} change={8} color="bg-blue-500" />
                    <StatCard icon={Users} label="Customers" value={customers.length.toString()} change={15} color="bg-purple-500" />
                    <StatCard icon={Package} label="Products" value={products.length.toString()} color="bg-[#607D8B]" />
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-8">
                    <h3 className="text-lg font-bold text-[#333333] mb-4">Recent Orders</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead><tr className="border-b border-gray-100">
                          <th className="text-left py-2 px-3 text-xs font-semibold text-[#666666] uppercase">Order</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-[#666666] uppercase">Date</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-[#666666] uppercase">Status</th>
                          <th className="text-right py-2 px-3 text-xs font-semibold text-[#666666] uppercase">Total</th>
                        </tr></thead>
                        <tbody>
                          {orders.slice(0, 5).map(o => (
                            <tr key={o._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                              <td className="py-2.5 px-3 font-medium text-[#333333]">#{o._id.slice(0, 8).toUpperCase()}</td>
                              <td className="py-2.5 px-3 text-[#666666]">{new Date(o.createdAt).toLocaleDateString()}</td>
                              <td className="py-2.5 px-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColors[o.orderStatus] || 'bg-gray-100 text-gray-600'}`}>{o.orderStatus}</span></td>
                              <td className="py-2.5 px-3 text-right font-semibold">{formatPrice(o.totalPrice)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {tab === 'products' && (
            <>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-[#333333]">Products</h1>
                  <p className="text-[#666666] text-sm">{products.length} total products</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input value={productSearch} onChange={e => setProductSearch(e.target.value)} placeholder="Search products..."
                      className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8BC34A]" />
                  </div>
                  <button onClick={() => setShowAddProduct(!showAddProduct)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#8BC34A] hover:bg-[#7CB342] text-white font-semibold rounded-xl text-sm transition-colors whitespace-nowrap">
                    <Plus className="w-4 h-4" /> Add Product
                  </button>
                </div>
              </div>

              {showAddProduct && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                  <h3 className="text-lg font-bold text-[#333333] mb-4">Add New Product</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { key: 'name', label: 'Product Name', type: 'text', required: true },
                      { key: 'description', label: 'Description', type: 'text', required: true },
                      { key: 'price', label: 'Price ($)', type: 'number', required: true },
                      { key: 'category', label: 'Category', type: 'select', options: ['Smart Lighting', 'Security Cameras', 'Climate Control', 'Entertainment', 'Sensors & Safety'] },
                      { key: 'stock', label: 'Stock', type: 'number' },
                      { key: 'brand', label: 'Brand', type: 'text' },
                      { key: 'vendor', label: 'Vendor', type: 'text' },
                      { key: 'sku', label: 'SKU', type: 'text' },
                      { key: 'tags', label: 'Tags (comma separated)', type: 'text' },
                      { key: 'images', label: 'Image URLs (comma separated)', type: 'text' },
                      { key: 'compatibility', label: 'Compatibility (comma separated)', type: 'text' },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="block text-sm font-medium text-[#333333] mb-1">{field.label}</label>
                        {field.type === 'select' ? (
                          <select value={(newProduct as any)[field.key]} onChange={e => setNewProduct({ ...newProduct, [field.key]: e.target.value })}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8BC34A]">
                            {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        ) : field.key === 'description' ? (
                          <textarea value={(newProduct as any)[field.key]} onChange={e => setNewProduct({ ...newProduct, [field.key]: e.target.value })}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8BC34A]" rows={3} required={field.required} />
                        ) : (
                          <input type={field.type} value={(newProduct as any)[field.key]} onChange={e => setNewProduct({ ...newProduct, [field.key]: e.target.value })}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8BC34A]" required={field.required} />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={addProduct} className="px-6 py-2.5 bg-[#8BC34A] hover:bg-[#7CB342] text-white font-semibold rounded-xl text-sm transition-colors">
                      Create Product
                    </button>
                    <button onClick={() => setShowAddProduct(false)} className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl text-sm transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-[#666666] uppercase">Product</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-[#666666] uppercase">SKU</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-[#666666] uppercase">Price</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-[#666666] uppercase">Stock</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-[#666666] uppercase">Status</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-[#666666] uppercase">Actions</th>
                    </tr></thead>
                    <tbody>
                      {filteredProducts.map(p => {
                        const isEditing = editingProduct === p._id;
                        return (
                          <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#F5F5F5] rounded-lg overflow-hidden flex-shrink-0">
                                  {p.images?.[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-medium text-[#333333] truncate max-w-[200px]">{p.name}</p>
                                  <p className="text-[10px] text-[#666666]">{p.category}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-[#666666] font-mono text-xs">{p.sku}</td>
                            <td className="py-3 px-4">
                              {isEditing ? (
                                <input value={editValues.price} onChange={e => setEditValues({ ...editValues, price: e.target.value })}
                                  className="w-20 px-2 py-1 border border-[#8BC34A] rounded-lg text-sm focus:outline-none" />
                              ) : (
                                <span className="font-semibold text-[#333333]">{formatPrice(p.price)}</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {isEditing ? (
                                <input type="number" value={editValues.stock} onChange={e => setEditValues({ ...editValues, stock: e.target.value })}
                                  className="w-16 px-2 py-1 border border-[#8BC34A] rounded-lg text-sm focus:outline-none" />
                              ) : (
                                <span className={`font-medium ${(p.stock || 0) < 10 ? 'text-red-500' : 'text-[#333333]'}`}>{p.stock ?? '—'}</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {isEditing ? (
                                <select value={editValues.status} onChange={e => setEditValues({ ...editValues, status: e.target.value })}
                                  className="px-2 py-1 border border-[#8BC34A] rounded-lg text-xs focus:outline-none">
                                  <option value="active">Active</option><option value="draft">Draft</option><option value="archived">Archived</option>
                                </select>
                              ) : (
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${productStatusColors[p.status] || 'bg-gray-100 text-gray-600'}`}>{p.status}</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              {isEditing ? (
                                <div className="flex items-center justify-end gap-1">
                                  <button onClick={() => saveEdit(p._id)} className="p-1.5 bg-[#8BC34A] text-white rounded-lg hover:bg-[#7CB342]"><Check className="w-3.5 h-3.5" /></button>
                                  <button onClick={cancelEdit} className="p-1.5 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"><X className="w-3.5 h-3.5" /></button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-end gap-1">
                                  <button onClick={() => startEdit(p)} className="p-1.5 text-[#666666] hover:text-[#8BC34A] hover:bg-[#8BC34A]/10 rounded-lg transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                                  <Link to={`/product/${p.handle}`} className="p-1.5 text-[#666666] hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Eye className="w-3.5 h-3.5" /></Link>
                                  <button onClick={() => deleteProduct(p._id)} className="p-1.5 text-[#666666] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {tab === 'orders' && (
            <>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-[#333333]">Orders</h1>
                  <p className="text-[#666666] text-sm">{orders.length} total orders</p>
                </div>
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input value={orderSearch} onChange={e => setOrderSearch(e.target.value)} placeholder="Search by ID or status..."
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8BC34A]" />
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-[#666666] uppercase">Order ID</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-[#666666] uppercase">Date</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-[#666666] uppercase">Customer</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-[#666666] uppercase">Status</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-[#666666] uppercase">Total</th>
                    </tr></thead>
                    <tbody>
                      {filteredOrders.map(o => (
                        <tr key={o._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="py-3 px-4 font-medium text-[#333333] font-mono text-xs">#{o._id.slice(0, 8).toUpperCase()}</td>
                          <td className="py-3 px-4 text-[#666666]">{new Date(o.createdAt).toLocaleDateString()}</td>
                          <td className="py-3 px-4 text-[#666666]">{o.shippingAddress?.email || o.shippingAddress?.name || '—'}</td>
                          <td className="py-3 px-4">
                            <select value={o.orderStatus} onChange={e => updateOrderStatus(o._id, e.target.value)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#8BC34A]/30 ${statusColors[o.orderStatus] || 'bg-gray-100 text-gray-600'}`}>
                              <option value="pending">Pending</option>
                              <option value="paid">Paid</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                              <option value="refunded">Refunded</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right font-semibold text-[#333333]">${((o.totalPrice || 0) / 100).toFixed(2)}</td>
                        </tr>
                      ))}
                      {filteredOrders.length === 0 && (
                        <tr><td colSpan={5} className="py-12 text-center text-[#666666]">No orders found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {tab === 'customers' && (
            <>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-[#333333]">Customers</h1>
                  <p className="text-[#666666] text-sm">{customers.length} total customers</p>
                </div>
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input value={customerSearch} onChange={e => setCustomerSearch(e.target.value)} placeholder="Search customers..."
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8BC34A]" />
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-[#666666] uppercase">Customer</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-[#666666] uppercase">Email</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-[#666666] uppercase">Role</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-[#666666] uppercase">Orders</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-[#666666] uppercase">Joined</th>
                    </tr></thead>
                    <tbody>
                      {filteredCustomers.map(c => (
                        <tr key={c._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-[#8BC34A]/10 rounded-full flex items-center justify-center text-[#8BC34A] font-bold text-xs">
                                {(c.name || c.email || '?')[0].toUpperCase()}
                              </div>
                              <span className="font-medium text-[#333333]">{c.name || '—'}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-[#666666]">{c.email}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${c.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                              {c.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center justify-center w-7 h-7 bg-[#607D8B]/10 text-[#607D8B] font-bold text-xs rounded-full">
                              {customerOrderCounts[c._id] || 0}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[#666666]">{new Date(c.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                      {filteredCustomers.length === 0 && (
                        <tr><td colSpan={5} className="py-12 text-center text-[#666666]">No customers found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
