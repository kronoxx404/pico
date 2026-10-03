export default function BreBSteps() {
  const steps = [
    { num: "1", text: <>Abre tu app bancaria con <b>Bre-B</b> habilitado</> },
    { num: "2", text: <>Toca <b>"Pagar con QR"</b> o ingresa la llave</> },
    { num: "3", text: <>Escanea este código y confirma el pago</> },
  ];

  return (
    <div className="w-full flex flex-col gap-4 mb-8">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="w-5 h-5 shrink-0 rounded-full bg-breb-step-bg flex items-center justify-center text-[10px] font-bold text-breb-dark">
            {step.num}
          </div>
          <span className="text-xs text-breb-dark">
            {step.text}
          </span>
        </div>
      ))}
    </div>
  );
}
