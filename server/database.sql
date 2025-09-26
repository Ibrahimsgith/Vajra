-- Products Table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  productType VARCHAR(255) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  imageUrl VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  galleryImageUrls TEXT[] -- Using TEXT array for gallery images
);

-- Orders Table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  orderNumber VARCHAR(255) NOT NULL,
  fullName VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  zipCode VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  taxes NUMERIC(10, 2) NOT NULL,
  total NUMERIC(10, 2) NOT NULL
);

-- Order Items Table (to link products to orders)
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL
);
