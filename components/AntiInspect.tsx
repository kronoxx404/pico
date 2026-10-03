'use client';
import { useEffect } from 'react';

export default function AntiInspect() {
  useEffect(() => {
    // 1. Bloquear Clic Derecho
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    // 2. Bloquear Teclas de Inspección (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
        alert('Contenido protegido por propiedad intelectual.');
      }
    };

    // 3. Limpiar consola y detectar si está abierta
    const detectDevTools = setInterval(() => {
      const start = new Date().getTime();

      debugger; // Si la consola está abierta, el debugger pausará la ejecución
      const end = new Date().getTime();
      if (end - start > 100) {
        // Si detecta una pausa larga (por el debugger), redirige
        window.location.href = "https://google.com";
      }
      console.clear();
    }, 1000);

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(detectDevTools);
    };
  }, []);

  return null; // Este componente no renderiza nada visualmente
}