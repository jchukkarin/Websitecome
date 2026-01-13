'use client';
import { useState, useRef } from "react";
import { Avatar, Button, Input, Card, CardBody } from "@heroui/react";
import { Camera, Mail, User as UserIcon, Lock, Bell, ShieldCheck, Trash2 } from "lucide-react";
import Link from "next/link";

// --- ส่วนของ SidebarItem ---
function SidebarItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
    return (
        <button onClick={onClick} className="w-full text-left">
            <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${active ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}>
                {icon}
                <span className="text-sm font-bold">{label}</span>
            </div>
        </button>
    );
}

export default function ProfilePage() {
    // 1. State สำหรับจัดการข้อมูลผู้ใช้ (ชื่อ และ รูปภาพ)
    const [userData, setUserData] = useState({
        name: "Junior Garcia",
        username: "jrgarciadev",
        email: "junior@example.com",
        image: "https://avatars.githubusercontent.com/u/30373425?v=4"
    });

    // State สำรองสำหรับเก็บค่าใน Input ก่อนกดบันทึก
    const [tempName, setTempName] = useState(userData.name);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ฟังก์ชันเลือกรูปใหม่
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setUserData({...userData, image: e.target?.result as string});
            reader.readAsDataURL(file);
        }
    };

    // ฟังก์ชันบันทึกข้อมูล
    const handleSave = () => {
        setUserData({ ...userData, name: tempName });
        // ตรงนี้ในอนาคตคุณสามารถเพิ่มคำสั่งส่งข้อมูลไป Backend API ได้
        alert("บันทึกข้อมูลเรียบร้อยแล้ว!");
    };

    return (
        <div className="min-h-screen bg-[#F8F9FC] p-4 md:p-10 font-sans tracking-tight">
            <div className="max-w-5xl mx-auto">
                
                {/* Header */}
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-3xl font-extrabold text-gray-900">การตั้งค่าบัญชี</h1>
                    <p className="text-gray-500 mt-1">จัดการข้อมูลของคุณให้เป็นปัจจุบัน</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Sidebar */}
                    <aside className="md:col-span-3 space-y-2">
                        <nav className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0">
                            <SidebarItem icon={<UserIcon size={18} />} label="ข้อมูลส่วนตัว" active />
                            <SidebarItem icon={<Lock size={18} />} label="รหัสผ่าน" />
                            <SidebarItem icon={<Bell size={18} />} label="การแจ้งเตือน" />
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <div className="md:col-span-9 space-y-6">
                        
                        {/* Avatar Section */}
                        <Card className="border-none shadow-sm bg-white">
                            <CardBody className="p-8">
                                <div className="flex flex-col sm:flex-row items-center gap-8">
                                    <div className="relative">
                                        <Avatar src={userData.image} className="w-28 h-28 text-large ring-4 ring-white shadow-xl" isBordered color="primary" />
                                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                                        <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-1 right-1 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-lg transition-transform hover:scale-110">
                                            <Camera size={16} />
                                        </button>
                                    </div>
                                    <div className="flex-1 text-center sm:text-left">
                                        {/* ชื่อตรงนี้จะเปลี่ยนตาม userData */}
                                        <h3 className="text-xl font-bold text-gray-800">{userData.name}</h3>
                                        <p className="text-sm text-gray-400 mb-4">@{userData.username}</p>
                                        <Button size="sm" color="primary" variant="flat" onClick={() => fileInputRef.current?.click()}>เปลี่ยนรูปโปรไฟล์</Button>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Personal Info Form */}
                        <Card className="border-none shadow-sm bg-white">
                            <CardBody className="p-8 md:p-10 space-y-10">
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <Input 
                                            label="ชื่อ-นามสกุล" 
                                            value={tempName} 
                                            onValueChange={setTempName}
                                            variant="bordered" 
                                            labelPlacement="outside"
                                            classNames={{ label: "text-gray-700 font-bold mb-2", inputWrapper: "h-12 border-gray-200", input: "mt-16" }}
                                        />
                                        <Input 
                                            label="ชื่อผู้ใช้" 
                                            defaultValue={userData.username} 
                                            variant="bordered" 
                                            labelPlacement="outside" 
                                            startContent={<span className="text-gray-400 mt-16">@</span>}
                                            classNames={{ label: "text-gray-700 font-bold mb-2", inputWrapper: "h-12 border-gray-200", input: "mt-16" }}
                                        />
                                    </div>
                                    <Input 
                                        label="อีเมล" 
                                        defaultValue={userData.email} 
                                        variant="bordered" 
                                        labelPlacement="outside" 
                                        startContent={<Mail size={18} className="text-gray-400 mt-16" />}
                                        classNames={{ label: "text-gray-700 font-bold mb-2", inputWrapper: "h-12 border-gray-200", input: "mt-16" }}
                                    />
                                </div>

                                <div className="pt-8 border-t flex justify-end gap-4">
                                    <Button variant="light" onClick={() => setTempName(userData.name)}>ยกเลิก</Button>
                                    <Button color="primary" className="font-bold px-12" onClick={handleSave}>
                                        บันทึกการเปลี่ยนแปลง
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}