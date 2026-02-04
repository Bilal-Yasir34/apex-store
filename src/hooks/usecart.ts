import { useState, useEffect } from 'react';

export const useCart = () => {
  // Initialize with extra safety
  const [cartItems, setCartItems] = useState<any[]>(() => {
    try {
      const savedCart = localStorage.getItem('apex_cart_v1'); // New key to bypass old bad data
      if (!savedCart) return [];
      const parsed = JSON.parse(savedCart);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Cart Initialization Error:", error);
      return [];
    }
  });

  // Save to localStorage with a specific versioned key
  useEffect(() => {
    try {
      localStorage.setItem('apex_cart_v1', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Cart Save Error:", error);
    }
  }, [cartItems]);

  const addToCart = (product: any) => {
    if (!product || !product.id) return;

    setCartItems(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const existingItem = safePrev.find(item => String(item.id) === String(product.id));

      if (existingItem) {
        return safePrev.map(item =>
          String(item.id) === String(product.id)
            ? { ...item, quantity: (Number(item.quantity) || 1) + 1 }
            : item
        );
      }

      // Ensure we only store clean, flat data (No complex objects)
      const cleanItem = {
        id: String(product.id),
        name: String(product.name || 'Product'),
        price: Number(product.price) || 0,
        image_url: String(product.image_url || product.image || ''),
        quantity: 1
      };

      return [...safePrev, cleanItem];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => String(item.id) !== String(itemId)));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    const safeQty = Math.max(1, Number(quantity) || 1);
    setCartItems(prev =>
      prev.map(item => String(item.id) === String(itemId) ? { ...item, quantity: safeQty } : item)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('apex_cart_v1');
  };

  // Ultra-safe calculations
  const total = cartItems.reduce((sum, item) => {
    const p = Number(item.price) || 0;
    const q = Number(item.quantity) || 0;
    return sum + (p * q);
  }, 0);

  const itemCount = cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

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