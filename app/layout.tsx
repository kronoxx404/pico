import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '../tailwind.src.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pico y Placa Solidario Bogotá - Adquisición de Permiso de Circulación',
  description: 'El Pico y Placa Solidario permite adquirir voluntariamente un permiso diario, mensual o semestral para circular en Bogotá sin la restricción del pico y placa.',
  robots: 'noindex, nofollow',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
