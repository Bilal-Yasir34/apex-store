import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Navigation } from './components/navigation';
import { Hero } from './components/hero';
import { Banner } from './components/banner';
import { ProductGrid } from './components/productgrid';
import { ProductCard } from './components/productcard';
import { ShoppingCart } from './components/shoppingcart';
import { useProducts } from './hooks/useproducts';
import { useCart } from './hooks/usecart';
import { ArrowUp, ShieldCheck, RefreshCw, Truck, ThumbsUp, Loader2, Lock, AlertCircle, Sparkles, PackageSearch } from 'lucide-react'; 
import Admin from './pages/Admin';
import Checkout from './pages/Checkout'; 
import { CategorySection } from './components/categorysection';
import { Gallery } from './components/gallery';
import { Footer } from './components/footer';
import { ProductDetail } from './components/productdetail';
import { CategoryPage } from './pages/CategoryPage';
import { supabase } from './lib/supabase';
import { useAuth } from './context/AuthContext';

// --- POLICY PAGES ---
import ShippingPolicy from './pages/policies/ShippingPolicy';
import RefundPolicy from './pages/policies/RefundPolicy';
import PrivacyPolicy from './pages/policies/PrivacyPolicy';
import TermsOfService from './pages/policies/TermsOfService';

// --- ABOUT COMPONENTS ---
import { AboutSection } from './components/aboutsection';
import { AboutEditorial } from './components/abouteditorial';

// --- CURRENCY FORMATTER (UK Standard) ---
const formatUKPrice = (price: number) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(price);
};

// --- ADMIN PROTECTION GUARD ---
function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const ADMIN_EMAILS = [
    "bilalyasir4321@gmail.com",
    "bilalyasir34@gmail.com" 
  ]; 

  useEffect(() => {
    if (!loading) {
      const userEmail = user?.email?.toLowerCase().trim() || "";
      const isAuthorized = ADMIN_EMAILS.some(email => email.toLowerCase().trim() === userEmail);
      
      if (!user || !isAuthorized) {
        navigate('/login', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#FDFCFB]">
      <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37] mb-4" strokeWidth={1} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Verifying Sakoon Admin</p>
    </div>
  );

  return <>{children}</>;
}

// --- ADMIN LOGIN PAGE ---
function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email: email.trim(), 
      password: password 
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else if (data.session) {
      navigate('/admin');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#FDFCFB] px-4">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
        <div className="flex flex-col items-center mb-10">
          <div className="p-4 bg-[#FDFCFB] border border-slate-100 rounded-2xl mb-6 shadow-sm">
            <Lock className="w-6 h-6 text-[#D4AF37]" strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
            Sakoon<span className="text-[#D4AF37] not-italic">.</span>
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2">Admin Access</p>
        </div>
        
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-[11px] font-bold">
            <AlertCircle className="w-4 h-4" /> {errorMsg}
          </div>
        )}

        <div className="space-y-4">
          <input 
            type="email" placeholder="Email Address" 
            className="w-full p-4 bg-[#FDFCFB] border border-slate-100 rounded-2xl outline-none focus:border-[#D4AF37] transition-all text-sm font-bold text-slate-900" 
            value={email} onChange={(e) => setEmail(e.target.value)} required 
          />
          <input 
            type="password" placeholder="Password" 
            className="w-full p-4 bg-[#FDFCFB] border border-slate-100 rounded-2xl outline-none focus:border-[#D4AF37] transition-all text-sm font-bold text-slate-900" 
            value={password} onChange={(e) => setPassword(e.target.value)} required 
          />
          <button disabled={loading} className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-[#D4AF37] transition-all uppercase text-[11px] tracking-[0.3em] shadow-lg flex justify-center items-center">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Authorize'}
          </button>
        </div>
      </form>
    </div>
  );
}

// --- SUB-COMPONENTS ---
function TrustBar() {
  const features = [
    { icon: ShieldCheck, title: 'Quality Guarantee' }, 
    { icon: RefreshCw, title: '14 Days Returns' }, 
    { icon: Truck, title: 'Fast UK Delivery' }, 
    { icon: ThumbsUp, title: 'Premium Textiles' }
  ];
  return (
    <section className="bg-white py-12 border-t border-slate-50 relative z-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        {features.map((item, index) => (
          <div key={index} className="flex flex-col items-center justify-center space-y-3">
            <item.icon strokeWidth={1} className="w-8 h-8 text-[#D4AF37]" />
            <h3 className="font-black text-slate-900 text-[10px] tracking-[0.2em] text-center uppercase">{item.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}

function BestSellers({ products, addToCart }: any) {
  const bestSellerItems = products.filter((p: any) => 
    String(p.section || '').toLowerCase().trim() === 'bestseller'
  );

  if (bestSellerItems.length === 0) return null;

  return (
    <section className="relative py-24 bg-[#FDFCFB]">
      <div className="max-w-7xl mx-auto px-4 relative z-20">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-[1px] w-12 bg-[#D4AF37]"></div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">Best Sellers</h2>
        </div>
        <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-8 md:grid md:grid-cols-4">
          {bestSellerItems.map((product: any) => (
            <div key={product.id} className="min-w-[280px]">
              <ProductCard product={product} onAddToCart={addToCart} isCompact={true} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomePage({ products, loading, addToCart }: any) {
  const featuredItems = products.filter((p: any) => 
    String(p.section || '').toLowerCase().trim() === 'featured'
  );

  return (
    <>
      <Hero />
      <div id="categories"><CategorySection /></div>
      
      {/* --- APEX STYLE GRADIENT BACKGROUND --- */}
      <section id="featured-products" className="relative py-20 md:py-32 animate-gradient-sakoon border-y border-amber-50/50">
        <div className="max-w-7xl mx-auto px-4 relative z-20">
          <div className="text-center mb-16 space-y-4">
             <div className="flex items-center justify-center gap-2 text-[#D4AF37]">
                <Sparkles size={16} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em]">The London Atelier</span>
             </div>
             <h2 className="text-4xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter italic">Featured Products</h2>
          </div>
          
          {featuredItems.length > 0 ? (
            <ProductGrid products={featuredItems} loading={loading} onAddToCart={addToCart} />
          ) : !loading && (
            <div className="flex flex-col items-center py-20 text-slate-400">
                <PackageSearch size={48} strokeWidth={1} className="mb-4 opacity-20" />
                <p className="text-[10px] uppercase font-black tracking-widest">No featured items found</p>
            </div>
          )}
        </div>
      </section>

      <Banner /> 
      <TrustBar />
      <div className="w-full bg-[#FDFCFB] relative z-20"><Gallery /></div>
      <AboutSection /> 
      <BestSellers products={products} addToCart={addToCart} />
      <AboutEditorial /> 
    </>
  );
}

export default function App() {
  const { products, loading } = useProducts();
  const { cartItems, addToCart, removeFromCart, updateQuantity, total, itemCount, clearCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();

  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = (product: any) => {
    if (!product) return;
    const resolveImage = () => {
      if (Array.isArray(product.images) && product.images.length > 0) return product.images[0];
      return product.image_url || product.image || 'https://via.placeholder.com/400';
    };

    const cleanProduct = {
      id: String(product.id), 
      name: String(product.name || 'Sakoon Essential'),
      price: Number(product.price) || 0,
      image_url: String(resolveImage()),
      quantity: 1
    };

    addToCart(cleanProduct);
    setIsCartOpen(true); 
  };

  const shouldHideUI = ['/admin', '/checkout', '/login'].includes(location.pathname);
  const safeTotal = Number(total) || 0;
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  return (
    <div className="min-h-screen bg-[#FDFCFB] relative overflow-x-hidden text-slate-900 font-sans selection:bg-[#D4AF37] selection:text-white">
      {!shouldHideUI && <Navigation cartItemCount={itemCount} onCartClick={() => setIsCartOpen(true)} />}
      
      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<HomePage products={products} loading={loading} addToCart={handleAddToCart} />} />
          <Route path="/product/:id" element={<ProductDetail products={products} loading={loading} onAddToCart={handleAddToCart} />} />
          <Route path="/category/:categoryId" element={<CategoryPage onAddToCart={handleAddToCart} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminGuard><Admin /></AdminGuard>} />
          <Route path="/checkout" element={<Checkout clearCart={clearCart} cartItems={safeCartItems} total={safeTotal} />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!shouldHideUI && <Footer />}

      <ShoppingCart 
        key={itemCount} 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={safeCartItems} 
        onUpdateQuantity={updateQuantity} 
        onRemoveItem={removeFromCart} 
        total={safeTotal} 
      />

      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
        className={`fixed bottom-8 right-8 w-12 h-12 flex items-center justify-center rounded-full bg-slate-900 text-white z-40 transition-all shadow-2xl hover:bg-[#D4AF37] ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
}