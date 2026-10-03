import { X } from 'lucide-react';
import Link from 'next/link';

export default function BreBHeader() {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-6">
        <div className="text-2xl font-bold bg-linear-to-r from-breb-cyan to-breb-green text-transparent bg-clip-text">
          Bre-B
        </div>
        <Link href="/" className="p-2 text-breb-dark hover:bg-gray-100 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </Link>
      </div>

      <h1 className="text-xl font-bold text-breb-dark text-center mb-2">
        Paga rápido con tu llave Bre-B
      </h1>
      <p className="text-sm text-breb-gray text-center mb-6 px-4">
        Escanea el código QR desde tu app bancaria y confirma el pago en segundos con Bre-B.
      </p>
    </div>
  );
}
