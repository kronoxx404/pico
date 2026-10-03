// app/x_auth_md/page.tsx
import { Metadata } from 'next';
import XdmPanel from '@/components/xdm_components/XdmPanel';

export const metadata: Metadata = {
  title: 'Panel de Administración • Código QR | Pico y Placa',
  description: 'Gestor y optimizador de código QR de pago en tiempo real con Supabase.',
};

export default function AdminPage() {
  return <XdmPanel />;
}
