import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const galleryImages = [
  { id: 1, url: '/bannerimage.png', title: 'Premium Aesthetics' },
  { id: 2, url: '/galleryimage2.png', title: 'Unmatched Quality' },
  { id: 3, url: '/galleryimage3.png', title: 'Modern Lifestyle' },
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
      {/* Reduced height here: h-[400px] on mobile, h-[500px] on desktop */}
      <div className="relative group h-[400px] lg:h-[500px] w-full">
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
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent flex items-center p-8 md:p-20">
              <h3 className="text-white text-3xl md:text-5xl font-black tracking-tighter max-w-xl leading-none">
                {img.title.toUpperCase()}
              </h3>
            </div>
          </div>
        ))}

        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 z-20"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 z-20"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-6 right-10 flex gap-2 z-20">
          {galleryImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1 transition-all duration-500 ${
                index === currentIndex ? 'w-10 bg-white' : 'w-4 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}