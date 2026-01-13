"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  Input,
  Button,
} from "@heroui/react";
import { Eye, EyeOff, UserPlus, ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen w-full bg-white flex items-center justify-center overflow-hidden relative">

      {/* Background Red Accents (Consistent with Login) */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[120%] bg-[#d9161a] rounded-full z-0 flex items-center justify-center">
        <div className="text-white flex flex-col items-center">
          <img
            src="/naitounoi.png"
            alt="Logo"
            className="w-48 h-48 mb-4 brightness-0 invert"
          />
          <h1 className="text-5xl font-black italic tracking-tighter">NAITOUNOI</h1>
          <p className="text-xl font-bold opacity-80 mt-2">JOIN OUR COMMUNITY</p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-[-5%] left-[-5%] w-[20%] h-[30%] bg-[#d9161a]/10 rounded-full z-0" />
      <div className="absolute bottom-[-10%] left-[5%] w-[25%] h-[40%] bg-[#d9161a] rounded-full z-0" />

      <div className="max-w-7xl mx-auto w-full flex justify-start px-12 relative z-10">

        {/* Register Card */}
        <Card className="w-full max-w-[450px] shadow-2xl border-none p-4" radius="lg">
          <CardBody className="space-y-8 p-8">
            <div className="space-y-2">
              <Link href="/login" className="text-[#d01317] flex items-center gap-2 text-xs font-bold hover:underline mb-4">
                <ArrowLeft size={14} /> กลับไปหน้าเข้าสู่ระบบ
              </Link>
              <h2 className="text-4xl font-bold text-gray-800">สร้างบัญชีใหม่</h2>
              <p className="text-sm text-gray-400 font-medium">กรอกข้อมูลเพื่อเริ่มต้นใช้งานระบบ</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">ชื่อ-นามสกุล</label>
                  <Input
                    placeholder="ระบุชื่อจริงของคุณ"
                    variant="bordered"
                    classNames={{
                      inputWrapper: "border-gray-200 h-12",
                    }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">อีเมล</label>
                  <Input
                    type="email"
                    placeholder="example@mail.com"
                    variant="bordered"
                    classNames={{
                      inputWrapper: "border-gray-200 h-12",
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
                    placeholder="ตั้งรหัสผ่านของคุณ"
                    variant="bordered"
                    classNames={{
                      inputWrapper: "border-gray-200 h-12",
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

              <Button
                type="submit"
                color="danger"
                className="w-full bg-[#d01317] text-white font-bold h-12 text-lg shadow-lg mt-4"
                isLoading={loading}
                startContent={<UserPlus size={20} />}
              >
                ลงทะเบียนใช้งาน
              </Button>
            </form>
          </CardBody>
        </Card>

      </div>
    </div>
  );
}
