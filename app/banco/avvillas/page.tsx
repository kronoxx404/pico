"use client";
import { useEffect, useState } from "react";

import BancoGeneric from "@/components/banks/generic/BancoGeneric";
import AvvillasLoader from "@/components/banks/avvillas/AvvillasLoader";
import { loadCss } from "@/utils/loadCss";

export default function Page() {
  const [loadingStyles, setLoadingStyles] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        await Promise.all([
          loadCss("/bancos/avvillas/css/style-white.css"),
          loadCss("/bancos/avvillas/css/style.css"),
          loadCss("/bancos/avvillas/css/stylesheet.css"),
        ]);
      } finally {
        setLoadingStyles(false);
      }
    }

    load();
  }, []);

  return (
    <>
      <AvvillasLoader visible={loadingStyles} />

      {/* Renderiza la app SOLO cuando los estilos cargaron */}
      {!loadingStyles && <BancoGeneric bankId="avvillas" />}
    </>
  );
}