import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Star, Zap } from 'lucide-react';

interface ProductCardProps {
  product: any;
  compact?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, compact }) => {
  const { addToCart } = useCart();
  const price = product.price || 0;
  const tags = product.tags || [];
  const hasAlexa = tags.includes('alexa');
  const hasGoogle = tags.includes('google-home');
  const isFeatured = tags.includes('featured');
  const isBestseller = tags.includes('bestseller');

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      product_id: product._id,
      name: product.name,
      sku: product.sku || product.handle,
      price: price,
      image: product.images?.[0],
    });
  };

  return (
    <Link
      to={`/product/${product.handle}`}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-square bg-[#F5F5F5] overflow-hidden">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isFeatured && (
            <span className="px-2.5 py-1 bg-[#8BC34A] text-white text-[10px] font-bold uppercase rounded-full tracking-wider">
              Featured
            </span>
          )}
          {isBestseller && (
            <span className="px-2.5 py-1 bg-[#607D8B] text-white text-[10px] font-bold uppercase rounded-full tracking-wider">
              Bestseller
            </span>
          )}
        </div>
        {/* Quick add */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 w-10 h-10 bg-[#8BC34A] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#7CB342] shadow-lg"
        >
          <ShoppingCart className="w-4 h-4" />
        </button>
        {/* Free shipping */}
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-semibold text-[#8BC34A] rounded-full">
            Free Shipping
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-2">
          {hasAlexa && (
            <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-semibold rounded">Alexa</span>
          )}
          {hasGoogle && (
            <span className="px-1.5 py-0.5 bg-red-50 text-red-500 text-[9px] font-semibold rounded">Google</span>
          )}
          {tags.includes('energy-star') && (
            <span className="px-1.5 py-0.5 bg-green-50 text-green-600 text-[9px] font-semibold rounded flex items-center gap-0.5">
              <Zap className="w-2.5 h-2.5" /> Energy Star
            </span>
          )}
        </div>
        <p className="text-xs text-[#607D8B] font-medium mb-1">{product.vendor || product.brand}</p>
        <h3 className="text-sm font-semibold text-[#333333] mb-2 line-clamp-2 group-hover:text-[#8BC34A] transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-[#333333]">
            CFA{(price / 100).toFixed(0)}
          </span>
          <div className="flex items-center gap-0.5">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className={`w-3 h-3 ${i <= (product.ratings || 4) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
