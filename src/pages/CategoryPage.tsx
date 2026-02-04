import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Loader2 } from 'lucide-react';
// Importing your official ProductCard component
import { ProductCard } from '../components/productgrid';

// This defines what "props" the component accepts to clear the App.tsx error
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
      // Fetching fresh data directly from Supabase
      const { data } = await supabase
        .from('products')
        .select('*');

      if (data) {
        if (categoryId === 'all') {
          setProducts(data);
        } else {
          // Robust filtering to match the category slug exactly
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

  // --- RESTORED LOADER WITH "LOADING CATALOG" ---
  if (loading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-purple-600" size={42} />
      <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] animate-pulse">
        Loading Catalog
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Back */}
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-purple-600 font-bold mb-6 md:mb-8 transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          <span className="text-sm md:text-base font-black uppercase tracking-widest text-[10px]">Back to Shop</span>
        </Link>
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
          <div>
            <p className="text-purple-600 font-black text-[10px] md:text-xs uppercase tracking-[0.3em] mb-2">Collection Vault</p>
            <h1 className="text-3xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">
              {categoryId?.replace('-', ' ')}<span className="text-purple-600">.</span>
            </h1>
          </div>
          <span className="bg-white border border-slate-200 text-slate-900 px-4 py-1.5 md:px-6 md:py-2 rounded-xl md:rounded-2xl text-[10px] md:text-sm font-bold uppercase tracking-widest shadow-sm self-start md:self-auto">
            {products.length} Items Found
          </span>
        </div>

        {/* Product Display Logic */}
        {products.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[2rem] md:rounded-[3rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm px-4">No products in this vault yet.</p>
            <Link to="/" className="text-purple-600 font-black uppercase text-xs mt-6 inline-block hover:tracking-widest transition-all">
              Return to Homepage
            </Link>
          </div>
        ) : (
          /* UPDATED GRID: Optimized for 2-column mobile and 4-column desktop */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={onAddToCart} 
                isCompact={true} // <--- THIS TRIGGERS THE COMPACT MOBILE UI
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}