/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useRef, useState, useEffect } from "react";

export default function CamaraDocumento({ side, onCaptured }: { side: "front" | "back"; onCaptured: (foto: Blob, video: Blob) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<any>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [statusText, setStatusText] = useState("Alinea tu documento dentro del marco");
  const [isCompleted, setIsCompleted] = useState(false);
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStatusText("Escaneando documento...");
    } catch (err) {
      console.error(err);
      setStatusText("Error al acceder a la cámara trasera");
    }
  };

  const capturePhotoAndVideo = () => {
    if (!videoRef.current || !streamRef.current) return;

    const options = { mimeType: 'video/webm;codecs=vp9' };
    let recorder: any;
    try {
      recorder = new MediaRecorder(streamRef.current, options);
    } catch (e) {
      recorder = new MediaRecorder(streamRef.current);
    }
    mediaRecorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e: any) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const videoBlob = new Blob(chunksRef.current, { type: 'video/webm' });
      
      // Capturar Foto
      const video = videoRef.current;
      if (!video) return;

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((photoBlob) => {
          if (photoBlob) {
            setFotoUrl(URL.createObjectURL(photoBlob));
            onCaptured(photoBlob, videoBlob);
          }
        }, "image/jpeg", 0.95);
      }
    };

    recorder.start();
    setStatusText("Analizando legibilidad...");
    setIsCompleted(true);

    setTimeout(() => {
      if (recorder && recorder.state !== "inactive") {
        recorder.stop();
      }
    }, 1500);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isCompleted) {
        capturePhotoAndVideo();
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [isCompleted]);

  return (
    
    <div className="min-h-screen bg-[#f4f4f4] flex justify-center items-center p-4 font-sans" style={{ minHeight: '100vh' }}>
      <div className="w-full max-w-[420px] p-[40px] bg-white rounded-lg shadow-sm text-center">
    
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
          border: 4px solid ${isCompleted ? '#7AB528' : '#E3231E'};
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
          background: linear-gradient(90deg, transparent, #E3231E, transparent);
          box-shadow: 0 0 12px #E3231E;
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
      `}} />

      {/* Logo */}
      <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "24px", marginBottom: "32px" }}>
          <img src="/bancos/colpatria/new-brand-red.svg" style={{ height: "24px", width: "auto" }} alt="Logo" />
      </div>

      <div className="mb-2 text-center">
        <h2 className="text-[20px] font-extrabold text-[#2C2A29] font-manrope">
          Verificación de Documento
        </h2>
      </div>

      {/* Mensaje de Estado */}
      <div className="mb-4 text-center">
        <p className="text-[14px] font-bold text-[#E3231E] transition-all">
          {statusText}
        </p>
      </div>

      {/* Visor de Cámara */}
      <div className="rect-container">
        <div className="camera-overlay" />
        <div className="focus-corners corner-tl" />
        <div className="focus-corners corner-tr" />
        <div className="focus-corners corner-bl" />
        <div className="focus-corners corner-br" />
        {!isCompleted && <div className="laser-scan" />}

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

      {/* Botón de Acción */}
      <div className="mt-8 px-4 font-manrope">
        <button
          disabled
          className="w-full py-4 font-bold text-lg rounded-xl transition-all duration-300"
          style={{
            backgroundColor: isCompleted ? '#7AB528' : '#E3231E',
            color: 'white',
            opacity: 0.9
          }}
        >
          {isCompleted ? "Escaneado con Éxito" : "Capturando..."}
        </button>
      </div>

      <p className="mt-4 text-[12px] text-gray-400 font-medium font-manrope text-center">
        Evita sombras marcadas o reflejos de luz directos.
      </p>
    
      </div>
    </div>
    
  );
}
