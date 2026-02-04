import { ArrowRight, Loader2, SearchX } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
export { ProductCard } from './productcard'; 
import { ProductCard } from './productcard';

interface ProductGridProps {
  products: any[];
  loading: boolean;
  onAddToCart: (product: any) => void;
}

export function ProductGrid({ products, loading, onAddToCart }: ProductGridProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract search term from URL
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('search')?.toLowerCase() || '';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600 mb-4" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Apex Collection</p>
      </div>
    );
  }

  // Filter products based on search term (name or description)
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) || 
    product.description?.toLowerCase().includes(searchTerm)
  );

  // If searching, show all matches. If not, slice for the mobile slider preview.
  const mobileDisplayProducts = searchTerm ? filteredProducts : filteredProducts.slice(0, 4);

  // Handle empty search results
  if (searchTerm && filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <div className="p-6 rounded-full bg-slate-100 mb-6">
          <SearchX className="w-12 h-12 text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">No results for "{searchTerm}"</h3>
        <p className="text-slate-500 max-w-xs mx-auto mb-8">
          Try checking your spelling or using more general keywords.
        </p>
        <button 
          onClick={() => navigate('/category/all')}
          className="px-8 py-3 bg-purple-600 text-white rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-purple-700 transition-colors"
        >
          View All Products
        </button>
      </div>
    );
  }

  return (
    <section id="products" className="py-12 relative z-20">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Search Results Header */}
        {searchTerm && (
          <div className="mb-10 border-b border-slate-100 pb-6">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-purple-600 mb-2">Search Results</h2>
            <p className="text-3xl font-bold text-slate-900 tracking-tighter">
              Showing matches for "{searchTerm}"
            </p>
          </div>
        )}

        {/* Mobile Slider Layout */}
        <div className="lg:hidden">
          <div className="flex overflow-x-auto pb-8 gap-4 snap-x snap-mandatory hide-scrollbar">
            {mobileDisplayProducts.map((product) => (
              <div key={product.id} className="min-w-[280px] snap-center">
                <ProductCard product={product} onAddToCart={onAddToCart} />
              </div>
            ))}
            
            {!searchTerm && (
              <div className="min-w-[200px] flex items-center justify-center snap-center pr-4">
                <button 
                  onClick={() => navigate('/category/all')}
                  className="flex flex-col items-center gap-4 group active:scale-95 transition-transform"
                >
                  <div className="w-16 h-16 rounded-full bg-slate-800 border border-white/30 flex items-center justify-center text-white group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-xl">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                  <span className="font-black text-[10px] uppercase tracking-widest text-slate-900">
                    See All Products
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      </div>
    </section>
  );
}