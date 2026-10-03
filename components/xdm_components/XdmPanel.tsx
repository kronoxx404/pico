// components/xdm_components/xdm.tsx
'use client';

import React from 'react';
import XdmHeader from './XdmHeader';
import CurrentQrCard from './CurrentQrCard';
import QrUploader from './QrUploader';
import QrPreviewModal from './QrPreviewModal';
import XdmToasts from './XdmToasts';
import QrTable from './QrTable';
import QrEditModal from './QrEditModal';
import { useQrAdmin } from './useQrAdmin';

export default function XdmPanel() {
  const {
    activeQrs,
    activeQr,
    isLoadingActive,
    isUploading,
    uploadProgress,
    isCompressing,
    compressionResult,
    previewModalOpen,
    previewImageUrl,
    toasts,
    isDragOver,
    metadata,
    setMetadata,
    setIsDragOver,
    handleFileSelect,
    cancelPendingUpload,
    executeUploadAndReplace,
    toggleStatus,
    deleteQr,
    isUploadModalOpen,
    setIsUploadModalOpen,
    openPreview,
    closePreview,
    removeToast,
    refreshActiveQr,
    isEditModalOpen,
    isEditing,
    openEdit,
    closeEdit,
    saveEdit,
  } = useQrAdmin();

  const isQrActive = activeQrs.some((qr: any) => qr.isActive);

  return (
    <div className="min-h-screen bg-stone-950 text-zinc-100 font-sans selection:bg-violet-500/30 selection:text-violet-200">
      {/* Barra de navegación superior */}
      <XdmHeader
        isActive={isQrActive}
        onRefresh={refreshActiveQr}
        isLoading={isLoadingActive}
        missingEnvVars={activeQr?.missingEnvVars}
      />

      {/* Contenido principal */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Banner de alerta si faltan variables de entorno dedicadas */}
        {activeQr?.missingEnvVars && activeQr.missingEnvVars.length > 0 && (
          <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-5 backdrop-blur-xs animate-in fade-in">
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="space-y-2 flex-1 text-xs">
                <h3 className="font-semibold text-sm text-amber-200">
                  Configuración pendiente de Supabase para Códigos QR
                </h3>
                <p className="text-amber-300/80 leading-relaxed">
                  Faltan las siguientes variables de entorno en tu archivo <code className="px-1.5 py-0.5 rounded bg-stone-900 font-mono text-white">.env</code>:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {activeQr.missingEnvVars.map((v: string) => (
                    <span
                      key={v}
                      className="px-2.5 py-1 rounded-lg bg-stone-900/90 border border-amber-500/30 text-amber-300 font-mono font-medium text-[11px]"
                    >
                      {v}
                    </span>
                  ))}
                </div>
                <p className="text-amber-400/70 text-[11px] pt-1">
                  Debes agregar las credenciales de tu otra base de datos de Supabase en esas variables para poder subir y reemplazar imágenes en el bucket.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Banner de introducción y botón de agregar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Administrador de Código QR
            </h2>
            <p className="text-sm text-zinc-400">
              Sube y gestiona tus códigos QR de pago en tiempo real. Los códigos activos rotarán de manera aleatoria.
            </p>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-medium px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-emerald-900/30"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Agregar Nuevo QR
          </button>
        </div>

        {/* Tabla de QRs como vista principal */}
        <QrTable
          qrs={activeQrs}
          isLoading={isLoadingActive}
          onToggleStatus={toggleStatus}
          onDelete={deleteQr}
          onPreview={openPreview}
          onEdit={openEdit}
        />
      </main>

      {/* Modal para Subir QR */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <QrUploader
              isCompressing={isCompressing}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
              compressionResult={compressionResult}
              isDragOver={isDragOver}
              metadata={metadata}
              setMetadata={setMetadata}
              onDragOver={setIsDragOver}
              onFileSelect={handleFileSelect}
              onCancel={cancelPendingUpload}
              onConfirmUpload={executeUploadAndReplace}
              onPreview={openPreview}
            />
          </div>
        </div>
      )}

      <QrEditModal
        isOpen={isEditModalOpen}
        initialBanco={metadata.banco}
        initialLlave={metadata.llave}
        isSaving={isEditing}
        onSave={saveEdit}
        onClose={closeEdit}
      />

      {/* Modal de previsualización completa */}
      <QrPreviewModal
        isOpen={previewModalOpen}
        imageUrl={previewImageUrl}
        onClose={closePreview}
      />

      {/* Notificaciones flotantes */}
      <XdmToasts toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
