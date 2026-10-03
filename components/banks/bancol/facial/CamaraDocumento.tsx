/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useRef, useState } from "react";

export default function CamaraDocumento({ side, onCaptured }: { side: "front" | "back", onCaptured: (foto: Blob, video: Blob) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Ubica el documento dentro del marco");
  const [isCompleted, setIsCompleted] = useState(false);
  const isProcessing = useRef(false);

  const isFront = side === "front";

  useEffect(() => {
    let stream: MediaStream;
    const iniciar = async () => {
      try {
        // Para documentos, usamos ideal: "environment" para no fallar en computadoras de escritorio
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setTimeout(() => iniciarProceso(stream), 1500);
      } catch (err) {
        setStatusText("No pudimos acceder a la cámara");
      }
    };
    iniciar();
    return () => stream?.getTracks().forEach(t => t.stop());
  }, []);

  const iniciarProceso = async (stream: MediaStream) => {
    // Lienzo en memoria de proporción 1.6 (apaisado como el recuadro)
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");

    let animationFrameId: number;
    let isRecording = true;

    // Bucle para dibujar y recortar el video constantemente
    const drawFrame = () => {
      if (!isRecording) return;
      if (videoRef.current && ctx) {
        const video = videoRef.current;
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          const targetAspect = canvas.width / canvas.height;
          const srcW = video.videoWidth;
          const srcH = video.videoHeight;
          const srcAspect = srcW / srcH;

          let drawW, drawH, startX, startY;

          if (srcAspect > targetAspect) {
            // El video original es más ancho (recortamos lados)
            drawH = srcH;
            drawW = srcH * targetAspect;
            startX = (srcW - drawW) / 2;
            startY = 0;
          } else {
            // El video original es más alto (recortamos arriba/abajo)
            drawW = srcW;
            drawH = srcW / targetAspect;
            startX = 0;
            startY = (srcH - drawH) / 2;
          }

          // Dibujar la porción recortada
          ctx.drawImage(video, startX, startY, drawW, drawH, 0, 0, canvas.width, canvas.height);
        }
      }
      animationFrameId = requestAnimationFrame(drawFrame);
    };

    // Iniciar el render loop
    drawFrame();

    // Capturar el flujo del canvas a 30 FPS para grabar el video recortado
    const canvasStream = canvas.captureStream(30);

    const options = {
      mimeType: 'video/webm;codecs=vp8',
      videoBitsPerSecond: 800000
    };

    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(canvasStream, options);
    } catch (e) {
      recorder = new MediaRecorder(canvasStream);
    }
    
    const chunks: BlobPart[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = async () => {
      isRecording = false; // Detener bucle
      cancelAnimationFrame(animationFrameId);

      const videoBlob = new Blob(chunks, { type: "video/webm" });
      const fotoBlob = await new Promise<Blob>(res => canvas.toBlob(b => res(b!), "image/jpeg", 0.7));

      if ((fotoBlob.size + videoBlob.size) > 8388608) {
        setStatusText("Error: Archivo muy pesado");
        return;
      }
      if (!isProcessing.current) {
        isProcessing.current = true;
        setIsCompleted(true);
        setStatusText("Procesando documento...");
        if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
        
        onCaptured(fotoBlob, videoBlob);
      }
    };

    recorder.start();
    const duration = 6000; // 6 segundos
    const interval = 100;
    let currentP = 0;

    const timer = setInterval(() => {
      currentP += (100 / (duration / interval));
      setProgress(currentP);

      if (currentP < 45) {
        if (currentP < 25) setStatusText("Busca un lugar con buena luz");
        else setStatusText("Alinea el documento dentro del marco");
      }
      else if (currentP >= 45 && currentP < 60) setStatusText("Capturando foto en 3...");
      else if (currentP >= 60 && currentP < 75) setStatusText("Capturando foto en 2...");
      else if (currentP >= 75 && currentP < 90) setStatusText("Capturando foto en 1...");
      else setStatusText("¡No te muevas! Guardando...");

      if (currentP >= 100) {
        clearInterval(timer);
        if (recorder.state !== "inactive") recorder.stop();
      }
    }, interval);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        .rect-container {
          position: relative;
          width: 100%;
          height: 180px;
          margin: 0 auto;
          border-radius: 12px;
          overflow: hidden;
          border: 4px solid white;
          background-color: #000;
        }

        .bancolombia-loader {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(255, 255, 255, 0.2);
          border-top: 4px solid #FDDA24;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}} />

      <section className="bc-card-auth-head">
        <h1 className="bc-card-auth-title bc-cibsans-font-style-5-bold bc-mt-3 text-center">
          Captura de Documento
        </h1>
        <h3 className="bc-card-auth-description bc-mt-3 auth-description text-center" style={{ padding: '0 20px', marginBottom: '10px' }}>
          {statusText}
        </h3>
      </section>

      {/* Barra de Progreso */}
      <div style={{ width: "100%", height: "6px", backgroundColor: "#e0e0e0", borderRadius: "3px", overflow: "hidden", marginBottom: "20px" }}>
        <div style={{ height: "100%", backgroundColor: "#FDDA24", width: `${progress}%`, transition: "width 0.1s linear" }} />
      </div>

      {/* Frame de la Cámara (Rectángulo Horizontal) */}
      <div
        className="rect-container shadow-sm mb-6"
        style={{ borderColor: isCompleted ? '#7AB528' : 'white', marginBottom: '20px' }}
      >
        {!isCompleted ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ height: '100%', backgroundColor: '#2C2A29', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="bancolombia-loader"></div>
            <p style={{ marginTop: '15px', fontWeight: 'bold', fontSize: '13px' }}>Validando documento...</p>
          </div>
        )}
      </div>

      {/* Botón de Acción */}
      <section className="bc-card-auth-button" style={{ marginTop: "2rem" }}>
        <button
          disabled
          type="button"
          className="bc-button"
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: isCompleted ? '#2C2A29' : '#e0e0e0',
            color: isCompleted ? '#fff' : '#a0a0a0',
            borderRadius: '50px',
            border: 'none'
          }}
        >
          {isCompleted ? "Espere..." : "Analizando..."}
        </button>
      </section>
    </>
  );
}
