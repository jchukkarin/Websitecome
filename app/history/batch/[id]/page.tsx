"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Button,
    Card,
    CardBody,
    Chip,
    Divider,
    Spinner,
    Image,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Input,
    Textarea
} from "@heroui/react";
import {
    ArrowLeft,
    FileText,
    Package,
    Clock,
    User,
    Calendar,
    Phone,
    MapPin,
    Eye,
    Edit3,
    Save
} from "lucide-react";
import axios from "axios";
import { exportConsignmentPDF } from "@/lib/export/exportPDF";
import toast from "react-hot-toast";

export default function BatchDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    // Edit state
    const [editData, setEditData] = useState<any>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchBatch();
    }, [id]);

    const fetchBatch = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/consignments/${id}`);
            setData(res.data);
            setEditData(res.data);
        } catch (error) {
            console.error("Fetch batch error:", error);
            toast.error("ไม่สามารถโหลดข้อมูลล็อตได้");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await axios.patch(`/api/consignments/${id}`, editData);
            toast.success("บันทึกการแก้ไขเรียบร้อยแล้ว");
            onOpenChange();
            fetchBatch();
        } catch (error) {
            console.error("Update error:", error);
            toast.error("ไม่สามารถบันทึกข้อมูลได้");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
                <Spinner size="lg" color="danger" />
                <p className="text-slate-500 font-bold animate-pulse">กำลังเรียกข้อมูลประวัติล็อต...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <h2 className="text-2xl font-black text-slate-900">ไม่พบข้อมูลล็อตนี้</h2>
                <Button onPress={() => router.back()} className="mt-4">ย้อนกลับ</Button>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8 bg-[#FAFBFC] min-h-screen">
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

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
                                <span className="w-8 h-1 bg-red-600 rounded-full"></span>
                                <p className="text-sm font-black text-red-600 uppercase tracking-widest">Batch Details</p>
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">รายละเอียดล็อต {data.lot}</h1>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="flat"
                            className="h-14 px-8 rounded-2xl bg-white text-slate-600 font-black border border-slate-200 hover:bg-slate-50 transition-all"
                            startContent={<Edit3 size={18} />}
                            onPress={onOpen}
                        >
                            แก้ไขข้อมูลพื้นฐาน
                        </Button>
                        <Button
                            className="h-14 px-8 rounded-2xl bg-red-600 text-white font-black shadow-lg shadow-red-200 hover:scale-105 active:scale-95 transition-all"
                            startContent={<FileText size={18} />}
                            onPress={() => exportConsignmentPDF(data)}
                        >
                            Export PDF
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Consignor Information Card */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                            <CardBody className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-black uppercase tracking-widest">ชื่อผู้ฝากขาย / พาร์ทเนอร์</p>
                                            <p className="text-lg font-black text-slate-800">{data.consignorName}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                            <Phone size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-black uppercase tracking-widest">เบอร์โทรติดต่อ</p>
                                            <p className="text-lg font-black text-slate-800">{data.contactNumber}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                                            <Calendar size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-black uppercase tracking-widest">วันที่นำเข้า</p>
                                            <p className="text-lg font-black text-slate-800">{new Date(data.date).toLocaleDateString("th-TH", { dateStyle: 'long' })}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-black uppercase tracking-widest">ที่อยู่</p>
                                            <p className="text-slate-600 font-medium leading-relaxed">{data.address || "-"}</p>
                                        </div>
                                    </div>
                                </div>

                                <Divider className="bg-slate-100" />

                                <div className="bg-slate-900 p-8 rounded-[2rem] text-white">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">ยอดรวมของล็อตนี้</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-black text-white">฿{data.totalPrice?.toLocaleString()}</span>
                                        <span className="text-slate-500 font-bold">THB</span>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Images Gallery */}
                        {data.images && data.images.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-slate-900 px-2">รูปภาพประกอบ ({data.images.length})</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {data.images.map((img: any) => (
                                        <div key={img.id} className="aspect-square rounded-[2rem] overflow-hidden border border-slate-200 bg-white">
                                            <Image src={img.imageUrl} className="w-full h-full object-cover" alt="Consignment Image" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Items Table */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                    <Package className="text-red-600" />
                                    รายการสินค้าในล็อต
                                </h3>
                                <Chip variant="flat" color="danger" className="font-black">
                                    {data.items?.length || 0} รายการ
                                </Chip>
                            </div>

                            <Table
                                aria-label="Product items in batch"
                                removeWrapper
                                classNames={{
                                    th: "bg-slate-50/50 text-slate-400 font-bold uppercase text-[10px] tracking-widest py-6 border-b border-slate-100 first:pl-8 last:pr-8",
                                    td: "py-6 text-slate-600 font-medium first:pl-8 last:pr-8 border-b border-slate-50",
                                }}
                            >
                                <TableHeader>
                                    <TableColumn>สินค้า</TableColumn>
                                    <TableColumn>หมวดหมู่</TableColumn>
                                    <TableColumn>สถานะ</TableColumn>
                                    <TableColumn align="end">ราคาประเมิน (บาท)</TableColumn>
                                    <TableColumn align="center">จัดการ</TableColumn>
                                </TableHeader>
                                <TableBody emptyContent="ไม่มีรายการสินค้าในล็อตนี้">
                                    {(data.items || []).map((item: any) => (
                                        <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-50 border border-slate-100">
                                                        {item.imageUrl ? (
                                                            <img src={item.imageUrl} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                                <Package size={20} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="font-black text-slate-900">{item.productName}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Chip size="sm" variant="flat" className="font-bold text-[10px] uppercase">
                                                    {item.category}
                                                </Chip>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    size="sm"
                                                    variant="flat"
                                                    color={item.status === "ready" ? "success" : "warning"}
                                                    className="font-black text-[10px] uppercase"
                                                >
                                                    {item.status}
                                                </Chip>
                                            </TableCell>
                                            <TableCell align="right">
                                                <span className="font-black text-slate-900">
                                                    ฿{item.confirmedPrice?.toLocaleString()}
                                                </span>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Button
                                                    isIconOnly
                                                    variant="light"
                                                    size="sm"
                                                    className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                                                    onPress={() => router.push(`/history/${item.id}`)}
                                                >
                                                    <Eye size={18} />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>

                {/* Edit Modal */}
                <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" backdrop="blur" className="rounded-[2.5rem]">
                    <ModalContent className="p-4">
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">
                                    <h3 className="text-2xl font-black text-slate-900">แก้ไขข้อมูลล็อต</h3>
                                    <p className="text-slate-500 font-medium text-sm">แก้ไขข้อมูลพื้นฐานของผู้นำเข้าและล็อตสินค้า</p>
                                </ModalHeader>
                                <ModalBody className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="เลขล็อตสินค้า"
                                            value={editData.lot}
                                            onChange={(e) => setEditData({ ...editData, lot: e.target.value })}
                                            variant="bordered"
                                            className="font-bold"
                                        />
                                        <Input
                                            label="ชื่อผู้ฝากขาย / พาร์ทเนอร์"
                                            value={editData.consignorName}
                                            onChange={(e) => setEditData({ ...editData, consignorName: e.target.value })}
                                            variant="bordered"
                                            className="font-bold"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="เบอร์โทรติดต่อ"
                                            value={editData.contactNumber}
                                            onChange={(e) => setEditData({ ...editData, contactNumber: e.target.value })}
                                            variant="bordered"
                                            className="font-bold"
                                        />
                                        <Input
                                            label="วันที่นำเข้า"
                                            type="date"
                                            value={editData.date ? new Date(editData.date).toISOString().split('T')[0] : ""}
                                            onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                                            variant="bordered"
                                            className="font-bold"
                                        />
                                    </div>
                                    <Input
                                        label="ราคารวมของล็อต"
                                        type="number"
                                        value={editData.totalPrice}
                                        onChange={(e) => setEditData({ ...editData, totalPrice: parseFloat(e.target.value) })}
                                        variant="bordered"
                                        className="font-bold"
                                        startContent={<span className="text-slate-400">฿</span>}
                                    />
                                    <Textarea
                                        label="ที่อยู่"
                                        value={editData.address}
                                        onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                                        variant="bordered"
                                        className="font-bold"
                                    />
                                </ModalBody>
                                <ModalFooter>
                                    <Button variant="flat" onPress={onClose} className="rounded-2xl font-black">
                                        ยกเลิก
                                    </Button>
                                    <Button
                                        color="danger"
                                        onPress={handleSave}
                                        isLoading={saving}
                                        className="rounded-2xl font-black px-8 shadow-xl shadow-red-200"
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
