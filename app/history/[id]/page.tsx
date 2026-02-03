"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    FileText,
    Package,
    Clock,
    User,
    Camera,
    Tag,
    Edit3,
    Save,
    ImageOff
} from "lucide-react";
import {
    Button,
    Card,
    CardBody,
    Chip,
    Divider,
    Spinner,
    Image,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Input,
    Select,
    SelectItem
} from "@heroui/react";
import axios from "axios";
import { exportProductPDF } from "@/lib/export/exportPDF";
import toast from "react-hot-toast";

export default function HistoryDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    // Edit state
    const [editData, setEditData] = useState<any>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchDetail();
    }, [id]);

    const fetchDetail = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/consignments/items/${id}`);
            setData(res.data);
            setEditData(res.data);
        } catch (error) {
            console.error("Fetch detail error:", error);
            toast.error("ไม่สามารถโหลดข้อมูลได้");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await axios.patch(`/api/consignments/items/${id}`, editData);
            toast.success("บันทึกการแก้ไขเรียบร้อยแล้ว");
            onOpenChange();
            fetchDetail();
        } catch (error) {
            console.error("Update error:", error);
            toast.error("ไม่สามารถบันทึกข้อมูลได้");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Spinner size="lg" color="secondary" label="กำลังโหลดข้อมูล..." labelColor="secondary" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex flex-col h-[80vh] items-center justify-center space-y-4">
                <div className="p-6 bg-slate-50 rounded-full">
                    <Package size={64} className="text-slate-300" />
                </div>
                <h1 className="text-2xl font-black text-slate-800">ไม่พบรายละเอียดสินค้า</h1>
                <Button onPress={() => router.back()} variant="flat">กลับไปก่อนหน้า</Button>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8 bg-[#FAFBFC] min-h-screen">
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-6">
                        <Button
                            isIconOnly
                            variant="flat"
                            onPress={() => router.back()}
                            className="w-14 h-14 rounded-2xl bg-white border border-slate-200 text-slate-600 shadow-sm hover:scale-110 active:scale-90 transition-all"
                        >
                            <ArrowLeft size={24} />
                        </Button>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="w-8 h-1 bg-purple-600 rounded-full"></span>
                                <p className="text-sm font-black text-purple-600 uppercase tracking-widest">Detail View</p>
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">รายละเอียดสินค้า</h1>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="flat"
                            className="h-14 px-8 rounded-2xl bg-white text-slate-600 font-black border border-slate-200 hover:bg-slate-50 transition-all"
                            startContent={<Edit3 size={18} />}
                            onPress={onOpen}
                        >
                            แก้ไขข้อมูล
                        </Button>
                        <Button
                            className="h-14 px-8 rounded-2xl bg-red-50 text-red-600 font-black border border-red-100 hover:bg-red-100 hover:scale-105 active:scale-95 transition-all"
                            startContent={<FileText size={18} />}
                            onPress={async () => await exportProductPDF(data)}
                        >
                            Export PDF
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Side: Photo & Quick Status */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="
                            bg-white 
                            rounded-[2.5rem] 
                            shadow-[0_20px_60px_rgba(0,0,0,0.06)] 
                            hover:shadow-[0_40px_100px_rgba(0,0,0,0.1)] 
                            hover:-translate-y-2 
                            transition-all duration-700 
                            overflow-hidden 
                            group
                        ">
                            <div className="relative aspect-square bg-gradient-to-br from-slate-50 to-white/30">
                                {data.displayImage ? (
                                    <Image
                                        src={data.displayImage}
                                        alt={data.productName}
                                        className="w-full h-full object-contain p-10 transition-transform duration-1000 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                                        <Camera size={80} strokeWidth={1} />
                                    </div>
                                )}

                                <div className="absolute top-6 right-6">
                                    <Chip
                                        color={
                                            data.status === "ready" ? "success" :
                                                data.status === "reserved" ? "warning" :
                                                    data.status === "repair" ? "primary" : "danger"
                                        }
                                        className="
                                            font-black 
                                            px-5 
                                            h-10 
                                            uppercase 
                                            backdrop-blur-xl 
                                            bg-white/70 
                                            border border-white/50 
                                            shadow-2xl 
                                            text-xs
                                        "
                                    >
                                        {data.status === 'ready' ? 'พร้อมขาย' :
                                            data.status === 'reserved' ? 'ติดจอง' :
                                                data.status === 'repair' ? 'ส่งซ่อม' :
                                                    data.status === 'sold' ? 'ขายแล้ว' : data.status}
                                    </Chip>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.06)] hover:shadow-[0_40px_100px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-700 p-8 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                                    <User size={24} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">ผู้บันทึกข้อมูล</p>
                                    <p className="text-base font-black text-slate-800">{data.user?.name || "ระบบอัตโนมัติ"}</p>
                                </div>
                            </div>
                            <div className="h-px bg-slate-50" />
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                                    <Clock size={24} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">วันที่ลงระบบ</p>
                                    <p className="text-base font-black text-slate-800">{new Date(data.date).toLocaleDateString("th-TH", { dateStyle: 'long' })}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Primary Info */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-white p-10 rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.06)] space-y-12 h-full">

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black tracking-widest uppercase">ID: {data.id?.slice(0, 8) || "N/A"}</span>
                                </div>
                                <h1 className="text-5xl font-black text-slate-900 leading-tight tracking-tight">{data.productName}</h1>
                                <div className="flex flex-wrap gap-3 mt-6">
                                    <Chip color="secondary" variant="flat" className="font-black px-4 h-9 text-xs" startContent={<Tag size={14} className="ml-1" />}>
                                        {data.category}
                                    </Chip>
                                    <Chip className="bg-blue-50 text-blue-600 font-black px-4 h-9 text-xs" startContent={<Package size={14} className="ml-1" />}>
                                        ล็อต: {data.lot}
                                    </Chip>
                                    <Chip
                                        variant="dot"
                                        color={data.repairStatus === "NOT_REPAIR" ? "default" : data.repairStatus === "REPAIRED" ? "success" : "warning"}
                                        className="font-black px-4 h-9 text-xs bg-slate-50/50"
                                    >
                                        สถานะการซ่อม: {
                                            data.repairStatus === "NOT_REPAIR" ? "ปกติ" :
                                                data.repairStatus === "REPAIRING" ? "กำลังซ่อม" :
                                                    data.repairStatus === "REPAIRED" ? "ซ่อมแล้ว" : data.repairStatus
                                        }
                                    </Chip>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="bg-gradient-to-br from-purple-50/50 to-blue-50/30 p-10 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white">
                                    <div className="text-xs font-black text-purple-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
                                        ราคาที่ตกลง (Confirmed Price)
                                    </div>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-5xl font-black text-purple-600 tracking-tighter">฿{data.confirmedPrice?.toLocaleString()}</span>
                                        <span className="text-slate-400 font-black text-lg">บาท</span>
                                    </div>
                                </div>

                                <div className="bg-slate-50/30 p-10 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">ชื่อผู้ฝากขาย (Consignor)</p>
                                    <p className="text-3xl font-black text-slate-800 flex items-center gap-3">
                                        <User className="text-slate-300" size={28} />
                                        {data.consignorName}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <h4 className="font-black text-slate-800 text-xl tracking-tight">ข้อมูลทางเทคนิค (Specifications)</h4>
                                    <div className="h-0.5 flex-1 bg-gradient-to-r from-slate-100 to-transparent"></div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                                    <div className="p-6 bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 border border-transparent hover:border-slate-50">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-slate-50 text-slate-400 rounded-xl">
                                                <ImageOff size={18} />
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">ปีผลิต/สภาพ</p>
                                        </div>
                                        <p className="text-lg font-black text-slate-700 ml-1">{data.year || "-"}</p>
                                    </div>
                                    {/* Add more spec items here if needed in the future */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Modal */}
                <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" backdrop="opaque">
                    <ModalContent className="rounded-[2.5rem] p-4 bg-white shadow-2xl">
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1 border-b border-slate-200 pb-4">
                                    <h3 className="text-2xl font-black text-slate-900">แก้ไขข้อมูลสินค้า</h3>
                                </ModalHeader>
                                <ModalBody className="space-y-4">
                                    <Input
                                        labelPlacement="outside"
                                        value={editData.productName}
                                        onChange={(e) => setEditData({ ...editData, productName: e.target.value })}
                                        variant="bordered"
                                        placeholder="ชื่อสินค้า: ระบุชื่อรุ่น / แบรนด์"
                                        classNames={{
                                            input: "font-bold text-slate-700",
                                            inputWrapper: "h-12 rounded-xl bg-slate-50/50 border-slate-200"
                                        }}
                                    />
                                    <div className="grid grid-cols-2 gap-6 pt-2">
                                        <Select
                                            labelPlacement="outside"
                                            placeholder="หมวดหมู่: เลือกหมวดหมู่"
                                            selectedKeys={editData.category ? [editData.category] : []}
                                            onSelectionChange={(keys) => setEditData({ ...editData, category: Array.from(keys)[0] })}
                                            variant="bordered"
                                            classNames={{
                                                value: "font-bold text-slate-700",
                                                trigger: "h-12 rounded-xl bg-slate-50/50 border-slate-200"
                                            }}
                                        >
                                            <SelectItem key="กล้อง" className="bg-white">กล้อง</SelectItem>
                                            <SelectItem key="เลนส์" className="bg-white">เลนส์</SelectItem>
                                            <SelectItem key="ขาตั้งกล้อง" className="bg-white">ขาตั้งกล้อง</SelectItem>
                                            <SelectItem key="แบต" className="bg-white">แบต</SelectItem>
                                            <SelectItem key="ฟิลม์" className="bg-white">ฟิลม์</SelectItem>
                                            <SelectItem key="อื่นๆ" className="bg-white">อื่นๆ</SelectItem>
                                        </Select>
                                        <Input
                                            labelPlacement="outside"
                                            placeholder="ปีที่ผลิต / สภาพ"
                                            value={editData.year}
                                            onChange={(e) => setEditData({ ...editData, year: e.target.value })}
                                            variant="bordered"
                                            classNames={{
                                                input: "font-bold text-slate-700",
                                                inputWrapper: "h-12 rounded-xl bg-slate-50/50 border-slate-200"
                                            }}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6 pt-2">
                                        <Select
                                            labelPlacement="outside"
                                            placeholder="สถานะสินค้า"
                                            selectedKeys={editData.status ? [editData.status] : []}
                                            onSelectionChange={(keys) => setEditData({ ...editData, status: Array.from(keys)[0] })}
                                            variant="bordered"
                                            classNames={{
                                                value: "font-bold text-slate-700",
                                                trigger: "h-12 rounded-xl bg-slate-50/50 border-slate-200"
                                            }}
                                        >
                                            <SelectItem key="ready" className="bg-white">พร้อมขาย</SelectItem>
                                            <SelectItem key="reserved" className="bg-white">ติดจอง</SelectItem>
                                            <SelectItem key="sold" className="bg-white">ขายแล้ว</SelectItem>
                                            <SelectItem key="repair" className="bg-white">ส่งซ่อม</SelectItem>
                                        </Select>
                                        <Select
                                            labelPlacement="outside"
                                            placeholder="สถานะการซ่อม"
                                            selectedKeys={editData.repairStatus ? [editData.repairStatus] : []}
                                            onSelectionChange={(keys) => setEditData({ ...editData, repairStatus: Array.from(keys)[0] })}
                                            variant="bordered"
                                            classNames={{
                                                value: "font-bold text-slate-700",
                                                trigger: "h-12 rounded-xl bg-slate-50/50 border-slate-200"
                                            }}
                                        >
                                            <SelectItem key="NOT_REPAIR" className="bg-white">ไม่ซ่อม</SelectItem>
                                            <SelectItem key="REPAIRING" className="bg-white">กำลังซ่อม</SelectItem>
                                            <SelectItem key="REPAIRED" className="bg-white">ซ่อมเสร็จแล้ว</SelectItem>
                                        </Select>
                                    </div>
                                    <div className="pt-2">
                                        <Input
                                            labelPlacement="outside"
                                            placeholder="ราคาประกัน / ราคาทุน"
                                            type="number"
                                            value={editData.confirmedPrice}
                                            onChange={(e) => setEditData({ ...editData, confirmedPrice: parseFloat(e.target.value) })}
                                            variant="bordered"
                                            startContent={<span className="text-slate-400 font-bold">฿</span>}
                                            classNames={{
                                                input: "font-bold text-slate-700",
                                                inputWrapper: "h-12 rounded-xl bg-slate-50/50 border-slate-200"
                                            }}
                                        />
                                    </div>
                                </ModalBody>
                                <ModalFooter className="border-t border-slate-200 pt-4">
                                    <Button variant="flat" onPress={onClose} className="rounded-2xl font-black">
                                        ยกเลิก
                                    </Button>
                                    <Button
                                        color="secondary"
                                        onPress={handleSave}
                                        isLoading={saving}
                                        className="rounded-2xl font-black px-8 shadow-xl shadow-purple-200"
                                        startContent={<Save size={18} />}
                                    >
                                        บันทึกการแก้ไข
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>

            </div>
        </div>
    );
}
