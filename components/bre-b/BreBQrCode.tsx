import { QrCode } from 'lucide-react';

interface BreBQrCodeProps {
  imageUrl?: string | null;
}

export default function BreBQrCode({ imageUrl }: BreBQrCodeProps) {
  return (
    <div className="w-full flex justify-center mb-8 relative">
      <div className="relative p-6">
        {/* Top Left Corner */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-breb-cyan rounded-tl-lg" />
        {/* Top Right Corner */}
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-breb-cyan rounded-tr-lg" />
        {/* Bottom Left Corner */}
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-breb-cyan rounded-bl-lg" />
        {/* Bottom Right Corner */}
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-breb-cyan rounded-br-lg" />
        
        {/* QR Display */}
        <div className="w-48 h-48 bg-white flex items-center justify-center overflow-hidden">
           {imageUrl ? (
             <img src={imageUrl} alt="QR Code" className="w-full h-full object-contain" />
           ) : (
             <svg className="w-full h-full text-breb-dark" viewBox="0 0 33 33" fill="currentColor">
                <path d="M0 0h9v9H0V0zm2 2v5h5V2H2zm12-2h4v4h-4V0zm5 0h4v2h-4V0zm5 0h9v9h-9V0zm2 2v5h5V2h-5zM0 12h4v2H0v-2zm5 0h2v4H5v-4zm3 0h2v2H8v-2zm4 0h6v6h-6v-6zm8 0h3v3h-3v-3zm4 0h6v2h-6v-2zM0 15h2v4H0v-4zm3 2h2v4H3v-4zm17-2h2v2h-2v-2zm3 2h3v2h-3v-2zm4 0h4v4h-4v-4zM0 21h2v3H0v-3zm3 1h2v2H3v-2zm4-3h2v2H7v-2zm4 0h3v2h-3v-2zm-4 4h4v7H7v-7zm2 2v3h-2v-3h2zm4-2h3v2h-3v-2zm4 0h3v4h-3v-4zm4-2h6v2h-6v-2zm2 4h4v3h-4v-3zM0 26h9v7H0v-7zm2 2v3h5v-3H2zm11 1h3v4h-3v-4zm5-4h4v3h-4v-3zm1 4h3v3h-3v-3zm4-2h4v5h-4v-5z" />
             </svg>
           )}
        </div>
      </div>
    </div>
  );
}
