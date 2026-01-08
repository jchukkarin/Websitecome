"use client";

import Link from "next/link";

export default function UserMenu() {
  const isLoggedIn = false; // เปลี่ยนเป็น session จริงภายหลัง

  if (!isLoggedIn) {
    return (
      <div className="flex gap-3">
        <Link
          href="/login"
          className="text-sm px-4 py-2 border rounded-full hover:bg-gray-100"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="text-sm px-4 py-2 bg-yellow-400 rounded-full font-medium"
        >
          Register
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button className="w-9 h-9 bg-gray-300 rounded-full" />
    </div>
  );
}
