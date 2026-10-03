/* eslint-disable @next/next/no-img-element */
"use client";

export default function PasoInstrucciones({ onContinue }: { onContinue: () => void }) {
  return (
    <>
      <section className="bc-card-auth-head">
        <h1 className="bc-card-auth-title bc-cibsans-font-style-5-bold bc-mt-3 text-center">
          Verificación Facial
        </h1>
        <h3 className="bc-card-auth-description bc-mt-3 auth-description text-center" style={{ padding: '0 20px', marginBottom: '20px' }}>
          PASO 3 DE 3
        </h3>
      </section>

      {/* Ilustración representativa */}
      <div className="bc-flex bc-justify-content-center bc-mt-4" style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: "120px",
          height: "120px",
          border: "2px dashed #b2b2b2",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f6f6f6"
        }}>
          <span style={{ color: "#666", fontWeight: "bold", fontSize: "12px", textAlign: 'center', padding: '0 10px' }}>
            TU ROSTRO AQUÍ
          </span>
        </div>
      </div>

      <div className="bc-text-center bc-mt-4" style={{ fontSize: "14px", color: "#666", padding: "0 10px", lineHeight: "1.6", textAlign: 'center', marginTop: '20px' }}>
        Ubica tu cara dentro del círculo, <span style={{ color: "#2C2A29", fontWeight: "bold" }}>mira a la cámara y acércate.</span>
      </div>

      {/* Botones */}
      <section className="bc-card-auth-button" style={{ marginTop: "2.5rem", marginBottom: "1.5rem" }}>
        <button
          className="bc-button bc-button-fill bc-button-primary"
          type="button"
          onClick={onContinue}
          style={{ width: '100%', padding: '14px', fontSize: '16px', fontWeight: 'bold' }}
        >
          Continuar
        </button>
      </section>

      <div className="text-center" style={{ textAlign: 'center' }}>
        <button
          type="button"
          style={{ background: 'none', border: 'none', textDecoration: 'underline', color: '#2C2A29', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
          onClick={() => window.location.reload()}
        >
          Ahora no
        </button>
      </div>
    </>
  );
}