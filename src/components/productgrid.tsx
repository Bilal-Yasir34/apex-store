import { ArrowRight, Loader2, SearchX } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
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
      <div className="flex flex-col items-center justify-center py-32 bg-[#FCFAF7]">
        <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37] mb-6" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Curating Skoon Textiles</p>
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
      <div className="flex flex-col items-center justify-center py-40 px-4 text-center bg-white">
        <div className="p-8 rounded-full bg-[#FCFAF7] border border-amber-50 mb-8">
          <SearchX className="w-12 h-12 text-[#D4AF37] opacity-40" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-3 uppercase italic tracking-tighter">No matches found</h3>
        <p className="text-slate-400 font-serif italic max-w-xs mx-auto mb-10 text-lg">
          We couldn't find "{searchTerm}" in our current collection. Try a broader term or explore our essentials.
        </p>
        <button 
          onClick={() => navigate('/category/all')}
          className="px-10 py-4 bg-slate-900 text-white rounded-full font-black uppercase text-[10px] tracking-[0.3em] hover:bg-[#D4AF37] transition-all shadow-xl"
        >
          Explore All Collections
        </button>
      </div>
    );
  }

  return (
    <section id="products" className="py-16 relative z-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search Results Header */}
        {searchTerm && (
          <div className="mb-16 border-b border-amber-50 pb-8">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] mb-3">Discovery</h2>
            <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
              Results for <span className="text-[#D4AF37]">"{searchTerm}"</span>
            </p>
          </div>
        )}

        {/* Mobile Slider Layout */}
        <div className="lg:hidden">
          <div className="flex overflow-x-auto pb-10 gap-6 snap-x snap-mandatory hide-scrollbar">
            {mobileDisplayProducts.map((product) => (
              <div key={product.id} className="min-w-[300px] snap-center">
                <ProductCard product={product} onAddToCart={onAddToCart} />
              </div>
            ))}
            
            {!searchTerm && (
              <div className="min-w-[220px] flex items-center justify-center snap-center pr-4">
                <button 
                  onClick={() => navigate('/category/all')}
                  className="flex flex-col items-center gap-6 group active:scale-95 transition-transform"
                >
                  <div className="w-20 h-20 rounded-full bg-white border-2 border-amber-50 flex items-center justify-center text-slate-900 group-hover:border-[#D4AF37] group-hover:text-[#D4AF37] transition-all duration-500 shadow-xl shadow-amber-900/5">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                  <span className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-900 border-b-2 border-transparent group-hover:border-[#D4AF37] transition-all">
                    View Entire Catalog
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      </div>
    </section>
  );
}