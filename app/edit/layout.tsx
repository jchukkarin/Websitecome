import AppLayout from "@/components/layout/AppLayout";

export default function EditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}