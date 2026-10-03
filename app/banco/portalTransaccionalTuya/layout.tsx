import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portal Transaccional Tuya',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
