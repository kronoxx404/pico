import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Banco Popular',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
