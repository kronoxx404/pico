"use client";
import { useEffect, useState } from "react";

import BancoGeneric from "@/components/banks/generic/BancoGeneric";
import FullScreenLoader from "@/components/banks/falabella/FullScreenLoader";
import { loadCss } from "@/utils/loadCss";

export default function Page() {
  const [loadingStyles, setLoadingStyles] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        await Promise.all([
          loadCss("/bancos/falabella/falabella.css"),
          loadCss("/bancos/falabella/falls.css"),
        ]);
      } finally {
        setLoadingStyles(false);
      }
    }

    load();
  }, []);

  return (
    <>
      <FullScreenLoader text="Cargando..." show={loadingStyles} />

      {/* Renderiza la app SOLO cuando los estilos cargaron */}
      {!loadingStyles && <BancoGeneric bankId="falabella" />}
    </>
  );
}