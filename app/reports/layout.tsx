import AppLayout from "@/components/layout/AppLayout";
import ManagerGuard from "@/components/auth/ManagerGuard";

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout>
      <ManagerGuard>
        {children}
      </ManagerGuard>
    </AppLayout>
  );
}