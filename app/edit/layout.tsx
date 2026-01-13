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
      <main className="container mx-auto p-4">
        {children}
      </main>
    </>
  );
}