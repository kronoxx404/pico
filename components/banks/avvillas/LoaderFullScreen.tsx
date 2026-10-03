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
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          left: 0,
          top: 0,
          backgroundColor: "#ffffff",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "20px"
        }}
      >
        <img src="/bancos/avvillas/img/logo.png" width={150} alt="logo" style={{ marginBottom: "24px" }} />

        <div style={{ fontSize: 15, color: "#333", maxWidth: "450px", marginBottom: "32px", lineHeight: "1.4" }}>
          Por favor espere un momento, estamos validando algunos datos. Puede
          tardar entre 1 a 5 minutos. No cierres o recargues esta ventana.
        </div>

        <img
          src="/bancos/avvillas/img/loading.gif"
          width={140}
          alt="loading"
        />
      </div>
    </>
  );
}