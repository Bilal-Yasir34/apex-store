import { Link } from 'react-router-dom';
import { Headphones, Watch, Smartphone, Zap, Music, LayoutGrid } from 'lucide-react';

const categories = [
  { id: 'all', name: 'All Products', icon: LayoutGrid },
  { id: 'airpods', name: 'AirPods', icon: Music },
  { id: 'headphones', name: 'Headphones', icon: Headphones },
  { id: 'smart-watches', name: 'Smart Watches', icon: Watch },
  { id: 'wireless-chargers', name: 'Wireless Chargers', icon: Zap },
  { id: 'cases', name: 'Cases', icon: Smartphone },
];

export function CategorySection() {
  const purpleGradient = "from-purple-600 to-indigo-600";

  return (
    /* ADDED id="categories" HERE FOR SMOOTH SCROLLING */
    <section id="categories" className="py-16 bg-purple-100/50 relative overflow-hidden shadow-inner">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-300/20 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-1.5 bg-purple-700 rounded-sm"></span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Categories
            </h2>
            <span className="w-10 h-1.5 bg-purple-700 rounded-sm"></span>
          </div>
          <p className="text-slate-700 font-bold text-sm md:text-base opacity-70">
            Swipe to explore
          </p>
        </div>
        
        {/* Container for the Fade Effect */}
        <div className="relative">
          {/* Right side fade - Only visible on mobile */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-purple-100/80 to-transparent z-20 pointer-events-none md:hidden"></div>

          {/* Scrolling Grid Container */}
          <div className="flex overflow-x-auto pb-8 gap-4 snap-x snap-mandatory hide-scrollbar md:grid md:grid-cols-3 lg:grid-cols-6 md:gap-6 md:overflow-visible">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="group relative flex-shrink-0 w-[40%] snap-start flex flex-col items-center justify-center p-5 md:p-8 overflow-hidden rounded-2xl bg-white border border-purple-200 transition-all duration-500 hover:border-purple-400 md:hover:-translate-y-2 shadow-md md:w-auto"
              >
                {/* Icon Container */}
                <div className="relative mb-4">
                  {/* Hover Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${purpleGradient} opacity-30 blur-2xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-500`}></div>
                  
                  {/* Icon Box */}
                  <div className={`relative p-3 md:p-5 rounded-xl bg-gradient-to-br ${purpleGradient} shadow-lg shadow-purple-600/30 transform group-hover:rotate-6 transition-all duration-500`}>
                    <cat.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                </div>
                
                {/* Text Content */}
                <div className="relative z-10 text-center">
                  <span className="block text-slate-900 font-black text-xs md:text-base transition-colors group-hover:text-purple-700 leading-tight">
                    {cat.name}
                  </span>
                  {/* Animated underline for desktop */}
                  <div className="mt-1.5 mx-auto w-0 h-1 bg-purple-600 rounded-full group-hover:w-6 transition-all duration-500 hidden md:block"></div>
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