import type { Metadata } from 'next';
import "./global.css";

export const metadata: Metadata = {
  title: 'Nequi',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
