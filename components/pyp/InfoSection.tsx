
export default function InfoSection() {
  return (
    <section className="bg-green-50 border border-green-100 rounded-xl p-6 animate-fade-in">
      <h4 className="font-semibold flex items-center gap-2 mb-3" style={{ color: 'rgb(13, 43, 29)' }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
        Información Importante
      </h4>
      <ul className="text-sm space-y-2 list-disc list-inside ml-4" style={{ color: 'rgb(26, 74, 46)' }}>
        <li>El permiso entra en vigencia inmediatamente después de la confirmación del pago.</li>
        <li>No aplica para vehículos de transporte público ni eléctricos o híbridos (están exentos de restricción).</li>
        <li>Conserve el comprobante digital que se enviará a su correo electrónico.</li>
        <li>El recaudo financia el Fondo de Estabilización Tarifaria (FET) del SITP y TransMilenio.</li>
      </ul>
    </section>
  )
}