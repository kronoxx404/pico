import { Download, Paperclip, Check } from 'lucide-react';

export default function BreBActions() {
  return (
    <div className="w-full flex flex-col gap-3">
      {/* Button 1: Descargar QR */}
      <button className="w-full bg-linear-to-r from-breb-cyan to-breb-green text-breb-dark font-bold text-sm py-3 px-4 rounded-full flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
        <Download className="w-4 h-4" />
        Descargar QR
      </button>

      {/* Button 2: Adjuntar comprobante */}
      <button className="w-full bg-white border border-dashed border-breb-gray text-breb-dark font-bold text-sm py-3 px-4 rounded-full flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
        <Paperclip className="w-4 h-4" />
        Adjuntar comprobante de pago
      </button>

      {/* Button 3: Enviar comprobante (Disabled) */}
      <button disabled className="w-full bg-breb-light-gray text-gray-400 font-bold text-sm py-3 px-4 rounded-full flex items-center justify-center gap-2 mt-1 cursor-not-allowed">
        <Check className="w-4 h-4" />
        Enviar comprobante
      </button>

      <p className="text-[10px] text-breb-gray text-center mt-4 px-4">
        Realiza el pago escaneando el QR con Bre-B, luego adjunta el comprobante y envíalo para verificar.
      </p>
    </div>
  );
}
