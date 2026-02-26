import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
// Importing your official ProductCard component
import { ProductCard } from '../components/productcard';

interface CategoryPageProps {
  onAddToCart: (product: any) => void;
}

export function CategoryPage({ onAddToCart }: CategoryPageProps) {
  const { categoryId } = useParams(); 
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('*');

      if (data) {
        if (categoryId === 'all') {
          setProducts(data);
        } else {
          const filtered = data.filter(p => 
            p.category?.toLowerCase().trim() === categoryId?.toLowerCase().trim()
          );
          setProducts(filtered);
        }
      }
      setLoading(false);
    }
    fetchProducts();
  }, [categoryId]);

  // --- Skoon BRANDED LOADER ---
  if (loading) return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <Loader2 className="animate-spin text-[#D4AF37]" size={48} strokeWidth={1} />
        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#D4AF37]/40 animate-pulse" size={20} />
      </div>
      <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">
        Opening Collection
      </p>
    </div>
  );

  // Helper to clean up category titles (e.g., bedsheets_category -> Bedsheets)
  const displayTitle = categoryId 
    ? categoryId.replace('_category', '').replace(/_/g, ' ') 
    : 'Collection';

  return (
    <div className="min-h-screen bg-[#FDFCFB] pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Back */}
        <Link to="/" className="inline-flex items-center gap-3 text-slate-400 hover:text-slate-900 transition-all group mb-10">
          <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-slate-900 transition-colors">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> 
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return to Atelier</span>
        </Link>
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-slate-100 pb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="h-[1px] w-8 bg-[#D4AF37]"></div>
               <p className="text-[#D4AF37] font-black text-[10px] uppercase tracking-[0.4em]">Skoon Curated</p>
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">
              {displayTitle}<span className="text-[#D4AF37] not-italic">.</span>
            </h1>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory Status</span>
            <span className="bg-white border border-slate-200 text-slate-900 px-6 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-sm">
              {products.length} Designs Available
            </span>
          </div>
        </div>

        {/* Product Display Logic */}
        {products.length === 0 ? (
          <div className="text-center py-40 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
            <Sparkles className="mx-auto text-slate-200 mb-6" size={40} />
            <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs px-4">
              This collection is currently being curated.
            </p>
            <Link to="/" className="text-slate-900 font-black uppercase text-[10px] tracking-widest mt-8 inline-block hover:text-[#D4AF37] transition-all border-b-2 border-slate-900 hover:border-[#D4AF37] pb-1">
              Explore Other Collections
            </Link>
          </div>
        ) : (
          /* Grid: Optimized for Skoon Visuals */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-10">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={onAddToCart} 
                isCompact={true} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}