
export function loadCss(url: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`link[href="${url}"]`)) {
      resolve();
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    link.onload = () => resolve();
    link.onerror = () => reject(`No se pudo cargar el CSS: ${url}`);
    document.head.appendChild(link);
  });
}