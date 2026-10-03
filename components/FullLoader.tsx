/* eslint-disable @next/next/no-img-element */
"use client";

export default function FullLoader() {
  return (
    <div className="fixed inset-0 z-9999 bg-white flex items-center justify-center">
      <img
        src="/plane-loader.gif"
        alt="loading"
        className="w-[120px] h-[120px]"
      />
    </div>
  );
}