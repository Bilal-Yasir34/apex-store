export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  
  /** * The "Original" or "Before" price. 
   * Should be higher than the current price to show a discount.
   */
  compare_at_price: number; 

  /** * Updated from image_url to an array to support multiple product views 
   * These store the public URLs or Base64 strings from the admin upload
   */
  images: string[]; 
  
  category: string;
  featured: boolean;

  /** * Section determines where the product appears on the homepage 
   * strictly typed for better IntelliSense 
   */
  section?: 'none' | 'featured' | 'bestseller'; 

  stock: number;
  created_at: string;

  /** Optional specs for the product detail page */
  specs?: {
    label: string;
    value: string;
  }[];
}

export interface CartItem {
  id: string;
  session_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  /** Reference to the full product object for the cart display */
  product?: Product;
}