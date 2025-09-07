# 🛒 VentaFacil - Sistema de Ventas Web

<div align="center">

![VentaFacil Logo](https://img.shields.io/badge/VentaFacil-Sistema%20de%20Ventas-success?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-4.4.5-purple?style=for-the-badge&logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)

**Un sistema de ventas moderno y responsive desarrollado con React + Vite, diseñado especialmente para dispositivos móviles pero también compatible con PC.**

[🚀 Ver Demo](#) | [📖 Documentación](#funcionalidades) | [💻 Instalación](#instalación)

</div>

---

## ✨ **Funcionalidades Principales**

### 📱 **Sistema de Ventas Completo**
- 🛒 **Carrito de compras** interactivo
- 📊 **Procesamiento de ventas** en tiempo real
- 🧾 **Historial de transacciones**
- 💳 **Cálculo automático** de totales e impuestos

### 📦 **Gestión de Inventario**
- 📋 **CRUD completo** de productos
- 🔍 **Búsqueda avanzada** por nombre o código
- ⚠️ **Alertas de stock bajo**
- 📈 **Control de existencias** en tiempo real

### 📷 **Escaneo de Códigos (QR & Barras)**
- 📱 **Escáner integrado** usando cámara del dispositivo
- 🔍 **Búsqueda por escaneo** en inventario
- 🛒 **Agregar al carrito** escaneando productos
- 📝 **Captura de códigos** para productos nuevos

### 📊 **Dashboard y Reportes**
- 📈 **Métricas en tiempo real**
- 💰 **Resumen de ventas diarias**
- 📦 **Estado del inventario**
- 📋 **Productos más vendidos**

### 🏷️ **Generación de Códigos QR**
- 🖨️ **Crear códigos QR** para productos
- 📄 **Exportar a PDF** para impresión
- 🏷️ **Etiquetas personalizables**

---

## 🛠️ **Tecnologías Utilizadas**

<div align="center">

| Frontend | Backend/DB | Herramientas |
|----------|------------|--------------|
| ⚛️ **React 18** | 🗄️ **Supabase** | 📱 **html5-qrcode** |
| ⚡ **Vite** | 🔐 **PostgreSQL** | 🎨 **Tailwind CSS** |
| 🎯 **React Router** | 🔒 **RLS Security** | 📊 **Lucide Icons** |
| 🔥 **React Hot Toast** | ☁️ **Cloud Hosting** | 📄 **jsPDF** |

</div>

---

## 🚀 **Instalación**

### **Prerrequisitos**
- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase (gratuita)

### **Instalación Local**

```bash
# Clonar el repositorio
git clone https://github.com/TU-USUARIO/ventafacil.git
cd ventafacil

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales de Supabase

# Ejecutar en desarrollo
npm run dev
```

### **🌐 Deploy Gratis**

1. **Sube a GitHub** (sigue `SUBIR-A-GITHUB.md`)
2. **Conecta con Vercel** (sigue `PUBLICAR.md`)
3. **¡Listo!** Tu app estará online 24/7

---

## 📸 **Demo**

```
🚧 Screenshots y demo en vivo próximamente...
```

---

## 🤝 **Contribuir**

1. 🍴 Fork el proyecto
2. 🌿 Crea tu feature branch
3. 💾 Commit tus cambios  
4. 📤 Push y crea un Pull Request

---

<div align="center">

**🌟 Si te gusta VentaFacil, dale una estrella en GitHub 🌟**

Desarrollado con ❤️ para pequeños negocios

</div>

## 🛠️ Tecnologías

- **Frontend**: React 18 + Vite
- **Estilos**: Tailwind CSS + CSS Modules
- **Base de datos**: Supabase (configuración requerida)
- **Escáner**: html5-qrcode
- **Generación QR**: qrcode + jsPDF
- **Iconos**: Lucide React
- **Routing**: React Router DOM

## 📋 Requisitos Previos

- Node.js (versión 16 o superior)
- npm o yarn
- Cuenta en Supabase (gratuita)

## 🚀 Instalación

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar Supabase**:
   - Crea una cuenta en [Supabase](https://supabase.com)
   - Crea un nuevo proyecto
   - Ve a Settings > API
   - Copia la URL y la clave anónima
   - Edita `src/context/SupabaseContext.jsx` con tus credenciales:
     ```javascript
     const supabaseUrl = 'TU_SUPABASE_URL'
     const supabaseKey = 'TU_SUPABASE_ANON_KEY'
     ```

3. **Crear tablas en Supabase**:
   Ejecuta este SQL en el editor de Supabase:
   ```sql
   -- Tabla de productos
   CREATE TABLE products (
     id SERIAL PRIMARY KEY,
     code VARCHAR(50) UNIQUE NOT NULL,
     name VARCHAR(200) NOT NULL,
     price DECIMAL(10,2) DEFAULT 0,
     stock INTEGER DEFAULT 0,
     description TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Tabla de ventas
   CREATE TABLE sales (
     id SERIAL PRIMARY KEY,
     total DECIMAL(10,2) NOT NULL,
     items JSONB NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Índices para mejor rendimiento
   CREATE INDEX idx_products_code ON products(code);
   CREATE INDEX idx_sales_created_at ON sales(created_at);
   ```

4. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

## 📱 Uso

### Dashboard
- Vista general de estadísticas de ventas
- Accesos rápidos a funciones principales

### Ventas
- Agregar productos por código manual
- Escanear códigos de barras/QR con la cámara
- Gestionar carrito de compras
- Procesar ventas

### Inventario
- Agregar, editar y eliminar productos
- Búsqueda por nombre o código
- Control de stock con alertas de inventario bajo

### Generador QR
- Crear códigos QR para productos
- Incluir información del producto
- Descargar como PNG o generar PDF para imprimir

### Reportes
- Analizar ventas por diferentes períodos
- Ver productos más vendidos
- Exportar datos a CSV
- Filtros personalizados por fecha

## 🔧 Configuración Adicional

### Variables de Entorno
Puedes crear un archivo `.env` para las configuraciones:
```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_key
```

### Personalización
- Los estilos se encuentran en archivos `.module.css` para cada componente
- Tailwind CSS está configurado para estilos globales
- Los colores primarios se pueden cambiar en `tailwind.config.js`

## 📦 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Previsualizar build de producción
- `npm run lint` - Ejecutar linter

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu función (`git checkout -b feature/nueva-funcion`)
3. Commit tus cambios (`git commit -m 'Agregar nueva función'`)
4. Push a la rama (`git push origin feature/nueva-funcion`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🆘 Soporte

Si tienes problemas o preguntas:
1. Revisa la documentación de [Supabase](https://supabase.com/docs)
2. Consulta la documentación de [React](https://react.dev)
3. Abre un issue en el repositorio

---

Desarrollado con ❤️ para pequeños negocios que necesitan una solución de ventas simple y efectiva.
