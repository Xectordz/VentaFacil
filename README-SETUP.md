# 🚀 Guía de Configuración Rápida - Punto de Venta Web

## 📋 Requisitos
- Cuenta en [Supabase](https://supabase.com)
- Node.js instalado

## ⚡ Configuración en 5 Pasos

### 1️⃣ Crear Proyecto en Supabase
1. Ve a [Supabase](https://supabase.com)
2. Crea un nuevo proyecto
3. Anota tu **URL** y **API Key**

### 2️⃣ Configurar Base de Datos
1. En Supabase, ve a **SQL Editor**
2. Copia todo el contenido de `database-complete-setup.sql`
3. Pégalo y ejecuta (botón **RUN**)
4. ✅ ¡Base de datos lista!

### 3️⃣ Configurar Variables de Entorno
Crea archivo `.env` en la raíz del proyecto:
```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_api_key_de_supabase
```

### 4️⃣ Instalar y Ejecutar
```bash
npm install
npm run dev
```

### 5️⃣ Configuración Inicial
1. Ve a `http://localhost:5173/admin/settings`
2. Configura:
   - ✉️ Tu correo de administrador
   - 📞 Tu teléfono de contacto
   - 🏪 Nombre de tu negocio
   - 🎨 Colores de tu tema

## 🛍️ ¡Listo para Vender!

### Funcionalidades Incluidas:
- ✅ **Panel de Administración** completo
- ✅ **Tienda Online** para clientes
- ✅ **Sistema de Inventario** con imágenes
- ✅ **Punto de Venta** tradicional
- ✅ **Pedidos Online** con notificaciones
- ✅ **Reportes y Analytics**
- ✅ **Generador de QR** para compartir tienda
- ✅ **Sistema de Configuración** personalizable

### URLs Importantes:
- **Admin:** `http://localhost:5173/admin`
- **Tienda:** `http://localhost:5173/tienda`
- **Configuración:** `http://localhost:5173/admin/settings`

## 🔧 Personalización Avanzada

### Cambiar Colores del Tema:
1. Ve a `/admin/settings` → pestaña "Tema"
2. Elige tus colores personalizados
3. ¡Se aplican automáticamente!

### Configurar Notificaciones por Email:
1. Ve a `/admin/settings` → pestaña "Notificaciones"
2. Activa las notificaciones
3. Configura tu correo de admin

### Agregar Productos:
1. Ve a `/admin/inventory`
2. Clic en "Agregar Producto"
3. Sube imágenes (se optimizan automáticamente)

## 📁 Estructura de Archivos

```
punto-de-venta-web/
├── database-complete-setup.sql  ← 🎯 Archivo principal para DB
├── .env                         ← Configuración de Supabase
├── src/
│   ├── pages/
│   │   ├── Dashboard/          ← Panel principal
│   │   ├── Sales/              ← Punto de venta
│   │   ├── Inventory/          ← Gestión de productos
│   │   ├── Store/              ← Tienda online
│   │   └── Settings/           ← Configuración
│   └── hooks/                  ← Lógica de negocio
└── README-SETUP.md             ← Esta guía
```

## 🆘 Solución de Problemas

### Error "Table does not exist":
- Asegúrate de haber ejecutado `database-complete-setup.sql` completo

### Error de conexión a Supabase:
- Verifica que las variables en `.env` sean correctas
- Asegúrate que el proyecto Supabase esté activo

### Imágenes no se suben:
- Ve a Supabase → Storage → Policies
- Asegúrate que las políticas estén creadas correctamente

## 📞 Soporte

Si necesitas ayuda:
1. Revisa la consola del navegador (F12)
2. Verifica los logs de Supabase
3. Asegúrate que todas las tablas existan

---

### 🎉 ¡Tu Punto de Venta Web está listo!

Con un solo archivo SQL tienes toda la base de datos configurada.
¡Perfecto para replicar en múltiples proyectos! 🚀
