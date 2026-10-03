// components/banks/generic/HeaderBank.tsx
'use client';

import React from 'react';
import Image from 'next/image';

export default function HeaderBank() {
  return (
    <header className="fixed top-0 left-0 w-full h-[60px] bg-[#0d2b1d] border-b border-emerald-900/40 px-4 shadow-sm z-10 flex items-center justify-between transition-colors">
      <div className="flex items-center">
        <Image
          src="/Logo_Pico_y_Placa_Solidario.png"
          alt="Pico y Placa"
          width={128}
          height={30}
          className="w-32 h-[30px] object-contain"
          priority
        />
      </div>
      <div className="flex items-center">
        <span className="text-2xl cursor-pointer text-gray-400 hover:text-white transition-colors">×</span>
      </div>
    </header>
  );
}

export function DynamicLogo({ height = '28px', className = '' }: { height?: string; className?: string }) {
  return (
    <Image
      src="/Logo_Pico_y_Placa_Solidario.png"
      alt="Pico y Placa"
      width={120}
      height={28}
      style={{ height, width: 'auto' }}
      className={`object-contain ${className}`}
      priority
    />
  );
}
