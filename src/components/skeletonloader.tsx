export function SkeletonLoader() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
      <style>{`
        @keyframes subtle-pulse {
          0% { background-color: #F8F5F0; }
          50% { background-color: #FDFBF7; }
          100% { background-color: #F8F5F0; }
        }
        .animate-Skoon-pulse {
          animation: subtle-pulse 2s infinite ease-in-out;
        }
      `}</style>
      
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex flex-col animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
          {/* Image Placeholder */}
          <div className="aspect-square rounded-[2.5rem] bg-[#F8F5F0] border border-amber-50/50 mb-6 animate-Skoon-pulse overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-50/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>

          {/* Category Tag Placeholder */}
          <div className="h-3 w-20 bg-[#F8F5F0] rounded-full mb-4 animate-Skoon-pulse"></div>

          {/* Title Placeholder */}
          <div className="space-y-3 mb-6">
            <div className="h-6 bg-[#F8F5F0] rounded-lg w-3/4 animate-Skoon-pulse"></div>
            <div className="h-6 bg-[#F8F5F0] rounded-lg w-1/2 animate-Skoon-pulse"></div>
          </div>

          {/* Description/Price Placeholder */}
          <div className="flex items-center justify-between mt-auto">
            <div className="h-8 bg-[#F8F5F0] rounded-xl w-1/3 animate-Skoon-pulse"></div>
            <div className="h-10 w-10 bg-[#F8F5F0] rounded-full animate-Skoon-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
}