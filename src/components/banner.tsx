import { ArrowRight } from 'lucide-react';

export function Banner() {
  const scrollToCategories = () => {
    const element = document.getElementById('categories');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative w-full h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden">
      {/* Background Image Container */}
      <div 
        className="absolute inset-0 z-0 transition-transform duration-700 hover:scale-105"
        style={{
          backgroundImage: 'url("/bannerimage1.png")',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Dark Overlay - slightly adjusted for a more premium feel */}
      <div className="absolute inset-0 bg-black/50 z-10"></div>

      {/* Content Container */}
      <div className="relative z-20 text-center px-4 max-w-4xl">
        <h2 className="text-3xl md:text-6xl font-black text-white tracking-tighter mb-4 drop-shadow-lg uppercase italic">
          Experience Pure <span className="text-[#D4AF37]">Skoon</span>
        </h2>
        <p className="text-white/90 text-sm md:text-xl font-medium mb-8 max-w-2xl mx-auto drop-shadow-md">
          Discover premium textiles designed for the elegant home. 
          Luxury comfort that defines your sanctuary.
        </p>
        
        {/* Updated Button with Gold Hover Logic */}
        <button 
          onClick={scrollToCategories}
          className="group flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-all hover:bg-[#D4AF37] hover:text-white mx-auto shadow-xl"
        >
          Explore Collections
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </section>
  );
}