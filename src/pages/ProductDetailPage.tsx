import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { ShoppingCart, Star, Minus, Plus, ChevronRight, Shield, Truck, RefreshCw, Mic, Home, Zap, Check } from 'lucide-react';

const ProductDetailPage: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('specs');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!handle) return;
      setLoading(true);
      setQuantity(1);
      setSelectedImage(0);

      try {
        const res = await api.getProduct(handle);
        if (res.success && res.data) {
          setProduct(res.data);

          // Fetch related
          try {
            const relRes = await api.getProducts({ category: res.data.category, limit: '5' });
            if (relRes.success && relRes.data) {
              setRelatedProducts(relRes.data.filter((p: any) => p._id !== res.data._id).slice(0, 4));
            }
          } catch {}
        }
      } catch {}
      setLoading(false);
    };
    fetchProduct();
  }, [handle]);

  const inStock = product ? (product.stock == null || product.stock > 0) : false;

  const handleAddToCart = () => {
    if (!product || !inStock) return;
    addToCart({
      product_id: product._id,
      name: product.name,
      sku: product.sku || product.handle,
      price: product.price,
      image: product.images?.[0],
    }, quantity);
  };

  const tags = product?.tags || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <Header />
        <main className="pt-[88px] max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-12 animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/4" />
              <div className="h-20 bg-gray-200 rounded" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <Header />
        <main className="pt-[88px] flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#333333] mb-2">Product Not Found</h2>
            <Link to="/products" className="text-[#8BC34A] font-semibold hover:underline">Browse all products</Link>
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
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-[#666666]">
            <Link to="/" className="hover:text-[#8BC34A]">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/products" className="hover:text-[#8BC34A]">Products</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#333333] font-medium">{product.name}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-gray-100">
                <img
                  src={product.images?.[selectedImage] || product.images?.[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images?.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                        selectedImage === i ? 'border-[#8BC34A]' : 'border-gray-200'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                {tags.includes('alexa') && (
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-md flex items-center gap-1">
                    <Mic className="w-3 h-3" /> Alexa
                  </span>
                )}
                {tags.includes('google-home') && (
                  <span className="px-2 py-1 bg-red-50 text-red-500 text-xs font-semibold rounded-md flex items-center gap-1">
                    <Home className="w-3 h-3" /> Google
                  </span>
                )}
                {tags.includes('energy-star') && (
                  <span className="px-2 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-md flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Energy Star
                  </span>
                )}
              </div>

              <p className="text-sm text-[#607D8B] font-medium">{product.vendor || product.brand}</p>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#333333] mt-1 mb-3">{product.name}</h1>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-4 h-4 ${i <= (product.ratings || 4) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                <span className="text-sm text-[#666666]">{(product.ratings || 4).toFixed(1)} ({product.numReviews || 0} reviews)</span>
              </div>

              <p className="text-3xl font-bold text-[#333333] mb-4">
                CFA{(product.price / 100).toFixed(0)}
              </p>

              <p className="text-[#666666] text-sm leading-relaxed mb-6">{product.description}</p>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#333333] mb-2">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-gray-200 rounded-xl flex items-center justify-center hover:border-[#8BC34A] transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-gray-200 rounded-xl flex items-center justify-center hover:border-[#8BC34A] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="w-full py-4 bg-[#8BC34A] hover:bg-[#7CB342] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#8BC34A]/25"
              >
                <ShoppingCart className="w-5 h-5" />
                {!inStock ? 'Out of Stock' : `Add to Cart - CFA${((product.price * quantity) / 100).toFixed(0)}`}
              </button>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                {[
                  { icon: Truck, label: 'Free Shipping' },
                  { icon: Shield, label: '2-Year Warranty' },
                  { icon: RefreshCw, label: '30-Day Returns' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-100">
                    <Icon className="w-4 h-4 text-[#8BC34A] flex-shrink-0" />
                    <span className="text-xs text-[#666666] font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-16">
            <div className="flex border-b border-gray-200">
              {['specs', 'description', 'reviews'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-semibold capitalize transition-colors border-b-2 ${
                    activeTab === tab
                      ? 'text-[#8BC34A] border-[#8BC34A]'
                      : 'text-[#666666] border-transparent hover:text-[#333333]'
                  }`}
                >
                  {tab === 'specs' ? 'Specifications' : tab}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-b-2xl p-6 border border-t-0 border-gray-100">
              {activeTab === 'specs' && product.compatibility?.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {product.compatibility.map((item: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-[#F5F5F5] rounded-xl">
                      <Check className="w-4 h-4 text-[#8BC34A] flex-shrink-0" />
                      <p className="text-sm font-semibold text-[#333333]">{item}</p>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'specs' && (!product.compatibility || product.compatibility.length === 0) && (
                <p className="text-[#666666]">Specifications coming soon.</p>
              )}

              {activeTab === 'description' && (
                <div className="prose prose-sm max-w-none text-[#666666]">
                  <p>{product.description}</p>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {product.reviews?.length > 0 ? product.reviews.map((review: any, i: number) => (
                    <div key={i} className="p-4 bg-[#F5F5F5] rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-[#8BC34A] rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {review.name?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#333333]">{review.name}</p>
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-[#666666]">{review.comment}</p>
                    </div>
                  )) : (
                    <p className="text-[#666666]">No reviews yet. Be the first to review this product!</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Related */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-[#333333] mb-6">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map(p => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
