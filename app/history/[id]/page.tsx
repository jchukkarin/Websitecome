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
    Save
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
                            onPress={() => exportProductPDF(data)}
                        >
                            Export PDF
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Side: Photo & Quick Status */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white p-4 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden group">
                            <div className="aspect-square rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-100 relative">
                                {data.displayImage ? (
                                    <Image
                                        src={data.displayImage}
                                        alt={data.productName}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <Camera size={64} strokeWidth={1} />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 z-10">
                                    <Chip
                                        color={data.status === "ready" ? "success" : "warning"}
                                        variant="shadow"
                                        className="font-black px-4 h-8 uppercase"
                                    >
                                        {data.status}
                                    </Chip>
                                </div>
                            </div>
                        </div>

                        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                            <CardBody className="p-8 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Recorded By</p>
                                        <p className="text-sm font-black text-slate-700">{data.user?.name || "System"}</p>
                                    </div>
                                </div>
                                <Divider className="bg-slate-100" />
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Entry Date</p>
                                        <p className="text-sm font-black text-slate-700">{new Date(data.date).toLocaleDateString("th-TH", { dateStyle: 'long' })}</p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Right Side: Primary Info */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 space-y-10">

                            <div className="space-y-2">
                                <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">#{data.id?.slice(0, 8) || "N/A"}</p>
                                <h2 className="text-4xl font-black text-slate-900 leading-tight">{data.productName}</h2>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    <Chip color="secondary" variant="flat" className="font-black uppercase text-[10px]" startContent={<Tag size={12} className="ml-1" />}>
                                        {data.category}
                                    </Chip>
                                    <Chip className="bg-slate-100 text-slate-600 font-black uppercase text-[10px]" startContent={<Package size={12} className="ml-1" />}>
                                        Lot: {data.lot}
                                    </Chip>
                                    <Chip className="bg-orange-100 text-orange-600 font-black uppercase text-[10px]">
                                        Repair: {data.repairStatus}
                                    </Chip>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Confirmed Price</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-black text-purple-600">฿{data.confirmedPrice?.toLocaleString()}</span>
                                        <span className="text-slate-400 font-bold">THB</span>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Consignor Name</p>
                                    <p className="text-2xl font-black text-slate-800">{data.consignorName}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <h4 className="font-black text-slate-800 uppercase tracking-wider">Specifications</h4>
                                    <div className="h-px flex-1 bg-slate-100"></div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Condition/Year</p>
                                        <p className="font-bold text-slate-700">{data.year || "-"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Modal */}
                <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" backdrop="blur">
                    <ModalContent className="rounded-[2.5rem] p-4">
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">
                                    <h3 className="text-2xl font-black text-slate-900">แก้ไขข้อมูลสินค้า</h3>
                                </ModalHeader>
                                <ModalBody className="space-y-4">
                                    <Input
                                        label="ชื่อสินค้า"
                                        value={editData.productName}
                                        onChange={(e) => setEditData({ ...editData, productName: e.target.value })}
                                        variant="bordered"
                                        className="font-bold"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Select
                                            label="หมวดหมู่"
                                            selectedKeys={editData.category ? [editData.category] : []}
                                            onSelectionChange={(keys) => setEditData({ ...editData, category: Array.from(keys)[0] })}
                                            variant="bordered"
                                            className="font-bold"
                                        >
                                            <SelectItem key="กล้อง">กล้อง</SelectItem>
                                            <SelectItem key="เลนส์">เลนส์</SelectItem>
                                            <SelectItem key="ขาตั้งกล้อง">ขาตั้งกล้อง</SelectItem>
                                            <SelectItem key="แบต">แบต</SelectItem>
                                            <SelectItem key="ฟิลม์">ฟิลม์</SelectItem>
                                            <SelectItem key="อื่นๆ">อื่นๆ</SelectItem>
                                        </Select>
                                        <Input
                                            label="ปีที่ผลิต / สภาพ"
                                            value={editData.year}
                                            onChange={(e) => setEditData({ ...editData, year: e.target.value })}
                                            variant="bordered"
                                            className="font-bold"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Select
                                            label="สถานะสินค้า"
                                            selectedKeys={editData.status ? [editData.status] : []}
                                            onSelectionChange={(keys) => setEditData({ ...editData, status: Array.from(keys)[0] })}
                                            variant="bordered"
                                            className="font-bold"
                                        >
                                            <SelectItem key="ready">พร้อมขาย</SelectItem>
                                            <SelectItem key="reserved">ติดจอง</SelectItem>
                                            <SelectItem key="sold">ขายแล้ว</SelectItem>
                                            <SelectItem key="repair">ส่งซ่อม</SelectItem>
                                        </Select>
                                        <Select
                                            label="สถานะการซ่อม"
                                            selectedKeys={editData.repairStatus ? [editData.repairStatus] : []}
                                            onSelectionChange={(keys) => setEditData({ ...editData, repairStatus: Array.from(keys)[0] })}
                                            variant="bordered"
                                            className="font-bold"
                                        >
                                            <SelectItem key="NOT_REPAIR">ไม่ซ่อม</SelectItem>
                                            <SelectItem key="REPAIRING">กำลังซ่อม</SelectItem>
                                            <SelectItem key="REPAIRED">ซ่อมเสร็จแล้ว</SelectItem>
                                        </Select>
                                    </div>
                                    <Input
                                        label="ราคาประกัน / ราคาทุน"
                                        type="number"
                                        value={editData.confirmedPrice}
                                        onChange={(e) => setEditData({ ...editData, confirmedPrice: parseFloat(e.target.value) })}
                                        variant="bordered"
                                        className="font-bold"
                                        startContent={<span className="text-slate-400">฿</span>}
                                    />
                                </ModalBody>
                                <ModalFooter>
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
