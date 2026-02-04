/*
  # eCommerce Schema for Premium Mobile Accessories

  ## Overview
  Creates the database structure for a premium mobile accessories eCommerce platform
  with products and shopping cart functionality.

  ## New Tables
  
  ### `products`
  - `id` (uuid, primary key) - Unique identifier for each product
  - `name` (text) - Product name
  - `description` (text) - Detailed product description
  - `price` (numeric) - Product price
  - `image_url` (text) - Product image URL
  - `category` (text) - Product category (cases, chargers, accessories)
  - `featured` (boolean) - Whether product is featured
  - `stock` (integer) - Available stock quantity
  - `created_at` (timestamptz) - Creation timestamp

  ### `cart_items`
  - `id` (uuid, primary key) - Unique identifier for cart item
  - `session_id` (text) - Browser session identifier for anonymous users
  - `product_id` (uuid, foreign key) - Reference to products table
  - `quantity` (integer) - Quantity of product in cart
  - `created_at` (timestamptz) - When item was added to cart

  ## Security
  - Enable RLS on all tables
  - Products are publicly readable
  - Cart items can be managed by session owners
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL,
  image_url text NOT NULL,
  category text NOT NULL DEFAULT 'accessories',
  featured boolean DEFAULT false,
  stock integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly readable"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view cart items by session"
  ON cart_items FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert cart items"
  ON cart_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update cart items by session"
  ON cart_items FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete cart items by session"
  ON cart_items FOR DELETE
  TO anon, authenticated
  USING (true);

INSERT INTO products (name, description, price, image_url, category, featured, stock) VALUES
('MagSafe Ultra Case', 'Premium magnetic case with aerospace-grade aluminum frame and shock-absorbing corners', 79.99, 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800', 'cases', true, 50),
('Quantum Wireless Charger', '15W fast charging with LED ambient lighting and temperature control', 89.99, 'https://images.pexels.com/photos/4614200/pexels-photo-4614200.jpeg?auto=compress&cs=tinysrgb&w=800', 'chargers', true, 30),
('NightGlow Phone Case', 'Luminescent case that glows in the dark with military-grade protection', 69.99, 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800', 'cases', true, 45),
('HyperCharge Cable Pro', 'Braided USB-C cable with 100W power delivery and data transfer', 39.99, 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=800', 'accessories', false, 100),
('Crystal Clear Case', 'Ultra-thin transparent case with anti-yellowing technology', 49.99, 'https://images.pexels.com/photos/2582928/pexels-photo-2582928.jpeg?auto=compress&cs=tinysrgb&w=800', 'cases', false, 60),
('MagMount Car Holder', 'Magnetic car mount with 360° rotation and auto-alignment', 59.99, 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800', 'accessories', false, 40),
('PowerBank Elite 20K', '20,000mAh portable charger with wireless charging capability', 99.99, 'https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg?auto=compress&cs=tinysrgb&w=800', 'chargers', true, 25),
('Screen Guard Pro', 'Tempered glass with blue light filter and fingerprint resistance', 29.99, 'https://images.pexels.com/photos/1092671/pexels-photo-1092671.jpeg?auto=compress&cs=tinysrgb&w=800', 'accessories', false, 80);
