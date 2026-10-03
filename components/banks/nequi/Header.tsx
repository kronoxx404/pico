/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';

export default function Header() {
    return (
      <div className='bg-white p-4 flex justify-between items-center m-auto'>
        <Image src="/bancos/nequi/logo.svg" alt="Logo" width={100} height={33} />
        <span className="icon-[pajamas--hamburger] text-3xl m-1"></span>
      </div>
    );
}