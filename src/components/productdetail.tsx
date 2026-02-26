import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, ShieldCheck, Star, Loader2, User, 
  Trash2, Send, AlertCircle, RefreshCw, 
  ThumbsUp, Truck, Sparkles
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { ProductCard } from './productcard';

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
  const navigate = useNavigate();
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
    window.scrollTo(0, 0);
  }, [id]);

  const handleBuyNow = () => {
    if (product) {
      onAddToCart(product);
      navigate('/checkout');
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
    <div className="pt-40 flex flex-col items-center justify-center h-screen bg-[#FCFAF7]">
      <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37] mb-4" />
      <p className="font-black uppercase tracking-[0.3em] text-[10px] text-slate-400">Tailoring your experience...</p>
    </div>
  );

  if (!product) return <div className="pt-40 text-center h-screen bg-white font-black uppercase tracking-widest text-slate-400">Product Not Found</div>;

  const suggestedProducts = products.filter((p) => p.id !== id).sort(() => 0.5 - Math.random()).slice(0, 8);
  const hasDiscount = product.compare_at_price > product.price;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="pt-28 pb-20 min-h-screen bg-white animate-fade-in">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes subtle-glow {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }
        .premium-glow {
          animation: subtle-glow 3s infinite ease-in-out;
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#D4AF37] mb-10 font-black uppercase text-[10px] tracking-[0.3em] transition-colors">
          <ChevronLeft size={14} /> Back to Boutique
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start mb-32">
          {/* Gallery UI */}
          <div className="space-y-6">
            <div className="aspect-square rounded-[3rem] overflow-hidden bg-[#FCFAF7] border border-amber-50 relative shadow-xl shadow-amber-900/5">
              <img src={product.images[activeImg]} className="w-full h-full object-cover" alt={product.name} />
              {hasDiscount && (
                <div className="absolute top-8 left-8 z-10 px-5 py-2 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest shadow-2xl">
                  Exclusive Offer
                </div>
              )}
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
              {product.images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImg(i)}
                  className={`min-w-[90px] h-24 rounded-[1.5rem] overflow-hidden border-2 transition-all duration-500 ${activeImg === i ? 'border-[#D4AF37] scale-95 shadow-lg' : 'border-transparent opacity-40 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="thumb" />
                </button>
              ))}
            </div>
          </div>

          {/* Info UI */}
          <div className="space-y-10 lg:sticky lg:top-32">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 rounded-full bg-amber-50 text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.2em] border border-amber-100">
                  {product.category.replace('_category', '').replace('_', ' ')}
                </span>
                {isOutOfStock ? (
                  <span className="text-red-400 font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5"><AlertCircle size={14}/> Restocking Soon</span>
                ) : (
                  <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5"><Sparkles size={14} className="text-[#D4AF37]"/> Artisan Quality</span>
                )}
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 uppercase italic leading-[1.1] tracking-tighter">{product.name}</h1>
              <div className="flex items-center gap-6">
                <p className="text-5xl font-black text-slate-900 tracking-tighter">£ {product.price.toLocaleString()}</p>
                {hasDiscount && (
                  <div className="flex flex-col">
                    <p className="text-lg text-slate-300 line-through font-bold">£ {product.compare_at_price.toLocaleString()}</p>
                    <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-widest">Save {Math.round((1 - product.price/product.compare_at_price)*100)}%</span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-slate-500 text-xl font-serif italic border-l-4 border-amber-100 pl-6 leading-relaxed max-w-xl">{product.description}</p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => onAddToCart(product)} 
                disabled={isOutOfStock}
                className={`flex-1 py-6 rounded-full font-black uppercase text-[11px] tracking-[0.3em] transition-all transform active:scale-95 border-2 ${isOutOfStock ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed' : 'border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white'}`}
              >
                {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
              </button>
              
              <button 
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className={`flex-1 py-6 bg-slate-900 text-white rounded-full font-black uppercase text-[11px] tracking-[0.3em] shadow-2xl shadow-slate-200 transform active:scale-95 transition-all hover:bg-[#D4AF37] ${isOutOfStock ? 'opacity-20 cursor-not-allowed' : ''}`}
              >
                Express Checkout
              </button>
            </div>

            {/* Trust Bar */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-4 py-10 border-y border-amber-50">
               <div className="flex items-center gap-4 text-slate-900"><ShieldCheck className="text-[#D4AF37]" size={22}/><span className="text-[10px] font-black uppercase tracking-[0.2em]">Authentic Fabric</span></div>
               <div className="flex items-center gap-4 text-slate-900"><RefreshCw className="text-[#D4AF37]" size={22}/><span className="text-[10px] font-black uppercase tracking-[0.2em]">Easy Exchange</span></div>
               <div className="flex items-center gap-4 text-slate-900"><Truck className="text-[#D4AF37]" size={22}/><span className="text-[10px] font-black uppercase tracking-[0.2em]">Nationwide Delivery</span></div>
               <div className="flex items-center gap-4 text-slate-900"><ThumbsUp className="text-[#D4AF37]" size={22}/><span className="text-[10px] font-black uppercase tracking-[0.2em]">Premium Finish</span></div>
            </div>
          </div>
        </div>

        {/* Suggestion Carousel */}
        <section className="mt-40 pt-20 border-t border-amber-50">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">You may also <span className="text-[#D4AF37]">love</span></h2>
            <Link to="/" className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em] hover:underline underline-offset-8">View All</Link>
          </div>
          <div className="flex overflow-x-auto gap-6 pb-12 hide-scrollbar snap-x snap-mandatory">
            {suggestedProducts.map((item) => (
              <div key={item.id} className="min-w-[85%] sm:min-w-[45%] lg:min-w-[22%] snap-center">
                <ProductCard product={item} onAddToCart={onAddToCart} />
              </div>
            ))}
          </div>
        </section>

        {/* REVIEWS SECTION */}
        <section className="max-w-5xl mx-auto mt-40 border-t border-amber-50 pt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-5xl font-black uppercase italic text-slate-900 tracking-tighter mb-4">
                Client <span className="text-[#D4AF37]">Reviews</span>
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex text-[#D4AF37]">
                  {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                </div>
                <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Based on {reviews.length} Experiences</span>
              </div>
            </div>
          </div>

          {error && <div className="mb-8 p-5 bg-red-50 text-red-500 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest flex items-center gap-3 border border-red-100"><AlertCircle size={16}/> {error}</div>}

          {/* Form */}
          <form onSubmit={handleAddReview} className="bg-[#FCFAF7] p-10 md:p-14 rounded-[3rem] mb-20 border border-amber-100">
            <h3 className="text-xl font-black uppercase italic mb-8 text-slate-900">Share Your Skoon Moment</h3>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Full Name</label>
                <input 
                  className="w-full p-5 rounded-2xl border border-amber-50 outline-none font-bold text-sm bg-white focus:border-[#D4AF37] transition-colors" 
                  placeholder="e.g. Sarah Khan" 
                  value={newReview.userName}
                  onChange={(e) => setNewReview({...newReview, userName: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Rating</label>
                <div className="flex items-center gap-4 h-[62px] px-6 bg-white rounded-2xl border border-amber-50">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setNewReview({...newReview, rating: num})}
                        className="transition-transform active:scale-125"
                      >
                        <Star 
                          size={24} 
                          className={newReview.rating >= num ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-slate-100'} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3 mb-10">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Your Thoughts</label>
              <textarea 
                className="w-full p-6 rounded-2xl border border-amber-50 outline-none font-serif italic text-lg bg-white focus:border-[#D4AF37] transition-colors" 
                placeholder="Describe the texture, quality, and feel..." 
                rows={5}
                value={newReview.comment}
                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-12 py-5 bg-slate-900 text-white rounded-full font-black uppercase text-[10px] tracking-[0.3em] flex items-center gap-3 hover:bg-[#D4AF37] transition-all disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={16}/> : <><Send size={16}/> Submit Review</>}
            </button>
          </form>

          {/* List */}
          {reviewsLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#D4AF37]" size={32} /></div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-amber-50 rounded-[3rem]">
               <p className="text-slate-300 font-serif italic text-xl">Be the first to share the comfort of Skoon.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {reviews.map((r) => (
                <div key={r.id} className="p-10 bg-white border border-amber-50 rounded-[2.5rem] flex flex-col gap-6 group hover:border-[#D4AF37]/30 transition-all shadow-sm hover:shadow-xl hover:shadow-amber-900/5">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center text-[#D4AF37]">
                        <User size={24} />
                      </div>
                      <div>
                        <h4 className="font-black uppercase text-sm text-slate-900 tracking-widest">{r.user_name}</h4>
                        <div className="flex text-[#D4AF37] gap-0.5 mt-1.5">
                          {[...Array(r.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                        </div>
                        <p className="text-[9px] text-slate-300 font-black mt-2 uppercase tracking-widest">{new Date(r.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <button onClick={() => deleteReview(r.id)} className="opacity-0 group-hover:opacity-100 text-slate-200 hover:text-red-400 transition-all"><Trash2 size={18}/></button>
                  </div>
                  <p className="text-slate-600 font-serif italic text-lg leading-relaxed">"{r.comment}"</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}