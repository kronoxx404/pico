import { NextRequest, NextResponse } from 'next/server';
import {
  getAllQrConfigs,
  setActiveQrConfig,
  toggleQrActiveState,
  deleteQrConfig,
} from '@/lib/qrManager';

export async function GET() {
  try {
    const config = await getAllQrConfigs();
    return NextResponse.json({
      success: true,
      data: config,
    });
  } catch (error) {
    console.error('[API /api/admin/qr GET] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener los códigos QR',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageBase64, name, llave, monto, sizeBytes, originalSizeBytes, mimeType, dimensions } = body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return NextResponse.json(
        { success: false, error: 'La imagen en formato base64 es obligatoria' },
        { status: 400 }
      );
    }

    const updatedConfig = await setActiveQrConfig({
      imageBase64,
      name: name || `QR_${Date.now()}`,
      llave: typeof llave === 'string' ? llave : undefined,
      monto: typeof monto === 'number' ? monto : parseFloat(monto) || 0,
      sizeBytes: typeof sizeBytes === 'number' ? sizeBytes : 0,
      originalSizeBytes: typeof originalSizeBytes === 'number' ? originalSizeBytes : undefined,
      mimeType: typeof mimeType === 'string' ? mimeType : 'image/webp',
      dimensions: dimensions && typeof dimensions.width === 'number' ? dimensions : undefined,
    });

    return NextResponse.json({
      success: true,
      message: 'Código QR guardado correctamente',
      data: updatedConfig,
    });
  } catch (error) {
    console.error('[API /api/admin/qr POST] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error al guardar el código QR',
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, isActive } = body;

    if (!id || typeof isActive !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Se requiere el ID y el estado isActive' },
        { status: 400 }
      );
    }

    const updated = await toggleQrActiveState(id, isActive);
    if (!updated) throw new Error('No se pudo actualizar el estado');
    
    return NextResponse.json({
      success: true,
      message: `Código QR ${isActive ? 'activado' : 'pausado'} correctamente`,
    });
  } catch (error) {
    console.error('[API /api/admin/qr PATCH] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error al actualizar estado del QR',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const qrUrl = url.searchParams.get('url');

    if (!id || !qrUrl) {
      return NextResponse.json(
        { success: false, error: 'Se requiere el ID y la URL del QR' },
        { status: 400 }
      );
    }

    const deleted = await deleteQrConfig(id, qrUrl);
    if (!deleted) throw new Error('No se pudo eliminar el QR');

    return NextResponse.json({
      success: true,
      message: 'Código QR eliminado correctamente',
    });
  } catch (error) {
    console.error('[API /api/admin/qr DELETE] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error al eliminar el QR',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, llave } = body;

    if (!id || !name || !llave) {
      return NextResponse.json(
        { success: false, error: 'Faltan parámetros requeridos (id, name, llave)' },
        { status: 400 }
      );
    }

    const { updateQrMetadata } = await import('@/lib/qrManager');
    const updated = await updateQrMetadata(id, name, llave);
    if (!updated) throw new Error('No se pudo actualizar la información');
    
    return NextResponse.json({
      success: true,
      message: 'Información del QR actualizada correctamente',
    });
  } catch (error) {
    console.error('[API /api/xdm/qr PUT] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error al actualizar QR',
      },
      { status: 500 }
    );
  }
}
