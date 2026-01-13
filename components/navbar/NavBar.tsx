"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // ไอคอน
import UserMenu from "./UserMenu";
import NavItem from "./NavItem";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/income", label: "Income" },
    { href: "/dashboard/expenses", label: "Expenses" },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full h-[72px] bg-white/80 backdrop-blur-md border-b shadow-sm px-4 md:px-8 flex items-center justify-between">
      
      {/* Left Side: Logo & Desktop Menu */}
      <div className="flex items-center gap-10">
        <Link
          href="/dashboard"
          className="text-2xl font-black tracking-tighter text-gray-900 hover:scale-105 transition-transform"
        >
          นายตัวน้อย<span className="text-yellow-500">.</span>
        </Link>

        {/* Desktop Menu (ซ่อนในมือถือ) */}
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <NavItem key={item.href} href={item.href} label={item.label} />
          ))}
        </div>
      </div>

      {/* Right Side: User & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <UserMenu />
        
        {/* Mobile Menu Button (แสดงเฉพาะมือถือ) */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown (แสดงเมื่อกด Menu ในมือถือ) */}
      {isOpen && (
        <div className="absolute top-[72px] left-0 w-full bg-white border-b shadow-xl p-4 flex flex-col gap-4 md:hidden animate-in slide-in-from-top duration-300">
          {menuItems.map((item) => (
            <div key={item.href} onClick={() => setIsOpen(false)}>
              <NavItem href={item.href} label={item.label} />
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}