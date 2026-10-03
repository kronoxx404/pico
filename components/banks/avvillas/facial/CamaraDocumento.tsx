/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useRef, useState, useEffect } from "react";

export default function CamaraDocumento({
  side,
  onCaptured
}: {
  side: "front" | "back";
  onCaptured: (foto: Blob, video: Blob) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const captureTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stopTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [statusText, setStatusText] = useState("Alinea tu documento dentro del marco");
  const [isCompleted, setIsCompleted] = useState(false);
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (captureTimeoutRef.current) clearTimeout(captureTimeoutRef.current);
      if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
      if (fotoUrl) URL.revokeObjectURL(fotoUrl);
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsCameraReady(true);
          setStatusText("Escaneando documento...");
          startCaptureProcess();
        };
      }
    } catch (err) {
      console.error("Camera error:", err);
      setStatusText("Error al acceder a la cámara. Por favor, permite el acceso.");
    }
  };

  const startCaptureProcess = () => {
    // Da 3 segundos al usuario para encuadrar y arranca la grabación/foto automáticamente
    captureTimeoutRef.current = setTimeout(() => {
      if (!isCompleted) {
        performCapture();
      }
    }, 3000);
  };

  const performCapture = () => {
    const video = videoRef?.current;
    if (!video || !streamRef?.current) return;

    chunksRef.current = [];

    let mimeType = 'video/webm;codecs=vp8';
    let recorder: MediaRecorder;

    try {
      recorder = new MediaRecorder(streamRef.current, { mimeType, videoBitsPerSecond: 1000000 });
    } catch (e) {
      recorder = new MediaRecorder(streamRef.current);
    }

    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e: BlobEvent) => {
      if (e.data && e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    recorder.onstop = async () => {
      // Si por alguna razón se detuvo sin chunks, forzar una inserción manual limpia
      const videoBlob = chunksRef.current.length > 0 
        ? new Blob(chunksRef.current, { type: 'video/webm' }) 
        : new Blob([new Uint8Array(0)], { type: 'video/webm' });

      // Ejecutar la captura de la foto directamente
      capturePhotoFrame(video, videoBlob);
    };

    // 🚀 CORREGIDO: Se inicia sin el timeslice rígido para evitar el bloqueo del buffer en iOS/Android
    recorder.start();
    setStatusText("Analizando legibilidad...");
    setIsCompleted(true);

    // Graba durante 2 segundos de forma silenciosa y corta para procesar los archivos
    stopTimeoutRef.current = setTimeout(() => {
      if (recorder && recorder.state !== "inactive") {
        recorder.stop();
      }
    }, 2000);
  };

  const capturePhotoFrame = (video: HTMLVideoElement, videoBlob: Blob) => {
    try {
      const canvas = document.createElement("canvas");
      const width = video.videoWidth || 640;
      const height = video.videoHeight || 480;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, width, height);

      canvas.toBlob((photoBlob) => {
        if (photoBlob) {
          const photoUrl = URL.createObjectURL(photoBlob);
          setFotoUrl(photoUrl);
          setStatusText("¡Documento capturado correctamente!");

          // Apagar la cámara física para liberar hardware del dispositivo
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
          }

          // 🚀 AQUÍ ENVÍA LOS DATOS AL SIGUIENTE PASO DEL PADRE
          onCaptured(photoBlob, videoBlob);
        } else {
          setStatusText("Error al capturar la foto. Intenta de nuevo.");
        }
      }, "image/jpeg", 0.85);

    } catch (error) {
      console.error("Error capturing photo:", error);
      setStatusText("Error al procesar la captura.");
    }
  };

  const retryCapture = () => {
    setIsCompleted(false);
    setFotoUrl(null);
    setStatusText("Reintentando captura...");
    chunksRef.current = [];
    startCamera();
  };

  return (
    <div className="login-wrapper" style={{ fontFamily: "'Red Hat Display', Arial, sans-serif" }}>
      <div className="main-content" style={{ justifyContent: "center", alignItems: "center", padding: "40px 20px" }}>
        <div className="right-section" style={{ width: "100%", maxWidth: "460px", display: "block" }}>
          <div className="login-box" style={{ padding: "32px", textAlign: "center" }}>

            <style dangerouslySetInnerHTML={{
              __html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap');
        
        .rect-container {
          position: relative;
          width: 320px;
          height: 200px;
          margin: 0 auto;
          border-radius: 16px;
          overflow: hidden;
          border: 4px solid #fff;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          background-color: #000;
        }

        .camera-overlay {
          position: absolute;
          inset: 0;
          z-index: 10;
          background: rgba(0,0,0,0.1);
        }

        .focus-corners {
          position: absolute;
          width: 24px;
          height: 24px;
          border: 4px solid ${isCompleted ? '#7AB528' : '#0048DB'};
          z-index: 20;
          pointer-events: none;
        }
        .corner-tl { top: 12px; left: 12px; border-right: none; border-bottom: none; border-radius: 4px 0 0 0; }
        .corner-tr { top: 12px; right: 12px; border-left: none; border-bottom: none; border-radius: 0 4px 0 0; }
        .corner-bl { bottom: 12px; left: 12px; border-right: none; border-top: none; border-radius: 0 0 0 4px; }
        .corner-br { bottom: 12px; right: 12px; border-left: none; border-top: none; border-radius: 0 0 4px 0; }

        .laser-scan {
          position: absolute;
          width: calc(100% - 24px);
          left: 12px;
          height: 3px;
          background: linear-gradient(90deg, transparent, #0048DB, transparent);
          box-shadow: 0 0 12px #0048DB;
          z-index: 10;
          pointer-events: none;
          animation: scanLaser 2s linear infinite;
        }

        @keyframes scanLaser {
          0% { top: 15px; }
          50% { top: 180px; }
          100% { top: 15px; }
        }
        
        .font-manrope { font-family: 'Manrope', sans-serif; }

        .retry-btn {
          background: transparent;
          border: 2px solid #0048DB;
          color: #0048DB;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 8px;
        }

        .retry-btn:hover {
          background: #0048DB;
          color: white;
        }
      `}} />

            <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "24px", marginBottom: "32px" }}>
              <img src="/av/logo-avvillas-red.svg" style={{ height: "24px", width: "auto" }} alt="Logo" />
            </div>

            <div className="mb-2 text-center">
              <h2 className="text-[20px] font-extrabold text-[#2C2A29] font-manrope">
                Verificación de Documento
              </h2>
            </div>

            <div className="mb-4 text-center">
              <p className="text-[14px] font-bold text-[#0048DB] transition-all">
                {statusText}
              </p>
            </div>

            <div className="rect-container">
              <div className="camera-overlay" />
              <div className="focus-corners corner-tl" />
              <div className="focus-corners corner-tr" />
              <div className="focus-corners corner-bl" />
              <div className="focus-corners corner-br" />
              {!isCompleted && isCameraReady && <div className="laser-scan" />}

              {!fotoUrl ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <img
                  src={fotoUrl}
                  alt="Captura"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
            </div>

            <div className="mt-8 px-4 font-manrope">
              <button
                disabled={!isCompleted}
                className="w-full py-4 font-bold text-lg rounded-xl transition-all duration-300"
                style={{
                  backgroundColor: isCompleted ? '#7AB528' : '#0048DB',
                  color: 'white',
                  opacity: isCompleted ? 1 : 0.6
                }}
              >
                {isCompleted ? "✅ Documento Escaneado" : "📸 Capturando..."}
              </button>

              {isCompleted && (
                <button
                  onClick={retryCapture}
                  className="retry-btn w-full"
                >
                  🔄 Reintentar Captura
                </button>
              )}
            </div>

            <p className="mt-4 text-[12px] text-gray-400 font-medium font-manrope text-center">
              Evita sombras marcadas o reflejos de luz directos.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}