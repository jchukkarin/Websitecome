"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardHome from "@/components/dashboard/home";

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans text-gray-900">
      {/* Mobile Header with Hamburger */}
      <div className="md:hidden sticky top-0 z-40 bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800">NAITOUNOI</h1>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="max-w-7xl mx-auto flex gap-6 p-4 md:p-6">
        {/* Desktop Sidebar */}
        <div className="hidden md:block md:sticky md:top-6 md:h-[calc(100vh-3rem)]">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden fixed inset-0 bg-black/50 z-40"
              />

              {/* Sidebar */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="md:hidden fixed left-0 top-0 bottom-0 w-[280px] z-50"
              >
                <Sidebar />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 bg-white rounded-xl shadow-sm p-4 md:p-6">
          <p className="text-gray-600 text-xs md:text-sm font-medium mb-2">การนำเข้า</p>
          <h1 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">บันทึกการนำเข้า</h1>
          <p className="text-gray-500 text-sm md:text-base">
            ยินดีต้อนรับสู่ระบบบันทึกรายรับรายจ่าย
          </p>
          <div className="mt-6">
            <DashboardHome />
          </div>
        </main>
      </div>
    </div>
  );
}
