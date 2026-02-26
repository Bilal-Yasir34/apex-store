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
        
        // --- FIXED: Ordering by created_at instead of 'featured' ---
        // This ensures the query doesn't crash if 'featured' column is missing
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Supabase Query Error:", error.message);
          throw error;
        }

        if (data) {
          // --- DATA SANITIZATION LAYER ---
          const sanitizedData = data.map((product: any) => ({
            ...product,
            // Ensure ID is a string
            id: String(product.id || Math.random().toString(36).substr(2, 9)),
            
            // Ensure Name is a string
            name: String(product.name || 'Skoon Essential'),
            
            // Ensure Price is ALWAYS a valid number
            price: typeof product.price === 'number' 
              ? product.price 
              : parseFloat(String(product.price || '0').replace(/[^0-9.]/g, '')) || 0,
            
            // Ensure Image exists (Checks multiple common field names)
            image_url: product.image_url || product.image || (Array.isArray(product.images) && product.images[0]) || 'https://via.placeholder.com/400?text=No+Image',
            
            // Ensure Section is a string and trimmed
            // IMPORTANT: This makes sure 'featured ' (with space) becomes 'featured'
            section: String(product.section || 'general').toLowerCase().trim(),
            
            // Ensure images is always an array
            images: Array.isArray(product.images) ? product.images : []
          }));

          console.log("✅ Successfully loaded and sanitized products:", sanitizedData.length);
          setProducts(sanitizedData);
        }
      } catch (err) {
        console.error("Critical error in useProducts hook:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { products, loading };
}