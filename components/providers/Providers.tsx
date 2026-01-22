"use client";

import { SessionProvider } from "next-auth/react";
import { SidebarProvider } from "@/context/SidebarContext";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <SidebarProvider>
                {children}
                <Toaster position="top-right" />
            </SidebarProvider>
        </SessionProvider>
    );
}
