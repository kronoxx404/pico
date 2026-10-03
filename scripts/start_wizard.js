// scripts/start_wizard.js
const http = require('http');
const path = require('path');
const { spawn, exec } = require('child_process');

console.log('==============================================================================');
console.log('              INICIANDO SISTEMA Y ASISTENTE INTELIGENTE');
console.log('==============================================================================\n');

const ROOT_DIR = path.resolve(__dirname, '..');

// 1. Iniciar servidor Next.js
console.log('[1/2] Iniciando servidor web de la pasarela...');
const devProcess = spawn('npm', ['run', 'dev:next'], {
  cwd: ROOT_DIR,
  shell: true,
  stdio: 'inherit'
});

devProcess.on('error', (err) => {
  console.error('[!] Error iniciando proceso:', err.message);
});

// 2. Comprobar en qué puerto está respondiendo el Wizard
function checkUrl(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/wizard.html`, { timeout: 1500 }, (res) => {
      if (res.statusCode === 200) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function findActivePortAndOpen() {
  const possiblePorts = [3000, 3001, 3002, 3500, 3003, 3004];
  console.log('[2/2] Esperando que el servidor este listo...');

  for (let attempt = 1; attempt <= 20; attempt++) {
    for (const port of possiblePorts) {
      const isLive = await checkUrl(port);
      if (isLive) {
        console.log(`\n==============================================================================`);
        console.log(`[✓] ¡Servidor detectado en puerto ${port}!`);
        console.log(`[✓] Abriendo Asistente en: http://localhost:${port}/wizard.html`);
        console.log(`==============================================================================\n`);
        exec(`start http://localhost:${port}/wizard.html`);
        return;
      }
    }
    await new Promise((r) => setTimeout(r, 1000));
  }

  // Si no respondió en 20 segundos, abrir el archivo estático de respaldo
  console.log('\n[!] Abriendo Asistente autonomo en el navegador...');
  const fallbackPath = path.join(ROOT_DIR, 'public', 'wizard.html');
  exec(`start "" "${fallbackPath}"`);
}

findActivePortAndOpen();
