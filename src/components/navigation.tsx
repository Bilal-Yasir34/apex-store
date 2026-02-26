import { ShoppingCart, Menu, X, Search, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface NavigationProps {
  cartItemCount: number;
  onCartClick: () => void;
}

export function Navigation({ cartItemCount, onCartClick }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();

  // Sakoon Categories: Only Woolen Shawls is active
  const navCategories = [
    { name: 'Woolen Shawls', id: 'woolen_shawls_category', active: true },
    { name: 'Prayer Mats', id: 'prayer_mats_category', active: false },
    { name: 'Bedsheets', id: 'bedsheets_category', active: false },
    { name: 'Comforters', id: 'comforters_category', active: false },
    { name: 'Curtains', id: 'curtains_category', active: false },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    // Smart Routing (If searching for shawls, go to that category)
    if (query.includes('shawl') || query.includes('wool')) {
      navigate(`/category/woolen_shawls_category?search=${encodeURIComponent(query)}`);
    } else {
      // For now, redirect general searches to the only active category
      navigate(`/category/woolen_shawls_category?search=${encodeURIComponent(query)}`);
    }

    setIsSearchOpen(false);
    setSearchQuery('');
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToCategories = () => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? 'backdrop-blur-2xl bg-white/95 border-b border-amber-100 shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between lg:grid lg:grid-cols-3 h-20 md:h-28">
            
            {/* Left: Nav Links */}
            <div className="flex items-center">
              <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-800">
                <Menu size={24} />
              </button>
              
              <div className="hidden lg:flex items-center gap-8">
                <Link to="/" className="text-slate-900 hover:text-[#D4AF37] font-bold uppercase text-[10px] tracking-[0.2em] transition-colors">Home</Link>
                <button onClick={scrollToCategories} className="text-slate-900 hover:text-[#D4AF37] font-bold uppercase text-[10px] tracking-[0.2em] transition-colors">Collections</button>
              </div>
            </div>

            {/* Center: Logo */}
            <div className="flex justify-center items-center">
              <Link to="/" className="flex flex-col items-center group">
                <img 
                  src="/skoonlogo.png" 
                  alt="Sakoon Logo" 
                  className="h-14 md:h-20 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
            </div>

            {/* Right: Search & Cart */}
            <div className="flex items-center justify-end gap-2 sm:gap-4">
              <div className="flex items-center">
                {isSearchOpen ? (
                  <form onSubmit={handleSearchSubmit} className="absolute inset-x-0 top-0 h-full bg-white flex items-center px-4 lg:relative lg:inset-auto lg:w-64 animate-in slide-in-from-top-2">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search Shawls..."
                      className="w-full bg-slate-50 border border-amber-100 rounded-full py-2 pl-4 pr-10 text-sm outline-none focus:border-[#D4AF37]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="button" onClick={() => setIsSearchOpen(false)} className="absolute right-6 lg:right-3 text-slate-400 hover:text-red-500">
                      <X size={16} />
                    </button>
                  </form>
                ) : (
                  <button onClick={() => setIsSearchOpen(true)} className="p-2 text-slate-800 hover:text-[#D4AF37] transition-colors">
                    <Search size={22} />
                  </button>
                )}
              </div>

              <button onClick={onCartClick} className="relative p-2 text-slate-800 hover:text-[#D4AF37] transition-colors group">
                <ShoppingCart size={22} />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-[#D4AF37] text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MOBILE SIDEBAR --- */}
      <div 
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <aside className={`fixed top-0 left-0 bottom-0 w-[80%] max-w-[320px] bg-white z-[70] shadow-2xl transition-transform duration-500 ease-in-out lg:hidden ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-6 border-b border-amber-50">
          <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">Navigation</span>
          <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-400">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 flex flex-col gap-8">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">Home</Link>
          <button onClick={scrollToCategories} className="text-left text-2xl font-black italic uppercase tracking-tighter text-slate-900">Collections</button>
          
          <div className="space-y-6">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Shop Textiles</p>
            {navCategories.map((cat) => (
              <button 
                key={cat.id} 
                disabled={!cat.active}
                onClick={() => { 
                  if(cat.active) {
                    navigate(`/category/${cat.id}`); 
                    setMobileMenuOpen(false); 
                  }
                }} 
                className={`flex items-center justify-between w-full text-left text-lg font-bold uppercase transition-colors ${
                  cat.active ? 'text-slate-700 hover:text-[#D4AF37]' : 'text-slate-300 cursor-not-allowed'
                }`}
              >
                <span>{cat.name}</span>
                {!cat.active && <Lock size={14} className="opacity-40" />}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}