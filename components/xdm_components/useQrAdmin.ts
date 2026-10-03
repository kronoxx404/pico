// components/xdm_components/useQrAdmin.ts
'use client';

import { useState, useCallback, useEffect } from 'react';
import { compressQrImage, CompressionResult } from '@/lib/imageCompressor';
import { ActiveQrData } from '@/hook/useActiveQr';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

export function useQrAdmin() {
  const [activeQrs, setActiveQrs] = useState<ActiveQrData[]>([]);
  const [activeQr, setActiveQr] = useState<ActiveQrData | null>(null);
  const [isLoadingActive, setIsLoadingActive] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState<boolean>(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>('');
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  const [metadata, setMetadata] = useState({
    banco: '',
    llave: '',
    monto: '',
  });

  const addToast = useCallback((type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const fetchActiveQr = useCallback(async () => {
    try {
      setIsLoadingActive(true);
      const res = await fetch('/api/xdm/qr', { cache: 'no-store' });
      
      // Manejar error de HTML en lugar de JSON
      const text = await res.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch (e) {
        throw new Error('Respuesta del servidor no es válida (Posible error 404/500)');
      }

      if (json.success && json.data && json.data.length > 0) {
        setActiveQrs(json.data);
        const recentActive = json.data.find((q: ActiveQrData) => q.isActive) || json.data[0] || null;
        setActiveQr(recentActive);
      } else {
        // Fallback: Default template
        const defaultTemplate: ActiveQrData = {
          id: 'default',
          url: '/default-qr.png',
          name: 'Plantilla QR por Defecto',
          isActive: true,
          sizeBytes: 0,
          source: 'default',
          updatedAt: new Date().toISOString(),
          mimeType: 'image/png'
        };
        setActiveQrs([defaultTemplate]);
        setActiveQr(defaultTemplate);
      }
    } catch (err) {
      console.error('Error fetching QRs:', err);
      // Fallback on error
      const defaultTemplate: ActiveQrData = {
        id: 'default',
        url: '/default-qr.png',
        name: 'Plantilla QR por Defecto',
        isActive: true,
        sizeBytes: 0,
        source: 'default',
        updatedAt: new Date().toISOString(),
        mimeType: 'image/png'
      };
      setActiveQrs([defaultTemplate]);
      setActiveQr(defaultTemplate);
      addToast('info', 'QR no encontrado', 'Se ha cargado una plantilla por defecto.');
    } finally {
      setIsLoadingActive(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchActiveQr();
  }, [fetchActiveQr]);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      addToast('error', 'Archivo inválido', 'Por favor selecciona un archivo de imagen (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      addToast('error', 'Tamaño excedido', 'La imagen no debe superar los 50MB.');
      return;
    }

    setIsCompressing(true);
    try {
      const result = await compressQrImage(file, {
        maxDimension: 1600,
        quality: 0.88,
        outputFormat: 'image/webp',
      });
      setCompressionResult(result);
      // We don't show toast here anymore because they still need to fill the form
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al comprimir la imagen.';
      addToast('error', 'Error de compresión', msg);
    } finally {
      setIsCompressing(false);
    }
  };

  const cancelPendingUpload = () => {
    setCompressionResult(null);
    setUploadProgress(0);
    setMetadata({ banco: '', llave: '', monto: '' });
    setIsUploadModalOpen(false);
  };

  const executeUploadAndReplace = async () => {
    if (!compressionResult) return;
    
    if (!metadata.banco) {
      addToast('error', 'Falta información', 'Por favor ingresa el nombre del Banco.');
      return;
    }
    if (!metadata.llave) {
      addToast('error', 'Falta información', 'Por favor ingresa el número de cuenta o llave.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);

    try {
      const progressTimer = setInterval(() => {
        setUploadProgress((prev) => (prev < 90 ? prev + 15 : prev));
      }, 150);

      const payload = {
        imageBase64: compressionResult.base64,
        name: metadata.banco,
        llave: metadata.llave,
        monto: metadata.monto ? parseFloat(metadata.monto) : 0,
        sizeBytes: compressionResult.compressedSize,
        originalSizeBytes: compressionResult.originalSize,
        mimeType: compressionResult.mimeType,
        dimensions: compressionResult.dimensions,
      };

      const res = await fetch('/api/xdm/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      clearInterval(progressTimer);
      setUploadProgress(100);

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Error al agregar el QR.');
      }

      await fetchActiveQr();
      setCompressionResult(null);
      setMetadata({ banco: '', llave: '', monto: '' });
      setIsUploadModalOpen(false);
      addToast('success', '¡QR Subido!', 'El nuevo código QR se ha agregado correctamente.');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido al subir.';
      addToast('error', 'Error al subir', msg);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const toggleStatus = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch('/api/xdm/qr', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Error al cambiar estado.');

      await fetchActiveQr();
      addToast('info', 'Estado actualizado', `Código QR ${isActive ? 'activado' : 'pausado'}.`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al cambiar estado.';
      addToast('error', 'Error', msg);
    }
  };

  const deleteQr = async (id: string, url: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este código QR de forma permanente?')) return;

    try {
      const res = await fetch(`/api/xdm/qr?id=${encodeURIComponent(id)}&url=${encodeURIComponent(url)}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Error al eliminar el QR.');

      await fetchActiveQr();
      addToast('success', 'QR Eliminado', 'El código QR se eliminó correctamente.');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar.';
      addToast('error', 'Error', msg);
    }
  };

  const openPreview = (url: string) => {
    setPreviewImageUrl(url);
    setPreviewModalOpen(true);
  };

  const closePreview = () => {
    setPreviewModalOpen(false);
    setPreviewImageUrl('');
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingQrId, setEditingQrId] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const openEdit = (qr: ActiveQrData) => {
    setEditingQrId(qr.id);
    setMetadata({ banco: qr.name, llave: qr.llave || '', monto: '' });
    setIsEditModalOpen(true);
  };

  const closeEdit = () => {
    setIsEditModalOpen(false);
    setEditingQrId('');
    setMetadata({ banco: '', llave: '', monto: '' });
  };

  const saveEdit = async (banco: string, llave: string) => {
    setIsEditing(true);
    try {
      const res = await fetch('/api/xdm/qr', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingQrId, name: banco, llave }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Error al actualizar.');

      await fetchActiveQr();
      addToast('success', 'QR Actualizado', 'La información se guardó correctamente.');
      closeEdit();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar.';
      addToast('error', 'Error', msg);
    } finally {
      setIsEditing(false);
    }
  };

  return {
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
    openEdit,
    closeEdit,
    saveEdit,
    isEditModalOpen,
    isEditing,
    isUploadModalOpen,
    setIsUploadModalOpen,
    openPreview,
    closePreview,
    removeToast,
    refreshActiveQr: fetchActiveQr,
  };
}
