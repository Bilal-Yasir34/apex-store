export function AboutEditorial() {
  return (
    <section className="bg-white py-24 md:py-40 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Decorative Element */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-[1px] w-12 bg-purple-600"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-600">
            Our Philosophy
          </span>
        </div>

        {/* Main Editorial Text */}
        <div className="space-y-12">
          <h2 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] italic uppercase">
            Redefining the <span className="text-purple-600">Art</span> of Modern Curation<span className="text-purple-600">.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            <p className="text-lg md:text-xl font-bold text-slate-900 leading-relaxed uppercase tracking-tight">
              We believe that the objects you surround yourself with are a reflection of your internal landscape. In a world of mass production, we stand for the intentional and the exceptional.
            </p>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
              Our journey began with a simple observation: quality is often sacrificed at the altar of convenience. We decided to reverse that narrative. Every piece in our collection is vetted through a rigorous process of aesthetic and functional evaluation. We don't just sell products; we curate experiences that linger in the spaces you call home.
            </p>
          </div>

          <div className="pt-12 border-t border-slate-100">
            <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-3xl">
              From the initial sketch to the final polish, our commitment to excellence is unwavering. We collaborate with artisans who share our vision of a future where design serves humanity, not the other way around. This isn't just about commerce—it's about building a community of individuals who appreciate the nuances of a well-crafted life. 
              <br /><br />
              As we continue to evolve, our mission remains fixed: to provide you with the tools to build a life that is as unique as your signature. Thank you for being part of this movement toward a more beautiful, thoughtful world.
            </p>
          </div>

          {/* Large Background Quote Styling */}
          <div className="pt-8 flex justify-end">
            <span className="text-6xl md:text-9xl font-black text-slate-50 opacity-10 select-none uppercase italic">
              Legacy
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}