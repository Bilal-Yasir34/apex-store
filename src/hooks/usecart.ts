import { useState, useEffect, useCallback } from 'react';

export const useCart = () => {
  // --- INITIALIZATION ---
  // Using a new key for the UK market to ensure a clean start with Pound sterling values
  const [cartItems, setCartItems] = useState<any[]>(() => {
    try {
      const savedCart = localStorage.getItem('Skoon_uk_cart_v1'); 
      if (!savedCart) return [];
      const parsed = JSON.parse(savedCart);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Skoon UK Cart Init Error:", error);
      return [];
    }
  });

  // --- PERSISTENCE ---
  useEffect(() => {
    try {
      localStorage.setItem('Skoon_uk_cart_v1', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Skoon UK Cart Save Error:", error);
    }
  }, [cartItems]);

  // --- ACTIONS ---
  const addToCart = useCallback((product: any) => {
    if (!product || !product.id) return;

    setCartItems(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const productId = String(product.id);
      const existingItem = safePrev.find(item => String(item.id) === productId);

      if (existingItem) {
        return safePrev.map(item =>
          String(item.id) === productId
            ? { ...item, quantity: (Number(item.quantity) || 0) + 1 }
            : item
        );
      }

      // Ensure data is numeric and clean (Standard UK Prices e.g. 45.99)
      const cleanItem = {
        id: productId,
        name: String(product.name || 'Skoon Essential'),
        price: Number(product.price) || 0,
        image_url: String(product.image_url || product.image || ''),
        quantity: 1
      };

      return [...safePrev, cleanItem];
    });
  }, []);

  const removeFromCart = (itemId: string) => {
    const idToMatch = String(itemId);
    setCartItems(prev => prev.filter(item => String(item.id) !== idToMatch));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    const idToMatch = String(itemId);
    const safeQty = Math.max(1, Math.floor(Number(quantity) || 1));
    
    setCartItems(prev =>
      prev.map(item => 
        String(item.id) === idToMatch ? { ...item, quantity: safeQty } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('Skoon_uk_cart_v1');
  };

  // --- TOTALS ---
  // These stay numeric so you can format them with £ in the UI
  const total = cartItems.reduce((sum, item) => {
    const p = Number(item.price) || 0;
    const q = Number(item.quantity) || 0;
    return sum + (p * q);
  }, 0);

  const itemCount = cartItems.reduce((sum, item) => {
    return sum + (Number(item.quantity) || 0);
  }, 0);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    total,
    itemCount,
    clearCart
  };
};