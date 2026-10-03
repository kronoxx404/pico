// scripts/setup_env_cli.js
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const https = require('https');

const ROOT_DIR = path.resolve(__dirname, '..');
const ENV_FILE = path.join(ROOT_DIR, '.env');
const ENV_EXAMPLE = path.join(ROOT_DIR, '.env.example');

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      env[key] = val;
    }
  });
  return env;
}

function httpsPost(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const postData = JSON.stringify(data);
    const req = https.request(
      {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      },
      res => {
        let body = '';
        res.on('data', chunk => (body += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch {
            resolve({ raw: body });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let body = '';
      res.on('data', chunk => (body += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch {
          resolve({ raw: body });
        }
      });
    }).on('error', reject);
  });
}

async function promptUser(query, defaultValue = '') {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const promptText = defaultValue ? `${query} [${defaultValue}]: ` : `${query}: `;

  return new Promise(resolve => {
    rl.question(promptText, answer => {
      rl.close();
      const trimmed = answer.trim();
      resolve(trimmed !== '' ? trimmed : defaultValue);
    });
  });
}

async function main() {
  console.log('\n==============================================================================');
  console.log('         CONFIGURACION DE VARIABLES DE ENTORNO (CONSOLA / VERCEL)');
  console.log('==============================================================================\n');

  let currentEnv = parseEnvFile(ENV_FILE);
  if (Object.keys(currentEnv).length === 0 && fs.existsSync(ENV_EXAMPLE)) {
    currentEnv = parseEnvFile(ENV_EXAMPLE);
  }

  const hasConfig = Boolean(currentEnv.TELEGRAM_BOT && currentEnv.TELEGRAM_CHAT && currentEnv.XDM_PASSWORD);

  const adminPath = currentEnv.ADMIN_PATH || '/terrorista-admin';

  if (hasConfig) {
    console.log('Configuracion actual detectada:');
    console.log(`- Bot Token:        ${currentEnv.TELEGRAM_BOT.slice(0, 10)}...`);
    console.log(`- Chat ID:          ${currentEnv.TELEGRAM_CHAT}`);
    console.log(`- Chat Logs:        ${currentEnv.TELEGRAM_CHAT_LOGS || '(no configurado)'}`);
    console.log(`- Proyecto:         ${currentEnv.PROYECTO || 'PYP'}`);
    console.log(`- Panel (${adminPath}): ${currentEnv.XDM_USER || 'admin'}`);
    console.log(`- Clave (${adminPath}): ******\n`);

    const edit = await promptUser('¿Deseas modificar estas variables ahora?', 'N');
    if (edit.toUpperCase() !== 'S' && edit.toUpperCase() !== 'SI' && edit.toUpperCase() !== 'Y') {
      console.log('\n[OK] Se conservan las variables actuales.');
      return;
    }
  }

  console.log('\nIngresa los datos solicitados (Presiona Enter para mantener valores por defecto):');
  console.log('------------------------------------------------------------------------------');

  const botToken = await promptUser(
    '1. Bot Token de Telegram (@BotFather)',
    currentEnv.TELEGRAM_BOT || ''
  );

  const chatId = await promptUser(
    '2. Chat ID de Telegram (Ej: -1001234567890)',
    currentEnv.TELEGRAM_CHAT || ''
  );

  const chatLogs = await promptUser(
    '3. Chat ID de Auditoria / Logs (Opcional)',
    currentEnv.TELEGRAM_CHAT_LOGS || ''
  );

  const xdmUser = await promptUser(
    `4. Usuario del panel de administracion (${adminPath})`,
    currentEnv.XDM_USER || 'admin'
  );

  const xdmPass = await promptUser(
    `5. Contraseña del panel de administracion (${adminPath})`,
    currentEnv.XDM_PASSWORD || 'admin'
  );

  const proyecto = await promptUser(
    '6. Nombre del Proyecto / Pasarela',
    currentEnv.PROYECTO || 'PYP'
  );

  // Probar Telegram si se ingresó token y chat
  if (botToken && chatId) {
    console.log('\n[*] Verificando conexion con Telegram Bot...');
    try {
      const meRes = await httpsGet(`https://api.telegram.org/bot${botToken}/getMe`);
      if (meRes && meRes.ok) {
        const botName = meRes.result?.username ? `@${meRes.result.username}` : 'Bot';
        console.log(`[OK] Bot valido: ${botName}`);

        console.log('[*] Enviando mensaje de prueba al chat...');
        const sendRes = await httpsPost(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          chat_id: chatId,
          text: `🚀 <b>¡Conexión Exitosa con Telegram!</b>\n\nVariables configuradas desde la consola.\n🤖 <b>Bot:</b> ${botName}\n📦 <b>Proyecto:</b> ${proyecto}\n⏰ <b>Fecha:</b> ${new Date().toLocaleString('es-CO')}`,
          parse_mode: 'HTML',
        });

        if (sendRes && sendRes.ok) {
          console.log('[OK] Mensaje de prueba enviado exitosamente a tu Telegram.');
        } else {
          console.log(`[!] Advertencia: No se pudo enviar mensaje al Chat ID (${sendRes.description || 'revisa permisos'}).`);
        }
      } else {
        console.log(`[!] Advertencia: El Bot Token parece invalido (${meRes.description || 'revisa token'}).`);
      }
    } catch (e) {
      console.log(`[!] Nota: No se pudo conectar a Telegram (${e.message}).`);
    }
  }

  // Generar o mantener TELEGRAM_DTA
  const dta = currentEnv.TELEGRAM_DTA || (botToken ? botToken.replace(/[^a-zA-Z0-9]/g, '').slice(0, 32) : 'default');

  // Actualizar o crear contenido .env
  let envContent = '';
  if (fs.existsSync(ENV_FILE)) {
    envContent = fs.readFileSync(ENV_FILE, 'utf8');
  } else if (fs.existsSync(ENV_EXAMPLE)) {
    envContent = fs.readFileSync(ENV_EXAMPLE, 'utf8');
  }

  const updates = {
    TELEGRAM_BOT: botToken,
    TELEGRAM_CHAT: chatId,
    TELEGRAM_CHAT_LOGS: chatLogs,
    TELEGRAM_DTA: dta,
    PROYECTO: proyecto,
    OFFER_PAGE: currentEnv.OFFER_PAGE || '/',
    XDM_USER: xdmUser,
    XDM_PASSWORD: xdmPass,
  };

  if (currentEnv.ADMIN_PATH) {
    updates.ADMIN_PATH = currentEnv.ADMIN_PATH;
  }

  let newLines = [];
  const handledKeys = new Set();

  if (envContent) {
    const lines = envContent.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      const eqIdx = trimmed.indexOf('=');
      if (trimmed && !trimmed.startsWith('#') && eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        if (updates[key] !== undefined) {
          newLines.push(`${key}=${updates[key]}`);
          handledKeys.add(key);
          continue;
        }
      }
      newLines.push(line);
    }
  }

  for (const [key, val] of Object.entries(updates)) {
    if (!handledKeys.has(key)) {
      newLines.push(`${key}=${val}`);
    }
  }

  fs.writeFileSync(ENV_FILE, newLines.join('\n'), 'utf8');
  console.log('\n[OK] Archivo .env guardado y actualizado exitosamente.');
  console.log('==============================================================================\n');
}

main().catch(err => {
  console.error('[ERROR]', err);
});
