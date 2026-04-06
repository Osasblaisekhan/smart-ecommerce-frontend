import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/currency';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const sortOptions = [
  { label: 'Newest', value: 'created-desc' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Name: A-Z', value: 'name-asc' },
];

const ProductsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState('created-desc');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [selectedType, setSelectedType] = useState('');
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.getProducts({ limit: '200' });
        console.log('API Response:', res);
        const prods = res.data || [];
        setProducts(prods);
        const types = [...new Set(prods.map((p: any) => p.category).filter(Boolean))] as string[];
        setProductTypes(types);
      } catch (err) {
        console.error('Fetch error:', err);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  useEffect(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.vendor?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    }

    if (selectedType) {
      result = result.filter(p => p.category === selectedType);
    }

    result = result.filter(p => {
      const price = (p.price || 0) / 100;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    const [field, dir] = sort.split('-');
    result.sort((a, b) => {
      if (field === 'price') return dir === 'asc' ? a.price - b.price : b.price - a.price;
      if (field === 'name') return dir === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      return dir === 'asc'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFiltered(result);
  }, [products, search, sort, priceRange, selectedType]);

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />
      <main className="pt-[88px]">
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-[#333333]">All Products</h1>
            <p className="text-[#666666] mt-1">{filtered.length} smart devices available</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search devices..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8BC34A] focus:ring-2 focus:ring-[#8BC34A]/20"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="sm:hidden flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>

            <div className="flex gap-3">
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className="hidden sm:block px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8BC34A]"
              >
                <option value="">All Categories</option>
                {productTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8BC34A]"
              >
                {sortOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {filtersOpen && (
            <div className="sm:hidden bg-white rounded-xl border border-gray-200 p-4 mb-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-[#333333] mb-2 block">Category</label>
                <select
                  value={selectedType}
                  onChange={e => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="">All Categories</option>
                  {productTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-[#333333] mb-2 block">
                  Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                </label>
                <input
                  type="range"
                  min={0}
                  max={500}
                  value={priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-[#8BC34A]"
                />
              </div>
            </div>
          )}

          {(selectedType || search) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedType && (
                <button
                  onClick={() => setSelectedType('')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8BC34A]/10 text-[#8BC34A] text-sm font-medium rounded-full"
                >
                  {selectedType} <X className="w-3 h-3" />
                </button>
              )}
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#607D8B]/10 text-[#607D8B] text-sm font-medium rounded-full"
                >
                  "{search}" <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
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
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#333333] mb-2">No products found</h3>
              <p className="text-[#666666]">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map(product => (
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

export default ProductsPage;
