import { AlignJustify, ChevronDown } from 'lucide-react'
import Link from 'next/link'

export default function Header() {
  return (
    <header
      className="text-white py-3.5 px-5 md:px-10 flex justify-between items-center shadow-md sticky top-0 z-50 select-none"
      style={{ backgroundColor: 'rgb(0, 39, 28)' }}
    >
      {/* Left side: Navigation links */}
      <div className="flex items-center gap-5 text-sm font-bold">
        <Link 
          href="/pyp" 
          className="relative pb-1.5 border-b-2 border-[#88f456] text-white hover:text-gray-200 transition-colors"
        >
          Inicio
        </Link>
        <button className="flex items-center gap-1.5 text-white hover:text-gray-200 transition-colors font-bold cursor-pointer bg-transparent border-none outline-none">
          Esp
          <ChevronDown className="w-3.5 h-3.5 stroke-3 mt-0.5" />
        </button>
      </div>

      {/* Center side: Support button */}
      <div className="flex-1 flex justify-center pl-2 sm:pl-0">
        <button className="bg-white text-[#00271c] font-bold text-xs sm:text-sm rounded-full px-4 py-1.5 sm:px-6 sm:py-2 hover:bg-gray-100 transition-colors shadow-sm cursor-pointer border-none outline-none">
          Soporte técnico
        </button>
      </div>

      {/* Right side: Hamburger menu icon */}
      <div className="flex items-center">
        <button className="text-white hover:text-gray-200 cursor-pointer bg-transparent border-none outline-none">
          <AlignJustify className="w-7 h-7 stroke-[2.5]" />
        </button>
      </div>
    </header>
  )
}