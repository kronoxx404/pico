import './global.css';
import BreBHeader from '@/components/bre-b/BreBHeader';
import BreBAlert from '@/components/bre-b/BreBAlert';
import BreBQrCode from '@/components/bre-b/BreBQrCode';
import BreBDetails from '@/components/bre-b/BreBDetails';
import BreBSteps from '@/components/bre-b/BreBSteps';
import BreBActions from '@/components/bre-b/BreBActions';
import { getActiveQRs } from '@/lib/qrDb';

export const dynamic = 'force-dynamic';

export default async function BreBPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const isError = resolvedParams?.error === 'true' || resolvedParams?.error === '1';

  const qrs = await getActiveQRs();
  let selectedQr = null;
  
  if (qrs && qrs.length > 0) {
    // Pick a random QR from the active ones
    const randomIndex = Math.floor(Math.random() * qrs.length);
    selectedQr = qrs[randomIndex];
  }

  const qrImageUrl = selectedQr?.imagen_url || null;
  const qrMonto = selectedQr?.monto || 0;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Mobile container - Max width restricted to look like a mobile app screen */}
      <div className="w-full max-w-[400px] bg-white rounded-3xl shadow-xl overflow-hidden relative pb-8 pt-6 px-6">
        <BreBHeader />
        <BreBAlert isError={isError} />
        <BreBQrCode imageUrl={qrImageUrl} />
        <BreBDetails monto={qrMonto} />
        <BreBSteps />
        <BreBActions />
      </div>
    </div>
  );
}
