/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import ErrorOtp from "./ErrorOtp";

export default function ErrorOtp8({
  enviar,
}: {
  enviar?: (code: any) => void;
}) {
  return <ErrorOtp enviar={enviar} digits={8} />;
}
