"use client";

import React, { useEffect, useState } from "react";
import {
    Card,
    CardBody,
    Input,
    Button,
    Spinner,
} from "@heroui/react";
import {
    UserCircle,
    LogOut,
    Edit3,
    Save,
    X,
    Phone,
    Facebook,
    ShoppingBag,
    MessageCircle
} from "lucide-react";
import axios from "axios";

export default function SetUpFormProFileShop() {
    const [profile, setProfile] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/shop-profile");
            setProfile(res.data);
            setFormData(res.data);
        } catch (error) {
            console.error("Fetch profile error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await axios.post("/api/shop-profile", formData);
            setProfile(res.data);
            setIsEditing(false);
        } catch (error) {
            console.error("Save profile error:", error);
            alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Spinner label="กำลังโหลดข้อมูลร้านค้า..." />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                    <p className="text-xs text-blue-600 font-semibold tracking-wider uppercase">การตั้งค่าข้อมูลร้านค้า</p>
                    <h1 className="text-3xl font-bold text-gray-900">บัญชีร้านค้า</h1>
                    <p className="text-sm text-gray-500">แสดงข้อมูลของร้านค้า</p>
                </div>
                <div className="flex gap-2">
                    <Button isIconOnly variant="light" radius="full" size="sm">
                        <UserCircle size={24} className="text-gray-400" />
                    </Button>
                    <Button isIconOnly variant="light" radius="full" size="sm">
                        <LogOut size={24} className="text-gray-400" />
                    </Button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="space-y-8">
                {/* Shop Details Card */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-800">รายละเอียดร้านค้า</h3>
                        {!isEditing ? (
                            <Button
                                variant="light"
                                color="primary"
                                startContent={<Edit3 size={18} />}
                                onClick={() => setIsEditing(true)}
                                className="font-bold"
                            >
                                แก้ไขข้อมูล
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button
                                    variant="flat"
                                    color="danger"
                                    startContent={<X size={18} />}
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData(profile);
                                    }}
                                >
                                    ยกเลิก
                                </Button>
                                <Button
                                    color="primary"
                                    startContent={<Save size={18} />}
                                    onClick={handleSave}
                                    isLoading={saving}
                                >
                                    บันทึก
                                </Button>
                            </div>
                        )}
                    </div>

                    <Card className="border-none shadow-sm" radius="lg">
                        <CardBody className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-gray-900 uppercase">ชื่อร้านค้า</p>
                                        {isEditing ? (
                                            <Input
                                                variant="bordered"
                                                value={formData.shopName}
                                                onValueChange={(v) => setFormData({ ...formData, shopName: v })}
                                            />
                                        ) : (
                                            <p className="text-sm text-gray-500">{profile.shopName}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-gray-900 uppercase">ที่อยู่</p>
                                        {isEditing ? (
                                            <Input
                                                variant="bordered"
                                                value={formData.address}
                                                onValueChange={(v) => setFormData({ ...formData, address: v })}
                                            />
                                        ) : (
                                            <p className="text-sm text-gray-500">{profile.address}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-gray-900 uppercase">ตำบล</p>
                                        {isEditing ? (
                                            <Input
                                                variant="bordered"
                                                value={formData.subDistrict}
                                                onValueChange={(v) => setFormData({ ...formData, subDistrict: v })}
                                            />
                                        ) : (
                                            <p className="text-sm text-gray-500">{profile.subDistrict}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-gray-900 uppercase">จังหวัด</p>
                                        {isEditing ? (
                                            <Input
                                                variant="bordered"
                                                value={formData.province}
                                                onValueChange={(v) => setFormData({ ...formData, province: v })}
                                            />
                                        ) : (
                                            <p className="text-sm text-gray-500">{profile.province}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-6 md:mt-auto">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-gray-900 uppercase">อำเภอ</p>
                                        {isEditing ? (
                                            <Input
                                                variant="bordered"
                                                value={formData.district}
                                                onValueChange={(v) => setFormData({ ...formData, district: v })}
                                            />
                                        ) : (
                                            <p className="text-sm text-gray-500">{profile.district}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-gray-900 uppercase">รหัสไปรษณีย์</p>
                                        {isEditing ? (
                                            <Input
                                                variant="bordered"
                                                value={formData.zipCode}
                                                onValueChange={(v) => setFormData({ ...formData, zipCode: v })}
                                            />
                                        ) : (
                                            <p className="text-sm text-gray-500">{profile.zipCode}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Contact Details Card */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800">รายละเอียดร้านค้า (ช่องทางติดต่อ)</h3>
                    <Card className="border-none shadow-sm" radius="lg">
                        <CardBody className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                <div className="space-y-2 flex flex-col items-center md:items-start">
                                    <div className="flex items-center gap-2">
                                        <MessageCircle size={18} className="text-green-500" />
                                        <p className="text-xs font-bold text-gray-900 uppercase">Line</p>
                                    </div>
                                    {isEditing ? (
                                        <Input
                                            variant="bordered" size="sm"
                                            value={formData.line || ""}
                                            onValueChange={(v) => setFormData({ ...formData, line: v })}
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-500">{profile.line || "-"}</p>
                                    )}
                                </div>

                                <div className="space-y-2 flex flex-col items-center md:items-start">
                                    <div className="flex items-center gap-2">
                                        <ShoppingBag size={18} className="text-orange-500" />
                                        <p className="text-xs font-bold text-gray-900 uppercase">Shopee</p>
                                    </div>
                                    {isEditing ? (
                                        <Input
                                            variant="bordered" size="sm"
                                            value={formData.shopee || ""}
                                            onValueChange={(v) => setFormData({ ...formData, shopee: v })}
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-500">{profile.shopee || "-"}</p>
                                    )}
                                </div>

                                <div className="space-y-2 flex flex-col items-center md:items-start">
                                    <div className="flex items-center gap-2">
                                        <Facebook size={18} className="text-blue-600" />
                                        <p className="text-xs font-bold text-gray-900 uppercase">Facebook</p>
                                    </div>
                                    {isEditing ? (
                                        <Input
                                            variant="bordered" size="sm"
                                            value={formData.facebook || ""}
                                            onValueChange={(v) => setFormData({ ...formData, facebook: v })}
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-500 truncate max-w-full">{profile.facebook || "-"}</p>
                                    )}
                                </div>

                                <div className="space-y-2 flex flex-col items-center md:items-start">
                                    <div className="flex items-center gap-2">
                                        <Phone size={18} className="text-gray-900" />
                                        <p className="text-xs font-bold text-gray-900 uppercase">Phone</p>
                                    </div>
                                    {isEditing ? (
                                        <Input
                                            variant="bordered" size="sm"
                                            value={formData.phone || ""}
                                            onValueChange={(v) => setFormData({ ...formData, phone: v })}
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-500">{profile.phone || "-"}</p>
                                    )}
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}