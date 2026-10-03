/* eslint-disable @next/next/no-img-element */
"use client";

export default function ModalDatosError({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">

          {/* ICONO DE ALERTA */}
          <div className="modal-icon">
            <img src="/alertas.png" width={40} height={40} alt="alertas" />
          </div>

          {/* TITULO */}
          <h2 className="modal-title">Tus datos no coinciden</h2>

          {/* TEXTO */}
          <p className="modal-text">
            Verifícalos e inténtalo nuevamente. Si aún no eres cliente te invitamos a
            solicitar un producto desde la pantalla de inicio. (00)
          </p>

          {/* BOTÓN */}
          <button className="modal-button" onClick={onClose}>
            Volver
          </button>

        </div>
      </div>

      {/* ESTILOS */}
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 25, 71, 0.8);
          backdrop-filter: blur(5px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 99999;
        }

        .modal-container {
          width: 90%;
          max-width: 600px;
          background: white;
          border-radius: 16px;
          padding: 35px 25px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          animation: fadeIn 0.25s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .modal-content {
          text-align: left;
        }

        .modal-icon {
          display: flex;
          justify-content: start;
          margin-bottom: 10px;
        }

        .icon-alert {
          width: 55px;
          height: 55px;
          background-image: url("/alertas.png");
          background-size: contain;
          background-repeat: no-repeat;
          display: block;
        }

        .modal-title {
          font-size: 22px;
          font-weight: 700;
          color: #000;
          margin-bottom: 15px;
          text-align: left;
        }

        .modal-text {
          font-size: 16px;
          line-height: 1.4;
          color: #333;
          margin-bottom: 30px;
        }

        .modal-button {
          background: #0037b3;
          color: white;
          width: 200px;
          border: none;
          padding: 14px 0;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 600;
          display: block;
          margin: 0 auto;
          cursor: pointer;
          transition: background 0.2s;
        }

        .modal-button:hover {
          background: #002c8f;
        }
      `}</style>
    </div>
  );
}