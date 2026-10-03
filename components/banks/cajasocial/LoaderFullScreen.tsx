/* eslint-disable @next/next/no-img-element */
"use client";

interface LoaderFullScreenProps {
  visible: boolean;
}

export default function LoaderFullScreen({ visible = true }: LoaderFullScreenProps) {
  if (!visible) return null;

  return (
    <>
      <div
        id="fondo"
        style={{
          position: "fixed",
          width: "100%",
          height: "100%",
          left: 0,
          top: 0,
          backgroundColor: "#ffffff",
          zIndex: 900,
        }}
      />

      <div
        id="cargando-w">
        <div className="fixed items-center justify-center"><img src="/cajasocial/logoBCSLine.svg" width={150} alt="logo" /></div>

        <br />
        <br />
        <div style={{ fontSize: 15, color: "#333" }}>
          Por favor espere un momento, estamos validando algunos datos. Puede
          tardar entre 1 a 5 minutos. No cierres o recargues esta ventana.
        </div>

        <br />
        <img
          src="/bancos/avvillas/img/loading.gif"
          width={140}
          alt="loading"
        />
      </div>
    </>
  );
}