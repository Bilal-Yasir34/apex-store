export function SkeletonLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6">
          <div className="relative overflow-hidden bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-shimmer">
            <div className="aspect-square bg-white/5 rounded-xl mb-4"></div>
            <div className="h-6 bg-white/5 rounded-lg mb-3 w-3/4"></div>
            <div className="h-4 bg-white/5 rounded-lg mb-2 w-full"></div>
            <div className="h-4 bg-white/5 rounded-lg mb-4 w-5/6"></div>
            <div className="h-8 bg-white/5 rounded-lg w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
