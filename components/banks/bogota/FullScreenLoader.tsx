"use client";

import BankCssLoader from "./BankCssLoader";

export default function FullScreenLoader() {
  // Si está activo → renderizamos BankCssLoader (siempre activo)
  return <BankCssLoader visible={true} />;
}