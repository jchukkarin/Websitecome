"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Card,
    CardBody,
    Input,
    Button,
} from "@heroui/react";
import { Mail, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

export default function ForgetPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            // Placeholder for actual reset logic
            // const res = await fetch("/api/auth/forget-password", { ... });

            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

            setSubmitted(true);
        } catch (error) {
            console.error("Reset error:", error);
            alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full bg-white flex items-center justify-center overflow-hidden relative">

            {/* Background Red Accents (Consistent with Brand) */}
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[120%] bg-[#d9161a] rounded-full z-0 flex items-center justify-center">
                <div className="text-white flex flex-col items-center">
                    <img
                        src="/naitounoi.png"
                        alt="Logo"
                        className="w-48 h-48 mb-4 brightness-0 invert"
                    />
                    <h1 className="text-5xl font-black italic tracking-tighter">NAITOUNOI</h1>
                    <p className="text-xl font-bold opacity-80 mt-2 text-center">ACCOUNT RECOVERY</p>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[50%] bg-[#d9161a] rounded-full z-0 blur-xl opacity-20" />

            <div className="max-w-7xl mx-auto w-full flex justify-end px-12 relative z-10">

                {/* Forget Password Card */}
                <Card className="w-full max-w-[450px] shadow-2xl border-none p-4" radius="lg">
                    <CardBody className="space-y-8 p-8">
                        {!submitted ? (
                            <>
                                <div className="space-y-2">
                                    <Link href="/login" className="text-[#d01317] flex items-center gap-2 text-xs font-bold hover:underline mb-4">
                                        <ArrowLeft size={14} /> กลับไปหน้าเข้าสู่ระบบ
                                    </Link>
                                    <h2 className="text-4xl font-bold text-gray-800">ลืมรหัสผ่าน?</h2>
                                    <p className="text-sm text-gray-400 font-medium tracking-tight">ไม่ต้องกังวล! เพียงกรอกอีเมลที่คุณใช้สมัครสมาชิก เราจะส่งขั้นตอนการกู้คืนรหัสให้คุณครับ</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-gray-700">อีเมลที่ใช้สมัคร</label>
                                            <Input
                                                type="email"
                                                placeholder="example@mail.com"
                                                variant="bordered"
                                                startContent={<Mail size={18} className="text-gray-400" />}
                                                classNames={{
                                                    inputWrapper: "border-gray-200 h-12",
                                                }}
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        color="danger"
                                        className="w-full bg-[#d01317] text-white font-bold h-12 text-lg shadow-lg mt-4"
                                        isLoading={loading}
                                        startContent={!loading && <Send size={18} />}
                                    >
                                        ส่งลิงก์กู้คืนรหัสผ่าน
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-8 space-y-6">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Send size={40} />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-bold text-gray-800">ส่งอีเมลเรียบร้อย!</h2>
                                    <p className="text-sm text-gray-500 font-medium px-4">
                                        เราได้ส่งลิงก์กู้คืนรหัสผ่านไปที่ <span className="text-[#d01317] font-bold">{email}</span> แล้วครับ กรุณาตรวจสอบใน Inbox หรือ Junk mail ของคุณ
                                    </p>
                                </div>
                                <Link href="/login">
                                    <Button color="danger" variant="flat" className="mt-8 font-bold">
                                        <ArrowLeft size={18} className="mr-2" /> กลับไปหน้าเข้าสู่ระบบ
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardBody>
                </Card>

            </div>
        </div>
    );
}
