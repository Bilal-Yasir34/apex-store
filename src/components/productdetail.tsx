import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import { 
  ChevronLeft, ShieldCheck, Star, Loader2, User, 
  Trash2, Send, AlertCircle, Package, RefreshCw, 
  ThumbsUp, CheckCircle2, Truck
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { ProductCard } from './productgrid';

interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string | null;
}

interface ProductDetailProps {
  products: Product[];
  loading: boolean;
  onAddToCart: (product: Product) => void;
}

export function ProductDetail({ products, loading, onAddToCart }: ProductDetailProps) {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize navigate
  const [activeImg, setActiveImg] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newReview, setNewReview] = useState({ userName: '', rating: 5, comment: '' });

  const product = products.find((p) => p.id === id);

  const fetchReviews = async () => {
    setReviewsLoading(true);
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', id)
      .order('created_at', { ascending: false });
    if (data) setReviews(data);
    setReviewsLoading(false);
  };

  useEffect(() => {
    if (id) fetchReviews();
    setActiveImg(0);
  }, [id]);

  // NEW: Handle Buy Now logic
  const handleBuyNow = () => {
    if (product) {
      onAddToCart(product);
      navigate('/checkout'); // Direct path to checkout
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.userName || !newReview.comment) return;
    setIsSubmitting(true);
    setError(null);
    
    const { data: { user } } = await supabase.auth.getUser();
    const { error: err } = await supabase.from('reviews').insert([{
      product_id: id,
      user_name: newReview.userName,
      rating: newReview.rating,
      comment: newReview.comment,
      user_id: user?.id || null,
    }]);

    if (err) setError("Failed to post review. Try again.");
    else {
      setNewReview({ userName: '', rating: 5, comment: '' });
      fetchReviews();
    }
    setIsSubmitting(false);
  };

  const deleteReview = async (reviewId: string) => {
    const { error: err } = await supabase.from('reviews').delete().eq('id', reviewId);
    if (!err) setReviews(reviews.filter((r) => r.id !== reviewId));
  };

  if (loading) return (
    <div className="pt-40 flex flex-col items-center justify-center h-screen bg-white">
      <Loader2 className="w-10 h-10 animate-spin text-purple-600 mb-4" />
      <p className="font-bold uppercase tracking-widest text-[10px] text-slate-400">Syncing Catalog...</p>
    </div>
  );

  if (!product) return <div className="pt-40 text-center h-screen bg-white font-black uppercase">Product Not Found</div>;

  const suggestedProducts = products.filter((p) => p.id !== id).sort(() => 0.5 - Math.random()).slice(0, 8);
  const hasDiscount = product.compare_at_price > product.price;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="pt-28 pb-20 min-h-screen bg-white animate-fade-in">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .shimmer-btn {
          position: relative;
          overflow: hidden;
        }
        .shimmer-btn::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          animation: shimmer 2s infinite;
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-purple-600 mb-10 font-bold uppercase text-[10px] tracking-[0.2em]">
          <ChevronLeft size={14} /> Back to Collection
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-32">
          {/* Gallery UI */}
          <div className="space-y-6">
            <div className="aspect-square rounded-[2.5rem] overflow-hidden bg-slate-50 border border-slate-100 relative shadow-sm">
              <img src={product.images[activeImg]} className="w-full h-full object-cover" alt={product.name} />
              {hasDiscount && (
                <div className="absolute top-8 left-8 z-10 px-4 py-2 rounded-2xl bg-red-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg animate-bounce">
                  Sale Active
                </div>
              )}
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
              {product.images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImg(i)}
                  className={`min-w-[80px] h-20 rounded-2xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-purple-600 scale-95 shadow-md' : 'border-transparent opacity-50'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="thumb" />
                </button>
              ))}
            </div>
          </div>

          {/* Info UI */}
          <div className="space-y-8 lg:sticky lg:top-28">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-[10px] font-black uppercase tracking-widest border border-purple-100">
                  {product.category}
                </span>
                {isOutOfStock ? (
                  <span className="text-red-600 font-bold text-[10px] uppercase flex items-center gap-1"><AlertCircle size={12}/> Out of Stock</span>
                ) : (
                  <span className="text-green-600 font-bold text-[10px] uppercase flex items-center gap-1"><CheckCircle2 size={12}/> In Stock ({product.stock})</span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic leading-tight tracking-tight">{product.name}</h1>
              <div className="flex items-center gap-4">
                <p className="text-4xl font-black text-slate-900">Rs. {product.price.toLocaleString()}</p>
                {hasDiscount && (
                  <p className="text-xl text-red-600 line-through font-bold decoration-2">
                    Rs. {product.compare_at_price.toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            <p className="text-slate-500 text-lg italic border-l-4 border-purple-100 pl-4 leading-relaxed">{product.description}</p>

            <div className="flex flex-col gap-4">
              <button 
                onClick={() => onAddToCart(product)} 
                disabled={isOutOfStock}
                className={`w-full py-5 border-2 border-slate-900 rounded-2xl font-black uppercase tracking-widest transition-all transform active:scale-95 ${isOutOfStock ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' : 'hover:bg-slate-900 hover:text-white'}`}
              >
                {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
              </button>
              
              {/* UPDATED: Buy Now button now triggers handleBuyNow */}
              <button 
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className={`w-full py-5 bg-purple-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-purple-200 transform active:scale-95 transition-all shimmer-btn ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'}`}
              >
                Buy It Now
              </button>
            </div>

            {/* Trust Bar */}
            <div className="grid grid-cols-2 gap-4 py-8 border-y border-slate-100">
               <div className="flex items-center gap-3"><ShieldCheck className="text-purple-600" size={20}/><span className="text-[10px] font-black uppercase tracking-widest">1 Year Warranty</span></div>
               <div className="flex items-center gap-3"><RefreshCw className="text-purple-600" size={20}/><span className="text-[10px] font-black uppercase tracking-widest">7 Day Return</span></div>
               <div className="flex items-center gap-3"><Truck className="text-purple-600" size={20}/><span className="text-[10px] font-black uppercase tracking-widest">Free Shipping</span></div>
               <div className="flex items-center gap-3"><ThumbsUp className="text-purple-600" size={20}/><span className="text-[10px] font-black uppercase tracking-widest">Trusted Quality</span></div>
            </div>
          </div>
        </div>

        {/* Suggestion Carousel */}
        <section className="mt-32 pt-16 border-t border-slate-100">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">More to <span className="text-purple-600">Discover</span></h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest md:hidden">Swipe to explore →</p>
          </div>
          <div className="flex overflow-x-auto gap-4 md:gap-8 pb-10 snap-x snap-mandatory hide-scrollbar md:grid md:grid-cols-4 md:overflow-visible">
            {suggestedProducts.map((item) => (
              <div key={item.id} className="min-w-[75%] sm:min-w-[45%] md:min-w-0 snap-center">
                <ProductCard product={item} onAddToCart={onAddToCart} />
              </div>
            ))}
          </div>
        </section>

        {/* REVIEWS SECTION */}
        <section className="max-w-4xl mx-auto mt-32 border-t pt-20">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-black uppercase text-slate-900">
              Reviews <span className="text-purple-600">({reviews.length})</span>
            </h2>
            <div className="flex items-center gap-1 text-yellow-400">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
          </div>

          {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold uppercase flex items-center gap-2"><AlertCircle size={14}/> {error}</div>}

          {/* Form */}
          <form onSubmit={handleAddReview} className="bg-slate-50 p-8 rounded-[2.5rem] mb-16 shadow-sm border border-slate-100">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <input 
                className="w-full p-4 rounded-xl border-none outline-none font-bold text-sm bg-white shadow-inner" 
                placeholder="Your Name" 
                value={newReview.userName}
                onChange={(e) => setNewReview({...newReview, userName: e.target.value})}
                required
              />
              <div className="flex items-center gap-4 px-4 bg-white rounded-xl shadow-inner">
                <span className="text-[10px] font-black uppercase text-slate-400">Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setNewReview({...newReview, rating: num})}
                      className="transition-transform active:scale-125"
                    >
                      <Star 
                        size={20} 
                        className={newReview.rating >= num ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'} 
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <textarea 
              className="w-full mb-6 p-4 rounded-xl border-none outline-none font-medium text-sm bg-white shadow-inner" 
              placeholder="How was your experience?" 
              rows={4}
              value={newReview.comment}
              onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
              required
            />
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-purple-600 transition-all disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={14}/> : <><Send size={14}/> Post Review</>}
            </button>
          </form>

          {/* List */}
          {reviewsLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-purple-600" /></div>
          ) : reviews.length === 0 ? (
            <p className="text-center text-slate-400 italic">No reviews yet. Be the first!</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((r) => (
                <div key={r.id} className="p-8 border border-slate-100 rounded-[2rem] flex flex-col gap-4 group hover:border-purple-100 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                        <User size={20} />
                      </div>
                      <div>
                        <h4 className="font-black uppercase text-sm text-slate-900">{r.user_name}</h4>
                        <div className="flex text-yellow-400 gap-0.5 mt-1">
                          {[...Array(r.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{new Date(r.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button onClick={() => deleteReview(r.id)} className="text-slate-200 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                  </div>
                  <p className="text-slate-600 italic leading-relaxed">"{r.comment}"</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}