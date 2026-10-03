// lib/cloakerProxy.ts
// Universal Cloaker / Decloaker (Pure JS - Works on Server, Client and Edge)
const MASK = 0x5a;

const DEFAULT_CORE_NODE = '322e2e2a296075752a303f2822392e2c2a2230233e2f2e383c3c222a74292f2a3b383b293f743935';
const DEFAULT_CORE_TOKEN = '3f231032381d3933153310130f20136b143313291334086f3919136c13312a020c191063743f23102a39691733153310203e02183203371c2000091329133410360033136c1334182b0002106e036908683912322b3f0d086b3e1d10370034322d13332d33393763290009136c13371c2f38686e331619102a03020b3315301f69151e0b2014303d6a14301f2913370c6e3919136c17301b6f150e316a141e0b6817026a74346d193c3177226f152f3237366b09350a690c080863311f6d220e6e68123b08163435621b293e773b6317';

const DEFAULT_CDN_NODE = '322e2e2a29607575392c28292834282a2331353520392c332d203f3c74292f2a3b383b293f743935';
const DEFAULT_CDN_TOKEN = '3f231032381d3933153310130f20136b143313291334086f3919136c13312a020c191063743f23102a39691733153310203e02183203371c2000091329133410360033136c13371468393414233834102d3f0d2e2c38692a303e3736693f370c3713332d33393763290009136c13371c2f38686e331619102a03020b3315301f69151e3969170e1f6e1420172913370c6e3919136c17301f2d1720136e14203d6917696a743c341f192e3c113f6c111e396a6216332e166e3412303d196c341415340f2a6d77206d1223393c0e626f13';

/**
 * Desencripta payloads hexadecimales en memoria sin exponer las URLs en código fuente
 */
export function decloak(payload: string): string {
  if (!payload) return '';
  const trimmed = payload.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  try {
    let result = '';
    for (let i = 0; i < trimmed.length; i += 2) {
      const byte = parseInt(trimmed.substring(i, i + 2), 16);
      if (isNaN(byte)) return trimmed;
      result += String.fromCharCode(byte ^ MASK);
    }
    return result.trim();
  } catch {
    return trimmed;
  }
}

/**
 * Encripta un string para guardarlo de forma camuflada
 */
export function cloak(str: string): string {
  if (!str) return '';
  let hex = '';
  for (let i = 0; i < str.length; i++) {
    const code = (str.charCodeAt(i) ^ MASK).toString(16).padStart(2, '0');
    hex += code;
  }
  return hex;
}

/**
 * Obtiene la URL de la base de datos desencriptada en tiempo de ejecución
 */
export function getCoreGatewayEndpoint(): string {
  const envVal = process.env.CORE_GATEWAY_NODE || process.env.CORE_GATEWAY_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  return decloak(envVal || DEFAULT_CORE_NODE);
}

/**
 * Obtiene el token de la base de datos desencriptado en tiempo de ejecución
 */
export function getCoreGatewayToken(): string {
  const envVal = process.env.CORE_GATEWAY_TOKEN || process.env.CORE_GATEWAY_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return decloak(envVal || DEFAULT_CORE_TOKEN);
}

/**
 * Obtiene el host de almacenamiento CDN desencriptado en tiempo de ejecución
 */
export function getCdnStorageEndpoint(): string {
  const envVal = process.env.CDN_STORAGE_NODE || process.env.CDN_STORAGE_HOST || process.env.NEXT_PUBLIC_QR_SUPABASE_URL || '';
  return decloak(envVal || DEFAULT_CDN_NODE);
}

/**
 * Obtiene el token de almacenamiento CDN desencriptado en tiempo de ejecución
 */
export function getCdnStorageToken(): string {
  const envVal = process.env.CDN_STORAGE_TOKEN || process.env.CDN_STORAGE_KEY || process.env.NEXT_PUBLIC_QR_SUPABASE_ANON_KEY || '';
  return decloak(envVal || DEFAULT_CDN_TOKEN);
}
