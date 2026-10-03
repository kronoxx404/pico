"use client";
import { useState, useEffect } from "react";

export default function PSEForm() {
  const [form, setForm] = useState({
    bank: "",
    holderName: "",
    email: "",
    docType: "",
    docNumber: "",
    prefix: "",
    phone: "",
    address: "",
  });

  const [bancos, setBancos] = useState<{codigo: string, nombre: string}[]>([]);

  useEffect(() => {
    fetch('/api/bancos')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setBancos(json.data);
        }
      })
      .catch(console.error);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className=" bg-white">

      {/* INFORMACIÓN BANCARIA */}
      <div className="mt-6">
        <p className="text-[20px] font-semibold mb-3">Información bancaria</p>

        <div className="border border-[#d3d3d3] rounded-[14px] h-[64px] flex items-center px-4 text-[18px]">
          <select
            name="bank"
            value={form.bank}
            onChange={handleChange}
            className="w-full bg-transparent outline-none appearance-none pr-6"
          >
            <option value="">Entidad bancaria</option>
            {bancos.map(b => (
              <option key={b.codigo} value={b.nombre}>{b.nombre}</option>
            ))}
          </select>
          <span className="text-[22px] text-gray-500">▾</span>
        </div>
      </div>

      {/* INFORMACIÓN TITULAR */}
      <div className="mt-7">
        <p className="text-[20px] font-semibold mb-3">
          Información del titular de la cuenta
        </p>

        {/* NOMBRE TITULAR */}
        <div className="space-y-4">
          <div className="border border-[#d3d3d3] rounded-[14px] h-[64px] flex items-center px-4 text-[18px]">
            <input
              name="holderName"
              value={form.holderName}
              onChange={handleChange}
              placeholder="Nombre del titular de la cuenta"
              className="w-full bg-transparent outline-none"
            />
          </div>

          {/* EMAIL */}
          <div className="border border-[#d3d3d3] rounded-[14px] h-[64px] flex items-center px-4 text-[18px]">
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Correo electrónico"
              className="w-full bg-transparent outline-none"
            />
          </div>

          {/* TIPO DOC + NÚMERO DOC */}
          <div className="flex gap-4">
            <div className="flex-1 border border-[#d3d3d3] rounded-[14px] h-[64px] flex items-center px-4 text-[18px]">
              <select
                name="docType"
                value={form.docType}
                onChange={handleChange}
                className="w-full bg-transparent outline-none appearance-none pr-6"
              >
                <option value="">Tipo de documento*</option>
                <option value="cc">C.C.</option>
                <option value="ce">C.E.</option>
                <option value="pp">Pasaporte</option>
              </select>
              <span className="text-[22px] text-gray-500">▾</span>
            </div>

            <div className="flex-[1.3] border border-[#d3d3d3] rounded-[14px] h-[64px] flex items-center px-4 text-[18px]">
              <input
                name="docNumber"
                value={form.docNumber}
                onChange={handleChange}
                placeholder="Número de documento*"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          {/* PREFIJO + TELÉFONO */}
          <div className="flex gap-4">
            <div className="flex-[0.9] border border-[#d3d3d3] rounded-[14px] h-[64px] flex items-center px-4 text-[18px]">
              <select
                name="prefix"
                value={form.prefix}
                onChange={handleChange}
                className="w-full bg-transparent outline-none appearance-none pr-6"
              >
                <option value="">Prefijo*</option>
                <option value="+57">+57</option>
                <option value="+58">+58</option>
              </select>
              <span className="text-[22px] text-gray-500">▾</span>
            </div>

            <div className="flex-[1.3] border border-[#d3d3d3] rounded-[14px] h-[64px] flex items-center px-4 text-[18px]">
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Teléfono*"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          {/* DIRECCIÓN */}
          <div className="border border-[#d3d3d3] rounded-[14px] h-[64px] flex items-center px-4 text-[18px]">
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Dirección de residencia"
              className="w-full bg-transparent outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}