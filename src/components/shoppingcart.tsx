import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
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

  // Handle body scroll locking
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

  // 1. Safety Filter: Ensure cartItems is always an array and contains valid objects
  const safeItems = Array.isArray(cartItems) ? cartItems.filter(item => item !== null && typeof item === 'object') : [];
  
  // 2. Safety Total: Force total to be a valid number to prevent toLocaleString() crashes
  const displayTotal = typeof total === 'number' && !isNaN(total) ? total : 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Cart Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-[440px] bg-white z-[60] shadow-2xl transition-transform duration-500 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-50">
                <ShoppingBag className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">Your Cart</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
            {safeItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-10 h-10 text-slate-200" />
                </div>
                <p className="text-slate-900 font-black uppercase text-sm tracking-widest">Cart is empty</p>
                <button 
                  onClick={onClose}
                  className="mt-4 text-purple-600 font-bold text-xs uppercase tracking-widest underline underline-offset-4"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              safeItems.map((item) => {
                // Triple-check properties to prevent white screen
                const itemId = String(item.id || Math.random());
                const itemPrice = Number(item.price) || 0;
                const itemQty = Number(item.quantity) || 1;
                
                // Logic to find ANY available image URL
                const displayImage = 
                    (item.images && Array.isArray(item.images) && item.images[0]) || 
                    item.image_url || 
                    item.image || 
                    'https://via.placeholder.com/400?text=No+Image';

                return (
                  <div key={itemId} className="flex gap-4 group">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                      <img
                        src={displayImage}
                        alt={item.name || 'Product'}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="text-slate-900 font-bold text-xs uppercase truncate pr-2">
                          {item.name || 'Unnamed Product'}
                        </h3>
                        <button
                          onClick={() => onRemoveItem(itemId)}
                          className="text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <p className="text-slate-500 font-black text-xs mt-1">
                        Rs. {itemPrice.toLocaleString()}
                      </p>

                      <div className="flex items-center mt-3">
                        <div className="flex items-center gap-3 bg-slate-50 rounded-lg px-2 py-1">
                          <button
                            onClick={() => onUpdateQuantity(itemId, Math.max(1, itemQty - 1))}
                            className="text-slate-400 hover:text-slate-900 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-slate-900 font-black text-xs w-4 text-center">
                            {itemQty}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(itemId, itemQty + 1)}
                            className="text-slate-400 hover:text-slate-900 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary */}
          {safeItems.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-slate-50/50">
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-slate-900">Rs. {displayTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <span>Shipping</span>
                  <span className="text-emerald-600">Free</span>
                </div>
                <div className="flex justify-between items-end pt-4">
                  <span className="text-sm font-black uppercase italic tracking-widest text-slate-900">Total Amount</span>
                  <span className="text-xl font-black text-slate-900">Rs. {displayTotal.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                className="group w-full h-14 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-purple-600 transition-all active:scale-[0.98] shadow-xl shadow-slate-200"
              >
                Checkout Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">
                  Cash on Delivery Available
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}