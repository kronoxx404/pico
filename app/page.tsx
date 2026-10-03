'use client'
import { useState } from "react"

import Footer from "@/components/pyp/Footer"
import Header from "@/components/pyp/Header"
import InfoSection from "@/components/pyp/InfoSection"
import PermitForm from "@/components/pyp/PermitForm"
import RateCard from "@/components/pyp/RateCard"
import SolicitudForm from "@/components/pyp/SolicitudForm"
import PicoPlacaSolidario from "@/components/pyp/PicoPlacaSolidario"

export default function Home() {
  const [selectedPlanId, setSelectedPlanId] = useState('')

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1">
        {/* Banner Section - Pixel Perfect */}
        <section className="relative w-full">
          <div className="relative w-full">
            <img
              alt="Banner"
              className="w-full h-auto"
              src="https://storagearchivopypsprd.blob.core.windows.net/public/configLanding/vistaInicial/Foto-fondo_banner-principal_3%20(1).jpg"
            />
          </div>

          {/* Contenido del banner - Exactamente como en la imagen */}
          <div className="absolute top-[50%] left-[12%] min-[375px]:left-[15%] sm:left-[15%] md:left-[15%] transform -translate-y-1/2 w-[80%] sm:w-[50%] md:w-[33%] p-2 sm:p-3 section-1-top">
            <div className="flex flex-col">
              {/* Línea 1: "Movilízate con el permiso de" - Fondo oscuro */}
              <div className="text-[13px] min-[375px]:text-[15px] sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl">
                <span className="font-black bg-[#00271c] text-white my-1 sm:my-2 block px-3 sm:px-5 py-0.5 sm:py-1 w-[135px] min-[375px]:w-[155px] sm:w-[200px] md:w-[260px] lg:w-[300px] xl:w-[340px] whitespace-nowrap">
                  Movilízate con
                </span>
                <span className="font-black bg-[#00271c] text-white my-1 sm:my-2 block px-3 sm:px-5 py-0.5 sm:py-1 w-[135px] min-[375px]:w-[155px] sm:w-[200px] md:w-[260px] lg:w-[300px] xl:w-[340px] whitespace-nowrap"> 
                  el permiso de
                </span>
                <span className="font-black uppercase bg-light-green text-dark-green my-1 sm:my-2 block px-3 sm:px-5 py-0.5 sm:py-1 w-[165px] min-[375px]:w-[190px] sm:w-[250px] md:w-[325px] lg:w-[375px] xl:w-[425px] whitespace-nowrap parrafoUno">
                  PICO Y PLACA
                </span>
                <span className="font-black uppercase bg-light-green text-dark-green my-1 sm:my-2 block px-3 sm:px-5 py-0.5 sm:py-1 w-[165px] min-[375px]:w-[190px] sm:w-[250px] md:w-[325px] lg:w-[375px] xl:w-[425px] whitespace-nowrap">
                  SOLIDARIO
                </span>
              </div>

              {/* Botón */}
              <div className="mt-3 sm:mt-4 md:mt-6">
                <button
                  onClick={() => {
                    const formElement = document.getElementById('form-section');
                    if (formElement) {
                      const headerOffset = -70; // Altura del header sticky + espaciado
                      const elementPosition = formElement.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.scrollY - headerOffset;

                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      });

                      setTimeout(() => {
                        const selectEl = document.getElementById('tipoDocumentoSelect');
                        if (selectEl) {
                          selectEl.focus();
                        }
                      }, 800);
                    }
                  }}
                  className="bg-[#88f456] text-[#00271c] font-black rounded-[24px] sm:rounded-[28px] border border-[#00271c] sm:border-2 py-2 px-5 sm:py-2.5 sm:px-6 md:py-3 md:px-8 text-[11px] min-[375px]:text-[12px] sm:text-xs md:text-sm lg:text-base hover:bg-[#00271c] hover:text-white transition-colors duration-300 w-max text-center leading-tight cursor-pointer"
                >
                  Inicia tu <br /> solicitud
                </button>
              </div>
            </div>
          </div>
        </section> <PicoPlacaSolidario />
        {/* Section 3 - Paso a paso */}
        <section className="flex justify-center bg-[#EDEDED] py-10 px-5">
          <div className="w-full max-w-4xl">
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-8">
              {/* Tarjeta 1 - Personas Naturales */}
              <div className="bg-white w-[280px] rounded-3xl flex flex-col items-center shadow-lg">
                <div className="bg-[#0d2b1d] w-full h-[160px] rounded-t-3xl relative flex items-center justify-center">
                  <img
                    src="icono_paso_a_paso.svg"
                    alt="Personas Naturales"
                    className="w-20 h-auto"
                  />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-15 border-r-15 border-t-15 border-l-transparent border-r-transparent border-t-[#0d2b1d]"></div>
                </div>
                <div className="p-6 text-center flex flex-col items-center w-full">
                  <h2 className="text-xl font-bold text-[#00271c] mb-1">Paso a paso</h2>
                  <p className="text-sm text-gray-700">Inscripción personas naturales</p>
                  <div className="mt-4">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00271c] font-bold rounded-full border-2 border-[#00271c] py-2 px-6 bg-white hover:bg-[#00271c] hover:text-white transition-colors duration-300 inline-block text-sm"
                      href="https://storagearchivopypsprd.blob.core.windows.net/documentspyp/configLanding/vistaMedia/Infografías pico y placa solidario - persona natural.pdf"
                    >
                      Comenzar
                    </a>
                  </div>
                </div>
              </div>

              {/* Tarjeta 2 - Personas Jurídicas */}
              <div className="bg-white w-[280px] rounded-3xl flex flex-col items-center shadow-lg">
                <div className="bg-[#0d2b1d] w-full h-[160px] rounded-t-3xl relative flex items-center justify-center">
                  <img
                    src="icono_paso_a_pasojuridico.svg"
                    alt="Personas Jurídicas"
                    className="w-20 h-auto"
                  />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-15 border-r-15 border-t-15 border-l-transparent border-r-transparent border-t-[#0d2b1d]"></div>
                </div>
                <div className="p-6 text-center flex flex-col items-center w-full">
                  <h2 className="text-xl font-bold text-[#00271c] mb-1">Paso a paso</h2>
                  <p className="text-sm text-gray-700">Inscripción personas jurídicas</p>
                  <div className="mt-4">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00271c] font-bold rounded-full border-2 border-[#00271c] py-2 px-6 bg-white hover:bg-[#00271c] hover:text-white transition-colors duration-300 inline-block text-sm"
                      href="https://storagearchivopypsprd.blob.core.windows.net/documentspyp/configLanding/vistaMedia/Infografías pico y placa solidario - persona jurídica.pdf"
                    >
                      Comenzar
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-[url('https://picoyplacasolidario.movilidadbogota.gov.co/Foto-fondo_secci%C3%B3n-llamado-a-la-acci%C3%B3n_2.04417383cbf3daab.jpg')] bg-cover bg-center  w-full pb-[60px]">
          <SolicitudForm />

        </section>
      </main>
      <Footer />
    </div>
  )
}