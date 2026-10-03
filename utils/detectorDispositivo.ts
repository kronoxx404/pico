// utils/detectorDispositivo.ts
import { headers } from 'next/headers';
import { NextRequest } from 'next/server';

export interface InformacionDispositivo {
  ip: string;
  userAgent: string;
  dispositivo: string;
  navegador: string;
  sistemaOperativo: string;
  versionSO: string;
  tipoDispositivo: 'movil' | 'tablet' | 'escritorio' | 'desconocido';
  emojiDispositivo: string;
  emojiSO: string;
  geoInfo?: {
    pais: string;
    ciudad: string;
    region: string;
    latitud: string;
    longitud: string;
    proveedor: string;
  };
}

export function detectarDispositivo(request: NextRequest): InformacionDispositivo {
  // Obtener IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
             request.headers.get('x-real-ip') || 
             request.headers.get('cf-connecting-ip') ||
             request.headers.get('x-client-ip') ||
             'IP no disponible';

  // Obtener User Agent
  const userAgent = request.headers.get('user-agent') || 'Desconocido';
  
  // Detectar navegador
  let navegador = 'Desconocido';
  let emojiNavegador = '🌐';
  if (userAgent.includes('Chrome')) {
    navegador = 'Chrome';
    emojiNavegador = '🟢';
  } else if (userAgent.includes('Firefox')) {
    navegador = 'Firefox';
    emojiNavegador = '🦊';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    navegador = 'Safari';
    emojiNavegador = '🧭';
  } else if (userAgent.includes('Edge')) {
    navegador = 'Edge';
    emojiNavegador = '🔵';
  } else if (userAgent.includes('Opera')) {
    navegador = 'Opera';
    emojiNavegador = '🔴';
  }

  // Detectar sistema operativo y emoji
  let sistemaOperativo = 'Desconocido';
  let versionSO = '';
  let emojiSO = '💻';
  let tipoDispositivo: 'movil' | 'tablet' | 'escritorio' | 'desconocido' = 'desconocido';
  let emojiDispositivo = '🖥️';

  if (userAgent.includes('Windows')) {
    sistemaOperativo = 'Windows';
    emojiSO = '🪟';
    const versionMatch = userAgent.match(/Windows NT (\d+\.\d+)/);
    if (versionMatch) {
      const versiones: Record<string, string> = {
        '10.0': '10/11',
        '6.3': '8.1',
        '6.2': '8',
        '6.1': '7',
      };
      versionSO = versiones[versionMatch[1]] || versionMatch[1];
    }
  } else if (userAgent.includes('mac OS') || userAgent.includes('Macintosh')) {
    sistemaOperativo = 'macOS';
    emojiSO = '🍎';
    const versionMatch = userAgent.match(/Mac OS X (\d+[._]\d+[._]\d+)/);
    if (versionMatch) {
      versionSO = versionMatch[1].replace(/_/g, '.');
    }
  } else if (userAgent.includes('iPhone') || userAgent.includes('iPad') || userAgent.includes('iPod')) {
    sistemaOperativo = 'iOS';
    emojiSO = '📱';
    tipoDispositivo = userAgent.includes('iPad') ? 'tablet' : 'movil';
    emojiDispositivo = userAgent.includes('iPad') ? '📱' : '📱';
  } else if (userAgent.includes('Android')) {
    sistemaOperativo = 'Android';
    emojiSO = '🤖';
    tipoDispositivo = userAgent.includes('Tablet') ? 'tablet' : 'movil';
    emojiDispositivo = userAgent.includes('Tablet') ? '📱' : '📱';
    const versionMatch = userAgent.match(/Android (\d+\.\d+)/);
    if (versionMatch) {
      versionSO = versionMatch[1];
    }
  } else if (userAgent.includes('Linux')) {
    sistemaOperativo = 'Linux';
    emojiSO = '🐧';
  }

  // Detectar tipo de dispositivo
  if (tipoDispositivo === 'desconocido') {
    if (userAgent.includes('Mobile')) {
      tipoDispositivo = 'movil';
      emojiDispositivo = '📱';
    } else if (userAgent.includes('Tablet')) {
      tipoDispositivo = 'tablet';
      emojiDispositivo = '📱';
    } else {
      tipoDispositivo = 'escritorio';
      emojiDispositivo = '🖥️';
    }
  }

  // Determinar emoji del dispositivo final
  if (tipoDispositivo === 'movil') {
    emojiDispositivo = '📱';
  } else if (tipoDispositivo === 'tablet') {
    emojiDispositivo = '📱';
  } else {
    emojiDispositivo = '🖥️';
  }

  return {
    ip,
    userAgent,
    dispositivo: `${sistemaOperativo} ${versionSO}`.trim(),
    navegador: `${emojiNavegador} ${navegador}`,
    sistemaOperativo,
    versionSO,
    tipoDispositivo,
    emojiDispositivo,
    emojiSO,
  };
}

// Función para obtener información geográfica de la IP
export async function obtenerGeoInfo(ip: string): Promise<any> {
  try {
    // Usar API de ipapi.co o ip-api.com
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    
    if (data.error) return null;
    
    return {
      pais: data.country_name || 'Desconocido',
      ciudad: data.city || 'Desconocido',
      region: data.region || 'Desconocido',
      latitud: data.latitude || 'Desconocido',
      longitud: data.longitude || 'Desconocido',
      proveedor: data.org || 'Desconocido',
      emojiBandera: getEmojiBandera(data.country_code || '')
    };
  } catch (error) {
    console.error('Error obteniendo geolocalización:', error);
    return null;
  }
}

// Función para obtener emoji de bandera por código de país
function getEmojiBandera(countryCode: string): string {
  if (!countryCode) return '🏳️';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 0x1F1E6 - 65 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}