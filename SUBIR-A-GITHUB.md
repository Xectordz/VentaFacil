# 📋 Guía Paso a Paso: Subir VentaFacil a GitHub

## 🔧 **Paso 1: Instalar Git (si no lo tienes)**

### Opción A: Descarga directa
1. Ve a: https://git-scm.com/download/win
2. Descarga e instala Git para Windows
3. Usa la configuración por defecto

### Opción B: Winget (desde terminal como administrador)
```powershell
winget install Git.Git --source winget
```

## 👤 **Paso 2: Configurar Git (primera vez)**

Abre una nueva terminal y ejecuta:

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@ejemplo.com"
```

## 📁 **Paso 3: Inicializar repositorio en tu proyecto**

En la carpeta de VentaFacil, ejecuta:

```bash
git init
git add .
git commit -m "Initial commit: VentaFacil - Sistema de Ventas completo"
```

## 🌐 **Paso 4: Crear repositorio en GitHub**

1. Ve a: https://github.com
2. Haz clic en "New repository"
3. Nombre: `ventafacil`
4. Descripción: `Sistema de ventas web con React, Supabase y funcionalidad de escaneo`
5. Déjalo como **Público** (gratis)
6. NO marques "Add a README file" (ya tienes uno)
7. Haz clic en "Create repository"

## 🔗 **Paso 5: Conectar y subir**

GitHub te dará comandos similares a estos:

```bash
git remote add origin https://github.com/TU-USUARIO/ventafacil.git
git branch -M main
git push -u origin main
```

**Reemplaza `TU-USUARIO` con tu usuario real de GitHub**

## ✅ **Paso 6: Verificar**

1. Refresca la página de tu repositorio en GitHub
2. Deberías ver todos tus archivos subidos
3. ¡Ya está listo para deploy en Vercel!

## 🚀 **Paso 7: Deploy en Vercel**

1. Ve a: https://vercel.com
2. "Sign up" con tu cuenta de GitHub
3. "New Project" → Selecciona `ventafacil`
4. En Environment Variables agrega:
   ```
   VITE_SUPABASE_URL = tu-url-de-supabase
   VITE_SUPABASE_ANON_KEY = tu-clave-anonima
   ```
5. ¡Deploy!

---

## ⚠️ **IMPORTANTE - Archivos que NO se suben:**

Tu `.gitignore` ya está configurado para NO subir:
- ❌ `node_modules/` (se instalan automáticamente)
- ❌ `dist/` (se genera automáticamente)
- ❌ `.env` (¡NUNCA subas este archivo!)
- ❌ Archivos temporales

## 🔒 **Seguridad:**

- ✅ Nunca subas el archivo `.env` 
- ✅ Las claves van en las variables de entorno de Vercel
- ✅ Tu código está seguro en un repositorio público

---

## 📞 **¿Necesitas ayuda?**

Si tienes algún problema en cualquier paso, dime exactamente dónde te quedaste y te ayudo a continuar! 😊
