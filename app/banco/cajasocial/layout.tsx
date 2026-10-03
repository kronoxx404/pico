import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Banco Caja Social',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
