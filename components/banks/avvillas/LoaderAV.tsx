
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
// LoaderAV.tsx
export default function LoaderAV({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <>
      <div id="fondo" />
      <img src="/bancos/avvillas/img/loading.gif" id="cargando" width={140} />
    </>
  );
}