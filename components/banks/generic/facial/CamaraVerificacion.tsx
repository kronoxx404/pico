/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useRef, useState, useEffect } from "react";
import { DynamicLogo } from "../HeaderBank";

export default function CamaraVerificacion({ enviar }: { enviar?: (foto: Blob, video: Blob) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<any>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [statusText, setStatusText] = useState("Ubica tu rostro dentro del óvalo");
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
        video: { facingMode: "user" },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStatusText("Alineando rostro...");
    } catch (err) {
      console.error(err);
      setStatusText("Error al acceder a la cámara frontal");
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
    setStatusText("Analizando biometría...");

    setTimeout(() => {
      if (recorder && recorder.state !== "inactive") {
        recorder.stop();
      }
    }, 2000);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isCompleted) {
        capturePhotoAndVideo();
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [isCompleted]);

  const onCaptured = (foto: Blob, video: Blob) => {
    setStatusText("Enviando validación...");
    setIsCompleted(true);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    
    if (enviar) {
      enviar(foto, video);
    }
  };

  return (
    
    <div className="min-h-screen bg-[#f5f5f7] flex justify-center items-center p-4 font-sans" style={{ minHeight: '100vh' }}>
      <div className="w-full max-w-[400px] p-6 bg-white rounded-xl shadow-md text-center">
    
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
          border: 2px dashed rgba(237, 28, 39, 0.4);
          border-radius: 50% / 50%;
          z-index: 10;
          pointer-events: none;
          animation: pulseOutline 2s ease-in-out infinite;
        }

        @keyframes pulseOutline {
          0% { transform: scale(0.98); opacity: 0.4; }
          50% { transform: scale(1.02); opacity: 0.8; }
          100% { transform: scale(0.98); opacity: 0.4; }
        }
        
        .font-manrope { font-family: 'Manrope', sans-serif; }
      `}} />

      {/* Logo */}
      <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "24px", marginBottom: "32px" }}>
          <DynamicLogo height="24px" />
      </div>

      <div className="mb-2 text-center">
        <h2 className="text-[20px] font-extrabold text-[#2C2A29] font-manrope">
          Verificación Facial
        </h2>
      </div>

      {/* Mensaje de Estado */}
      <div className="mb-4 text-center">
        <p className="text-[14px] font-bold text-[#004481] transition-all">
          {statusText}
        </p>
      </div>

      {/* Visor de Cámara */}
      <div className="oval-container">
        {!isCompleted && <div className="face-outline" style={{ borderColor: '#004481' }} />}
        
        {!fotoUrl ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
          />
        ) : (
          <img
            src={fotoUrl}
            alt="Captura"
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
          />
        )}
      </div>

      {/* Botón de Acción */}
      <div className="mt-8 px-4 font-manrope">
        <button
          disabled
          className="w-full py-4 font-bold text-lg rounded-xl transition-all duration-300"
          style={{
            backgroundColor: isCompleted ? '#7AB528' : '#004481',
            color: 'white',
            opacity: 0.9
          }}
        >
          {isCompleted ? "Validación Completada" : "Escaneando Rostro..."}
        </button>
      </div>

      <p className="mt-4 text-[12px] text-gray-400 font-medium font-manrope text-center">
        Mantén el rostro centrado y una expresión neutra.
      </p>
    
      </div>
    </div>
    
  );
}
