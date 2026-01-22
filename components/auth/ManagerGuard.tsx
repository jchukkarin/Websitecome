"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";

export default function ManagerGuard({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        if (status === "loading") return;

        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }

        const user = session?.user as any;
        if (user?.role !== "MANAGER") {
            router.push("/dashboard");
        } else {
            setAuthorized(true);
        }
    }, [status, session, router]);

    if (status === "loading" || !authorized) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#F8FAFC]">
                <div className="flex flex-col items-center gap-4">
                    <Spinner size="lg" color="primary" />
                    <p className="text-slate-500 font-medium">กำลังตรวจสอบสิทธิ์เข้าถึง...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
