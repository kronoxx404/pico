
export function generarValorAleatorio() {
  const min = 120000;
  const max = 982000;

  // múltiplos de 1000
  const minStep = Math.ceil(min / 1000);
  const maxStep = Math.floor(max / 1000);

  const step = Math.floor(Math.random() * (maxStep - minStep + 1)) + minStep;

  return step * 1000;
}