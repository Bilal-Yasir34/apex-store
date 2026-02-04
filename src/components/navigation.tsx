import { ShoppingCart, Smartphone, Menu, X, Search } from 'lucide-react';
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

  const categories = [
    { name: 'All Products', id: 'all' },
    { name: 'Smart Watches', id: 'smart-watches' },
    { name: 'AirPods', id: 'airpods' },
    { name: 'Headphones', id: 'headphones' },
    { name: 'Wireless Chargers', id: 'wireless-chargers' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    // --- SMART ROUTING LOGIC ---
    // Mapping various user inputs to your specific category IDs
    const categoryMapping: { [key: string]: string } = {
      'airpod': 'airpods',
      'air pod': 'airpods',
      'pods': 'airpods',
      'apple watch': 'smart-watches',
      'watch': 'smart-watches',
      'smartwatch': 'smart-watches',
      'headphone': 'headphones',
      'head phone': 'headphones',
      'earphone': 'headphones',
      'charger': 'wireless-chargers',
      'wireless': 'wireless-chargers',
      'magsafe': 'wireless-chargers'
    };

    let targetCategory = 'all';

    // 1. Check if the query specifically contains any of our mapping keywords
    for (const [key, value] of Object.entries(categoryMapping)) {
      if (query.includes(key)) {
        targetCategory = value;
        break;
      }
    }

    // 2. If no keyword match, check if it matches a category name directly
    const directMatch = categories.find(cat => 
      query.includes(cat.name.toLowerCase()) || query.includes(cat.id)
    );
    if (directMatch) targetCategory = directMatch.id;

    // 3. Navigate to the determined category with the search term
    navigate(`/category/${targetCategory}?search=${encodeURIComponent(query)}`);
    
    // UI Cleanup
    setIsSearchOpen(false);
    setSearchQuery('');
    setMobileMenuOpen(false);
  };

  const handleCategoryNavigation = (categoryId: string) => {
    setMobileMenuOpen(false);
    navigate(`/category/${categoryId}`);
  };

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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Main Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? 'backdrop-blur-2xl bg-white/90 border-b border-slate-200 shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-purple-900 shadow-lg">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-slate-900 via-purple-800 to-purple-600 bg-clip-text text-transparent tracking-tighter italic">
                APEX
              </span>
            </Link>

            {/* Desktop Links */}
            {!isSearchOpen && (
              <div className="hidden lg:flex items-center gap-6">
                <Link to="/" className="text-slate-600 hover:text-purple-600 font-bold uppercase text-[10px] tracking-[0.2em]">Home</Link>
                <button onClick={scrollToCategories} className="text-slate-500 hover:text-purple-600 font-bold uppercase text-[10px] tracking-[0.2em] whitespace-nowrap">
                  Collections
                </button>
                <div className="h-4 w-[1px] bg-slate-200 mx-2"></div>
                {categories.slice(1, 5).map((cat) => (
                  <button 
                    key={cat.id} 
                    onClick={() => handleCategoryNavigation(cat.id)} 
                    className="text-slate-500 hover:text-purple-600 font-bold uppercase text-[10px] tracking-[0.2em] whitespace-nowrap"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}

            {/* Right Side Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`flex items-center transition-all duration-300 ${isSearchOpen ? 'w-[200px] sm:w-[300px]' : 'w-10'}`}>
                {isSearchOpen ? (
                  <form onSubmit={handleSearchSubmit} className="relative w-full">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search products..."
                      className="w-full bg-slate-100 border border-purple-200 rounded-xl py-2 pl-4 pr-10 text-sm outline-none focus:border-purple-500 transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="button" onClick={() => setIsSearchOpen(false)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500">
                      <X size={16} />
                    </button>
                  </form>
                ) : (
                  <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-purple-600 transition-colors"
                  >
                    <Search size={20} />
                  </button>
                )}
              </div>

              <button onClick={onCartClick} className="relative p-2.5 rounded-xl bg-slate-100 border border-slate-200 group">
                <ShoppingCart className="w-5 h-5 text-slate-700 group-hover:text-purple-600" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-purple-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>

              <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700">
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MOBILE SIDEBAR --- */}
      <div 
        className={`fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <aside className={`fixed top-0 right-0 bottom-0 w-[75%] max-w-[300px] bg-white z-[70] shadow-2xl transition-transform duration-500 ease-in-out lg:hidden ${
        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Menu</span>
          <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 flex flex-col gap-8">
          <form onSubmit={handleSearchSubmit} className="relative lg:hidden">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </form>

          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold uppercase tracking-widest text-slate-900">Home</Link>
          <button onClick={scrollToCategories} className="text-left text-lg font-bold uppercase tracking-widest text-slate-900">Collections</button>
          
          <div className="flex flex-col gap-6">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-600">Browse Categories</p>
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => handleCategoryNavigation(cat.id)} className="text-left text-xl font-bold text-slate-800 uppercase tracking-tighter hover:text-purple-600 transition-colors flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-200 group-hover:bg-purple-600" />
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}