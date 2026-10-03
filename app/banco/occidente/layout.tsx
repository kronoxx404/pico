import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Banco de Occidente',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
