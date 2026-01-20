"use client";

import React, { useEffect, useState } from "react";
import {
    Card,
    CardBody,
    Input,
    Button,
    Spinner,
    Divider,
    Chip,
} from "@heroui/react";
import {
    Store,
    MapPin,
    Phone,
    Facebook,
    ShoppingBag,
    MessageCircle,
    Edit3,
    Save,
    X,
    Building2,
    Hash,
    MapPinned
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

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
            toast.error("โหลดข้อมูลร้านค้าล้มเหลว");
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
            toast.success("บันทึกข้อมูลเรียบร้อยแล้ว");
        } catch (error) {
            console.error("Save profile error:", error);
            toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <Spinner size="lg" color="danger" />
                <p className="text-gray-500 font-medium animate-pulse">กำลังโหลดข้อมูลร้านค้า...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Chip variant="flat" color="danger" size="sm" className="font-bold uppercase tracking-wider px-2">
                            Shop Settings
                        </Chip>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <Store className="text-red-500" size={36} />
                        บัญชีร้านค้า
                    </h1>
                    <p className="text-gray-500 font-medium">จัดการข้อมูลพื้นฐานและการติดต่อสื่อสารของร้านค้าคุณ</p>
                </div>

                <div className="flex gap-3">
                    {!isEditing ? (
                        <Button
                            size="lg"
                            radius="full"
                            color="danger"
                            variant="shadow"
                            startContent={<Edit3 size={20} />}
                            onClick={() => setIsEditing(true)}
                            className="font-bold px-8 bg-red-600 shadow-red-200"
                        >
                            แก้ไขข้อมูลร้าน
                        </Button>
                    ) : (
                        <div className="flex gap-3">
                            <Button
                                size="lg"
                                radius="full"
                                variant="flat"
                                startContent={<X size={20} />}
                                onClick={() => {
                                    setIsEditing(false);
                                    setFormData(profile);
                                }}
                                className="font-bold px-6"
                            >
                                ยกเลิก
                            </Button>
                            <Button
                                size="lg"
                                radius="full"
                                color="danger"
                                startContent={<Save size={20} />}
                                onClick={handleSave}
                                isLoading={saving}
                                className="font-bold px-8 bg-red-600 shadow-xl shadow-red-200"
                            >
                                บันทึกการเปลี่ยนแปลง
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Essential Info */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="bg-white border-none shadow-xl shadow-gray-200/50 rounded-[2.5rem] overflow-hidden">
                        <CardBody className="p-8 md:p-12">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                                    <Building2 size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900">ข้อมูลพื้นฐาน</h3>
                                    <p className="text-sm text-gray-400 font-medium">ชื่อและที่อยู่สำนักงานใหญ่</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="md:col-span-2">
                                    <DetailField
                                        label="ชื่อร้านค้า"
                                        value={profile.shopName}
                                        isEditing={isEditing}
                                        icon={<Store size={18} />}
                                        editValue={formData.shopName}
                                        onValueChange={(v: string) => setFormData({ ...formData, shopName: v })}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <DetailField
                                        label="ที่อยู่"
                                        value={profile.address}
                                        isEditing={isEditing}
                                        icon={<MapPin size={18} />}
                                        editValue={formData.address}
                                        onValueChange={(v: string) => setFormData({ ...formData, address: v })}
                                    />
                                </div>
                                <DetailField
                                    label="ตำบล / แขวง"
                                    value={profile.subDistrict}
                                    isEditing={isEditing}
                                    icon={<MapPinned size={18} />}
                                    editValue={formData.subDistrict}
                                    onValueChange={(v: string) => setFormData({ ...formData, subDistrict: v })}
                                />
                                <DetailField
                                    label="อำเภอ / เขต"
                                    value={profile.district}
                                    isEditing={isEditing}
                                    icon={<MapPinned size={18} />}
                                    editValue={formData.district}
                                    onValueChange={(v: string) => setFormData({ ...formData, district: v })}
                                />
                                <DetailField
                                    label="จังหวัด"
                                    value={profile.province}
                                    isEditing={isEditing}
                                    icon={<Building2 size={18} />}
                                    editValue={formData.province}
                                    onValueChange={(v: string) => setFormData({ ...formData, province: v })}
                                />
                                <DetailField
                                    label="รหัสไปรษณีย์"
                                    value={profile.zipCode}
                                    isEditing={isEditing}
                                    icon={<Hash size={18} />}
                                    editValue={formData.zipCode}
                                    onValueChange={(v: string) => setFormData({ ...formData, zipCode: v })}
                                />
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Right Column: Contact & Social */}
                <div className="space-y-8">
                    <Card className="bg-white border-none shadow-xl shadow-gray-200/50 rounded-[2.5rem] overflow-hidden">
                        <CardBody className="p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-gray-900">ช่องทางการติดต่อ</h3>
                                    <p className="text-xs text-gray-400 font-medium">โซเชียลมีเดียและเบอร์โทร</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <ContactField
                                    icon={<MessageCircle size={20} className="text-green-500" />}
                                    label="Line Official"
                                    value={profile.line}
                                    isEditing={isEditing}
                                    editValue={formData.line}
                                    onValueChange={(v: string) => setFormData({ ...formData, line: v })}
                                    color="success"
                                />
                                <ContactField
                                    icon={<ShoppingBag size={20} className="text-orange-500" />}
                                    label="Shopee Store"
                                    value={profile.shopee}
                                    isEditing={isEditing}
                                    editValue={formData.shopee}
                                    onValueChange={(v: string) => setFormData({ ...formData, shopee: v })}
                                    color="warning"
                                />
                                <ContactField
                                    icon={<Facebook size={20} className="text-blue-600" />}
                                    label="Facebook Page"
                                    value={profile.facebook}
                                    isEditing={isEditing}
                                    editValue={formData.facebook}
                                    onValueChange={(v: string) => setFormData({ ...formData, facebook: v })}
                                    color="primary"
                                />
                                <ContactField
                                    icon={<Phone size={20} className="text-gray-700" />}
                                    label="เบอร์โทรศัพท์"
                                    value={profile.phone}
                                    isEditing={isEditing}
                                    editValue={formData.phone}
                                    onValueChange={(v: string) => setFormData({ ...formData, phone: v })}
                                    color="default"
                                />
                            </div>
                        </CardBody>
                    </Card>

                    {/* Quick Tips or Stats Card */}
                    <Card className="bg-gradient-to-br from-red-500 to-red-600 border-none shadow-xl shadow-red-200 rounded-[2.5rem] overflow-hidden text-white">
                        <CardBody className="p-8 relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Store size={120} />
                            </div>
                            <h4 className="text-lg font-black mb-2">คำแนะนำ</h4>
                            <p className="text-sm opacity-90 leading-relaxed">
                                ข้อมูลร้านค้าจะถูกนำไปใช้ในหน้าออกบิลและรายงานต่างๆ กรุณาระบุข้อมูลให้ถูกต้องครบถ้วนเพื่อความเป็นมืออาชีพของร้านคุณ
                            </p>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}

interface DetailFieldProps {
    label: string;
    value: string;
    isEditing: boolean;
    icon: React.ReactNode;
    editValue: string;
    onValueChange: (v: string) => void;
}

// Sub-components for better organization
function DetailField({ label, value, isEditing, icon, editValue, onValueChange }: DetailFieldProps) {
    return (
        <div className="space-y-2 group">
            <div className="flex items-center gap-2 text-gray-400 group-hover:text-red-500 transition-colors">
                {icon}
                <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
            </div>
            {isEditing ? (
                <Input
                    variant="flat"
                    radius="lg"
                    size="lg"
                    value={editValue || ""}
                    onValueChange={onValueChange}
                    className="max-w-full"
                    classNames={{
                        inputWrapper: "bg-gray-50 group-hover:bg-gray-100 transition-all border-none h-14"
                    }}
                />
            ) : (
                <div className="h-14 flex items-center px-4 bg-gray-50/50 rounded-2xl border border-gray-50 group-hover:border-red-100 transition-all">
                    <p className="text-gray-900 font-bold text-lg">{value || "-"}</p>
                </div>
            )}
        </div>
    );
}

interface ContactFieldProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    isEditing: boolean;
    editValue: string;
    onValueChange: (v: string) => void;
    color: string;
}

function ContactField({ icon, label, value, isEditing, editValue, onValueChange, color }: ContactFieldProps) {
    return (
        <Card className="bg-gray-50/50 border border-gray-100 shadow-none rounded-2xl overflow-hidden group hover:border-blue-100 transition-all">
            <CardBody className="p-4">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        {icon}
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</span>
                    </div>
                    {isEditing ? (
                        <Input
                            variant="flat"
                            size="sm"
                            radius="lg"
                            value={editValue || ""}
                            onValueChange={onValueChange}
                            classNames={{
                                inputWrapper: "bg-white border-none shadow-sm"
                            }}
                        />
                    ) : (
                        <p className="font-bold text-gray-800 text-sm truncate px-1">
                            {value || "ไม่ระบุข้อมูล"}
                        </p>
                    )}
                </div>
            </CardBody>
        </Card>
    );
}