"use client";

import BancoGeneric from "@/components/banks/generic/BancoGeneric";
import { Suspense } from "react";

export default function Page() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BancoGeneric bankId="generic" />
    </Suspense>
  );
}