-- Crear tabla de productos
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  price DECIMAL(10,2) DEFAULT 0,
  stock INTEGER DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de ventas
CREATE TABLE sales (
  id SERIAL PRIMARY KEY,
  total DECIMAL(10,2) NOT NULL,
  items JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de elementos de venta (para mejores reportes)
CREATE TABLE sale_items (
  id SERIAL PRIMARY KEY,
  sale_id INTEGER REFERENCES sales(id) ON DELETE CASCADE,
  product_code VARCHAR(50),
  product_name VARCHAR(200),
  price DECIMAL(10,2),
  quantity INTEGER,
  subtotal DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para mejor rendimiento
CREATE INDEX idx_products_code ON products(code);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_sales_created_at ON sales(created_at);
CREATE INDEX idx_sale_items_sale_id ON sale_items(sale_id);
CREATE INDEX idx_sale_items_product_code ON sale_items(product_code);

-- Trigger para actualizar updated_at en products
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar algunos productos de ejemplo
INSERT INTO products (code, name, price, stock, description) VALUES
('123456789', 'Coca Cola 500ml', 2.50, 50, 'Refresco de cola 500ml'),
('987654321', 'Papas Fritas', 1.75, 30, 'Papas fritas saladas 100g'),
('456789123', 'Agua 1L', 1.00, 100, 'Agua purificada 1 litro'),
('789123456', 'Galletas Chocolate', 3.25, 25, 'Galletas con chispas de chocolate'),
('321654987', 'Yogurt Natural', 2.00, 40, 'Yogurt natural 200ml');
