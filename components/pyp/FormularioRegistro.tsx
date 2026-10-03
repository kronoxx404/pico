// components/FormularioRegistro.tsx
'use client';

import { useState, useEffect } from 'react';
import munData from '../../data/mun.json';

interface FormData {
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  correoPrimario: string;
  correoSecundario: string;
  departamentoResidencia: string;
  municipioResidencia: string;
  localidadResidencia: string;
  direccionCorrespondencia: string;
  numeroTelefono: string;
  direccionOrigen: string;
  direccionDestino: string;
  estrato: string;
  tipoPropiedad: string;
  soyPropietario: string;
  motivoViaje: string;
}

interface FormularioRegistroProps {
  onDataChange?: (datos: any) => void;
  initialData?: Partial<any> | null;
  isLoading?: boolean;
}

export function FormularioRegistro({ 
  onDataChange,
  initialData, 
  isLoading = false 
}: FormularioRegistroProps) {
  // Convertir nombre de departamento a ID
  const getDeptoId = (nameOrId?: string | number) => {
    if (!nameOrId) return '';
    if (!isNaN(Number(nameOrId))) {
      const found = munData.departamentos.find(d => String(d.id) === String(nameOrId));
      if (found) return String(found.id);
    }
    const found = munData.departamentos.find(
      (d) => d.nombre.toLowerCase() === String(nameOrId).toLowerCase()
    );
    return found ? String(found.id) : '';
  };

  const [formData, setFormData] = useState<FormData>({
    primerNombre: initialData?.primerNombre || '',
    segundoNombre: initialData?.segundoNombre || '',
    primerApellido: initialData?.primerApellido || '',
    segundoApellido: initialData?.segundoApellido || '',
    correoPrimario: initialData?.correoPrimario || '',
    correoSecundario: initialData?.correoSecundario || '',
    departamentoResidencia: getDeptoId(initialData?.departamentoResidencia) || '14', // 14 es Cundinamarca en mun.json
    municipioResidencia: initialData?.municipioResidencia || 'Bogotá',
    localidadResidencia: initialData?.localidadResidencia || '',
    direccionCorrespondencia: initialData?.direccionCorrespondencia || '',
    numeroTelefono: initialData?.numeroTelefono || '',
    direccionOrigen: initialData?.direccionOrigen || '',
    direccionDestino: initialData?.direccionDestino || '',
    estrato: initialData?.estrato || '',
    tipoPropiedad: initialData?.tipoPropiedad || '',
    soyPropietario: initialData?.soyPropietario || '',
    motivoViaje: initialData?.motivoViaje || '1',
  });

  const [copyAddress, setCopyAddress] = useState(false);

  // Notificar cambios al padre
  useEffect(() => {
    if (onDataChange) {
      // Enviar el nombre real del departamento al componente padre
      const deptoObj = munData.departamentos.find(
        (d) => String(d.id) === String(formData.departamentoResidencia)
      );
      const deptoName = deptoObj ? deptoObj.nombre : '';

      onDataChange({
        ...formData,
        departamentoResidencia: deptoName,
      });
    }
  }, [formData, onDataChange]);

  // Obtener departamentos desde mun.json ordenados alfabéticamente
  const departamentos = [...munData.departamentos].sort((a, b) =>
    a.nombre.localeCompare(b.nombre)
  );

  // Obtener municipios filtrados por el departamento seleccionado (por ID)
  const departamentoSeleccionado = munData.departamentos.find(
    (d) => String(d.id) === String(formData.departamentoResidencia)
  );
  const municipios = departamentoSeleccionado
    ? [...departamentoSeleccionado.municipios].sort((a, b) => a.localeCompare(b))
    : [];

  // Obtener localidades desde mun.json ordenadas alfabéticamente
  const localidades = munData.localidades
    ? munData.localidades.map((l) => l.nombre).sort((a, b) => a.localeCompare(b))
    : [];

  const estratos = ['1', '2', '3', '4', '5', '6'];
  const tiposPropiedad = ['Propio', 'Locatario'];
  const motivosViaje = ['Trabajo', 'Estudio', 'Salud', 'Ocio', 'Otro'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const nextData = { ...prev, [name]: value };
      // Si cambia el departamento, reiniciar el municipio y la localidad
      if (name === 'departamentoResidencia') {
        nextData.municipioResidencia = '';
        nextData.localidadResidencia = '';
      }
      // Si cambia el municipio y no es Bogotá, reiniciar la localidad
      if (name === 'municipioResidencia' && value !== 'Bogotá') {
        nextData.localidadResidencia = '';
      }
      return nextData;
    });
  };

  const handleCopyAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setCopyAddress(checked);
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        direccionOrigen: prev.direccionCorrespondencia,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        direccionOrigen: '',
      }));
    }
  };

  return (
    <div className="flex justify-center text-[#1a4d2e]">
      <div className="w-[95%] mx-auto h-max bg-white rounded-lg shadow-md p-2.5 pb-4 sm:p-4 mb-4 mt-2">
        <div className="w-full mx-auto h-max rounded-sm border border-[#1a4d2e] p-4 pb-4 sm:p-6 md:p-3">
          <div className="mb-4 bg-gray-100 border-b border-zinc-500 border-t-0 p-2.5">
            <h3 className="font-medium text-lg py-2">
              Datos básicos de la persona
            </h3>
            {initialData?.encontrado === false && (
              <div className="text-sm text-orange-500 pb-2">
                ⚠️ Por favor, complete su registro.
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            {/* Primer Nombre */}
            <div className="flex flex-col self-start">
              <label className="whitespace-nowrap font-semibold text-sm">
                Primer nombre<span className="text-red-500 text-lg">*</span>:
              </label>
              <input
                type="text"
                name="primerNombre"
                value={formData.primerNombre}
                onChange={handleChange}
                maxLength={50}
                className="border border-gray-800 px-3 py-2 rounded-md focus:border-[#1a4d2e] focus:outline-none focus:ring-1 focus:ring-[#1a4d2e] w-full"
                required
              />
            </div>

            {/* Segundo Nombre */}
            <div className="flex flex-col self-start">
              <label className="whitespace-nowrap font-semibold text-sm">
                Segundo nombre:
              </label>
              <input
                type="text"
                name="segundoNombre"
                value={formData.segundoNombre}
                onChange={handleChange}
                maxLength={50}
                className="border border-gray-800 px-3 py-2 rounded-md focus:border-[#1a4d2e] focus:outline-none focus:ring-1 focus:ring-[#1a4d2e] w-full"
              />
            </div>

            {/* Primer Apellido */}
            <div className="flex flex-col self-start">
              <label className="whitespace-nowrap font-semibold text-sm">
                Primer apellido<span className="text-red-500 text-lg">*</span>:
              </label>
              <input
                type="text"
                name="primerApellido"
                value={formData.primerApellido}
                onChange={handleChange}
                maxLength={50}
                className="border border-gray-800 px-3 py-2 rounded-md focus:border-[#1a4d2e] focus:outline-none focus:ring-1 focus:ring-[#1a4d2e] w-full"
                required
              />
            </div>

            {/* Segundo Apellido */}
            <div className="flex flex-col self-start">
              <label className="whitespace-nowrap font-semibold text-sm">
                Segundo apellido:
              </label>
              <input
                type="text"
                name="segundoApellido"
                value={formData.segundoApellido}
                onChange={handleChange}
                maxLength={50}
                className="border border-gray-800 px-3 py-2 rounded-md focus:border-[#1a4d2e] focus:outline-none focus:ring-1 focus:ring-[#1a4d2e] w-full"
              />
            </div>

            {/* Correo Primario */}
            <div className="flex flex-col self-start">
              <label className="font-semibold text-sm">
                Correo electrónico primario<span className="text-red-500 text-lg">*</span>:
              </label>
              <input
                type="email"
                name="correoPrimario"
                value={formData.correoPrimario}
                onChange={handleChange}
                maxLength={100}
                className="border border-gray-800 px-3 py-2 rounded-md focus:border-[#1a4d2e] focus:outline-none focus:ring-1 focus:ring-[#1a4d2e] w-full"
                required
              />
            </div>

            {/* Correo Secundario */}
            <div className="flex flex-col self-start">
              <label className="font-semibold text-sm">
                Correo electrónico secundario:
              </label>
              <input
                type="email"
                name="correoSecundario"
                value={formData.correoSecundario}
                onChange={handleChange}
                maxLength={100}
                className="border border-gray-800 px-3 py-2 rounded-md focus:border-[#1a4d2e] focus:outline-none focus:ring-1 focus:ring-[#1a4d2e] w-full"
              />
            </div>

            {/* Departamento */}
            <div className="flex flex-col self-start">
              <label className="whitespace-nowrap font-semibold text-sm">
                Departamento de residencia<span className="text-red-500 text-lg">*</span>:
              </label>
              <select
                name="departamentoResidencia"
                value={formData.departamentoResidencia}
                onChange={handleChange}
                className="border border-gray-800 px-3 py-2 rounded-md focus:border-[#1a4d2e] focus:outline-none focus:ring-1 focus:ring-[#1a4d2e] bg-white w-full"
                required
              >
                <option value="">---Seleccionar---</option>
                {departamentos.map((depto) => (
                  <option key={depto.id} value={depto.id}>
                    {depto.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Municipio */}
            <div className="flex flex-col self-start">
              <label className="whitespace-nowrap font-semibold text-sm">
                Municipio de residencia<span className="text-red-500 text-lg">*</span>:
              </label>
              <select
                name="municipioResidencia"
                value={formData.municipioResidencia}
                onChange={handleChange}
                className="border border-gray-800 px-3 py-2 rounded-md focus:border-[#1a4d2e] focus:outline-none focus:ring-1 focus:ring-[#1a4d2e] bg-white w-full"
                required
              >
                <option value="">---Seleccionar---</option>
                {municipios.map((municipio) => (
                  <option key={municipio} value={municipio}>
                    {municipio}
                  </option>
                ))}
              </select>
            </div>

            {/* Localidad */}
            {formData.municipioResidencia === 'Bogotá' && (
              <div className="flex flex-col self-start w-full">
                <label className="whitespace-nowrap font-semibold text-sm">
                  Localidad de residencia<span className="text-red-500 text-lg">*</span>:
                </label>
                <select
                  name="localidadResidencia"
                  value={formData.localidadResidencia}
                  onChange={handleChange}
                  className="border border-gray-800 px-3 py-2 rounded-md focus:border-[#1a4d2e] focus:outline-none focus:ring-1 focus:ring-[#1a4d2e] bg-white w-full"
                  required
                >
                  <option value="">---Seleccionar---</option>
                  {localidades.map((localidad) => (
                    <option key={localidad} value={localidad}>
                      {localidad}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Dirección Correspondencia */}
            <div className="flex flex-col self-start">
              <label className="whitespace-nowrap font-semibold text-sm">
                Dirección de correspondencia<span className="text-red-500 text-lg">*</span>:
              </label>
              <input
                type="text"
                name="direccionCorrespondencia"
                value={formData.direccionCorrespondencia}
                onChange={handleChange}
                className="border border-gray-800 px-3 py-2 rounded-md focus:border-[#1a4d2e] focus:outline-none focus:ring-1 focus:ring-[#1a4d2e] w-full"
                required
              />
            </div>

            {/* Teléfono */}
            <div className="flex flex-col self-start">
              <label className="whitespace-nowrap font-semibold text-sm">
                Teléfono o celular
              </label>
              <input
                type="text"
                name="numeroTelefono"
                value={formData.numeroTelefono}
                onChange={handleChange}
                maxLength={10}
                className="border border-gray-800 px-3 py-2 rounded-md focus:border-[#1a4d2e] focus:outline-none focus:ring-1 focus:ring-[#1a4d2e] w-full"
              />
            </div>

            {/* Dirección Origen */}
            <div className="flex flex-col self-start">
              <label className="whitespace-nowrap font-semibold text-sm">
                Dirección de origen<span className="text-red-500 text-lg">*</span>:
              </label>
              <input
                type="text"
                name="direccionOrigen"
                value={formData.direccionOrigen}
                onChange={handleChange}
                className="border border-gray-800 px-3 py-2 rounded-md focus:border-[#1a4d2e] focus:outline-none focus:ring-1 focus:ring-[#1a4d2e] w-full"
                required
              />
              <div className="flex items-center mt-3">
                <input
                  type="checkbox"
                  id="copyAddress"
                  checked={copyAddress}
                  onChange={handleCopyAddress}
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="copyAddress" className="text-sm">
                  Copiar dirección de correspondencia
                </label>
              </div>
            </div>

            {/* Dirección Destino */}
            <div className="flex flex-col self-start">
              <label className="whitespace-nowrap font-semibold text-sm">
                Dirección de destino<span className="text-red-500 text-lg">*</span>:
              </label>
              <input
                type="text"
                name="direccionDestino"
                value={formData.direccionDestino}
                onChange={handleChange}
                className="border border-gray-800 px-3 py-2 rounded-md focus:border-[#1a4d2e] focus:outline-none focus:ring-1 focus:ring-[#1a4d2e] w-full"
                required
              />
            </div>

            {/* Estrato */}
            <div className="flex flex-col self-start">
              <label className="whitespace-nowrap font-semibold text-sm">
                Estrato<span className="text-red-500 text-lg">*</span>:
              </label>
              <select
                name="estrato"
                value={formData.estrato}
                onChange={handleChange}
                className="border border-gray-800 px-3 py-2 rounded-md focus:border-[#1a4d2e] focus:outline-none focus:ring-1 focus:ring-[#1a4d2e] bg-white w-full"
                required
              >
                <option value="">--- Seleccionar ---</option>
                {estratos.map((estrato) => (
                  <option key={estrato} value={estrato}>
                    {estrato}
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo Propiedad */}
            <div className="flex flex-col self-start">
              <label className="whitespace-nowrap font-semibold text-sm">
                Tipo de propiedad<span className="text-red-500 text-lg">*</span>:
              </label>
              <select
                name="tipoPropiedad"
                value={formData.tipoPropiedad}
                onChange={handleChange}
                className="border border-gray-800 px-3 py-2 rounded-md focus:border-[#1a4d2e] focus:outline-none focus:ring-1 focus:ring-[#1a4d2e] bg-white w-full"
                required
              >
                <option value="">--- Seleccionar ---</option>
                {tiposPropiedad.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            {/* Soy Propietario */}
            <div className="flex flex-col self-start">
              <label className="whitespace-nowrap font-semibold text-sm">
                Soy propietario de<span className="text-red-500 text-lg">*</span>:
              </label>
              <select
                name="soyPropietario"
                value={formData.soyPropietario}
                onChange={handleChange}
                className="border border-gray-800 px-3 py-2 rounded-md focus:border-[#1a4d2e] focus:outline-none focus:ring-1 focus:ring-[#1a4d2e] bg-white w-full"
                required
              >
                <option value="">--- Seleccionar ---</option>
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i + 1} value={String(i + 1)}>
                    {i + 1} Vehículo{i > 0 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Motivo Viaje */}
            <div className="flex flex-col self-start">
              <label className="whitespace-nowrap font-semibold text-sm">
                Motivo de viaje
              </label>
              <select
                name="motivoViaje"
                value={formData.motivoViaje}
                onChange={handleChange}
                className="border border-gray-800 px-3 py-2 rounded-md focus:border-[#1a4d2e] focus:outline-none focus:ring-1 focus:ring-[#1a4d2e] bg-white w-full"
              >
                {motivosViaje.map((motivo, index) => (
                  <option key={index + 1} value={String(index + 1)}>
                    {motivo}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}