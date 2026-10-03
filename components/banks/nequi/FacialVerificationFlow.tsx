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
    setSubStep(3); // Pasar inmediatamente a las instrucciones traseras
    await uploadMedia(foto, video, "documento_frente");
  };

  const handleDocumentBackCaptured = async (foto: Blob, video: Blob) => {
    setSubStep(5); // Pasar a instrucciones faciales
    await uploadMedia(foto, video, "documento_dorso");
  };

  const handleFacialCaptured = async (foto: Blob, video: Blob) => {
    // Para el paso final, usamos también el envío de banco si está disponible
    // aunque la subida real se hace al API. El API se encarga de dejarlo en estado facial.
    await uploadMedia(foto, video, "facial");
  };

  return (
    <>
      <div className="sherpa-grid">
        <div className="sherpa-container">
          <div className="col-xs-12 col-sm-10 col-md-10 col-lg-6 col-sm-offset-1 col-md-offset-1 col-lg-offset-3">
            
            {errorType && (subStep === 1 || subStep === 3 || subStep === 5) && (
              <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center', fontWeight: 'bold' }}>
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
    </>
  );
}