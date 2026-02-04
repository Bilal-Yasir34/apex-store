import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('featured', { ascending: false });

        if (error) throw error;

        if (data) {
          // --- DATA SANITIZATION LAYER ---
          // This prevents the "Blank Screen" by ensuring no property is null/undefined
          const sanitizedData = data.map((product: any) => ({
            ...product,
            // Ensure ID is a string
            id: product.id?.toString() || Math.random().toString(),
            
            // Ensure Name is a string
            name: product.name || 'Unnamed Product',
            
            // Ensure Price is ALWAYS a valid number
            // If the DB has "Rs 2500" or null, this converts it to 2500 or 0
            price: typeof product.price === 'number' 
              ? product.price 
              : parseFloat(String(product.price || '0').replace(/[^0-9.]/g, '')) || 0,
            
            // Ensure Image exists (Checks multiple common field names)
            image_url: product.image_url || product.image || 'https://via.placeholder.com/400?text=No+Image',
            
            // Ensure Section is a string
            section: product.section || 'general',
            
            // Ensure images is always an array
            images: Array.isArray(product.images) ? product.images : []
          }));

          setProducts(sanitizedData);
        }
      } catch (err) {
        console.error("Critical error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { products, loading };
}