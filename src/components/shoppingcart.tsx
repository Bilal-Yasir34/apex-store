import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: any[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  total: number;
}

export function ShoppingCart({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  total = 0,
}: ShoppingCartProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const safeItems = Array.isArray(cartItems) ? cartItems.filter(item => item !== null && typeof item === 'object') : [];
  const displayTotal = typeof total === 'number' && !isNaN(total) ? total : 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Cart Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-[460px] bg-white z-[60] shadow-[-20px_0_50px_rgba(0,0,0,0.1)] transition-transform duration-700 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-amber-50">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-amber-50">
                <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">Selected Pieces</h2>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">{safeItems.length} items in bag</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 rounded-full hover:bg-slate-50 transition-all text-slate-300 hover:text-slate-900"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 hide-scrollbar">
            {safeItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                <div className="w-24 h-24 bg-[#FCFAF7] rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-amber-100" />
                </div>
                <div>
                  <p className="text-slate-900 font-black uppercase text-sm tracking-[0.3em]">Your bag is empty</p>
                  <p className="text-slate-400 font-serif italic mt-2">Discover the comfort of Skoon.</p>
                </div>
                <button 
                  onClick={onClose}
                  className="px-8 py-3 bg-slate-900 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-[#D4AF37] transition-all"
                >
                  Browse Collection
                </button>
              </div>
            ) : (
              safeItems.map((item) => {
                const itemId = String(item.id || Math.random());
                const itemPrice = Number(item.price) || 0;
                const itemQty = Number(item.quantity) || 1;
                
                const displayImage = 
                    (item.images && Array.isArray(item.images) && item.images[0]) || 
                    item.image_url || 
                    item.image || 
                    'https://via.placeholder.com/400?text=Skoon+Textiles';

                return (
                  <div key={itemId} className="flex gap-5 group animate-fade-in">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-[#FCFAF7] border border-amber-50 shrink-0 shadow-sm">
                      <img
                        src={displayImage}
                        alt={item.name || 'Product'}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>

                    <div className="flex-1 min-w-0 py-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-slate-900 font-black text-[11px] uppercase tracking-widest truncate pr-4">
                          {item.name || 'Artisan Piece'}
                        </h3>
                        <button
                          onClick={() => onRemoveItem(itemId)}
                          className="text-slate-200 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <p className="text-[#D4AF37] font-black text-xs">
                        £ {itemPrice.toLocaleString()}
                      </p>

                      <div className="flex items-center justify-between mt-5">
                        <div className="flex items-center gap-4 bg-white border border-amber-50 rounded-full px-4 py-1.5 shadow-sm">
                          <button
                            onClick={() => onUpdateQuantity(itemId, Math.max(1, itemQty - 1))}
                            className="text-slate-400 hover:text-[#D4AF37] transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-slate-900 font-black text-xs min-w-[12px] text-center">
                            {itemQty}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(itemId, itemQty + 1)}
                            className="text-slate-400 hover:text-[#D4AF37] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-slate-900 font-black text-xs">
                          £ {(itemPrice * itemQty).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary */}
          {safeItems.length > 0 && (
            <div className="p-8 border-t border-amber-50 bg-[#FCFAF7]">
              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <span>Bag Subtotal</span>
                  <span className="text-slate-900 font-black">£ {displayTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <span>Elite Delivery</span>
                  <span className="text-[#D4AF37] font-black">Complimentary</span>
                </div>
                <div className="flex justify-between items-end pt-5 border-t border-amber-100 mt-2">
                  <span className="text-sm font-black uppercase italic tracking-widest text-slate-900">Total Amount</span>
                  <span className="text-2xl font-black text-slate-900 tracking-tighter">£ {displayTotal.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                className="group w-full h-16 bg-slate-900 text-white rounded-full font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-[#D4AF37] transition-all shadow-xl shadow-amber-900/10"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="mt-6 flex items-center justify-center gap-3">
                <Sparkles className="w-3 h-3 text-[#D4AF37] animate-pulse" />
                <p className="text-[9px] text-slate-400 uppercase font-black tracking-[0.2em]">
                  Premium Quality Guaranteed
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}