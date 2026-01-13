"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  href: string;
  label: string;
};

export default function NavItem({ href, label }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`relative py-2 text-sm font-semibold transition-all duration-200 
        ${isActive ? "text-yellow-600" : "text-gray-500 hover:text-gray-900"}
      `}
    >
      {label}
      {isActive && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 rounded-full animate-in fade-in" />
      )}
    </Link>
  );
}