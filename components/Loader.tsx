import Image from "next/image";

export default function Loader() {
  return (
    <div className="fixed inset-0 bg-[#1B0041]  backdrop-blur-sm flex flex-col items-center justify-center z-50">
      {/* Logo */}
      <Image
        src="/bre-logo.png"
        alt="Bre-b"
        width={150}
        height={80}
        className="animate-pulse"
      />

      {/* Texto */}
      <p className="text-white mt-6 text-lg font-medium animate-fade">
        Estamos consultando tu información...
      </p>

      {/* Spinner */}
      <div className="mt-6 w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}