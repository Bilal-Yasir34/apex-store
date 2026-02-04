import { ShoppingCart, Zap, Star, Package } from 'lucide-react';
import { Product } from '../types';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isCompact?: boolean;
}

export function ProductCard({ product, onAddToCart, isCompact = false }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    await onAddToCart(product);
    setTimeout(() => setIsAdding(false), 1000);
  };

  const isBestSeller = product.section === 'bestseller';
  const isFeatured = product.section === 'featured';
  const hasDiscount = product.compare_at_price > product.price;
  const isOutOfStock = product.stock <= 0;
  
  const discountPercentage = hasDiscount 
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  const displayImage = product.images?.[0] || 'https://via.placeholder.com/400';

  return (
    <Link 
      to={`/product/${product.id}`}
      className={`group relative block overflow-hidden bg-white border border-slate-200 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10 h-full 
        ${isCompact ? 'rounded-2xl md:rounded-3xl' : 'rounded-3xl'}`}
    >
      {/* BADGES */}
      <div className={`absolute z-20 flex justify-between items-start pointer-events-none 
        ${isCompact ? 'top-2 left-2 right-2' : 'top-4 left-4 right-4'}`}>
        
        {hasDiscount ? (
          <div className={`rounded-lg bg-red-600 text-white font-black uppercase tracking-tighter shadow-lg 
            ${isCompact ? 'px-1.5 py-0.5 text-[7px] md:text-[10px]' : 'px-2.5 py-1 text-[10px]'}`}>
            -{discountPercentage}%
          </div>
        ) : <div />}

        {isBestSeller && (
          <div className={`rounded-full bg-yellow-400 border border-yellow-300 flex items-center shadow-lg 
            ${isCompact ? 'px-1.5 py-0.5 gap-1' : 'px-3 py-1.5 gap-1.5'}`}>
            <Zap className={`${isCompact ? 'w-2 h-2' : 'w-3 h-3'} text-black fill-black`} />
            <span className={`uppercase tracking-wider font-bold text-black ${isCompact ? 'text-[7px] md:text-[10px]' : 'text-[10px]'}`}>Best Seller</span>
          </div>
        )}
      </div>

      <div className={`relative ${isCompact ? 'p-3 md:p-5' : 'p-5'}`}>
        <div className={`aspect-square overflow-hidden bg-slate-50 transition-transform duration-700 ease-out group-hover:scale-105 
          ${isCompact ? 'mb-3 md:mb-6 rounded-xl md:rounded-2xl' : 'mb-6 rounded-2xl'}`}>
          <img src={displayImage} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
        </div>

        <div className="space-y-1.5 md:space-y-4">
          <div>
            <span className="text-[8px] md:text-[10px] font-bold text-purple-600 uppercase tracking-widest">
              {product.category.replace('-', ' ')}
            </span>
            <h3 className={`font-bold text-slate-900 group-hover:text-purple-600 transition-colors truncate 
              ${isCompact ? 'text-sm md:text-lg' : 'text-lg'}`}>
              {product.name}
            </h3>
            
            {/* STOCK INDICATOR - Adaptive for Compact/Full mode */}
            <div className={`flex items-center gap-1.5 mt-1 ${isCompact ? 'md:mt-2' : 'mt-2'}`}>
               <div className={`w-1.5 h-1.5 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
               <span className={`font-bold uppercase tracking-widest ${isOutOfStock ? 'text-red-500' : 'text-emerald-600'} 
                 ${isCompact ? 'text-[7px] md:text-[9px]' : 'text-[10px]'}`}>
                 {isOutOfStock ? 'Out of Stock' : `${product.stock} Units Left`}
               </span>
            </div>

            {!isCompact && (
              <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed h-10 mt-2.5">
                {product.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex flex-col min-w-0">
              <div className="flex flex-col md:flex-col-reverse">
                <p className={`font-black text-slate-900 leading-none truncate ${isCompact ? 'text-base md:text-2xl' : 'text-2xl'}`}>
                  Rs.{product.price.toLocaleString()}
                </p>
                {hasDiscount && (
                  <p className={`font-bold text-red-500 line-through ${isCompact ? 'text-[9px] md:text-sm mt-0.5' : 'text-sm mt-1'}`}>
                    Rs.{product.compare_at_price.toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAdding}
              className={`group/btn relative flex items-center justify-center bg-slate-900 text-white font-bold transition-all duration-300 hover:bg-purple-600 
                ${isCompact 
                  ? 'w-9 h-9 rounded-full md:w-auto md:h-12 md:rounded-xl md:px-6' 
                  : 'h-12 px-6 rounded-xl'}`}
            >
              {isAdding ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span className={`${isCompact ? 'hidden md:block' : 'block'} ml-2`}>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}