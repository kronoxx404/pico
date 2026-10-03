/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Otp from "./Otp";

export default function ErrorOtp({ enviar }: { enviar: any }) {
  return <Otp enviar={enviar} isError={true} />;
}