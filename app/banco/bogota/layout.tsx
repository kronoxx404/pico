import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Banco de Bogotá',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
