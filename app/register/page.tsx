"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  Input,
  Button,
} from "@heroui/react";
import { Eye, EyeOff, UserPlus, ArrowLeft, Package } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("สมัครสมาชิกสำเร็จ!");
      router.push("/login");
    } catch (error) {
      console.error("Registration error:", error);
      alert("เกิดข้อผิดพลาดในการสมัครสมาชิก");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex overflow-hidden bg-slate-50">

      {/* Right Decoration Section (Desktop) - Swapped side for variety */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden order-2">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-slate-900 via-slate-900/90 to-red-900/40"></div>

        <div className="relative z-10 flex flex-col items-center text-center p-12 max-w-lg">
          <div className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-black/20 ring-1 ring-white/20 animate-in fade-in zoom-in duration-700">
            <Package size={64} className="text-white" />
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight mb-6 leading-tight">
            Join Our <br />
            <span className="text-red-500">Community</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium leading-relaxed">
            เริ่มต้นใช้งานระบบจัดการร้านกล้องมือสองที่มีประสิทธิภาพสูงสุด สมัครเลยวันนี้
          </p>
        </div>

        {/* Decorative Circles */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-red-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* Left Form Section - Order 1 */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative order-1">
        <div className="absolute top-0 left-0 p-8 hidden md:block">
          <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
              <ArrowLeft size={16} />
            </div>
            กลับไปหน้าเข้าสู่ระบบ
          </Link>
        </div>

        <div className="w-full max-w-[420px] space-y-10">
          <div className="text-center lg:text-left space-y-3">
            <div className="lg:hidden flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-200">
                <Package size={32} className="text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">สร้างบัญชีใหม่</h2>
            <p className="text-slate-500 font-medium">กรอกข้อมูลด้านล่างเพื่อลงทะเบียนเข้าใช้งาน</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <Input
                placeholder="ระบุชื่อจริงของคุณ"
                variant="flat"
                labelPlacement="outside"
                classNames={{
                  label: "font-bold text-slate-700 pb-1.5",
                  inputWrapper: "h-14 bg-white border border-slate-200 rounded-2xl focus-within:!border-red-500 focus-within:!bg-red-50/10 transition-all shadow-sm group-data-[hover=true]:bg-slate-50/50",
                  input: "font-medium text-slate-900 placeholder:text-slate-400"
                }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

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
                placeholder="ตั้งรหัสผ่านของคุณ"
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

            <Button
              type="submit"
              size="lg"
              className="w-full h-14 bg-red-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-red-200 hover:scale-[0.98] active:scale-95 transition-all"
              isLoading={loading}
              startContent={!loading && <UserPlus size={20} />}
            >
              ลงทะเบียนใช้งาน
            </Button>
          </form>

          <div className="lg:hidden text-center">
            <p className="text-sm font-medium text-slate-500">
              มีบัญชีอยู่แล้ว? <Link href="/login" className="text-slate-900 font-bold">เข้าสู่ระบบ</Link>
            </p>
          </div>

          <p className="text-center text-xs text-slate-400 font-medium px-8 leading-relaxed">
            โดยการสมัครสมาชิก คุณยอมรับ <a href="#" className="underline hover:text-slate-600">ข้อกำหนดการใช้งาน</a> และ <a href="#" className="underline hover:text-slate-600">นโยบายความเป็นส่วนตัว</a> ของเรา
          </p>
        </div>
      </div>
    </div>
  );
}
