import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tuya',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
