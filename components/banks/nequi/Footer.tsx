import Image from 'next/image';
import { FaTwitter, FaInstagram, FaFacebookF, FaLinkedinIn, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="w-full bg-[#200020] text-white pt-12 pb-8 pl-14 pr-6 mt-32 select-none relative" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <div className="max-w-97.5 mx-auto relative">
        
        {/* Left vertical side banner - Absolute to prevent layout shifting/stretching */}
        <div 
          className="absolute -left-20 bottom-0 top-0 flex flex-col items-center justify-end select-none w-6 h-full" 
          style={{ writingMode: 'vertical-rl', transform: 'rotate(0deg)' }}
        >
          <div className="mt-4 shrink-0">
            <Image 
              src="/bancos/nequi/vigilado.png" 
              alt="Vigilado" 
              width={240}
              height={60}
              className="w-20 h-auto object-contain opacity-40 hover:opacity-60 transition-opacity"
            />
          </div>
        </div>

        {/* Right main side */}
        <div className="w-full">
          {/* Logo Row */}
          <div className="flex justify-between items-center mb-8">
            <Image 
              src="/bancos/nequi/logo.svg" 
              alt="Nequi Logo" 
              width={100}
              height={33}
              className="h-8 w-auto brightness-0 invert"
            />
            <Image 
              src="/bancos/nequi/65ce1c19567caef6f894a575_logo-grupo-bancolombia.svg" 
              alt="Grupo Bancolombia Logo" 
              width={100}
              height={24}
              className="h-8 w-auto"
            />
          </div>

          {/* App Store Links */}
          <div className="flex flex-col items-center gap-3 my-8">
            <div className="flex justify-center gap-3 w-full">
              <a href="#" className="flex-1 max-w-36.25 hover:scale-102 transition-transform">
                <Image 
                  src="/bancos/nequi/64e50ed88b7bb33f2c2c4653_store-googleplay.svg" 
                  alt="Google Play" 
                  width={135}
                  height={40}
                  className="w-full h-auto"
                />
              </a>
              <a href="#" className="flex-1 max-w-36.25 hover:scale-102 transition-transform">
                <Image 
                  src="/bancos/nequi/64e50ed702047ba456edd2cb_store-apple.svg" 
                  alt="App Store" 
                  width={135}
                  height={40}
                  className="w-full h-auto"
                />
              </a>
            </div>
            <a href="#" className="w-full max-w-36.25 hover:scale-102 transition-transform">
              <Image 
                src="/bancos/nequi/64e50ed702047ba456edd25c_store-huawei.svg" 
                alt="AppGallery" 
                width={135}
                height={40}
                className="w-full h-auto"
              />
            </a>
          </div>

          <hr className="border-t border-white/50 border-2 my-8" />

          {/* List Menu */}
          <div className="space-y-5">
            {[
              "Información legal",
              "Para personas",
              "Para tu negocio",
              "Ayuda",
              "Conócenos"
            ].map((text) => (
              <div 
                key={text} 
                className="flex justify-between items-center text-white/90 cursor-pointer hover:text-white transition-colors py-1"
              >
                <span className="font-semibold text-[17px] tracking-tight">{text}</span>
                <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>

          <hr className="border-t border-white/10 my-8" />

          {/* Social Icons */}
          <div className="flex justify-center items-center gap-4 py-2">
            {[
              { icon: FaTwitter, url: "#" },
              { icon: FaInstagram, url: "#" },
              { icon: FaFacebookF, url: "#" },
              { icon: FaLinkedinIn, url: "#" },
              { icon: FaYoutube, url: "#" }
            ].map(({ icon: Icon, url }, idx) => (
              <a 
                key={idx} 
                href={url} 
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-white hover:bg-white/5 transition-all duration-200"
              >
                <Icon className="w-4 h-4" strokeWidth={2} />
              </a>
            ))}
          </div>

          <hr className="border-t border-white/10 mt-8 mb-4" />
        </div>

      </div>
    </footer>
  );
}
