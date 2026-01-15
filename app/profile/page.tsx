'use client';
import { useState, useEffect } from "react";
import ProFile from "@/components/profile/ProFile";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Lock, Bell, User as UserIcon } from "lucide-react";
import { Card } from "@heroui/react";

export default function ProfilePage() {
    const [activeItem, setActiveItem] = useState("profile");
    const [userData, setUserData] = useState({
        id: "",
        name: "",
        username: "",
        email: "",
        image: ""
    });
    // ข้อมูลในฟอร์มแก้ไข
    const [tempData, setTempData] = useState({ ...userData });

    // ดึงข้อมูลจริงจาก API (จำลอง)
    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                const response = await fetch("/api/user/profile");
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                    setTempData(data); // ซิงค์ข้อมูลเข้าฟอร์ม
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        loadUserProfile();
    }, []);

    // 2. ฟังก์ชันบันทึกข้อมูล
    const handleSave = async () => {
        try {
            const res = await fetch("/api/user/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: userData.id,
                    name: tempData.name,
                    username: tempData.username,
                    email: tempData.email,
                    image: userData.image, 
                })
            });

            const data = await res.json();
            
            if (res.ok) {
                setUserData(data); // Sync displayed data with response
                 // Also update tempData to match what was saved (in case of partial updates or sanitization)
                setTempData({
                    id: data.id,
                    name: data.name,
                    username: data.username || "",
                    email: data.email,
                    image: data.image || ""
                });
                alert("บันทึกสำเร็จ!");
            } else {
                console.error("Save failed:", data);
                alert(`เกิดข้อผิดพลาด: ${data.message || data.error || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Network error:", error);
            alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
        }
    };

    const handleCancel = () => {
        setTempData({ ...userData }); // รีเซ็ตฟอร์มกลับเป็นค่าล่าสุดที่ดึงมาจาก DB
    };

    return (
        <div className="min-h-screen bg-[#F8F9FC] font-sans text-gray-900">
            <div className="max-w-7xl mx-auto flex gap-6 p-4 md:p-6">
                <div className="hidden md:block md:sticky md:top-6 md:h-[calc(100vh-3rem)]">
                    <Sidebar />
                </div>

                <main className="flex-1">
                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-900">การตั้งค่าบัญชี</h1>
                    </div>

                    {activeItem === "profile" && (
                        <ProFile
                            userData={userData}
                            setUserData={setUserData}
                            tempData={tempData}
                            setTempData={setTempData}
                            handleSave={handleSave}
                            handleCancel={handleCancel}
                        />
                    )}

                    {activeItem === "password" && (
                        <Card className="p-12 text-center bg-white shadow-sm border-none">
                            <Lock size={48} className="mx-auto mb-4 text-blue-500 opacity-20" />
                            <h3 className="font-bold text-xl text-gray-400">ระบบเปลี่ยนรหัสผ่าน</h3>
                        </Card>
                    )}
                </main>
            </div>
        </div>
    );
}