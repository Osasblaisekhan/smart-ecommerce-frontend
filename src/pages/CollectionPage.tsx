import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { ChevronRight, Search } from 'lucide-react';

const CollectionPage: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const [categoryName, setCategoryName] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('manual');

  useEffect(() => {
    const fetchCollectionProducts = async () => {
      if (!handle) return;
      setLoading(true);

      try {
        // Convert handle back to category name
        const category = handle.replace(/-/g, ' ');
        setCategoryName(category.charAt(0).toUpperCase() + category.slice(1));

        const res = await api.getProducts({ category, limit: '50' });
        if (res.success && res.data) {
          setProducts(res.data);
        }
      } catch {}
      setLoading(false);
    };

    fetchCollectionProducts();
  }, [handle]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'name-asc') return a.name.localeCompare(b.name);
    return 0;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <Header />
        <main className="pt-[88px]">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4 animate-pulse" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-5 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />
      <main className="pt-[88px]">
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-[#666666]">
            <Link to="/" className="hover:text-[#8BC34A]">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#333333] font-medium">{categoryName}</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#333333] to-[#607D8B] text-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-3xl lg:text-4xl font-bold">{categoryName}</h1>
            <p className="text-[#8BC34A] font-semibold mt-3">{products.length} products</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-[#666666]">Showing {sortedProducts.length} products</p>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8BC34A]"
            >
              <option value="manual">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A-Z</option>
            </select>
          </div>

          {sortedProducts.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#333333] mb-2">No products in this collection</h3>
              <Link to="/products" className="text-[#8BC34A] font-semibold hover:underline">Browse all products</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CollectionPage;
