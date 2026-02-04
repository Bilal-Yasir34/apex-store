import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Navigation } from './components/navigation';
import { Hero } from './components/hero';
import { Banner } from './components/banner';
import { ProductGrid, ProductCard } from './components/productgrid';
import { ShoppingCart } from './components/shoppingcart';
import { useProducts } from './hooks/useproducts';
import { useCart } from './hooks/usecart';
import { ArrowUp, ShieldCheck, RefreshCw, Truck, ThumbsUp, Zap, Star, Loader2, Lock, AlertCircle } from 'lucide-react'; 
import Admin from './pages/Admin';
import Checkout from './pages/Checkout'; 
import { CategorySection } from './components/categorysection';
import { Gallery } from './components/gallery';
import { Footer } from './components/footer';
import { ProductDetail } from './components/productdetail';
import { CategoryPage } from './pages/CategoryPage';
import { supabase } from './lib/supabase';
import { useAuth } from './context/AuthContext';

// --- IMPORT POLICY PAGES ---
import ShippingPolicy from './pages/policies/ShippingPolicy';
import RefundPolicy from './pages/policies/RefundPolicy';
import PrivacyPolicy from './pages/policies/PrivacyPolicy';
import TermsOfService from './pages/policies/TermsOfService';

// --- IMPORT YOUR ORIGINAL ABOUT COMPONENTS ---
import { AboutSection } from './components/aboutsection';
import { AboutEditorial } from './components/abouteditorial';

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
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="w-10 h-10 animate-spin text-purple-600 mb-4" />
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Verifying Admin Access</p>
    </div>
  );

  const userEmail = user?.email?.toLowerCase().trim() || "";
  const isAuthorized = ADMIN_EMAILS.some(email => email.toLowerCase().trim() === userEmail);
  return isAuthorized ? <>{children}</> : null;
}

// --- ADMIN LOGIN PAGE ---
function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else if (data.session) {
      window.location.href = '/admin';
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-50 px-4">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-purple-100 rounded-2xl mb-4"><Lock className="w-6 h-6 text-purple-600" /></div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter italic">APEX <span className="text-purple-600">ADMIN</span></h2>
        </div>
        {errorMsg && <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold"><AlertCircle className="w-4 h-4" /> {errorMsg}</div>}
        <div className="space-y-4">
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-purple-500 transition-all text-slate-900" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-purple-500 transition-all text-slate-900" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button disabled={loading} className="w-full py-4 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 transition-all uppercase text-xs tracking-widest">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Sign In'}
          </button>
        </div>
      </form>
    </div>
  );
}

// --- SUB-COMPONENTS ---
const glassAnimationStyle = `
  @keyframes purpleMesh { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
  .animate-purple-fast { background: linear-gradient(-45deg, #ffffff, #a855f7, #3b0764, #d8b4fe); background-size: 300% 300%; animation: purpleMesh 4s ease-in-out infinite; }
  .hide-scrollbar::-webkit-scrollbar { display: none; }
`;

function TrustBar() {
  const features = [{ icon: ShieldCheck, title: '1 YEAR WARRANTY' }, { icon: RefreshCw, title: '7 DAYS REPLACEMENT' }, { icon: Truck, title: 'FREE DELIVERY' }, { icon: ThumbsUp, title: '1k+ CUSTOMERS' }];
  return (
    <section className="bg-white py-6 border-t border-slate-50 relative z-20">
      <div className="max-w-5xl mx-auto px-4 flex flex-row items-center justify-between gap-2">
        {features.map((item, index) => (
          <div key={index} className="flex flex-col items-center justify-center space-y-2 flex-1">
            <item.icon strokeWidth={1.5} className="w-6 h-6 sm:w-8 md:w-10 text-purple-600/40" />
            <h3 className="font-bold text-slate-800 text-[7px] sm:text-[9px] md:text-[11px] tracking-widest text-center uppercase">{item.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}

function BestSellers({ products, addToCart }: any) {
  const bestSellerItems = products.filter((p: any) => p.section === 'bestseller');
  if (bestSellerItems.length === 0) return null;
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 z-0 animate-purple-fast opacity-70"></div>
      <div className="absolute inset-0 z-10 backdrop-blur-[60px] bg-white/20"></div>
      <div className="max-w-7xl mx-auto px-4 relative z-20">
        <h2 className="text-3xl md:text-5xl font-black text-white text-center tracking-tight uppercase mb-12 italic">Best Sellers</h2>
        <div className="flex overflow-x-auto hide-scrollbar gap-6 pb-8 md:grid md:grid-cols-4">
          {bestSellerItems.map((product: any) => (
            <div key={product.id} className="min-w-[280px]">
              <ProductCard product={product} onAddToCart={addToCart} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomePage({ products, loading, addToCart }: any) {
  const featuredItems = products.filter((p: any) => p.section === 'featured');
  return (
    <>
      <style>{glassAnimationStyle}</style>
      <Hero />
      <Banner /> 
      <div id="categories"><CategorySection /></div>
      <section id="featured-products" className="relative pt-10 md:pt-20 pb-6 overflow-hidden">
        <div className="absolute inset-0 z-0 animate-purple-fast opacity-70"></div>
        <div className="absolute inset-0 z-10 backdrop-blur-[60px] bg-white/20"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-20">
          <h2 className="text-3xl md:text-5xl font-black text-white text-center uppercase mb-12 italic">Featured Products</h2>
          <ProductGrid products={featuredItems} loading={loading} onAddToCart={addToCart} />
        </div>
      </section>
      <TrustBar />
      <div className="w-full bg-white relative z-20"><Gallery /></div>
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
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = (product: any) => {
    if (!product) return;

    const resolveImage = () => {
      if (Array.isArray(product.images) && product.images.length > 0) return product.images[0];
      if (product.image_url) return product.image_url;
      if (product.image) return product.image;
      return 'https://via.placeholder.com/400';
    };

    const cleanProduct = {
      id: String(product.id || Math.random().toString(36).substr(2, 9)), 
      name: String(product.name || 'Unknown Product'),
      price: Number(product.price) || 0,
      image_url: String(resolveImage()),
      quantity: 1
    };

    try {
      addToCart(cleanProduct);
      setIsCartOpen(true); 
    } catch (err) {
      console.error("Cart Logic Error:", err);
    }
  };

  const hideHeaderFooterRoutes = ['/admin', '/checkout', '/login'];
  const shouldHideUI = hideHeaderFooterRoutes.includes(location.pathname);

  const safeTotal = typeof total === 'number' && !isNaN(total) ? total : 0;
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden text-slate-900 font-sans">
      {!shouldHideUI && <Navigation cartItemCount={itemCount} onCartClick={() => setIsCartOpen(true)} />}
      
      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<HomePage products={products} loading={loading} addToCart={handleAddToCart} />} />
          <Route path="/product/:id" element={<ProductDetail products={products} loading={loading} onAddToCart={handleAddToCart} />} />
          <Route path="/category/:categoryId" element={<CategoryPage onAddToCart={handleAddToCart} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminGuard><Admin /></AdminGuard>} />
          <Route path="/checkout" element={<Checkout clearCart={clearCart} cartItems={safeCartItems} total={safeTotal} />} />
          
          {/* --- POLICY ROUTES --- */}
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

      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`fixed bottom-8 right-8 p-4 rounded-full bg-slate-900 text-white z-40 transition-all ${showScrollTop ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`}><ArrowUp className="w-5 h-5" /></button>
    </div>
  );
}