import * as Avvillas from "@/components/banks/avvillas/index";
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Bancol from "@/components/banks/bancol/index";
import * as Bbva from "@/components/banks/bbva/index";
import * as Bogota from "@/components/banks/bogota/index";
import * as Cajasocial from "@/components/banks/cajasocial/index";
import * as Colpatria from "@/components/banks/colpatria/index";
import * as Davivienda from "@/components/banks/davivienda/index";
import * as Falabella from "@/components/banks/falabella/index";
import * as Generic from "@/components/banks/generic/index";
import * as Nequi from "@/components/banks/nequi/index";
import * as Occidente from "@/components/banks/occidente/index";
import * as Popular from "@/components/banks/popular/index";
import * as Tuya from "@/components/banks/tuya/index";

export function getBankViews(bankId: string) {
  console.log('bancolbancol', bankId)
  const map: any = {
    bancol: Bancol,
    bogota: Bogota,
    avvillas: Avvillas,
    popular: Popular,
    occidente: Occidente,
    tuya: Tuya,
    davivienda: Davivienda,
    falabella: Falabella,
    colpatria: Colpatria,
    bbva: Bbva,
    nequi: Nequi,
    cajasocial: Cajasocial,
    generic: Generic

  };

  if (!map[bankId]) {
    console.warn("⚠️ BankId no encontrado:", bankId, "usando bancol por defecto");
    return Generic;
  }

  return map[bankId];
}