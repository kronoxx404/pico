'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function XdmSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/xdm-auth/logout', { method: 'POST' });
      router.push('/terrorista-admin/login');
    } catch (e) {
      console.error(e);
    }
  };

  const menuItems = [
    { label: '🔴 Dashboard en Vivo', href: '/terrorista-admin' },
    { label: 'Gestión Bancos PSE', href: '/terrorista-admin/bancos' },
    { label: 'Gestión Códigos QR', href: '/terrorista-admin/qrs' },
    { label: 'Gestión Medios de Pago', href: '/terrorista-admin/pagos' },
  ];

  return (
    <aside className="w-64 bg-stone-900 border border-stone-800 rounded-2xl m-3 h-[calc(100vh-1.5rem)] flex flex-col text-zinc-100 shadow-xl">
      <div className="h-16 flex items-center px-6 border-b border-stone-800 bg-stone-950/50">
        <h2 className="text-xl font-bold text-violet-500">Terrorista Terminal</h2>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {menuItems.map(item => {
          const isActive = pathname === item.href || (item.href === '/terrorista-admin' && (pathname === '/terrorista-admin' || pathname === '/terrorista-admin/'));
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive 
                  ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20' 
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100 border border-transparent'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-stone-800">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
