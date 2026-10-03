"use client";

import React from "react";

interface InactividadModalProps {
  onAceptar: () => void;
}

export default function InactividadModal({ onAceptar }: InactividadModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 z-9999 flex items-center justify-center p-4 backdrop-blur-[1.5px] animate-in fade-in duration-200">
      
      {/* Modal Card */}
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          padding: '32px 24px 28px 24px',
          width: '100%',
          maxWidth: '320px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          boxSizing: 'border-box'
        }}
      >
        
        {/* Colorful Clock SVG Icon */}
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
          <svg width="54" height="54" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="clockGrad" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ff5a5f" />
                <stop offset="25%" stopColor="#ffb703" />
                <stop offset="50%" stopColor="#06d6a0" />
                <stop offset="75%" stopColor="#118ab2" />
                <stop offset="100%" stopColor="#7209b7" />
              </linearGradient>
            </defs>
            <circle cx="30" cy="30" r="21" stroke="url(#clockGrad)" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M30 18V30H38" stroke="#555" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Title */}
        <h3 
          style={{
            fontSize: '15.5px',
            color: '#2c2a29',
            fontWeight: 'bold',
            margin: '0 0 16px 0',
            lineHeight: '1.4',
            padding: '0 8px'
          }}
        >
          Llevas un rato sin actividad
        </h3>

        {/* Description */}
        <p 
          style={{
            fontSize: '12.5px',
            color: '#666',
            lineHeight: '1.5',
            fontWeight: 'normal',
            margin: '0 0 28px 0',
            padding: '0 8px',
            userSelect: 'none'
          }}
        >
          Cerramos la sesión para cuidar tu información.
        </p>

        {/* Yellow "Intentar nuevamente" button */}
        <button
          type="button"
          onClick={onAceptar}
          style={{
            width: '220px',
            height: '38px',
            backgroundColor: '#FDDF3C',
            borderRadius: '19px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            color: '#2c2a29',
            fontSize: '13px',
            border: 'none',
            cursor: 'pointer',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        >
          Intentar nuevamente
        </button>

      </div>

    </div>
  );
}
