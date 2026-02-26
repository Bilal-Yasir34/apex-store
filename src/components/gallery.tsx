import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const galleryImages = [
  { id: 1, url: '/galleryimage1.png', title: 'Premium Shawls' },
  { id: 2, url: '/galleryimage2.png', title: 'Luxury Collection' },
  { id: 3, url: '/galleryimage3.png', title: '100% Woolen Shawls' },
];

export function Gallery() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <section className="w-full bg-white overflow-hidden">
      <div className="relative group h-[400px] lg:h-[600px] w-full">
        {galleryImages.map((img, index) => (
          <div
            key={img.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
              index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <img
              src={img.url}
              alt={img.title}
              className="w-full h-full object-cover"
            />
            {/* Darker gradient for luxury feel */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent flex items-center p-8 md:p-24">
              <div className="max-w-xl space-y-4">
                <div className="h-[2px] w-12 bg-[#D4AF37]"></div>
                <h3 className="text-white text-4xl md:text-7xl font-black tracking-tighter leading-[0.85] italic uppercase">
                  {img.title.split(' ').slice(0, -1).join(' ')} <br />
                  <span className="text-[#D4AF37]">{img.title.split(' ').pop()}</span>
                </h3>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Buttons with Gold Hover */}
        <button 
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-[#D4AF37] z-30"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-[#D4AF37] z-30"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Golden Progress Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 md:left-auto md:right-24 md:translate-x-0 flex gap-3 z-30">
          {galleryImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-[3px] transition-all duration-700 rounded-full ${
                index === currentIndex ? 'w-16 bg-[#D4AF37]' : 'w-6 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}