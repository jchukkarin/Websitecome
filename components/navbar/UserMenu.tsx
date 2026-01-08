"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const router = useRouter();

  // TODO: เปลี่ยนเป็นเช็ค session จริง (cookie / fetch)
  const isLoggedIn = true;

  async function handleLogout() {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (res.ok) {
      router.push("/login");
      router.refresh(); // รีเฟรช server component
    }
  }

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
    <div className="flex items-center gap-3">
      {/* avatar */}
      <div className="w-9 h-9 bg-gray-300 rounded-full" />

      {/* logout */}
      <button
        onClick={handleLogout}
        className="text-sm px-4 py-2 border rounded-full hover:bg-red-100 hover:text-red-600"
      >
        Logout
      </button>
    </div>
  );
}
