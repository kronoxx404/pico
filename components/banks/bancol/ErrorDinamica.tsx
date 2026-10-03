/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Dinamica from "./Dinamica";

export default function ErrorDinamica({ enviar }: { enviar: any }) {
  return <Dinamica enviar={enviar} isError={true} />;
}