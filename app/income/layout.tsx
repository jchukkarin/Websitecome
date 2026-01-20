// app/(main)/layout.tsx
import Navbar from "@/components/navbar/NavBar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="w-full">
        {children}
      </main>
    </>
  );
}