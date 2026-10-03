"use client";
import BancoGeneric from "@/components/banks/generic/BancoGeneric";
import { Suspense } from "react";

export default async function Page() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BancoGeneric bankId={'occidente'} />
    </Suspense>
  );
}