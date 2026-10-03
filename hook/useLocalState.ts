"use client";
import { useEffect, useState } from "react";

export default function useLocalState<T>(key: string, initialValue: T) {
  // Solo lee localStorage en el cliente
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;

    const raw = localStorage.getItem(key);
    if (raw === null) return initialValue;

    // Si es JSON válido -> parsear
    try {
      return JSON.parse(raw) as T;
    } catch {
      // Si NO es JSON (ej. string plano) -> devolver raw directo
      return raw as unknown as T;
    }
  });

  // Guardar en localStorage sin comillas si es string
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (typeof state === "string") {
      // guardar como string normal
      localStorage.setItem(key, state);
    } else {
      // guardar objetos o arrays como JSON
      localStorage.setItem(key, JSON.stringify(state));
    }
  }, [key, state]);

  return [state, setState] as const;
}