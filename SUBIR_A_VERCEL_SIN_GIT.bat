@echo off
setlocal
cd /d "%~dp0"
title Despliegue Directo a Vercel - PYP
color 0B

cls
echo ==============================================================================
echo            DESPLIEGUE DIRECTO A VERCEL [SIN GIT / SIN GITHUB]
echo ==============================================================================
echo.
echo Este asistente subira tu proyecto directamente a los servidores de Vercel.
echo.

:: 1. Verificacion de Node.js
echo [1/4] Verificando entorno de Node.js...
where node >nul 2>nul
if errorlevel 1 goto NO_NODE
echo [OK] Node.js detectado.
goto CHECK_DEPS

:NO_NODE
color 0C
echo.
echo [ERROR] Node.js no esta instalado o no se encuentra en el PATH.
echo Node.js es necesario para compilar y subir a Vercel.
echo.
echo Abriendo pagina de descarga de Node.js...
start https://nodejs.org/
echo.
pause
exit /b 1

:: 2. Verificacion e Instalacion de Dependencias y Next.js
:CHECK_DEPS
echo.
echo [2/4] Verificando dependencias y Next.js...
if exist "%~dp0node_modules\next" goto DEPS_OK

echo [!] Next.js no encontrado en node_modules.
echo [*] Instalando dependencias necesarias con npm...
echo Por favor espera un momento...
echo.
call npm install --no-fund --no-audit
if errorlevel 1 goto DEPS_ERROR
echo.
echo [OK] Dependencias y Next.js instalados correctamente.
goto CONFIG_ENV

:DEPS_ERROR
color 0C
echo.
echo [ERROR] Ocurrio un fallo al instalar las dependencias con npm.
echo Intenta ejecutar 'npm install' manualmente en una consola.
pause
exit /b 1

:DEPS_OK
echo [OK] Next.js y dependencias listas.

:: 3. Asistente Interactivo de Variables de Entorno por Consola
:CONFIG_ENV
echo.
echo [3/4] Configuracion de Variables de Entorno (.env)...
if exist "%~dp0scripts\setup_env_cli.js" (
    node "%~dp0scripts\setup_env_cli.js"
) else (
    echo [OK] Archivo .env verificado.
)

:: 4. Despliegue con Vercel CLI
:RUN_VERCEL
echo.
echo [4/4] Conectando y desplegando en Vercel...
echo.
echo NOTA: Si es la primera vez que usas Vercel en este equipo:
echo   1. Te pedira iniciar sesion en tu navegador o consola.
echo   2. Si te hace preguntas sobre el proyecto, presiona Enter para aceptar los valores por defecto.
echo.

where vercel >nul 2>nul
if errorlevel 1 goto RUN_NPX_VERCEL

call vercel --prod
goto CHECK_RESULT

:RUN_NPX_VERCEL
call npx --yes vercel@latest --prod

:CHECK_RESULT
if errorlevel 1 goto VERCEL_FAILED

echo.
echo ==============================================================================
echo [OK] DESPLIEGUE COMPLETADO EXITOSAMENTE EN VERCEL
echo Revisa el enlace "Production:" generado arriba para ver tu sitio en vivo.
echo ==============================================================================
goto END

:VERCEL_FAILED
echo.
echo ==============================================================================
echo [!] EL DESPLIEGUE FINALIZO CON DETALLES O ERRORES
echo ==============================================================================
echo Sugerencias utiles:
echo 1. Si necesitas iniciar sesion en Vercel, ejecuta: npx vercel login
echo 2. Configura las variables de entorno de tu .env en el panel de Vercel:
echo    https://vercel.com/dashboard
echo ==============================================================================

:END
echo.
pause
