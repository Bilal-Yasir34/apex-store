import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, Loader2, Sparkles, MapPin, CreditCard } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CheckoutProps {
  clearCart: () => void;
  cartItems: any[];
  total: number;
}

export default function Checkout({ clearCart, cartItems = [], total = 0 }: CheckoutProps) {
  const navigate = useNavigate();
  const [isOrdered, setIsOrdered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (!cartItems || cartItems.length === 0) {
        throw new Error("Your cart is empty.");
      }

      const lightweightItems = cartItems.map(item => ({
        id: String(item.id),
        name: String(item.name || 'Product'),
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1
      }));

      const { error } = await supabase
        .from('orders')
        .insert([{
          customer_name: String(formData.fullName),
          customer_email: String(formData.email),
          customer_phone: String(formData.phone),
          address: String(formData.address),
          city: String(formData.city),
          items: lightweightItems,
          total_amount: Number(total) || 0,
          status: 'pending'
        }]);

      if (error) throw error;

      setIsOrdered(true);
      setTimeout(() => { clearCart(); }, 150);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error: any) {
      console.error("Order Failure:", error);
      alert(`Order Failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isOrdered) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="relative mx-auto w-24 h-24 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-[#D4AF37]" strokeWidth={1} />
            <div className="absolute inset-0 rounded-full border border-[#D4AF37]/20 animate-ping"></div>
          </div>
          <div className="space-y-3">
            <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">Confirmed<span className="text-[#D4AF37] not-italic">.</span></h2>
            <p className="text-slate-500 text-sm font-medium tracking-wide">Thank you, {formData.fullName.split('')[0]}. Your Skoon pieces are being prepared for dispatch.</p>
            <p className="text-[10px] text-[#D4AF37] uppercase tracking-[0.4em] font-black">Registry Updated</p>
          </div>
          <button 
            onClick={() => navigate('/')} 
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-[#D4AF37] transition-all shadow-xl"
          >
            Back to Atelier
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-3 text-slate-400 mb-12 font-black text-[10px] uppercase tracking-[0.2em] hover:text-slate-900 transition-colors group">
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Bag
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Form Side */}
          <div className="lg:col-span-7 space-y-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <MapPin size={18} className="text-[#D4AF37]" />
                <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Shipping Details</h2>
              </div>
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">Where should we deliver your comfort?</p>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Full Name</label>
                  <input required name="fullName" type="text" value={formData.fullName} onChange={handleInputChange} className="w-full p-4 bg-white border border-slate-100 rounded-xl focus:ring-1 focus:ring-[#D4AF37] outline-none text-sm font-bold text-slate-900 transition-all shadow-sm" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Email Address</label>
                    <input required name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full p-4 bg-white border border-slate-100 rounded-xl focus:ring-1 focus:ring-[#D4AF37] outline-none text-sm font-bold text-slate-900 shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Phone Number</label>
                    <input required name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="w-full p-4 bg-white border border-slate-100 rounded-xl focus:ring-1 focus:ring-[#D4AF37] outline-none text-sm font-bold text-slate-900 shadow-sm" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Street Address</label>
                  <input required name="address" type="text" value={formData.address} onChange={handleInputChange} className="w-full p-4 bg-white border border-slate-100 rounded-xl focus:ring-1 focus:ring-[#D4AF37] outline-none text-sm font-bold text-slate-900 shadow-sm" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">City</label>
                    <input required name="city" type="text" value={formData.city} onChange={handleInputChange} className="w-full p-4 bg-white border border-slate-100 rounded-xl focus:ring-1 focus:ring-[#D4AF37] outline-none text-sm font-bold text-slate-900 shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Postal Code</label>
                    <input name="postalCode" type="text" value={formData.postalCode} onChange={handleInputChange} className="w-full p-4 bg-white border border-slate-100 rounded-xl focus:ring-1 focus:ring-[#D4AF37] outline-none text-sm font-bold text-slate-900 shadow-sm" />
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] hover:bg-[#D4AF37] transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      <CreditCard size={16} /> 
                      Confirm Selection
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Summary Side */}
          <div className="lg:col-span-5">
            <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 sticky top-32">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-50">
                <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Checkout</h2>
                <Sparkles size={18} className="text-[#D4AF37]" />
              </div>

              <div className="space-y-6 mb-10 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={item.image_url || item.image} className="w-14 h-14 object-cover rounded-xl border border-slate-100" alt="" />
                        <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[8px] font-black w-5 h-5 flex items-center justify-center rounded-full">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black uppercase tracking-tight text-slate-900 leading-tight line-clamp-1">{item.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">£ {item.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-slate-900">£ {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-slate-50">
                <div className="flex justify-between text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                  <span>Subtotal</span>
                  <span>£ {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                  <span>Shipping</span>
                  <span className="text-[#D4AF37]">Complimentary</span>
                </div>
                <div className="flex justify-between pt-4 text-3xl font-black text-slate-900">
                  <span className="italic uppercase tracking-tighter">Total</span>
                  <span className="text-[#D4AF37]">£ {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}