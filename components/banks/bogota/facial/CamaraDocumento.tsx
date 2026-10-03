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

      if (currentP < 30) setStatusText("Busca un lugar con buena luz");
      else if (currentP >= 30 && currentP < 70) setStatusText("Mantén el documento quieto");
      else setStatusText("Capturando...");

      if (currentP >= 100) {
        clearInterval(timer);
        if (recorder.state !== "inactive") recorder.stop();
      }
    }, interval);
  };

  return (
    <div className="contenedor animate-in fade-in duration-500 max-w-[400px] mx-auto p-4 text-center" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap');
        
        .rect-container {
          position: relative;
          width: 320px;
          height: 200px;
          margin: 0 auto;
          border-radius: 12px;
          overflow: hidden;
          border: 4px solid white;
          background-color: #000;
        }

        .nequi-loader {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(255, 255, 255, 0.2);
          border-top: 4px solid #FFE300;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        
        .font-manrope { font-family: 'Manrope', sans-serif; }
      `}} />

      {/* Header con Logo */}
      <div className="flex flex-col items-center mb-6 font-manrope">
        <img src="/bancos/bogota/css/logo.svg" alt="logo" className="h-8 object-contain mb-2" />
        <h2 className="text-[20px] font-extrabold text-[#00223E]">
          Verificación de Identidad
        </h2>
      </div>

      {/* Mensaje de Estado */}
      <div className="mb-4">
        <p className="text-[14px] font-bold text-[#00223E] transition-all">
          {statusText}
        </p>
      </div>

      {/* Barra de Progreso Estilo Nequi */}
      <div className="w-full h-1.5 bg-gray-100 rounded-full mb-8 overflow-hidden max-w-[280px] mx-auto">
        <div
          className="h-full bg-[#FFE300] transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Frame de la Cámara (Rectángulo Horizontal) */}
      <div
        className="rect-container"
        style={{ borderColor: isCompleted ? '#7AB528' : 'white' }}
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
          <div className="flex flex-col items-center justify-center h-full bg-[#00223E]">
            <div className="nequi-loader"></div>
            <p className="mt-4 text-white font-bold text-sm">Validando documento...</p>
          </div>
        )}
      </div>

      {/* Botón de Acción (Informativo) */}
      <div className="mt-10 px-4">
        <button
          disabled
          className={`w-full py-4 font-bold text-lg rounded-sm transition-all duration-300 ${isCompleted
            ? "bg-[#00223E] text-white opacity-80"
            : "bg-gray-200 text-gray-400"
            }`}
        >
          {isCompleted ? "Espere un momento..." : "Analizando Documento"}
        </button>
      </div>

      <p className="mt-4 text-[12px] text-gray-400 font-medium">
        Asegúrate de estar en un lugar bien iluminado.
      </p>
    </div>
  );
}
