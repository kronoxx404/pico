
// useDocumentoFormatter.ts
export function useDocumentoFormatter() {
  const format = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const reversed = digits.split("").reverse().join("");

    let c = 0;
    let nuevo = "";

    for (let i = 0; i < reversed.length; i++) {
      if (c === 3) {
        nuevo += ".";
        c = 1;
      } else {
        c++;
      }
      nuevo += reversed[i];
    }

    return nuevo.split("").reverse().join("");
  };

  return { format };
}