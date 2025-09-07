@echo off
echo Preparando VentaFacil para produccion...
echo.

echo 1. Instalando dependencias...
npm install

echo.
echo 2. Ejecutando build...
npm run build

echo.
echo 3. Verificando build...
if exist "dist" (
    echo ✅ Build completado exitosamente
    echo ✅ Archivos generados en la carpeta 'dist'
    echo.
    echo 📁 Contenido de dist:
    dir dist /b
    echo.
    echo 🚀 Tu aplicacion esta lista para deploy!
    echo.
    echo Siguiente paso:
    echo - Sube la carpeta 'dist' a tu plataforma de hosting
    echo - O conecta tu repositorio con Vercel/Netlify
    echo.
    echo 📖 Lee DEPLOY.md para instrucciones detalladas
) else (
    echo ❌ Error en el build
    echo Revisa los errores anteriores
)

echo.
pause
