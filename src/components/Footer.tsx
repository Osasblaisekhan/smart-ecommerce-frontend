import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { Zap, Mail, Phone, MapPin, Send } from 'lucide-react';

const Footer: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.getCategories();
        if (res.success && res.data) {
          setCategories(res.data.map((c: string) => ({ id: c, title: c, handle: c.toLowerCase().replace(/\s+/g, '-') })));
        }
      } catch {}
    };
    fetch();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-[#333333] text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-1">Stay Connected</h3>
              <p className="text-gray-400 text-sm">Get the latest smart home deals and product updates.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 md:w-72 px-4 py-3 bg-white/10 border border-white/20 rounded-l-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#8BC34A]"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#8BC34A] hover:bg-[#7CB342] text-white font-semibold rounded-r-lg transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#8BC34A] rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Nexa<span className="text-[#8BC34A]">Home</span></span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Your trusted partner for smart home automation. We bring cutting-edge technology to make your home smarter, safer, and more efficient.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-[#8BC34A]" />
                    katewinslet@gmail.com
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-[#8BC34A]" />
                1-800-NEXA-HOME
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-[#8BC34A]" />
                Cameroon
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-[#8BC34A]">Categories</h4>
            <ul className="space-y-2.5">
              {categories.map(col => (
                <li key={col.id}>
                  <Link to={`/collections/${col.handle}`} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {col.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white text-sm transition-colors">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-[#8BC34A]">Company</h4>
            <ul className="space-y-2.5">
              {['About Us', 'Careers', 'Blog', 'Press', 'Partners'].map(item => (
                <li key={item}>
                  <Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-[#8BC34A]">Support</h4>
            <ul className="space-y-2.5">
              {['Help Center', 'Shipping Info', 'Returns & Exchanges', 'Warranty', 'Contact Us'].map(item => (
                <li key={item}>
                  <Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-gray-500 text-xs">&copy; 2026 NexaHome. All rights reserved.</p>
          <div className="flex gap-4">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <Link key={item} to="/" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
