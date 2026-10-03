"use client";

import { Suspense } from "react";
import type { ReactNode } from "react";

export default function BancoLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {children}
    </Suspense>
  );
}
