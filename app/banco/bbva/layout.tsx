import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BBVA',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
