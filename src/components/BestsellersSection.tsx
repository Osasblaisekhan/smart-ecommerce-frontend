import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Star, ArrowRight, TrendingUp } from 'lucide-react';

const BestsellersSection: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.getProducts({ tag: 'bestseller', limit: '4' });
        if (res.success && res.data) {
          setProducts(res.data);
        }
      } catch {}
    };
    fetch();
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-[#8BC34A]" />
              <span className="text-[#8BC34A] font-semibold text-sm uppercase tracking-wider">Trending</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#333333]">Bestsellers</h2>
          </div>
          <Link to="/products" className="hidden md:flex items-center gap-2 text-[#8BC34A] font-semibold hover:gap-3 transition-all">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product, i) => (
            <Link
              key={product._id}
              to={`/product/${product.handle}`}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex"
            >
              <div className="w-40 sm:w-48 bg-[#F5F5F5] flex-shrink-0 overflow-hidden">
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-[#607D8B]/10 text-[#607D8B] text-[10px] font-bold uppercase rounded">
                      #{i + 1} Bestseller
                    </span>
                  </div>
                  <p className="text-xs text-[#607D8B] font-medium">{product.vendor || product.brand}</p>
                  <h3 className="text-lg font-bold text-[#333333] mt-1 group-hover:text-[#8BC34A] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-[#666666] mt-1 line-clamp-2">{product.description}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xl font-bold text-[#333333]">${(product.price / 100).toFixed(2)}</span>
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= (product.ratings || 4) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestsellersSection;
