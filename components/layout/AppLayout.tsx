"use client";

import React from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import Navbar from "@/components/navbar/NavBar";
import { useSidebar } from "@/context/SidebarContext";
import { motion } from "framer-motion";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { isCollapsed } = useSidebar();

    return (
        <div className="flex w-full min-h-screen bg-[#F8FAFC]">
            {/* Sidebar - Handles its own collapse state width */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Navbar */}
                <Navbar />

                {/* Dynamic Content Area with Scroll */}
                <main className="flex-1 overflow-y-auto no-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
}
