import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingCart, User, Search, Menu, X, Zap, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartCount } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.getProducts({ limit: '200' });
        if (res.success && res.data) {
          const cats = [...new Set(res.data.map((p: any) => p.category).filter(Boolean))];
          setCategories(cats.map((c: string) => ({ id: c, title: c, handle: c.toLowerCase().replace(/\s+/g, '-') })));
        }
      } catch {}
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchResults([]);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) { setSearchResults([]); return; }
    try {
      const res = await api.getProducts({ search: query, limit: '5' });
      if (res.success && res.data) {
        setSearchResults(res.data);
      }
    } catch {}
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchResults([]);
      setSearchQuery('');
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-md'}`}>
      {/* Top bar */}
      <div className="bg-[#333333] text-white text-xs py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <span className="flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-[#8BC34A]" />
            Free Shipping on All Orders
          </span>
          <span className="hidden sm:block">Smart Home. Smarter Living.</span>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-[#8BC34A] rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#333333]">
              Nexa<span className="text-[#8BC34A]">Home</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {categories.map(col => (
              <Link
                key={col.id}
                to={`/collections/${col.handle}`}
                className="text-sm font-medium text-[#666666] hover:text-[#8BC34A] transition-colors"
              >
                {col.title}
              </Link>
            ))}
            <Link to="/products" className="text-sm font-medium text-[#666666] hover:text-[#8BC34A] transition-colors">
              All Products
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div ref={searchRef} className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-[#666666] hover:text-[#8BC34A] transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
              {searchOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                  <form onSubmit={handleSearchSubmit}>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => handleSearch(e.target.value)}
                      placeholder="Search smart devices..."
                      className="w-full px-4 py-3 text-sm border-b border-gray-100 focus:outline-none"
                      autoFocus
                    />
                  </form>
                  {searchResults.length > 0 && (
                    <div className="max-h-64 overflow-y-auto">
                      {searchResults.map(p => (
                        <Link
                          key={p._id}
                          to={`/product/${p.handle}`}
                          onClick={() => { setSearchOpen(false); setSearchResults([]); setSearchQuery(''); }}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                        >
                          <img src={p.images?.[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <p className="text-sm font-medium text-[#333333]">{p.name}</p>
                            <p className="text-xs text-[#8BC34A] font-semibold">${(p.price / 100).toFixed(2)}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User */}
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => user ? setUserMenuOpen(!userMenuOpen) : navigate('/auth')}
                className="p-2 text-[#666666] hover:text-[#8BC34A] transition-colors"
              >
                <User className="w-5 h-5" />
              </button>
              {userMenuOpen && user && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-[#333333]">{user.name || 'User'}</p>
                    <p className="text-xs text-[#666666]">{user.email}</p>
                  </div>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2.5 text-sm text-[#666666] hover:bg-gray-50 hover:text-[#8BC34A]">
                      Admin Dashboard
                    </Link>
                  )}
                  <Link to="/orders" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2.5 text-sm text-[#666666] hover:bg-gray-50 hover:text-[#8BC34A]">
                    My Orders
                  </Link>
                  <button
                    onClick={() => { signOut(); setUserMenuOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-[#666666] hover:text-[#8BC34A] transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#8BC34A] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#666666] hover:text-[#8BC34A]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {categories.map(col => (
              <Link
                key={col.id}
                to={`/collections/${col.handle}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-[#666666] hover:text-[#8BC34A] hover:bg-gray-50 rounded-lg"
              >
                {col.title}
              </Link>
            ))}
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-[#666666] hover:text-[#8BC34A] hover:bg-gray-50 rounded-lg">
              All Products
            </Link>
            {!user && (
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-[#8BC34A] hover:bg-[#8BC34A]/10 rounded-lg">
                Sign In / Sign Up
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
