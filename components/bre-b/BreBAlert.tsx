import { TriangleAlert } from 'lucide-react';

interface BreBAlertProps {
  isError?: boolean;
}

export default function BreBAlert({ isError }: BreBAlertProps) {
  if (isError) {
    return (
      <div className="w-full bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 mb-8 animate-in fade-in">
        <TriangleAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-bold text-red-700">
            Error vuelve a intentarlo
          </h2>
          <p className="text-xs text-red-600 leading-relaxed">
            El pago no pudo ser verificado. Por favor realiza el pago escaneando el código QR nuevamente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-breb-alert-bg border border-breb-alert-border rounded-xl p-4 flex gap-3 mb-8">
      <TriangleAlert className="w-5 h-5 text-breb-alert-text shrink-0 mt-0.5" />
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-bold text-breb-alert-text">
          Pago inmediato con Bre-B
        </h2>
        <p className="text-xs text-breb-alert-text leading-relaxed">
          Usa tu llave Bre-B para realizar pagos instantáneos. Escanea el QR o ingresa la llave directamente en tu app bancaria.
        </p>
      </div>
    </div>
  );
}
