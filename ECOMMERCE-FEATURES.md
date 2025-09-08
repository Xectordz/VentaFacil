# VentaFacil - Sistema E-commerce Completo

VentaFacil ahora incluye una plataforma completa de e-commerce con dos interfaces separadas:

## 🏪 **Tienda Online (Cliente)**
**URL Pública**: `https://tu-dominio.com/tienda`

### Características:
- **Catálogo de productos** con búsqueda y filtros
- **Carrito de compras** con persistencia en localStorage
- **Proceso de checkout** con datos del cliente
- **Confirmación de pedido** con número de seguimiento
- **Responsive design** optimizado para móviles

### Flujo del Cliente:
1. **Explorar productos** - Ver catálogo con precios y stock
2. **Agregar al carrito** - Seleccionar productos y cantidades
3. **Checkout** - Llenar datos (nombre, email, teléfono, dirección)
4. **Confirmación** - Recibir número de pedido y email

---

## 🎛️ **Panel Administrativo**
**URL Admin**: `https://tu-dominio.com/admin`

### Nuevas Funcionalidades:
- **Pedidos Online** - Gestión completa de pedidos de clientes
- **Dashboard mejorado** - Estadísticas incluyen ventas online
- **Integración completa** - Pedidos aprobados se convierten automáticamente en ventas

### Gestión de Pedidos:
- **Ver todos los pedidos** con filtros por estado
- **Detalles completos** - Info del cliente, productos, cantidades
- **Aprobar/Rechazar** - Control total sobre pedidos
- **Conversión automática** - Pedidos aprobados → Ventas registradas
- **Actualización de stock** - Automática al aprobar pedidos

---

## 🗄️ **Base de Datos Actualizada**

### Nuevas Tablas:
```sql
-- Pedidos online
online_orders (id, customer_name, customer_email, customer_phone, customer_address, notes, total, status, created_at)

-- Items de pedidos
order_items (id, order_id, product_id, quantity, price, created_at)

-- Clientes
customers (id, name, email, phone, address, created_at)
```

### Funciones SQL:
- **`convert_order_to_sale(order_id)`** - Convierte pedido en venta y actualiza stock
- **`update_product_stock()`** - Trigger automático para control de inventario

---

## 🚀 **URLs del Sistema**

### **Cliente (Público)**:
- `/tienda` - Catálogo de productos
- `/carrito` - Carrito de compras  
- `/checkout` - Proceso de pago
- `/pedido-confirmado` - Confirmación

### **Administrador (Privado)**:
- `/admin` - Dashboard principal
- `/admin/sales` - Ventas presenciales
- `/admin/inventory` - Gestión de inventario
- `/admin/online-orders` - **NUEVO** Pedidos online
- `/admin/reports` - Reportes y estadísticas
- `/admin/qr-generator` - Generador de códigos QR

---

## 📱 **Características Móviles**

### Optimizaciones:
- **Navegación táctil** - Menús adaptados para dedos
- **Carrito persistente** - No se pierde al cerrar la app
- **Checkout rápido** - Formulario optimizado para móviles
- **Botones grandes** - Fácil interacción en pantallas pequeñas

---

## 🔗 **Enlace Compartible**

Para compartir tu tienda con clientes:

**Enlace directo**: `https://tu-dominio.com/tienda`

Los clientes pueden:
- ✅ Ver todos los productos disponibles
- ✅ Agregar productos al carrito
- ✅ Realizar pedidos online
- ✅ Recibir confirmación por email
- ✅ Contactar directamente para dudas

---

## 🎯 **Flujo Completo de Negocio**

### 1. **Cliente hace pedido**:
   - Navega por `/tienda`
   - Agrega productos al carrito
   - Completa checkout con sus datos
   - Recibe confirmación y número de pedido

### 2. **Administrador gestiona**:
   - Ve pedido en `/admin/online-orders`
   - Revisa productos y disponibilidad
   - **Aprueba** → Se crea venta automáticamente + actualiza stock
   - **Rechaza** → Cliente es notificado

### 3. **Seguimiento**:
   - Pedidos aparecen en reportes
   - Stock se actualiza automáticamente
   - Historial completo de transacciones

---

## 🔧 **Configuración Necesaria**

### Supabase (Base de Datos):
1. Ejecutar `database-setup.sql` actualizado
2. Configurar variables de entorno:
   ```
   VITE_SUPABASE_URL=tu_url_supabase
   VITE_SUPABASE_ANON_KEY=tu_key_supabase
   ```

### Despliegue:
1. **Vercel** - Para hosting automático
2. **Variables de entorno** - Configurar en panel de Vercel
3. **Dominio personalizado** - Opcional para URL profesional

---

## 🎉 **¡Listo para Vender Online!**

Tu VentaFacil ahora es una plataforma e-commerce completa que maneja:
- ✅ Ventas presenciales (POS tradicional)
- ✅ Ventas online (E-commerce)
- ✅ Gestión unificada de inventario
- ✅ Reportes consolidados
- ✅ Experiencia móvil optimizada

**¡Comparte el enlace `/tienda` con tus clientes y empieza a vender online!** 🛒✨
