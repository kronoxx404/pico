/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Otp from "./Otp";

export default function Otp8({
  enviar,
}: {
  enviar?: (code: any) => void;
}) {
  return <Otp enviar={enviar} digits={8} />;
}
