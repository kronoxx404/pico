// lib/imageCompressor.ts

export interface CompressionResult {
  file: File;
  base64: string;
  originalSize: number;
  compressedSize: number;
  dimensions: { width: number; height: number };
  compressionRatio: number;
  mimeType: string;
}

export interface CompressionOptions {
  maxDimension?: number;
  quality?: number;
  outputFormat?: 'image/webp' | 'image/jpeg' | 'image/png';
}

/**
 * Comprime una imagen para optimizar su peso manteniendo la máxima nitidez para códigos QR.
 * Valida tamaño máximo de 50MB y produce una salida optimizada (preferiblemente < 3MB).
 */
export async function compressQrImage(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const {
    maxDimension = 1600,
    quality = 0.88,
    outputFormat = 'image/webp',
  } = options;

  const MAX_ALLOWED_BYTES = 50 * 1024 * 1024; // 50MB límite
  if (file.size > MAX_ALLOWED_BYTES) {
    throw new Error(`El archivo supera el límite de 50MB (${(file.size / (1024 * 1024)).toFixed(1)}MB).`);
  }

  const originalSize = file.size;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Error al leer el archivo de imagen.'));
    };

    reader.onload = (event) => {
      const img = new window.Image();

      img.onerror = () => {
        reject(new Error('El archivo seleccionado no es una imagen válida o está corrupto.'));
      };

      img.onload = () => {
        try {
          let { width, height } = img;

          // Redimensionar manteniendo proporción si excede maxDimension
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d', {
            alpha: outputFormat !== 'image/jpeg',
            willReadFrequently: false,
          });

          if (!ctx) {
            throw new Error('No se pudo inicializar el contexto 2D de Canvas.');
          }

          // Rellenar fondo blanco para evitar transparencias oscuras en QR
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);

          // Configurar calidad de renderizado para preservar bordes del QR
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          ctx.drawImage(img, 0, 0, width, height);

          // Determinar formato soportado
          let targetFormat = outputFormat;
          let base64 = canvas.toDataURL(targetFormat, quality);

          // Fallback a JPEG si WebP no es soportado por el navegador
          if (!base64.startsWith(`data:${targetFormat}`)) {
            targetFormat = 'image/jpeg';
            base64 = canvas.toDataURL(targetFormat, quality);
          }

          // Convertir a File/Blob para medir tamaño real
          const byteString = atob(base64.split(',')[1]);
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }

          const blob = new Blob([ab], { type: targetFormat });
          const compressedSize = blob.size;

          const extension = targetFormat === 'image/webp' ? 'webp' : 'jpg';
          const compressedFileName = file.name.replace(/\.[^/.]+$/, '') + `_opt.${extension}`;

          const compressedFile = new File([blob], compressedFileName, {
            type: targetFormat,
            lastModified: Date.now(),
          });

          const compressionRatio = originalSize > 0
            ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
            : 0;

          resolve({
            file: compressedFile,
            base64,
            originalSize,
            compressedSize,
            dimensions: { width, height },
            compressionRatio,
            mimeType: targetFormat,
          });
        } catch (err) {
          reject(err instanceof Error ? err : new Error('Error durante la compresión.'));
        }
      };

      if (typeof event.target?.result === 'string') {
        img.src = event.target.result;
      } else {
        reject(new Error('Formato de datos de imagen no compatible.'));
      }
    };

    reader.readAsDataURL(file);
  });
}
