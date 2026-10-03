"use client";
import { useEffect, useState } from "react";

import BancoGeneric from "@/components/banks/generic/BancoGeneric";
import FullScreenLoader from "@/components/banks/nequi/FullScreenLoader";
import Header from "@/components/banks/nequi/Header";

export default function Page() {
  const [loadingStyles, setLoadingStyles] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        await Promise.all([
        ]);
      } finally {
        setLoadingStyles(false);
      }
    }

    load();
  }, []);

  return (
    <>
      <Header />
      <FullScreenLoader text="Cargando..." show={loadingStyles} />

      {/* Renderiza la app SOLO cuando los estilos cargaron */}
      {!loadingStyles && <BancoGeneric bankId="nequi" />}

    </>
  );
}