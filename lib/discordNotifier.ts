export interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface DiscordNotificationPayload {
  webhookUrl?: string;
  title: string;
  description?: string;
  color?: number; // Integer color value, e.g. 0x008BE3
  fields?: DiscordEmbedField[];
  footer?: string;
}

export async function sendDiscordNotification(payload: DiscordNotificationPayload): Promise<boolean> {
  try {
    const rawWebhook = payload.webhookUrl || process.env.DISCORD_WEBHOOK_URL || "https://discordapp.com/api/webhooks/1531970860250955858/wEWBIxtnKGH4gBX_Y-KGDgTxLuUA2Igz_HoyDH96yNUq66U7uRbQ72i6VH9VFB_teCic";
    const webhookUrl = rawWebhook.replace(/['"]/g, '').trim();
    if (!webhookUrl || !webhookUrl.startsWith('http')) {
      console.log('[Discord System] DISCORD_WEBHOOK_URL no configurado. Omitiendo.');
      return false;
    }

    const embed = {
      title: payload.title,
      description: payload.description || '',
      color: payload.color || 0x1b365d,
      fields: payload.fields || [],
      footer: {
        text: payload.footer || 'Pico y Placa • Sistema de Notificaciones'
      },
      timestamp: new Date().toISOString()
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Pico y Placa Bot',
        embeds: [embed]
      })
    });

    if (!response.ok) {
      console.error(`[Discord System] Error al enviar webhook: ${response.status} ${response.statusText}`);
      return false;
    }

    console.log('[Discord System] Notificación enviada exitosamente a Discord.');
    return true;
  } catch (error) {
    console.error('[Discord System] Error inesperado:', error);
    return false;
  }
}
