
const fares = [
  {
    name: "Basic",
    price: 96850,
    recommended: false,
    features: [
      { label: "1 artículo personal (bolso)", included: true, icon: "icon icon-backpack", ty: "red" },
      { label: "Acumula 3 Lifemiles por cada USD", included: true, icon: "icon icon-life-miles", ty: "red" },
      { label: "Equipaje de mano (10 kg)", included: true, icon: "icon icon-currency", ty: "iconmuted" },
      { label: "Equipaje de bodega (23 kg)", included: true, icon: "icon icon-currency", ty: "iconmuted" },
      { label: "Check-in en aeropuerto", included: true, icon: "icon icon-currency", ty: "iconmuted" },
      { label: "Selección de asientos", included: true, icon: "icon icon-currency", ty: "iconmuted" },
      { label: "Menú a bordo", included: true, icon: "icon icon-currency", ty: "iconmuted" },
      { label: "Cambios (antes del vuelo)", included: true, icon: "icon icon-currency", ty: "iconmuted" },
      { label: "Reembolsos", included: true, icon: "icon icon-cross", ty: "iconmuted" },
    ],
  },
  {
    name: "Classic",
    price: 126680,
    recommended: true,
    features: [
      { label: "1 artículo personal (bolso)", included: true, icon: "icon icon-backpack", ty: "purple" },
      { label: "1 equipaje de mano (10 kg)", included: true, icon: "icon icon-baggage-carry-on", ty: "purple" },
      { label: "1 equipaje de bodega (23 kg)", included: true, icon: "icon icon-baggage", ty: "purple" },
      { label: "Check-in en aeropuerto", included: true, icon: "icon icon-boarding-pass", ty: "purple" },
      { label: "Asiento Economy incluido", included: true, icon: "icon icon-seat-airplane", ty: "purple" },
      { label: "Acumula 6 Lifemiles por cada USD", included: true, icon: "icon icon-life-miles", ty: "purple" },
      { label: "Menú a bordo", included: true, icon: "icon icon-currency", ty: "iconmuted" },
      { label: "Cambios (antes del vuelo)", included: true, icon: "icon icon-currency", ty: "iconmuted" },
      { label: "Reembolsos", included: true, icon: "icon icon-cross", ty: "iconmuted" },
    ],
  },
  {
    name: "Flex",
    price: 262850,
    recommended: false,
    features: [
      { label: "1 artículo personal (bolso)", included: true, icon: "icon icon-backpack", ty: "nranja" },
      { label: "1 equipaje de mano (10 kg)", included: true, icon: "icon icon-baggage-carry-on", ty: "nranja" },
      { label: "1 equipaje de bodega (23 kg)", included: true, icon: "icon icon-baggage", ty: "nranja" },
      { label: "Check-in en aeropuerto", included: true, icon: "icon icon-boarding-pass", ty: "nranja" },
      { label: "Asiento Plus (sujeto a disponibilidad)", included: true, icon: "icon icon-seat-airplane", ty: "nranja" },
      { label: "Acumula 8 Lifemiles por cada USD", included: true, icon: "icon icon-life-miles", ty: "nranja" },
      { label: "Cambios (antes del vuelo)", included: true, icon: "icon icon-airplane-change", ty: "nranja" },
      { label: "Reembolsos (antes del vuelo)", included: true, icon: "icon icon-refunds", ty: "nranja" },
      { label: "Menú a bordo", included: true, icon: "icon icon-currency", ty: "iconmuted" },
    ],
  },
];

export default fares;