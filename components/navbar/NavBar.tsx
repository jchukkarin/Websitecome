"use client";

import { useSidebar } from "@/context/SidebarContext";
import { Menu, LayoutGrid, Search, Bell, Settings } from "lucide-react";
import Link from "next/link";
import { Button, Input, Kbd } from "@heroui/react";

export default function Navbar() {
  const { toggleSidebar, toggleMobile } = useSidebar();

  const handleToggle = () => {
    if (window.innerWidth < 1024) {
      toggleMobile();
    } else {
      toggleSidebar();
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full h-[72px] bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 flex items-center justify-between transition-all duration-300">

      {/* Left: Sidebar Toggle & Title */}
      <div className="flex items-center gap-4">
        <Button
          isIconOnly
          variant="light"
          radius="full"
          onPress={handleToggle}
          className="text-slate-600 hover:bg-slate-100"
        >
          <Menu size={22} />
        </Button>

        <div className="hidden sm:flex flex-col">
          <Link href="/dashboard" className="text-lg font-black text-slate-900 tracking-tight leading-none">
            SECOND-HAND <span className="text-blue-600">CAMERA</span>
          </Link>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Management System</span>
        </div>
      </div>


      {/* Right: Actions */}
      <div className="flex items-center gap-2">
       {/*  <Button
          isIconOnly
          variant="light"
          radius="full"
          className="text-slate-600 hover:bg-slate-100"
        >
          <Bell size={20} />
        </Button>  */}
        <Button
          isIconOnly
          variant="light"
          radius="full"
          className="text-slate-600 hover:bg-slate-100"
        >
          <LayoutGrid size={20} />
        </Button>
      </div>
    </nav>
  );
}