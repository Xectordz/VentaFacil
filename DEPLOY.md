# VentaFacil - Deploy Instructions

## 🚀 Cómo Publicar VentaFacil en Internet

### **Opción 1: Vercel (Recomendada)**

1. **Preparar el proyecto:**
   ```bash
   npm run build
   ```

2. **Subir a GitHub:**
   - Crea un repositorio en GitHub
   - Sube tu código (sin el archivo .env)
   
3. **Configurar Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Conecta tu cuenta de GitHub
   - Importa tu repositorio
   - Agrega las variables de entorno:
     * `VITE_SUPABASE_URL`
     * `VITE_SUPABASE_ANON_KEY`

4. **Deploy automático:**
   - Vercel hará deploy automáticamente
   - Obtendrás una URL como: `https://ventafacil.vercel.app`

### **Opción 2: Netlify**

1. **Build del proyecto:**
   ```bash
   npm run build
   ```

2. **Deploy en Netlify:**
   - Ve a [netlify.com](https://netlify.com)
   - Arrastra la carpeta `dist` al área de deploy
   - O conecta con GitHub para deploy automático

### **Configuración de Variables de Entorno:**

En el panel de administración de tu plataforma, agrega:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima
```

### **Requisitos para Producción:**

1. **Base de datos Supabase configurada**
2. **Dominio personalizado (opcional)**
3. **HTTPS habilitado (automático en Vercel/Netlify)**
4. **Variables de entorno configuradas**

### **Costos Estimados:**

- **Hosting:** Gratis (Vercel/Netlify)
- **Base de datos:** Gratis hasta 500MB (Supabase)
- **Dominio personalizado:** $10-15/año (opcional)

### **Consideraciones de Seguridad:**

1. **Nunca subir el archivo .env a GitHub**
2. **Usar variables de entorno en producción**
3. **Configurar RLS (Row Level Security) en Supabase**
4. **Limitar acceso por dominio en Supabase**

### **Monitoreo y Mantenimiento:**

- Vercel/Netlify proporcionan analytics básicos
- Supabase tiene dashboard de métricas
- Configurar alertas para uso de recursos
