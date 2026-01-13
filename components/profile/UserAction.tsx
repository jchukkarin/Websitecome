"use client";

import { Button } from "@heroui/react";
import { UserCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserAction() {
  const router = useRouter();

  // ออกจากระบบจริง
  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    // กลับหน้า login
    router.replace("/login");
  }

  return (
    <div className="flex gap-2">
      {/* ไปหน้าโปรไฟล์ */}
      <Button
        isIconOnly
        variant="light"
        radius="full"
        size="sm"
        onClick={() => router.push("/profile/ProFile")}
      >
        <UserCircle size={24} className="text-gray-400" />
      </Button>

      {/* Logout */}
      <Button
        isIconOnly
        variant="light"
        radius="full"
        size="sm"
        onClick={handleLogout}
      >
        <LogOut size={24} className="text-gray-400" />
      </Button>
    </div>
  );
}
