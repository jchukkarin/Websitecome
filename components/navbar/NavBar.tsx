"use client";

import Link from "next/link";
import NavItem from "./NavItem";
import UserMenu from "./UserMenu";

export default function Navbar() {
  return (
    <nav className="w-full h-16 bg-white border-b shadow-sm px-6 flex items-center justify-between">
      
      {/* Logo */}
      <Link href="/" className="text-xl font-bold text-gray-900">
        Income
      </Link>

      {/* Menu */}
      <div className="flex items-center gap-6">
        <NavItem href="/dashboard" label="Dashboard" />
        <NavItem href="/income" label="Income" />
        <NavItem href="/expense" label="Expense" />
      </div>

      {/* User */}
      <UserMenu />
    </nav>
  );
}
