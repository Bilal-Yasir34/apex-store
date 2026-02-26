export function AboutEditorial() {
  return (
    <section className="bg-white py-24 md:py-40 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Decorative Element */}
        <div className="flex items-center gap-4 mb-12">
          {/* Changed bg-purple-600 to a rich Gold [#D4AF37] */}
          <div className="h-[1px] w-12 bg-[#D4AF37]"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">
            The Skoon Heritage
          </span>
        </div>

        {/* Main Editorial Text */}
        <div className="space-y-12">
          {/* Heading updated for Textile Brand */}
          <h2 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] italic uppercase">
            Weaving the <span className="text-[#D4AF37]">Threads</span> of Pure Comfort<span className="text-[#D4AF37]">.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            <p className="text-lg md:text-xl font-bold text-slate-900 leading-relaxed uppercase tracking-tight">
              At Skoon, we believe that your home is a sanctuary. The fabrics that touch your skin should be a testament to quality, tranquility, and timeless luxury.
            </p>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
              Our journey began with a dedication to the finest fibers and traditional craftsmanship. From our signature prayer mats to our velvet fleece collections, every piece is curated to bring a sense of 'Skoon'—peace—to your daily life. We don't just provide textiles; we craft the backdrop for your most cherished home moments.
            </p>
          </div>

          <div className="pt-12 border-t border-slate-100">
            <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-3xl">
              From the intricate patterns of our floor rugs to the soft embrace of our comforters, our commitment to textile excellence is unwavering. We collaborate with master weavers who understand that luxury lies in the details—the weight of a throw, the sheen of a curtain, and the durability of a kitchen towel.
              <br /><br />
              Skoon is more than a brand; it is an invitation to slow down and appreciate the tactile beauty of a well-furnished life. Thank you for choosing us to be a part of your home’s story.
            </p>
          </div>

          {/* Large Background Quote Styling */}
          <div className="pt-8 flex justify-end">
            <span className="text-6xl md:text-9xl font-black text-slate-100 opacity-20 select-none uppercase italic">
              Comfort
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}