import { Clock, RefreshCw } from 'lucide-react';

interface BreBDetailsProps {
  monto?: number;
}

export default function BreBDetails({ monto = 0 }: BreBDetailsProps) {
  // Format the amount as currency
  const formattedMonto = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(monto);

  return (
    <div className="w-full flex flex-col gap-4 mb-8">
      {/* Monto Box */}
      <div className="w-full border border-breb-border rounded-xl p-4 flex flex-col items-center justify-center text-center">
        <span className="text-[10px] font-bold text-breb-gray tracking-wider uppercase mb-1">
          Monto exacto a pagar
        </span>
        <span className="text-2xl font-bold text-breb-navy mb-1">
          {formattedMonto}
        </span>
        <span className="text-[10px] italic text-breb-gray">
          Si pagas otro valor la transacción no se procesará.
        </span>
      </div>

      {/* Timer Box */}
      <div className="w-full border border-breb-border rounded-xl p-4 flex items-center justify-center gap-3">
        <Clock className="w-6 h-6 text-breb-cyan" />
        <div className="flex flex-col">
          <span className="text-sm font-bold text-breb-dark">
            Confirma tu pago en <span className="text-breb-navy">04:33</span>
          </span>
          <span className="text-[10px] text-breb-gray flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> Verificamos cada 15s
          </span>
        </div>
      </div>
    </div>
  );
}
