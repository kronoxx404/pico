@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
title Despliegue Rapido a Produccion - PYP
color 0B

cls
echo ==============================================================================
echo                 DESPLIEGUE RAPIDO A PRODUCCION (VERCEL / GITHUB)
echo ==============================================================================
echo.

where git >nul 2>nul
if errorlevel 1 (
    echo [!] Git no esta en el PATH o no esta instalado. Abriendo Asistente Web...
    start http://localhost:3000/wizard.html
    exit /b
)

echo [1/3] Guardando cambios locales para produccion...
git add .
git commit -m "Auto-deploy via Wizard Script" >nul 2>nul

echo [2/3] Sincronizando con repositorio remoto...
git push origin main >nul 2>nul
if errorlevel 1 (
    echo [i] Si aun no has vinculado tu repositorio, el Asistente Web te guiara.
)

echo [3/3] Abriendo el Asistente y panel de despliegue...
start http://localhost:3000/wizard.html

echo.
echo ==============================================================================
echo [OK] Operacion completada. Revisa la ventana abierta en tu navegador.
echo ==============================================================================
echo.
pause
