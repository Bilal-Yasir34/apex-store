import { ArrowRight, Sparkles } from 'lucide-react';

export function Hero() {
  // Helper function for smooth scrolling
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-10 bg-white">
      {/* Dynamic Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-[120px] animate-blob"></div>
        <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-blue-200/40 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-pink-100/40 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="text-center lg:text-left relative z-20 pointer-events-none">
            <div className="pointer-events-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 mb-6 group hover:bg-purple-100 transition-all duration-300">
                <Sparkles className="w-4 h-4 text-purple-600 group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-sm font-bold text-purple-700 tracking-wide uppercase">Premium Mobile Accessories</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black mb-6 leading-[1.05] text-purple-900 tracking-tight">
                Elevate Your <br />
                <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                  Mobile Experience
                </span>
              </h1>

              <p className="text-xl text-slate-500 mb-8 max-w-xl leading-relaxed font-medium mx-auto lg:mx-0">
                Discover our collection of premium mobile accessories designed with precision engineering 
                and clean aesthetics. Where technology meets lifestyle.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <button
                  onClick={() => scrollToSection('categories')}
                  className="group relative px-10 py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-extrabold text-lg shadow-xl shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/40 text-center"
                >
                  <span className="relative z-10 flex items-center gap-2 justify-center">
                    Explore Collection
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>

                <button
                  onClick={() => scrollToSection('featured-products')}
                  className="group px-10 py-5 rounded-2xl border-2 border-purple-500 bg-transparent text-purple-600 font-extrabold text-lg hover:bg-purple-50 transition-all duration-300 hover:scale-105 flex items-center gap-2 justify-center"
                >
                  View Featured
                </button>
              </div>
            </div>
          </div>

          {/* Right Side Visuals */}
          <div className="absolute lg:relative inset-0 lg:inset-auto h-full lg:h-[500px] flex items-center justify-center z-0 pointer-events-none">
            <div className="relative w-full h-full flex items-center justify-center perspective-1000 scale-75 sm:scale-90 lg:scale-100">
              
              <div className="absolute inset-0 flex items-center justify-center animate-float opacity-15 lg:opacity-100 transition-all duration-700">
                <div className="relative w-64 h-[350px] lg:w-80 lg:h-[420px] transform rotate-3 lg:rotate-3">
                  <div className="absolute inset-0 rounded-[3rem] bg-white border border-white shadow-2xl p-4">
                    <div className="w-full h-full rounded-[2.5rem] bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-8 text-white">
                      <div className="w-24 h-24 lg:w-32 lg:h-32 mb-8 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                        <Sparkles className="w-12 h-12 lg:w-16 lg:h-16 text-white" />
                      </div>
                      <h3 className="font-black text-xl lg:text-2xl mb-1 text-center">MagSafe Ultra</h3>
                      <p className="text-white/80 font-bold text-xs tracking-widest uppercase">Premium Case</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute top-20 right-0 lg:top-10 lg:-right-4 animate-float animation-delay-2000 opacity-10 lg:opacity-100 transition-all duration-700">
                <div className="w-32 h-32 lg:w-52 lg:h-52 rounded-[2rem] lg:rounded-[2.5rem] bg-white border border-white shadow-xl transform -rotate-6 p-3">
                  <div className="w-full h-full rounded-[1.5rem] lg:rounded-[2rem] bg-gradient-to-tr from-indigo-400 to-purple-400 flex flex-col items-center justify-center p-4 text-white">
                    <div className="w-10 h-10 lg:w-16 lg:h-16 mb-2 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                      <div className="w-4 h-4 rounded-full bg-white animate-pulse" />
                    </div>
                    <h3 className="font-black text-sm lg:text-lg">Quantum</h3>
                    <p className="text-white/80 font-bold text-[6px] lg:text-[10px] tracking-widest uppercase">Charger</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}