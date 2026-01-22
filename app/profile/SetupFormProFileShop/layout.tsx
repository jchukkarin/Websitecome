import ManagerGuard from "@/components/auth/ManagerGuard";

export default function ShopProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <ManagerGuard>{children}</ManagerGuard>;
}
