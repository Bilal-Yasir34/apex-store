import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, ShieldCheck, ChevronLeft, CheckCircle2, ShoppingBag, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase'; // Ensure this path is correct

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

      // --- Prepare lightweight items for JSON storage ---
      const lightweightItems = cartItems.map(item => ({
        id: String(item.id),
        name: String(item.name || 'Product'),
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1
      }));

      // --- SAVE TO SUPABASE (The Cloud Fix) ---
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

      // --- Success Logic ---
      setIsOrdered(true);
      
      // Clear the local shopping cart
      setTimeout(() => {
        clearCart();
      }, 150);

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
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="relative mx-auto w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">Ordered!</h2>
            <p className="text-slate-500 font-medium">Order confirmed for {formData.fullName}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Saved to Cloud Database</p>
          </div>
          <button onClick={() => navigate('/')} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-purple-600 transition-all shadow-xl">
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 mb-8 font-bold text-xs uppercase tracking-widest hover:text-purple-600 transition-colors">
          <ChevronLeft size={16} /> Back to Bag
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h2 className="text-3xl font-black text-slate-900 uppercase italic mb-8">Shipping</h2>
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                <input required name="fullName" type="text" value={formData.fullName} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none text-sm font-bold text-slate-900" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required name="email" type="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none text-sm font-bold text-slate-900" />
                <input required name="phone" type="tel" placeholder="Phone" value={formData.phone} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none text-sm font-bold text-slate-900" />
              </div>
              <input required name="address" type="text" placeholder="Shipping Address" value={formData.address} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none text-sm font-bold text-slate-900" />
              <div className="grid grid-cols-2 gap-4">
                <input required name="city" type="text" placeholder="City" value={formData.city} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none text-sm font-bold text-slate-900" />
                <input name="postalCode" type="text" placeholder="Postal Code" value={formData.postalCode} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none text-sm font-bold text-slate-900" />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-purple-600 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Complete Order'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 sticky top-32">
              <h2 className="text-xl font-black text-slate-900 uppercase italic mb-6">Summary</h2>
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <img src={item.image_url || item.image} className="w-10 h-10 object-cover rounded-lg" alt="" />
                      <span className="text-[10px] font-black uppercase text-slate-500 truncate max-w-[150px]">{item.name} x{item.quantity}</span>
                    </div>
                    <span className="text-xs font-black text-slate-900">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-2xl font-black text-slate-900">
                  <span className="italic uppercase">Total</span>
                  <span className="text-purple-600">Rs. {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}