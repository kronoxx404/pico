@echo off
cd /d "%~dp0"
title Asistente de Instalacion y Despliegue - PYP
color 0A

cls
echo ==============================================================================
echo                 SISTEMA DE INSTALACION Y DESPLIEGUE PYP
echo ==============================================================================
echo.

echo [1/3] Verificando entorno de ejecucion...
node -v >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Node.js detectado.
    echo.
    if not exist "%~dp0node_modules" (
        echo [2/3] Instalando dependencias del sistema por primera vez...
        echo Por favor espera 1 minuto...
        call npm install --no-fund --no-audit
        echo [OK] Dependencias listas.
    ) else (
        echo [2/3] Dependencias ya instaladas.
    )
    echo.
    echo [3/3] Iniciando servidor y detectando puerto libre...
    node "%~dp0scripts\start_wizard.js"
) else (
    echo [!] Node.js no detectado en el PATH.
    echo [3/3] Abriendo el Asistente Autonomo directamente en tu navegador...
    start "" "%~dp0public\wizard.html"
)

echo.
echo ==============================================================================
echo   ¡TODO LISTO! El Asistente de Instalacion se ha abierto en tu navegador.
echo   Sigue los pasos en pantalla para configurar tu pasarela.
echo ==============================================================================
echo.
echo (Puedes mantener esta ventana abierta mientras configuras tu sistema)
echo.
pause
