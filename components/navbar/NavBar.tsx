"use client";

import Link from "next/link";
import NavItem from "./NavItem";
import UserMenu from "./UserMenu";

export default function Navbar() {
  return (
    <nav className="w-full h-[72px] mx-auto bg-white border-b shadow-sm px-6 flex items-center justify-between">
      
      {/* Logo */}
      <div>
        <button
          type="button"
          className="text-xl font-bold tracking-wide text-gray-900 bg-transparent border-none outline-none hover:opacity-80 transition"
          >
          <Link href="/dashboard">Income</Link>
  </button>
</div>

      {/* Menu */}
     <div className="">
      <div className="">
        <button className="">
          <Link href="/dashboard">Dashboard</Link>
        </button>
        <button className="">
          <Link href="/dashboard">Dashboard</Link>
        </button>
        <button className="">
          <Link href="/dashboard">Dashboard</Link>
        </button>
      </div>
     </div>

      {/* User */}
      <UserMenu />
    </nav>
  );
}
