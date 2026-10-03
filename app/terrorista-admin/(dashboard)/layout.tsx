import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import XdmSidebar from '@/components/terrorista-admin/XdmSidebar';

export default async function XdmLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('xdm_session');

  if (!session || session.value !== 'authenticated') {
    redirect('/terrorista-admin/login');
  }

  return (
    <div className="bg-stone-950 flex h-screen overflow-hidden font-sans text-zinc-100 selection:bg-violet-500/30 selection:text-violet-200">
      <XdmSidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-stone-950">
        {children}
      </main>
    </div>
  );
}
