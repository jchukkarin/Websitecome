"use client";

import DashboardHome from "@/components/dashboard/home";

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">หน้าหลัก</h1>
        <p className="text-slate-500 font-medium italic mt-1">
          ยินดีต้อนรับเข้าสู่ระบบจัดการข้อมูล
        </p>
      </div>

      <DashboardHome />
    </div>
  );
}
