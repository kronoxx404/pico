/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

function formatearFechaColombia(fecha: Date = new Date()): string {
  const raw = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(fecha);

  // Corrección exacta para "a. m." y "p. m."
  return raw
    .replace("a. m.", "a. m.")
    .replace("p. m.", "p. m.");
}

export function useFechaFormateada(): string {
  const [fecha, setFecha] = useState<string>(formatearFechaColombia());

  useEffect(() => {
    // Actualiza cada minuto (60000 ms)
    const interval = setInterval(() => {
      setFecha(formatearFechaColombia());
    }, 60000);

    // Actualización inmediata al montar
    setFecha(formatearFechaColombia());

    return () => clearInterval(interval);
  }, []);

  return fecha;
}