"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  Input,
  Button,
} from "@heroui/react";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import Link from "next/link";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        return;
      }

      // Successful login, get session to check role for redirection
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const userRole = session?.user?.role;

      if (userRole === "MANAGER") {
        router.push("/dashboard"); // Or a specific manager page if it exists
      } else {
        router.push("/dashboard");
      }

      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      alert("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center overflow-hidden relative p-4">

      {/* Background Red Accents - Hidden on mobile, visible on desktop */}
      <div className="hidden lg:block absolute top-[-10%] left-[-10%] w-[60%] h-[120%] bg-[#d9161a] rounded-full z-0">
        <div className="text-white flex flex-col items-center justify-center h-full">
          <img
            src="/naitounoi.png"
            alt="Logo"
            className="w-32 h-32 md:w-48 md:h-48 mb-4 brightness-0 invert"
          />
          <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter">Second-Hand Camera Shop Management System</h1>
        </div>
      </div>

      {/* Mobile Logo - Visible only on mobile */}
      <div className="lg:hidden absolute top-8 left-0 right-0 flex flex-col items-center z-10">
        <img
          src="/naitounoi.png"
          alt="Logo"
          className="w-20 h-20 mb-2"
        />
        <h1 className="text-2xl font-black italic tracking-tighter text-[#d9161a]">Second-Hand Camera Shop Management System</h1>
      </div>

      {/* Bottom Red Circles - Hidden on mobile */}
      <div className="hidden lg:block absolute bottom-[-10%] left-[-5%] w-[30%] h-[50%] bg-[#d9161a]/80 rounded-full z-0 blur-xl opacity-50" />
      <div className="hidden lg:block absolute bottom-[-20%] right-[-5%] w-[25%] h-[40%] bg-[#d9161a] rounded-full z-0" />

      <div className="w-full max-w-7xl mx-auto flex justify-center lg:justify-end px-4 md:px-12 relative z-10 mt-32 lg:mt-0">

        {/* Login Card */}
        <Card className="w-full max-w-[450px] shadow-2xl border-none p-2 md:p-4" radius="lg">
          <CardBody className="space-y-6 md:space-y-8 p-6 md:p-8">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">เข้าสู่ระบบ</h2>
              <p className="text-xs md:text-sm text-gray-400 font-medium">กรุณากรอกอีเมลและรหัสผ่าน</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">อีเมล</label>
                  <Input
                    type="email"
                    placeholder="ใส่ชื่ออีเมล"
                    variant="bordered"
                    classNames={{
                      inputWrapper: "border-gray-200 h-11 md:h-12",
                    }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">รหัสผ่าน</label>
                  <Input
                    type={isVisible ? "text" : "password"}
                    placeholder="รหัสผ่าน"
                    variant="bordered"
                    classNames={{
                      inputWrapper: "border-gray-200 h-11 md:h-12",
                    }}
                    endContent={
                      <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                        {isVisible ? (
                          <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <Eye className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Link
                  href="/forget-your-password"
                  className="text-[10px] text-gray-400 font-bold hover:underline"
                >
                  ลืมรหัสผ่าน?
                </Link>
              </div>

              <Button
                type="submit"
                color="danger"
                className="w-full bg-[#d01317] text-white font-bold h-11 md:h-12 text-base md:text-lg shadow-lg"
                isLoading={loading}
              >
                เข้าสู่ระบบ
              </Button>

              <div className="text-center pt-3 md:pt-4">
                <p className="text-xs md:text-sm text-gray-500">
                  ยังไม่มีบัญชี?{" "}
                  <Link
                    href="/register"
                    className="text-[#d01317] font-bold hover:underline inline-flex items-center gap-1"
                  >
                    สมัครสมาชิกที่นี่ <UserPlus size={16} />
                  </Link>
                </p>
              </div>
            </form>
          </CardBody>
        </Card>

      </div>
    </div>
  );
}