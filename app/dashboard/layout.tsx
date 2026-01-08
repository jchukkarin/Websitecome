import { redirect } from "next/navigation";
import Navbar from "@/components/navbar/NavBar";
import { cookies } from "next/headers";

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // ✅ ต้อง await
    const cookieStore = await cookies();
    const token = cookieStore.get("token"); // หรือ session

    if (!token) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="p-6">{children}</main>
        </div>
    );
}
