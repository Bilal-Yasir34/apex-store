-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- 2. Create Orders Table for Checkout
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  address text NOT NULL,
  total_amount numeric(10,2) NOT NULL,
  status text DEFAULT 'pending', -- pending, processing, delivered
  items jsonb NOT NULL, -- To store the list of products bought
  created_at timestamptz DEFAULT now()
);

-- 3. Enable Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are public" ON categories FOR SELECT USING (true);
CREATE POLICY "Anyone can insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view orders" ON orders FOR SELECT USING (true); -- In a real app, you'd restrict this

-- 4. Insert Your Requested Categories
INSERT INTO categories (name, slug, image_url) VALUES 
('AirPods', 'airpods', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=compress&cs=tinysrgb&w=800'),
('Headphones', 'headphones', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=compress&cs=tinysrgb&w=800'),
('Smart Watches', 'smart-watches', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=compress&cs=tinysrgb&w=800'),
('Wireless Chargers', 'wireless-chargers', 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?auto=compress&cs=tinysrgb&w=800'),
('All Products', 'all-products', 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?auto=compress&cs=tinysrgb&w=800');