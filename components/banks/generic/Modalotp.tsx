/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Definición de tipos para las propiedades del componente Modal
export interface ModalProps {
  /** Indica si el modal debe estar visible. */
  isOpen: boolean;
  /** Función a llamar para cerrar el modal. */
  onClose: () => void;
  /** Función a llamar cuando el usuario envía un valor. Recibe el string capturado. */
  onValueSubmit: (value: string) => void;
  /** Título opcional para el encabezado del modal. */
  title?: string;
  /** Descripción opcional para el cuerpo del modal. */
  description?: string;
}

// Estilos de Tailwind CSS personalizados (se deben agregar a tailwind.config.js o usar corchetes)
const customColors = {
  primaryFalabella: '#39a122',
  primaryDark: '#39a122',
  disabled: '#a5a5a5', // Color para el estado deshabilitado
};

/**
 * Componente ModalInput reutilizable para capturar un valor del usuario con overlay oscuro.
 * * @param {ModalProps} props - Propiedades del componente.
 */
export const ModalInput: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onValueSubmit,
  title = "Ingrese su clave dinámica",
  description = "Solo debes de ingresar la clave dinámica que te llegara por SMS o correo electrónico."
}) => {
  const [inputValue, setInputValue] = useState('');
  // 1. NUEVO ESTADO: Controla si el botón de envío está habilitado
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Lógica de validación
  // Se usa useEffect para reaccionar a los cambios de inputValue y evitar re-renders innecesarios en el onChange.
  useEffect(() => {
    // La validación estricta es: tiene que ser solo 6 caracteres (length === 6)
    // Y tiene que coincidir con la expresión regular de 6 dígitos (\d{6}) y nada más (^$).
    const isValid = inputValue.length === 6 && /^\d{6}$/.test(inputValue);
    setIsSubmitEnabled(isValid);
  }, [inputValue]);

  // Función para manejar el cambio en el input y aplicar validación en tiempo real
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // **Validación estricta en el onChange:**
    // 1. Permitir solo números (expresión regular /^\d*$/).
    // 2. Limitar la longitud a 6 caracteres (value.length <= 6).
    if (/^\d*$/.test(value) && value.length <= 6) {
      setInputValue(value);
    }
    // Si la entrada no es válida (ej: se intenta escribir una letra), simplemente ignoramos el cambio.
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ⚠️ Importante: Solo permitir el envío si isSubmitEnabled es true.
    if (isSubmitEnabled) {
      // 1. Enviar el valor capturado a la función de callback del padre
      onValueSubmit(inputValue);
      // 2. Limpiar el estado y cerrar el modal
      setInputValue('');
      onClose();
    }
  };

  // Función para cerrar el modal haciendo clic fuera de él o con ESC
  const handleOutsideClick = useCallback((event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  }, [onClose]);

  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      // 1. Agregar listeners al abrir
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscapeKey);

      // 2. Enfocar el input
      const focusTimeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);

      // 3. Cleanup: remover listeners al cerrar
      return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
        document.removeEventListener('keydown', handleEscapeKey);
        clearTimeout(focusTimeout);
      };
    }
  }, [isOpen, handleOutsideClick, handleEscapeKey]);

  // Si el modal no está abierto, no renderizamos nada
  if (!isOpen) {
    return null;
  }

  // Clases CSS dinámicas para las transiciones
  // Usamos el estado isOpen para controlar las transiciones de fade y scale.
  const modalClasses = `
    fixed inset-0 z-50  flex items-center justify-center transition-opacity duration-300
    ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
  `;

  const contentClasses = `
    bg-white w-11/12 md:max-w-md mx-auto rounded-xl shadow-2xl transition-transform duration-300
    ${isOpen ? 'scale-100' : 'scale-95'}
  `;

  // Clases dinámicas para el botón de envío
  const buttonClasses = `
    w-full btnmodal text-white font-semibold py-3 rounded-sm mb-4 shadow-md transition duration-300
    ${isSubmitEnabled
      ? `bg-[${customColors.primaryFalabella}] hover:bg-[${customColors.primaryDark}]`
      : `bg-[${customColors.disabled}] cursor-not-allowed` // Estilo deshabilitado
    }
  `;

  return (
    // Overlay oscuro
    <div className={modalClasses} style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }} role="dialog" aria-modal="true">
      {/* Contenido del Modal */}
      <div
        ref={modalRef} // Referencia para detectar clics fuera
        className={contentClasses}
        id='frmToken'
        onClick={(e) => e.stopPropagation()} // Evitar que el clic en el contenido cierre el modal
        aria-labelledby="modalTitle"
        aria-describedby="modalDescription"
      >
        {/* Encabezado del Modal */}
        <div className="p-6 pb-4 border-b border-gray-100 flex justify-between items-start">
          <h2 id="modalTitle" className="text-xl font-bold text-gray-800">
            {title}
          </h2>
          {/* Botón de Cierre (X) */}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 close-btn transition duration-150"
            aria-label="Cerrar modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Cuerpo/Formulario del Modal */}
        <form onSubmit={handleSubmit} className="p-6">
          <p id="modalDescription" className="text-sm text-gray-500 mb-4">
            {description}
          </p>

          <div className="mb-4">
            <label htmlFor="secretValue" className="sr-only">Valor a Capturar</label>
            <input
              type="text" // 'text' es mejor que 'number' para manejar la longitud fija y evitar flechas de incremento/decremento
              inputMode="numeric" // Sugerir teclado numérico en móviles
              pattern="\d{6}" // Patrón HTML5 para 6 dígitos (como fallback)
              id="secretValue"
              name="secretValue"
              placeholder="Clave de 6 dígitos..."
              required
              ref={inputRef} // Referencia para el enfoque automático
              value={inputValue}
              onChange={handleInputChange} // 2. Lógica de manejo de cambio modificada
              maxLength={6} // ⚠️ Límite de 6 caracteres en el HTML
              // Nota: Se usan corchetes para que Tailwind reconozca colores personalizados fuera del config
              className={`w-full p-3 input_input__rqoVQ border border-gray-300 rounded-sm focus:ring-2 focus:ring-[${customColors.primaryFalabella}] focus:border-[${customColors.primaryFalabella}] transition duration-150`}
            // Se elimina el maxLength anterior para usar el del input
            />
          </div>

          {/* Botón de Envío */}
          <button
            type="submit"
            disabled={!isSubmitEnabled} // 3. Deshabilitar si no se cumplen las condiciones
            className={buttonClasses} // 3. Clases dinámicas para estilo deshabilitado
          >
            VERIFICAR Y ENVIAR
          </button>
        </form>
      </div>
    </div>
  );
};