@echo off
echo 🚀 Preparando VentaFacil para GitHub...
echo.

echo ⚡ Verificando Git...
git --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Git no está instalado
    echo 📥 Instala Git desde: https://git-scm.com/download/win
    echo 📖 O sigue las instrucciones en SUBIR-A-GITHUB.md
    pause
    exit /b
)

echo ✅ Git instalado correctamente
echo.

echo 🔧 Verificando configuración de Git...
git config --global user.name >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ⚙️ Configurando Git por primera vez...
    set /p nombre="Ingresa tu nombre: "
    set /p email="Ingresa tu email: "
    git config --global user.name "%nombre%"
    git config --global user.email "%email%"
    echo ✅ Git configurado
) else (
    echo ✅ Git ya está configurado
)
echo.

echo 📁 Inicializando repositorio...
git init

echo 📋 Agregando archivos...
git add .

echo 💾 Haciendo commit inicial...
git commit -m "Initial commit: VentaFacil - Sistema de Ventas completo con React y Supabase"

echo.
echo ✅ ¡Repositorio local listo!
echo.
echo 🌐 Siguientes pasos:
echo 1. Ve a https://github.com
echo 2. Crea un nuevo repositorio llamado 'ventafacil'
echo 3. Copia la URL que te da GitHub
echo 4. Ejecuta estos comandos:
echo.
echo    git remote add origin https://github.com/TU-USUARIO/ventafacil.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 📖 Instrucciones detalladas en SUBIR-A-GITHUB.md
echo.
pause
