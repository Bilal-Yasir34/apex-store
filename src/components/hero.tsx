import { ArrowRight, Sparkles, Wind, Flower2 } from 'lucide-react';

export function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-10 bg-[#FCFAF7]">
      
      {/* --- BACKGROUND LAYER: SUBTLE FLOATING VISUALS --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        
        {/* Soft Golden Glows */}
        <div className="absolute top-[-5%] left-[-5%] w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[500px] h-[500px] bg-[#B8860B]/5 rounded-full filter blur-[100px] animate-pulse animation-delay-2000"></div>

        {/* Shrunken, Faded Background Card 1 (Left) */}
        <div className="absolute top-1/4 left-10 md:left-20 w-32 h-48 md:w-48 md:h-64 bg-white/40 rounded-2xl border border-[#D4AF37]/10 p-2 transform -rotate-12 opacity-40 animate-float">
          <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center">
             <Wind className="w-8 h-8 text-white/50" />
          </div>
        </div>

        {/* Shrunken, Faded Background Card 2 (Right) */}
        <div className="absolute bottom-1/4 right-10 md:right-32 w-28 h-28 md:w-40 md:h-40 bg-white/40 rounded-2xl border border-[#D4AF37]/10 p-2 transform rotate-12 opacity-50 animate-float animation-delay-2000">
          <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center">
             <Flower2 className="w-6 h-6 text-[#D4AF37]/50" />
          </div>
        </div>

        {/* Shrunken, Faded Background Card 3 (Center-Top) */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-[#D4AF37]/5 rounded-full border border-[#D4AF37]/5 flex items-center justify-center opacity-30 animate-pulse">
           <Sparkles className="w-4 h-4 text-[#D4AF37]" />
        </div>
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="max-w-4xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#D4AF37]/20 mb-8 group hover:border-[#D4AF37] transition-all duration-300 shadow-sm">
            <Sparkles className="w-4 h-4 text-[#D4AF37] group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-[10px] font-black text-[#D4AF37] tracking-[0.3em] uppercase">Premium Home Textiles</span>
          </div>

          <h1 className="text-6xl md:text-9xl font-black mb-8 leading-[0.85] text-slate-900 tracking-tighter uppercase italic">
            Experience <br />
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-[#D4AF37] bg-clip-text text-transparent">
              Pure Skoon
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-slate-600 mb-10 max-w-2xl leading-relaxed font-medium mx-auto font-serif italic">
            Masterfully crafted textiles designed to transform your home <br className="hidden md:block" /> 
            into a sanctuary of peace and timeless elegance.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <button
              onClick={() => scrollToSection('categories')}
              className="group relative px-12 py-5 rounded-full bg-[#D4AF37] text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-amber-900/10 transition-all duration-300 hover:bg-[#B8860B] hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2 justify-center">
                Explore Collections
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>

            <button
              onClick={() => scrollToSection('about')}
              className="group px-12 py-5 rounded-full border border-[#D4AF37]/30 bg-white/50 backdrop-blur-sm text-[#D4AF37] font-black text-sm uppercase tracking-widest hover:bg-[#D4AF37] hover:text-white transition-all duration-300 hover:scale-105"
            >
              Our Story
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}