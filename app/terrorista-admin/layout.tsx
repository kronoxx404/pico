// Layout para /terrorista-admin — asegura que el dashboard ocupe toda la pantalla
// y que el scroll sea manejado internamente por el componente
export default function XdmLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen overflow-hidden bg-stone-950">
      {children}
    </div>
  );
}
