import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Banco AV Villas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
