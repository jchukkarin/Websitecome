"use client";

import Link from "next/link";
import NavItem from "./NavItem";
import UserMenu from "./UserMenu";

export default function Navbar() {
  return (
    <nav className="w-full h-[72px] mx-auto bg-white border-b shadow-sm px-6 flex items-center justify-between">

      {/* Logo */}
      <div>
        <Link
          href="/dashboard"
          className="text-xl font-bold tracking-wide text-gray-900 bg-transparent border-none outline-none hover:opacity-80 transition"
        >
          Income
        </Link>
      </div>

      {/* Menu */}
      <div className="">
        <div className="flex gap-4">
          <Link href="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
          <Link href="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
          <Link href="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
        </div>
      </div>

      {/* User */}
      <UserMenu />
    </nav>
  );
}
