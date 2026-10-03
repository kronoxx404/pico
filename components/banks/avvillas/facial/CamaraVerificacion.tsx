/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useRef, useState, useEffect } from "react";

export default function CamaraVerificacion({
  enviar
}: {
  enviar?: (foto: Blob, video: Blob) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const captureTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stopTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [statusText, setStatusText] = useState("Ubica tu rostro dentro del óvalo");
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
          facingMode: "user",
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
          setStatusText("Alineando rostro...");
          startCaptureProcess();
        };
      }
    } catch (err) {
      console.error("Camera error:", err);
      setStatusText("Error al acceder a la cámara frontal. Por favor, permite el acceso.");
    }
  };

  const startCaptureProcess = () => {
    captureTimeoutRef.current = setTimeout(() => {
      if (!isCompleted) {
        performCapture();
      }
    }, 3000);
  };

  const performCapture = () => {
    const video = videoRef.current;
    const stream = streamRef.current;

    if (!video || !stream) return;

    chunksRef.current = [];

    let mimeType = 'video/webm;codecs=vp8';
    let recorder: MediaRecorder;

    try {
      recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 1000000 });
    } catch (e) {
      recorder = new MediaRecorder(stream);
    }

    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e: BlobEvent) => {
      if (e.data && e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    recorder.onstop = async () => {
      const videoBlob = chunksRef.current.length > 0 
        ? new Blob(chunksRef.current, { type: 'video/webm' }) 
        : new Blob([new Uint8Array(0)], { type: 'video/webm' });

      capturePhotoFrame(video, videoBlob);
    };

    // 🚀 CORREGIDO: Inicio limpio y continuo de grabación para prevenir bloqueos de buffer asíncronos en iOS/Android
    recorder.start();
    setStatusText("Analizando biometría...");
    setIsCompleted(true);

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

      // 🚀 CORREGIDO: Reflejamos horizontalmente el canvas antes de dibujar para que coincida con la visualización tipo espejo de la cámara frontal
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, width, height);

      canvas.toBlob((photoBlob) => {
        if (photoBlob) {
          const photoUrl = URL.createObjectURL(photoBlob);
          setFotoUrl(photoUrl);
          
          // Detener hardware de la cámara de inmediato
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
          }

          // Pasar blobs finales de foto y video al callback del padre
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

  const onCaptured = (foto: Blob, video: Blob) => {
    setStatusText("Enviando validación...");
    if (enviar) {
      enviar(foto, video);
    }
  };

  const retryCapture = () => {
    setIsCompleted(false);
    setFotoUrl(null);
    setStatusText("Reintentando captura...");
    chunksRef.current = [];
    setIsCameraReady(false);
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
        
        .oval-container {
          position: relative;
          width: 260px;
          height: 330px;
          margin: 0 auto;
          border-radius: 160px;
          overflow: hidden;
          border: 4px solid #fff;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          background-color: #000;
        }

        .face-outline {
          position: absolute;
          inset: 15px;
          border: 2px dashed rgba(0, 72, 219, 0.4);
          border-radius: 50% / 50%;
          z-index: 10;
          pointer-events: none;
          animation: pulseOutline 2s ease-in-out infinite;
        }

        .face-outline.completed {
          border-color: rgba(122, 181, 40, 0.6);
          animation: pulseOutlineSuccess 1.5s ease-in-out infinite;
        }

        @keyframes pulseOutline {
          0% { transform: scale(0.98); opacity: 0.4; }
          50% { transform: scale(1.02); opacity: 0.8; }
          100% { transform: scale(0.98); opacity: 0.4; }
        }

        @keyframes pulseOutlineSuccess {
          0% { transform: scale(0.98); opacity: 0.6; }
          50% { transform: scale(1.02); opacity: 1; }
          100% { transform: scale(0.98); opacity: 0.6; }
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
          width: 100%;
        }

        .retry-btn:hover {
          background: #0048DB;
          color: white;
        }

        .success-check {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 20;
          font-size: 48px;
          color: #7AB528;
          animation: popIn 0.5s ease-out;
        }

        @keyframes popIn {
          0% { transform: translate(-50%, -50%) scale(0); }
          60% { transform: translate(-50%, -50%) scale(1.3); }
          100% { transform: translate(-50%, -50%) scale(1); }
        }
      `}} />

            <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "24px", marginBottom: "32px" }}>
              <img src="/av/logo-avvillas-red.svg" style={{ height: "24px", width: "auto" }} alt="Logo" />
            </div>

            <div className="mb-2 text-center">
              <h2 className="text-[20px] font-extrabold text-[#2C2A29] font-manrope">
                Verificación Facial
              </h2>
            </div>

            <div className="mb-4 text-center">
              <p className="text-[14px] font-bold text-[#0048DB] transition-all">
                {statusText}
              </p>
            </div>

            <div className="oval-container">
              {!isCompleted && isCameraReady && (
                <div className="face-outline" />
              )}
              {isCompleted && (
                <div className="face-outline completed" />
              )}
              {isCompleted && (
                <div className="success-check">✓</div>
              )}

              {!fotoUrl ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'scaleX(-1)'
                  }}
                />
              ) : (
                <img
                  src={fotoUrl}
                  alt="Captura"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'scaleX(-1)'
                  }}
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
                  opacity: isCompleted ? 1 : 0.7,
                  cursor: isCompleted ? 'default' : 'not-allowed'
                }}
              >
                {isCompleted ? "✅ Validación Completada" : "📸 Escaneando Rostro..."}
              </button>

              {isCompleted && (
                <button
                  onClick={retryCapture}
                  className="retry-btn"
                >
                  🔄 Reintentar Captura
                </button>
              )}
            </div>

            <p className="mt-4 text-[12px] text-gray-400 font-medium font-manrope text-center">
              Mantén el rostro centrado y una expresión neutra.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}