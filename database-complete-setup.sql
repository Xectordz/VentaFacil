-- =================================================================
-- PUNTO DE VENTA WEB - CONFIGURACIÓN COMPLETA DE BASE DE DATOS
-- =================================================================
-- Archivo para crear una base de datos idéntica desde cero
-- Ejecutar todo este archivo en un proyecto Supabase nuevo
-- =================================================================

-- 1. TABLA DE PRODUCTOS
-- =================================================================
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 0,
    category VARCHAR(100) DEFAULT 'General',
    description TEXT,
    image_url TEXT,
    image_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para productos
CREATE INDEX IF NOT EXISTS idx_products_code ON products(code);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);

-- 2. TABLA DE VENTAS
-- =================================================================
CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    total DECIMAL(10, 2) NOT NULL,
    items JSONB NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'efectivo',
    customer_name VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para ventas
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at);
CREATE INDEX IF NOT EXISTS idx_sales_payment_method ON sales(payment_method);

-- 3. TABLA DE CONFIGURACIONES DE LA APP
-- =================================================================
CREATE TABLE IF NOT EXISTS app_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para configuraciones
CREATE INDEX IF NOT EXISTS idx_app_settings_key ON app_settings(key);

-- 4. TABLA DE PEDIDOS ONLINE
-- =================================================================
CREATE TABLE IF NOT EXISTS online_orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    customer_address TEXT,
    items JSONB NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para pedidos online
CREATE INDEX IF NOT EXISTS idx_online_orders_status ON online_orders(status);
CREATE INDEX IF NOT EXISTS idx_online_orders_created_at ON online_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_online_orders_customer_email ON online_orders(customer_email);

-- =================================================================
-- FUNCIONES Y TRIGGERS
-- =================================================================

-- Función para actualizar timestamp automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at automáticamente
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sales_updated_at ON sales;
CREATE TRIGGER update_sales_updated_at
    BEFORE UPDATE ON sales
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_app_settings_updated_at ON app_settings;
CREATE TRIGGER update_app_settings_updated_at
    BEFORE UPDATE ON app_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_online_orders_updated_at ON online_orders;
CREATE TRIGGER update_online_orders_updated_at
    BEFORE UPDATE ON online_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =================================================================
-- CONFIGURACIONES INICIALES
-- =================================================================

-- Insertar configuraciones por defecto
INSERT INTO app_settings (key, value, description) VALUES
('admin_email', '', 'Correo electrónico del administrador para contacto y notificaciones'),
('admin_phone', '', 'Número de teléfono del administrador para contacto'),
('business_name', 'Mi Negocio', 'Nombre del negocio que aparece en la tienda'),
('theme_primary_color', '#3b82f6', 'Color primario del tema'),
('theme_secondary_color', '#64748b', 'Color secundario del tema'),
('theme_mode', 'light', 'Modo del tema: light, dark, auto'),
('email_notifications', 'true', 'Habilitar notificaciones por correo electrónico'),
('business_address', '', 'Dirección del negocio para mostrar a clientes'),
('business_hours', '', 'Horario de atención del negocio'),
('currency_symbol', '$', 'Símbolo de moneda utilizado'),
('tax_rate', '0', 'Tasa de impuesto por defecto (%)'),
('enable_online_orders', 'true', 'Habilitar pedidos online'),
('order_confirmation_message', 'Gracias por tu pedido. Te contactaremos pronto.', 'Mensaje de confirmación para pedidos')
ON CONFLICT (key) DO NOTHING;

-- Productos de ejemplo (opcional)
INSERT INTO products (code, name, price, stock, category, description) VALUES
('PROD001', 'Producto Ejemplo 1', 29.99, 50, 'Categoría A', 'Descripción del producto ejemplo 1'),
('PROD002', 'Producto Ejemplo 2', 15.50, 30, 'Categoría B', 'Descripción del producto ejemplo 2'),
('PROD003', 'Producto Ejemplo 3', 45.00, 20, 'Categoría A', 'Descripción del producto ejemplo 3')
ON CONFLICT (code) DO NOTHING;

-- =================================================================
-- CONFIGURACIÓN DE SEGURIDAD (RLS)
-- =================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE online_orders ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir todas las operaciones a usuarios autenticados
CREATE POLICY "Permitir todas las operaciones a usuarios autenticados en products" ON products
    FOR ALL USING (true);

CREATE POLICY "Permitir todas las operaciones a usuarios autenticados en sales" ON sales
    FOR ALL USING (true);

CREATE POLICY "Permitir todas las operaciones a usuarios autenticados en app_settings" ON app_settings
    FOR ALL USING (true);

CREATE POLICY "Permitir todas las operaciones a usuarios autenticados en online_orders" ON online_orders
    FOR ALL USING (true);

-- Política especial para permitir inserción de pedidos anónimos
CREATE POLICY "Permitir inserción de pedidos anónimos" ON online_orders
    FOR INSERT WITH CHECK (true);

-- =================================================================
-- STORAGE PARA IMÁGENES (Opcional - ejecutar después)
-- =================================================================

-- Crear bucket para imágenes de productos
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Política para permitir lectura pública de imágenes
CREATE POLICY "Lectura pública de imágenes de productos" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

-- Política para permitir subida de imágenes a usuarios autenticados
CREATE POLICY "Subida de imágenes para usuarios autenticados" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-images');

-- Política para permitir actualización de imágenes a usuarios autenticados
CREATE POLICY "Actualización de imágenes para usuarios autenticados" ON storage.objects
FOR UPDATE USING (bucket_id = 'product-images');

-- Política para permitir eliminación de imágenes a usuarios autenticados
CREATE POLICY "Eliminación de imágenes para usuarios autenticados" ON storage.objects
FOR DELETE USING (bucket_id = 'product-images');

-- =================================================================
-- COMENTARIOS DE DOCUMENTACIÓN
-- =================================================================

COMMENT ON TABLE products IS 'Tabla de productos del inventario';
COMMENT ON TABLE sales IS 'Registro de todas las ventas realizadas';
COMMENT ON TABLE app_settings IS 'Configuraciones globales de la aplicación';
COMMENT ON TABLE online_orders IS 'Pedidos realizados desde la tienda online';

COMMENT ON COLUMN products.image_url IS 'URL de la imagen del producto almacenada en Supabase Storage';
COMMENT ON COLUMN products.image_name IS 'Nombre del archivo de imagen para referencia';
COMMENT ON COLUMN sales.items IS 'Array JSON con los productos vendidos';
COMMENT ON COLUMN online_orders.items IS 'Array JSON con los productos del pedido';
COMMENT ON COLUMN online_orders.status IS 'Estado del pedido: pending, confirmed, preparing, ready, delivered, cancelled';

-- =================================================================
-- INFORMACIÓN DE VERSIÓN
-- =================================================================

INSERT INTO app_settings (key, value, description) VALUES
('database_version', '1.0.0', 'Versión de la estructura de base de datos'),
('setup_date', NOW()::text, 'Fecha de configuración inicial de la base de datos'),
('setup_complete', 'true', 'Indica si la configuración inicial está completa')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- =================================================================
-- ¡CONFIGURACIÓN COMPLETA!
-- =================================================================
-- Tu base de datos está lista para usar con el Punto de Venta Web
-- 
-- Próximos pasos:
-- 1. Configurar las variables de entorno con las credenciales de Supabase
-- 2. Configurar la aplicación con tus datos de negocio en /admin/settings
-- 3. Agregar tus productos en /admin/inventory
-- 
-- ¡Listo para vender! 🚀
-- =================================================================
