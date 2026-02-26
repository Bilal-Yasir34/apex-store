import { Link } from 'react-router-dom';
import { 
  LayoutGrid, Flower2, DoorOpen, Star, Bed, Wind, 
  Cloud, Sparkles, Heart, Waves, Sun, Map, Grid, 
  User, Trees, ShoppingBag, Layers, UtensilsCrossed, Frame,
  Zap // Icon for Woolen Shawls
} from 'lucide-react';

const categories = [
  // THE ONLY ACTIVE CATEGORY
  { id: 'woolen_shawls_category', name: 'Woolen Shawls', icon: Layers, active: true },
  { id: 'all', name: 'All Products', icon: LayoutGrid, active: true },

  // DISABLED CATEGORIES
  { id: 'prayer_mats_category', name: 'Prayer Mats', icon: Flower2, active: false },
  { id: 'door_mats_category', name: 'Door Mats', icon: DoorOpen, active: false },
  { id: 'bedsheets_category', name: 'Bedsheets', icon: Bed, active: false },
  { id: 'comforters_category', name: 'Comforters', icon: Wind, active: false },
  { id: 'curtains_category', name: 'Curtains', icon: Sun, active: false },
  { id: 'velvet_fleece_category', name: 'Velvet Fleece', icon: Sparkles, active: false },
  { id: 'cushions_category', name: 'Cushions', icon: Cloud, active: false },
  { id: 'pillows_category', name: 'Pillows', icon: Heart, active: false },
  { id: 'floor_rugs_category', name: 'Floor Rugs', icon: Trees, active: false },
  { id: 'towels_category', name: 'Towels', icon: ShoppingBag, active: false },
  { id: 'kitchen_towels_category', name: 'Kitchen Towels', icon: UtensilsCrossed, active: false },
  { id: 'customer_reviews', name: 'Reviews', icon: Star, active: false },
];

export function CategorySection() {
  const goldGradient = "from-[#D4AF37] to-[#B8860B]";

  return (
    <section id="categories" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-[2px] bg-[#D4AF37]"></span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight uppercase italic">
              Shop by Collection
            </h2>
            <span className="w-8 h-[2px] bg-[#D4AF37]"></span>
          </div>
          <p className="text-[#D4AF37] font-bold text-xs md:text-sm uppercase tracking-[0.3em]">
            Exclusively Available: Woolen Shawls
          </p>
        </div>
        
        {/* Slider Container */}
        <div className="relative group">
          {/* Subtle Side Fades */}
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none"></div>

          {/* Horizontal Scrollable Wrapper */}
          <div className="flex overflow-x-auto gap-4 md:gap-6 pb-12 snap-x snap-mandatory hide-scrollbar">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={cat.active ? `/category/${cat.id}` : '#'}
                onClick={(e) => !cat.active && e.preventDefault()}
                className={`
                  group relative flex-shrink-0 
                  w-[45%] md:w-[18%] 
                  snap-start flex flex-col items-center justify-center 
                  p-6 md:p-8 rounded-2xl border transition-all duration-500
                  ${cat.active 
                    ? 'bg-white border-[#D4AF37] shadow-xl shadow-amber-900/5 cursor-pointer hover:-translate-y-1' 
                    : 'bg-slate-50 border-slate-100 opacity-60 grayscale-[0.8] cursor-not-allowed'
                  }
                `}
              >
                {/* Status Badge for Disabled Items */}
                {!cat.active && (
                  <span className="absolute top-3 right-3 text-[7px] font-black uppercase tracking-widest text-slate-400 border border-slate-200 px-2 py-1 rounded-full">
                    Soon
                  </span>
                )}

                {/* Active Badge for Woolen Shawls */}
                {cat.active && (
                  <span className="absolute top-3 right-3 text-[7px] font-black uppercase tracking-widest text-[#D4AF37] border border-[#D4AF37] px-2 py-1 rounded-full animate-pulse">
                  
                  </span>
                )}

                {/* Icon Container */}
                <div className="relative mb-6">
                  {cat.active && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${goldGradient} opacity-20 blur-2xl rounded-full scale-150 transition-transform duration-500`}></div>
                  )}
                  
                  <div className={`relative p-4 md:p-5 rounded-full bg-white shadow-lg border border-slate-100 transform transition-all duration-500`}>
                    <cat.icon className={`w-6 h-6 md:w-7 md:h-7 ${cat.active ? 'text-[#D4AF37]' : 'text-slate-300'}`} />
                  </div>
                </div>
                
                {/* Text Content */}
                <div className="relative z-10 text-center">
                  <span className={`block font-bold text-[10px] md:text-xs uppercase tracking-widest transition-colors leading-tight ${cat.active ? 'text-slate-900' : 'text-slate-400'}`}>
                    {cat.name.replace('_category', '').replace('_', ' ')}
                  </span>
                  {cat.active && (
                    <div className="mt-2 mx-auto w-4 h-[1px] bg-[#D4AF37]"></div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}