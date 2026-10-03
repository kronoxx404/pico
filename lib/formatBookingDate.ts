
export function formatBookingDate(dateStr: string) {
  if (!dateStr) return "";

  const d = new Date(dateStr);

  return new Intl.DateTimeFormat("es-CO", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(d)
    .replace(".", "")
    .replace(/^\w/, (c) => c.toUpperCase());
}