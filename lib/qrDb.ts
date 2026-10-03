import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';

export interface QRData {
  id: number;
  identificador_encriptado: string;
  monto: number;
  imagen_url: string;
  color_fondo?: string;
  color_puntos?: string;
  texto_personalizado: string;
  estado: number;
}

const LOCAL_DATA_FILE = path.join(process.cwd(), 'data', 'qrs.json');

function readLocalQrs(): QRData[] {
  try {
    if (fs.existsSync(LOCAL_DATA_FILE)) {
      const content = fs.readFileSync(LOCAL_DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.warn('[qrDb] Error leyendo qrs.json local:', e);
  }
  return [];
}

function writeLocalQrs(qrs: QRData[]): void {
  try {
    const dir = path.dirname(LOCAL_DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_DATA_FILE, JSON.stringify(qrs, null, 2), 'utf-8');
  } catch (e) {
    console.warn('[qrDb] Error guardando qrs.json local:', e);
  }
}

export async function getActiveQRs(): Promise<QRData[]> {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('qrs')
        .select('*')
        .eq('estado', 1)
        .order('id', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          identificador_encriptado: row.identificador_encriptado || row.llave || '',
          monto: Number(row.monto) || 0,
          imagen_url: row.imagen_url || row.url || '/QR.jpeg',
          color_fondo: row.color_fondo || '#ffffff',
          color_puntos: row.color_puntos || '#000000',
          texto_personalizado: row.texto_personalizado || row.name || 'QR',
          estado: row.estado ?? 1,
        }));
      }
    }
  } catch (err) {
    console.warn('[qrDb] Error en getActiveQRs desde Supabase:', err);
  }

  const local = readLocalQrs();
  return local.filter((q) => q.estado === 1);
}

export async function getAllQRs(): Promise<QRData[]> {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('qrs')
        .select('*')
        .order('id', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          identificador_encriptado: row.identificador_encriptado || row.llave || '',
          monto: Number(row.monto) || 0,
          imagen_url: row.imagen_url || row.url || '/QR.jpeg',
          color_fondo: row.color_fondo || '#ffffff',
          color_puntos: row.color_puntos || '#000000',
          texto_personalizado: row.texto_personalizado || row.name || 'QR',
          estado: row.estado ?? 1,
        }));
      }
    }
  } catch (err) {
    console.warn('[qrDb] Error en getAllQRs desde Supabase:', err);
  }

  return readLocalQrs();
}

export async function addQR(identificador: string, monto: number, imagenUrl: string, banco: string): Promise<number> {
  const newId = Date.now();
  const newQr: QRData = {
    id: newId,
    identificador_encriptado: identificador,
    monto,
    imagen_url: imagenUrl,
    texto_personalizado: banco,
    estado: 1,
  };

  try {
    if (supabase) {
      await supabase.from('qrs').insert([
        {
          id: newId,
          identificador_encriptado: identificador,
          monto,
          imagen_url: imagenUrl,
          texto_personalizado: banco,
          estado: 1,
        },
      ]);
    }
  } catch (err) {
    console.warn('[qrDb] Error insertando QR en Supabase:', err);
  }

  const list = readLocalQrs();
  list.unshift(newQr);
  writeLocalQrs(list);
  return newId;
}

export async function toggleQRStatus(id: number, estado: number): Promise<boolean> {
  try {
    if (supabase) {
      await supabase.from('qrs').update({ estado }).eq('id', id);
    }
  } catch (err) {
    console.warn('[qrDb] Error actualizando estado en Supabase:', err);
  }

  const list = readLocalQrs();
  const item = list.find((q) => q.id === id);
  if (item) {
    item.estado = estado;
    writeLocalQrs(list);
    return true;
  }
  return true;
}

export async function deleteQR(id: number): Promise<boolean> {
  try {
    if (supabase) {
      await supabase.from('qrs').delete().eq('id', id);
    }
  } catch (err) {
    console.warn('[qrDb] Error eliminando QR en Supabase:', err);
  }

  const list = readLocalQrs();
  const filtered = list.filter((q) => q.id !== id);
  writeLocalQrs(filtered);
  return true;
}

export async function updateQR(id: number, identificador: string, banco: string): Promise<boolean> {
  try {
    if (supabase) {
      await supabase
        .from('qrs')
        .update({ identificador_encriptado: identificador, texto_personalizado: banco })
        .eq('id', id);
    }
  } catch (err) {
    console.warn('[qrDb] Error actualizando QR en Supabase:', err);
  }

  const list = readLocalQrs();
  const item = list.find((q) => q.id === id);
  if (item) {
    item.identificador_encriptado = identificador;
    item.texto_personalizado = banco;
    writeLocalQrs(list);
    return true;
  }
  return true;
}
