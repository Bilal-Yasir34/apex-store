import { ShoppingCart, Sparkles } from 'lucide-react';
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
  const hasDiscount = product.compare_at_price > product.price;
  const isOutOfStock = product.stock <= 0;
  
  const discountPercentage = hasDiscount 
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  const displayImage = product.images?.[0] || 'https://via.placeholder.com/400';

  return (
    <Link 
      to={`/product/${product.id}`}
      className={`group relative block overflow-hidden bg-white border border-amber-50 transition-all duration-700 hover:shadow-[0_20px_50px_rgba(212,175,55,0.1)] h-full 
        ${isCompact ? 'rounded-2xl md:rounded-[2rem]' : 'rounded-[2.5rem]'}`}
    >
      {/* BADGES */}
      <div className={`absolute z-20 flex justify-between items-start pointer-events-none 
        ${isCompact ? 'top-2 left-2 right-2' : 'top-5 left-5 right-5'}`}>
        
        {hasDiscount ? (
          <div className={`rounded-full bg-slate-900 text-white font-black uppercase tracking-widest shadow-lg 
            ${isCompact ? 'px-2 py-0.5 text-[7px] md:text-[9px]' : 'px-3 py-1 text-[9px]'}`}>
            {discountPercentage}% Off
          </div>
        ) : <div />}

        {isBestSeller && (
          <div className={`rounded-full bg-[#D4AF37] text-white flex items-center shadow-lg 
            ${isCompact ? 'px-2 py-0.5 gap-1' : 'px-3 py-1.5 gap-1.5'}`}>
            <Sparkles className={`${isCompact ? 'w-2 h-2' : 'w-3 h-3'} fill-white`} />
            <span className={`uppercase tracking-[0.2em] font-black ${isCompact ? 'text-[7px] md:text-[9px]' : 'text-[9px]'}`}>Elite Choice</span>
          </div>
        )}
      </div>

      <div className={`relative ${isCompact ? 'p-3 md:p-5' : 'p-6'}`}>
        {/* IMAGE CONTAINER */}
        <div className={`relative aspect-square overflow-hidden bg-[#FCFAF7] transition-transform duration-1000 ease-out 
          ${isCompact ? 'mb-3 md:mb-5 rounded-xl md:rounded-2xl' : 'mb-6 rounded-[2rem]'}`}>
          <img src={displayImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" loading="lazy" />
          
          {/* Subtle Overlay on Hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
        </div>

        <div className="space-y-2 md:space-y-4">
          <div>
            <span className="text-[8px] md:text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em]">
              {product.category.replace('_category', '').replace('_', ' ')}
            </span>
            <h3 className={`font-black text-slate-900 group-hover:text-[#D4AF37] transition-colors truncate italic leading-tight
              ${isCompact ? 'text-sm md:text-xl' : 'text-xl'}`}>
              {product.name}
            </h3>
            
            {/* STOCK INDICATOR */}
            <div className={`flex items-center gap-1.5 mt-2`}>
               <div className={`w-1 h-1 rounded-full ${isOutOfStock ? 'bg-red-400' : 'bg-[#D4AF37]'}`} />
               <span className={`font-bold uppercase tracking-[0.2em] ${isOutOfStock ? 'text-red-400' : 'text-slate-400'} 
                 ${isCompact ? 'text-[6px] md:text-[8px]' : 'text-[9px]'}`}>
                 {isOutOfStock ? 'Awaiting Restock' : 'Limited Edition'}
               </span>
            </div>

            {!isCompact && (
              <p className="text-sm text-slate-500 font-serif italic line-clamp-2 leading-relaxed h-10 mt-3">
                {product.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-amber-50">
            <div className="flex flex-col min-w-0">
              <p className={`font-black text-slate-900 leading-none truncate ${isCompact ? 'text-base md:text-xl' : 'text-2xl'}`}>
                £ {product.price.toLocaleString()}
              </p>
              {hasDiscount && (
                <p className={`font-bold text-slate-300 line-through ${isCompact ? 'text-[9px] md:text-xs mt-1' : 'text-xs mt-1'}`}>
                  £ {product.compare_at_price.toLocaleString()}
                </p>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAdding}
              className={`group/btn relative flex items-center justify-center transition-all duration-500
                ${isOutOfStock ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-[#D4AF37]'} 
                ${isCompact 
                  ? 'w-10 h-10 rounded-full md:w-auto md:h-12 md:rounded-full md:px-6' 
                  : 'h-12 px-8 rounded-full'}`}
            >
              {isAdding ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span className={`${isCompact ? 'hidden md:block' : 'block'} ml-2 font-black uppercase text-[10px] tracking-widest`}>
                    {isOutOfStock ? 'Sold' : 'Add'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}