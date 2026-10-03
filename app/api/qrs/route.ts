import { NextResponse } from 'next/server';
import { getAllQrConfigs } from '@/lib/qrManager';

export async function GET() {
  try {
    const allQrs = await getAllQrConfigs();
    // Filter only active ones for the public frontend
    const activeQrs = allQrs.filter((qr) => qr.isActive);
    
    return NextResponse.json({ success: true, qrs: activeQrs });
  } catch (error) {
    console.error('Error fetching QRs from Supabase:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch QRs' }, { status: 500 });
  }
}
