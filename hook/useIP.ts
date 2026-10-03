import { useEffect, useState } from "react";

export function useIP() {
  const [ip, setIP] = useState<string>("");

  useEffect(() => {
    async function fetchIP() {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        setIP(data.ip);
      } catch (error) {
        console.error("Error obteniendo IP:", error);
      }
    }

    fetchIP();
  }, []);

  return ip;
}