"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, User, LogOut, ChevronDown } from "lucide-react";
import { useSession } from "next-auth/react";

export default function UserMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // สมมติว่าค่าเหล่านี้ดึงมาจาก Context หรือสถานะจริง
  const isLoggedIn = true; 

  // --- ฟังก์ชัน Logout ---
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        // เมื่อ Logout สำเร็จ ให้ปิดเมนูและไปหน้า Login หรือหน้าแรก
        setOpen(false);
        router.push("/login");
        router.refresh(); // เพื่อรีเฟรชสถานะ Auth ใน Server Component
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login" className="text-sm font-medium px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-full transition">
          Login
        </Link>
        <Link href="/register" className="text-sm font-bold px-5 py-2 bg-yellow-400 hover:bg-yellow-500 rounded-full shadow-sm transition">
          Register
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1 pr-3 hover:bg-gray-100 rounded-full transition border border-transparent hover:border-gray-200"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-xs shadow-inner">
          JG
        </div>
        <ChevronDown size={14} className={`text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in zoom-in-95 duration-150">
          <div className="px-4 py-4 bg-gray-50/50 border-b">
            <p className="font-bold text-gray-900 leading-none">Junior Garcia</p>
            <p className="text-xs text-gray-500 mt-1">junior@example.com</p>
          </div>

          <div className="p-1">
            <Link href="/profile" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-xl transition">
              <User size={18} className="text-gray-400" /> โปรไฟล์ของฉัน
            </Link>
            <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-xl transition">
              <LayoutDashboard size={18} className="text-gray-400" /> Dashboard
            </Link>
          </div>

          <div className="h-px bg-gray-100 mx-1" />

          <div className="p-1">
            {/* เรียกใช้ฟังก์ชัน handleLogout */}
            <button
              onClick={handleLogout} 
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition font-medium"
            >
              <LogOut size={18} /> ออกจากระบบ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}