'use client'

import { Sidebar } from "@/components/dashboard/Sidebar"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans text-gray-900">
      <div className="max-w-7xl mx-auto flex gap-6 p-4 md:p-6">

        {/* Sidebar */}
        <div className="hidden md:block md:sticky md:top-6 md:h-[calc(100vh-3rem)]">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <p className="text-gray-500">
            ยินดีต้อนรับสู่ระบบบันทึกรายรับรายจ่าย
          </p>
          <Sidebar />
        </main>

      </div>
    </div>
  )
}
