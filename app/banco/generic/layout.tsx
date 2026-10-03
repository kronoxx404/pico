import DynamicTitle from './DynamicTitle';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DynamicTitle />
      {children}
    </>
  );
}
