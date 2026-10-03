// lib/qrManager.ts
import { getQrSupabaseClient, checkQrSupabaseEnv, QR_BUCKET_NAME } from '@/lib/qrSupabase';
import fs from 'fs';
import path from 'path';

export interface QrConfig {
  id: string | number;
  url: string;
  isActive: boolean;
  name: string;
  monto?: number;
  llave?: string;
  sizeBytes?: number;
  originalSizeBytes?: number;
  mimeType?: string;
  dimensions?: { width: number; height: number };
  updatedAt: string;
  source: 'supabase_storage' | 'supabase_db' | 'local_fallback' | 'sqlite';
  missingEnvVars?: string[];
}

const LOCAL_STORAGE_DIR = path.join(process.cwd(), 'data');
const LOCAL_CONFIG_FILE = path.join(LOCAL_STORAGE_DIR, 'qr_active.json');
const DEFAULT_FALLBACK_URL = '/QR.jpeg';

/**
 * Asegura que el directorio data exista
 */
function ensureDataDir() {
  try {
    if (!fs.existsSync(LOCAL_STORAGE_DIR)) {
      fs.mkdirSync(LOCAL_STORAGE_DIR, { recursive: true });
    }
  } catch (e) {
    console.error('[qrManager] Error creando directorio data:', e);
  }
}

/**
 * Lee la configuración local de respaldo
 */
export function getLocalConfig(): QrConfig | null {
  try {
    ensureDataDir();
    if (fs.existsSync(LOCAL_CONFIG_FILE)) {
      const content = fs.readFileSync(LOCAL_CONFIG_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      return parsed;
    }
  } catch (e) {
    console.warn('[qrManager] Error leyendo qr_active.json:', e);
  }
  return null;
}

/**
 * Guarda la configuración local de respaldo
 */
export function saveLocalConfig(config: QrConfig): void {
  try {
    ensureDataDir();
    fs.writeFileSync(LOCAL_CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
  } catch (e) {
    console.error('[qrManager] Error guardando qr_active.json:', e);
  }
}

/**
 * Obtiene la configuración activa del QR desde la base de datos de Supabase dedicada
 */
export async function getActiveQrConfig(): Promise<QrConfig> {
  const envStatus = checkQrSupabaseEnv();

  // 1. Intentar consultar en el Supabase dedicado si las variables están configuradas
  if (envStatus.isConfigured) {
    try {
      const qrClient = getQrSupabaseClient();
      if (qrClient && typeof qrClient.from === 'function') {
        const { data, error } = await qrClient
          .from('qr_config')
          .select('*')
          .eq('is_active', true)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!error && data && data.url) {
          const config: QrConfig = {
            id: data.id || 'supabase-qr',
            url: data.url,
            isActive: data.is_active !== false,
            name: data.name || 'Código QR Activo',
            sizeBytes: data.size_bytes || 0,
            originalSizeBytes: data.original_size_bytes || undefined,
            mimeType: data.mime_type || 'image/webp',
            dimensions: data.dimensions || undefined,
            updatedAt: data.updated_at || new Date().toISOString(),
            source: 'supabase_db',
          };
          saveLocalConfig(config);
          return config;
        }
      }
    } catch (err) {
      console.warn('[qrManager] Error al consultar Supabase QR dedicado:', err);
    }
  }

  // 2. Intentar leer respaldo local
  const local = getLocalConfig();
  if (local && local.url) {
    return {
      ...local,
      missingEnvVars: envStatus.missingVars,
    };
  }

  // 3. Fallback predeterminado a /QR.jpeg
  const defaultConfig: QrConfig = {
    id: 'default-pyp-qr',
    url: DEFAULT_FALLBACK_URL,
    isActive: true,
    name: 'QR Predeterminado',
    sizeBytes: 154200,
    mimeType: 'image/jpeg',
    dimensions: { width: 400, height: 400 },
    updatedAt: new Date().toISOString(),
    source: 'local_fallback',
    missingEnvVars: envStatus.missingVars,
  };

  saveLocalConfig(defaultConfig);
  return defaultConfig;
}

import { getAllQRs, addQR, toggleQRStatus, deleteQR } from '@/lib/qrDb';

/**
 * Guarda o reemplaza el QR activo en el Bucket y base de datos local SQLite
 */
export async function setActiveQrConfig(params: {
  imageBase64: string;
  name: string; // banco
  llave?: string;
  monto?: number;
  sizeBytes?: number;
  originalSizeBytes?: number;
  mimeType?: string;
  dimensions?: { width: number; height: number };
}): Promise<QrConfig> {
  const envStatus = checkQrSupabaseEnv();

  if (!envStatus.isConfigured) {
    throw new Error(
      `No se puede subir al bucket. Faltan las siguientes variables de entorno en tu archivo .env: ${envStatus.missingVars.join(
        ', '
      )}. Debes configurar tu otra base de datos de Supabase antes de subir.`
    );
  }

  const {
    imageBase64,
    name,
    llave = '',
    monto = 0,
    sizeBytes,
    originalSizeBytes,
    mimeType = 'image/webp',
    dimensions,
  } = params;

  let finalUrl = imageBase64;
  let source: QrConfig['source'] = 'sqlite';

  const qrClient = getQrSupabaseClient();

  // 1. Subir al Storage Bucket dedicado
  try {
    if (qrClient?.storage) {
      const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
      const buffer = Buffer.from(base64Data, 'base64');
      const ext = mimeType.includes('webp') ? 'webp' : mimeType.includes('png') ? 'png' : 'jpeg';
      const fileName = `active_qr_${Date.now()}.${ext}`;

      const { data: uploadData, error: uploadError } = await qrClient.storage
        .from(QR_BUCKET_NAME)
        .upload(fileName, buffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = qrClient.storage
          .from(QR_BUCKET_NAME)
          .getPublicUrl(fileName);

        if (publicUrlData?.publicUrl) {
          finalUrl = publicUrlData.publicUrl;
        }
      } else if (uploadError) {
        console.warn(
          `[qrManager] Advertencia en Supabase Storage (${QR_BUCKET_NAME}): ${uploadError.message}. Guardando imagen local.`
        );
      }
    }
  } catch (storageErr) {
    console.warn(
      '[qrManager] Excepción al interactuar con Storage Bucket:',
      storageErr
    );
  }

  // 2. Registrar en tabla 'qrs' de SQLite
  let insertId = 0;
  try {
    insertId = await addQR(llave, monto, finalUrl, name);
  } catch (dbErr) {
    console.warn('[qrManager] Advertencia insertando registro en SQLite qrs:', dbErr);
    throw new Error('Error al guardar el QR en la base de datos local');
  }

  const now = new Date().toISOString();
  
  // 3. Crear objeto de configuración final y persistir localmente (opcional)
  const newConfig: QrConfig = {
    id: insertId,
    url: finalUrl,
    isActive: true,
    name,
    monto,
    llave,
    sizeBytes,
    originalSizeBytes,
    mimeType,
    dimensions,
    updatedAt: now,
    source,
  };

  saveLocalConfig(newConfig);
  return newConfig;
}

/**
 * Obtiene todos los QRs de la base de datos SQLite
 */
export async function getAllQrConfigs(): Promise<QrConfig[]> {
  try {
    const rows = await getAllQRs();
    return rows.map(item => ({
      id: item.id,
      url: item.imagen_url,
      isActive: item.estado === 1,
      name: item.texto_personalizado || 'Código QR',
      monto: item.monto,
      llave: item.identificador_encriptado,
      updatedAt: new Date().toISOString(), // SQLite could return this if we parse it, but fine for now
      source: 'sqlite',
    }));
  } catch (err) {
    console.warn('[qrManager] Error al consultar todos los QRs:', err);
    return [];
  }
}

/**
 * Alterna el estado activo / inactivo de un QR específico (SQLite)
 */
export async function toggleQrActiveState(id: string | number, isActive: boolean): Promise<boolean> {
  try {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(numericId)) return false;
    
    return await toggleQRStatus(numericId, isActive ? 1 : 0);
  } catch (e) {
    console.warn('[qrManager] Error actualizando estado en SQLite:', e);
  }
  return false;
}

/**
 * Elimina un QR de SQLite y Storage
 */
export async function deleteQrConfig(id: string | number, url: string): Promise<boolean> {
  const qrClient = getQrSupabaseClient();
  try {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(numericId)) return false;

    // 1. Borrar de DB local SQLite
    await deleteQR(numericId);

    // 2. Borrar del Storage si existe la URL
    if (qrClient && url && url.includes(QR_BUCKET_NAME)) {
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      if (fileName) {
        await qrClient.storage.from(QR_BUCKET_NAME).remove([fileName]);
      }
    }

    return true;
  } catch (e) {
    console.warn('[qrManager] Error al eliminar QR:', e);
  }
  return false;
}

/**
 * Actualiza los metadatos de un QR (Banco y Llave)
 */
import { updateQR } from '@/lib/qrDb';

export async function updateQrMetadata(id: string | number, name: string, llave: string): Promise<boolean> {
  const envStatus = checkQrSupabaseEnv();
  
  try {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (!isNaN(numericId)) {
      await updateQR(numericId, llave, name);
    }
    
    // Update Supabase if configured
    if (envStatus.isConfigured) {
      const qrClient = getQrSupabaseClient();
      if (qrClient) {
        await qrClient
          .from('qr_config')
          .update({ name, llave })
          .eq('id', id);
      }
    }
    
    return true;
  } catch (e) {
    console.warn('[qrManager] Error al actualizar metadatos del QR:', e);
    return false;
  }
}
