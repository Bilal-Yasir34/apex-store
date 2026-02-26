import { ArrowRight } from 'lucide-react';

export function AboutSection() {
  return (
    <section className="bg-white py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 space-y-24 md:space-y-32">
        
        {/* Row 1: Text Left, Image Right */}
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          <div className="flex-1 space-y-6 order-2 md:order-1">
            <div className="inline-block px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest">
              Our Story
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight uppercase italic">
              Crafted with <span className="text-[#D4AF37]">Artistry</span> & Care.
            </h2>
            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed italic font-serif">
              "We believe that the textiles in your home should be more than just functional—they should be an invitation to tranquility. Skoon began with a simple goal: to create premium linens and mats that elevate your sanctuary through exceptional quality and timeless design."
            </p>
            <button className="flex items-center gap-2 text-slate-900 font-bold hover:text-[#D4AF37] transition-colors group">
              Discover Skoon <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="flex-1 order-1 md:order-2">
            <div className="relative group">
              <div className="absolute -inset-4 bg-[#D4AF37]/5 rounded-[2rem] -rotate-2 transition-transform group-hover:rotate-0 duration-500"></div>
              <img 
                src="/aboutimage1.png" 
                alt="The Skoon Story" 
                className="relative rounded-2xl shadow-2xl object-cover aspect-[4/3] w-full transform transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>

        {/* Row 2: Image Left, Text Right */}
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          <div className="flex-1">
            <div className="relative group">
              <div className="absolute -inset-4 bg-slate-100 rounded-[2rem] rotate-2 transition-transform group-hover:rotate-0 duration-500"></div>
              <img 
                src="/aboutimage2.png" 
                alt="Our Vision" 
                className="relative rounded-2xl shadow-2xl object-cover aspect-[4/3] w-full transform transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
              Our Vision
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight uppercase italic text-right md:text-left">
              The Future of <span className="text-[#D4AF37]">Luxury</span>.
            </h2>
            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed italic font-serif text-right md:text-left">
              "Our vision is to enrich the modern home with textiles that inspire peace. We don't just weave fabrics; we craft the soft moments that turn a house into a haven, elevating your daily routine from ordinary to extraordinary."
            </p>
            <div className="flex justify-end md:justify-start">
              <button className="flex items-center gap-2 text-slate-900 font-bold hover:text-[#D4AF37] transition-colors group">
                View All Collections <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}