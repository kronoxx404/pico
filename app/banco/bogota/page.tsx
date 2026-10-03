"use client";
import { useEffect, useState } from "react";

import BancoGeneric from "@/components/banks/generic/BancoGeneric";
import BankCssLoader from "@/components/banks/bogota/BankCssLoader";
import { loadCss } from "@/utils/loadCss";

export default function Page() {
  const [loadingStyles, setLoadingStyles] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        await Promise.all([
          loadCss("/bancos/bogota/styles.css"),
          loadCss("/bancos/bogota/css/styles.css"),
          loadCss("/bancos/bogota/styleerror.css"),
        ]);
      } finally {
        setLoadingStyles(false);
      }
    }

    load();
  }, []);

  return (
    <>
      <BankCssLoader visible={loadingStyles} />
      {/* Renderiza la app SOLO cuando los estilos cargaron ss*/}
      {!loadingStyles && <BancoGeneric bankId="bogota" />}
    </>
  );
}