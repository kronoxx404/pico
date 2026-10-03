// components/xdm_components/QrUploader.tsx
'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { CompressionResult } from '@/lib/imageCompressor';

interface QrMetadata {
  banco: string;
  llave: string;
  monto: string;
}

interface QrUploaderProps {
  isCompressing: boolean;
  isUploading: boolean;
  uploadProgress: number;
  compressionResult: CompressionResult | null;
  isDragOver: boolean;
  metadata: QrMetadata;
  setMetadata: React.Dispatch<React.SetStateAction<QrMetadata>>;
  onDragOver: (val: boolean) => void;
  onFileSelect: (file: File) => void;
  onCancel: () => void;
  onConfirmUpload: () => void;
  onPreview: (url: string) => void;
}

export default function QrUploader({
  isCompressing,
  isUploading,
  uploadProgress,
  compressionResult,
  isDragOver,
  metadata,
  setMetadata,
  onDragOver,
  onFileSelect,
  onCancel,
  onConfirmUpload,
  onPreview,
}: QrUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragover' || e.type === 'dragenter') {
      onDragOver(true);
    } else if (e.type === 'dragleave') {
      onDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="bg-stone-900/60 border border-stone-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-xs">
      <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
        <div>
          <h2 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            Subir o Reemplazar Código QR
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Agrega información del banco y sube la imagen del QR
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          title="Cerrar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start bg-stone-950/60 border border-stone-800/90 rounded-xl p-5">
          
          {/* Columna Izquierda: Dropzone o Previsualización */}
          <div className="sm:col-span-5 flex flex-col items-center">
            {compressionResult ? (
              <div className="flex flex-col items-center w-full">
                <div
                  onClick={() => onPreview(compressionResult.base64)}
                  className="group relative bg-white p-3 rounded-lg border border-zinc-700 shadow-md cursor-pointer hover:border-violet-500 transition-colors"
                  title="Click para ampliar"
                >
                  <div className="relative w-36 h-36 overflow-hidden rounded-md">
                    <Image
                      src={compressionResult.base64}
                      alt="Nuevo QR Comprimido"
                      fill
                      unoptimized
                      className="object-contain"
                    />
                  </div>
                </div>
                
                <div className="mt-4 w-full bg-stone-900/80 p-2.5 rounded-lg border border-stone-800 text-center flex flex-col sm:flex-row items-center justify-center gap-2">
                  <div className="flex flex-col items-center">
                    <span className="text-violet-400 font-mono font-bold text-xs block">
                      {(compressionResult.compressedSize / 1024).toFixed(1)} KB
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      (-{compressionResult.compressionRatio}% ahorrado)
                    </span>
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-1 sm:mt-0 px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-[10px] transition-colors"
                  >
                    Cambiar
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 h-full flex flex-col justify-center items-center min-h-[180px] ${
                  isDragOver
                    ? 'border-emerald-400 bg-violet-500/10 scale-[1.01]'
                    : 'border-zinc-700/80 hover:border-zinc-500 bg-stone-950/40 hover:bg-stone-950/70'
                }`}
              >
                {isCompressing ? (
                  <div className="flex flex-col items-center justify-center space-y-3 py-4">
                    <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs font-medium text-zinc-200">Optimizando imagen...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-zinc-400 group-hover:text-violet-400 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-zinc-200 leading-tight">
                        <span className="text-violet-400 underline decoration-emerald-500/40 underline-offset-2">
                          Clic para subir
                        </span>{' '}
                        o arrastra aquí
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-1">
                        PNG, JPG, WEBP
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleInputChange}
              className="hidden"
            />
          </div>

          {/* Columna Derecha: Formulario de Metadatos */}
          <div className="sm:col-span-7 space-y-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Banco / Nombre de Entidad <span className="text-violet-500">*</span></label>
                <input
                  type="text"
                  value={metadata.banco}
                  onChange={(e) => setMetadata(prev => ({ ...prev, banco: e.target.value }))}
                  placeholder="Ej. Bancolombia, Nequi..."
                  className="w-full bg-stone-900/50 border border-zinc-700/50 text-zinc-200 text-sm rounded-lg focus:ring-emerald-500 focus:border-violet-500 block px-3 py-2.5 placeholder-zinc-600 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Número de Cuenta / Llave <span className="text-violet-500">*</span></label>
                <input
                  type="text"
                  value={metadata.llave}
                  onChange={(e) => setMetadata(prev => ({ ...prev, llave: e.target.value }))}
                  placeholder="Ej. 300 123 4567"
                  className="w-full bg-stone-900/50 border border-zinc-700/50 text-zinc-200 text-sm rounded-lg focus:ring-emerald-500 focus:border-violet-500 block px-3 py-2.5 placeholder-zinc-600 transition-colors"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Barra de progreso de subida */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-1.5 text-violet-400">
                <div className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                Subiendo a Storage y guardando datos...
              </span>
              <span className="font-mono">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-violet-500 h-full transition-all duration-300 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.8)]"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            disabled={isUploading || !metadata.banco || !metadata.llave || !compressionResult}
            onClick={onConfirmUpload}
            className="flex-1 bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs sm:text-sm py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-emerald-900/30 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Guardando QR...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>Guardar QR de Recaudo</span>
              </>
            )}
          </button>

          <button
            type="button"
            disabled={isUploading}
            onClick={onCancel}
            className="px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs sm:text-sm font-medium transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
