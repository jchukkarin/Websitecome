'use client';
import { Dispatch, SetStateAction, useRef } from "react";
import { Avatar, Button, Input, Card, CardBody } from "@heroui/react";
import { Camera, Mail, User as UserIcon, Trash2 } from "lucide-react";

// กำหนด Interface ให้ถูกต้องเพื่อแก้ปัญหา ts(2322)
interface UserDataType {
    id: string;
    name: string;
    username: string;
    email: string;
    image: string;
}

interface ProFileProps {
    userData: UserDataType;
    setUserData: Dispatch<SetStateAction<UserDataType>>;
    tempData: UserDataType;
    setTempData: Dispatch<SetStateAction<UserDataType>>;
    handleSave: () => void;
    handleCancel: () => void;
}

export default function ProFile({

    userData,
    setUserData,
    tempData,
    setTempData,
    handleSave,
    handleCancel
}: ProFileProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const newImageUrl = event.target?.result as string;
                setUserData(prev => ({ ...prev, image: newImageUrl }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setUserData(prev => ({ ...prev, image: "" }));
    };

    return (
        <div className="space-y-6">
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
                            <h3 className="text-xl font-bold text-gray-800">{userData.name}</h3>
                            <p className="text-sm text-gray-400 mb-4">@{userData.username}</p>
                            <div className="flex gap-2 justify-center sm:justify-start">
                                <Button size="sm" color="primary" variant="flat" className="font-bold" onClick={() => fileInputRef.current?.click()}>เปลี่ยนรูปโปรไฟล์</Button>
                                <Button size="sm" color="danger" variant="light" className="font-bold" startContent={<Trash2 size={14} />} onClick={handleRemoveImage}>ลบรูป</Button>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Form Section */}
            <Card className="border-none shadow-sm bg-white animate-in fade-in slide-in-from-bottom-2 duration-300">
                <CardBody className="p-8 md:p-10 space-y-10">
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Input
                                label="ชื่อ-นามสกุล"
                                value={tempData.name}
                                onValueChange={(val) => setTempData({ ...tempData, name: val })}
                                variant="bordered" labelPlacement="outside"
                                startContent={<UserIcon size={18} className="text-gray-400 mt-20 mr-4" />}
                                classNames={{ label: "text-gray-500 font-semibold mb-2", inputWrapper: "h-12 border-gray-200", input: "border-2 border-gray-400 rounded m mt-20" }}
                            />
                            <Input
                                label="ชื่อผู้ใช้"
                                value={tempData.username}
                                onValueChange={(val) => setTempData({ ...tempData, username: val })}
                                variant="bordered" labelPlacement="outside"
                                startContent={<span className="text-gray-400 mt-20 mr-4">@</span>}
                                classNames={{ label: "text-gray-500 font-semibold mb-2", inputWrapper: "h-12 border-gray-200", input: "border-2 border-gray-400 rounded m mt-20" }}
                            />
                        </div>
                        <Input
                            label="อีเมล"
                            value={tempData.email}
                            onValueChange={(val) => setTempData({ ...tempData, email: val })}
                            variant="bordered" labelPlacement="outside"
                            startContent={<Mail size={18} className="text-gray-400 mt-20 mr-4" />}
                            classNames={{ label: "text-gray-500 font-semibold mb-2", inputWrapper: "h-12 border-gray-200", input: "border-2 border-gray-400 rounded m mt-20" }}
                        />
                    </div>

                    <div className="pt-8 border-t flex justify-end gap-4">
                        <Button variant="light" className="font-bold rounded-full px-12 bg-gray-100 text-gray-600" onClick={handleCancel}>
                            ยกเลิก
                        </Button>
                        <Button color="primary" className="font-bold rounded-full px-12 bg-green-600 text-white shadow-lg shadow-green-100" onClick={handleSave}>
                            บันทึกการเปลี่ยนแปลง
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}