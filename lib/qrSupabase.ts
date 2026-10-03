import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getCdnStorageEndpoint, getCdnStorageToken } from '@/lib/cloakerProxy';

export interface QrSupabaseEnvStatus {
  isConfigured: boolean;
  url: string;
  key: string;
  bucket: string;
  missingVars: string[];
}

export function checkQrSupabaseEnv(): QrSupabaseEnvStatus {
  const url = getCdnStorageEndpoint();
  const key = getCdnStorageToken();
  const bucket = (
    process.env.CDN_STORAGE_VAULT ||
    process.env.QR_SUPABASE_BUCKET ||
    'qr_codes'
  ).trim();

  return {
    isConfigured: Boolean(url && key),
    url,
    key,
    bucket,
    missingVars: [],
  };
}

export const QR_BUCKET_NAME = (
  process.env.CDN_STORAGE_VAULT ||
  process.env.QR_SUPABASE_BUCKET ||
  'qr_codes'
).trim();

let _qrClient: SupabaseClient | null = null;

/**
 * Retorna el cliente de Supabase exclusivo para el Bucket de Códigos QR.
 * Si faltan las variables en .env, lanza un error descriptivo con los nombres exactos.
 */
export function getQrSupabaseClient(): SupabaseClient {
  const status = checkQrSupabaseEnv();

  if (!status.isConfigured) {
    throw new Error(
      `Faltan las siguientes variables de entorno en tu archivo .env: ${status.missingVars.join(
        ', '
      )}. Debes configurarlas con los datos de tu otra base de datos de Supabase para poder usar el bucket de QR.`
    );
  }

  if (!_qrClient) {
    _qrClient = createClient(status.url, status.key, {
      auth: {
        persistSession: false,
      },
    });
  }

  return _qrClient;
}
