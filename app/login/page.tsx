"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  Input,
  Button,
  Link as HeroLink,
} from "@heroui/react";
import { Eye, EyeOff, UserPlus, Package } from "lucide-react";
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

      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const userRole = session?.user?.role;

      if (userRole === "MANAGER") {
        router.push("/dashboard");
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
    <div className="min-h-screen w-full flex overflow-hidden bg-slate-50">

      {/* Left Decoration Section (Desktop) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/90 to-red-900/40"></div>

        <div className="relative z-10 flex flex-col items-center text-center p-12 max-w-lg">
          <div className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-black/20 ring-1 ring-white/20">
            <Package size={64} className="text-white" />
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight mb-6 leading-tight">
            Second-Hand <br />
            <span className="text-red-500">Camera</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium leading-relaxed">
            ระบบจัดการร้านกล้องมือสองครบวงจร จัดการสินค้า
          </p>
          <h1 className="text-slate-400 text-lg font-medium leading-relaxed">สต็อก และยอดขายได้ง่ายๆ ในที่เดียว</h1>
        </div>

        {/* Decorative Circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        <div className="absolute top-0 right-0 p-8 hidden md:block">
          <Link href="/register" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2">
            ยังไม่มีบัญชี? <span className="text-red-600">สมัครสมาชิก</span>
          </Link>
        </div>

        <div className="w-full max-w-[420px] space-y-10">
          <div className="text-center lg:text-left space-y-3">
            <div className="lg:hidden flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-200">
                <Package size={32} className="text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">ยินดีต้อนรับกลับมา!</h2>
            <p className="text-slate-500 font-medium">กรุณาเข้าสู่ระบบเพื่อจัดการข้อมูลร้านค้าของคุณ</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <Input
                type="email"
                placeholder="กรอกอีเมลของคุณ"
                variant="flat"
                labelPlacement="outside"
                classNames={{
                  label: "font-bold text-slate-700 pb-1.5",
                  inputWrapper: "h-14 bg-white border border-slate-200 rounded-2xl focus-within:!border-red-500 focus-within:!bg-red-50/10 transition-all shadow-sm group-data-[hover=true]:bg-slate-50/50",
                  input: "font-medium text-slate-900 placeholder:text-slate-400"
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                type={isVisible ? "text" : "password"}
                placeholder="กรอกรหัสผ่านของคุณ"
                variant="flat"
                labelPlacement="outside"
                classNames={{
                  label: "font-bold text-slate-700 pb-1.5",
                  inputWrapper: "h-14 bg-white border border-slate-200 rounded-2xl focus-within:!border-red-500 focus-within:!bg-red-50/10 transition-all shadow-sm group-data-[hover=true]:bg-slate-50/50",
                  input: "font-medium text-slate-900 placeholder:text-slate-400"
                }}
                endContent={
                  <button className="focus:outline-none text-slate-400 hover:text-slate-600 transition-colors" type="button" onClick={toggleVisibility}>
                    {isVisible ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Checkbox could go here if needed */}
              </div>
              <Link
                href="/forget-your-password"
                className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors"
              >
                ลืมรหัสผ่าน?
              </Link>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full h-14 bg-slate-900 text-white font-black text-lg rounded-2xl shadow-xl shadow-slate-200 hover:scale-[0.98] active:scale-95 transition-all"
              isLoading={loading}
              startContent={!loading && <UserPlus size={20} className="opacity-50" />}
            >
              เข้าสู่ระบบ
            </Button>
          </form>

          <div className="lg:hidden text-center">
            <p className="text-sm font-medium text-slate-500">
              ยังไม่มีบัญชี? <Link href="/register" className="text-red-600 font-bold">สมัครสมาชิก</Link>
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-50 px-4 text-slate-400 font-bold tracking-wider">Secure System</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}