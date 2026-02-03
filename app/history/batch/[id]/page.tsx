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
    Save,
    Tag,
    ChevronRight
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
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFBFC] gap-6">
                <Spinner size="lg" color="danger" />
                <div className="space-y-1 text-center">
                    <p className="text-slate-900 font-black text-xl">กำลังเรียกข้อมูลประวัติล็อต...</p>
                    <p className="text-slate-400 text-sm">โปรดรอสักครู่ ระบบกำลังจัดเตรียมข้อมูล</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFBFC] gap-6">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">ไม่พบข้อมูลล็อตนี้</h2>
                    <p className="text-slate-500">ข้อมูลที่คุณกำลังค้นหาอาจจะถูกลบหรือไม่มีอยู่ในระบบ</p>
                </div>
                <Button
                    onPress={() => router.back()}
                    variant="flat"
                    className="h-14 px-10 rounded-2xl bg-white shadow-lg shadow-slate-200 border border-slate-100 font-black"
                >
                    ย้อนกลับ
                </Button>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8 bg-[#FAFBFC] min-h-screen">
            <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="flex items-center gap-6">
                        <Button
                            isIconOnly
                            variant="flat"
                            onPress={() => router.back()}
                            className="w-14 h-14 rounded-2xl bg-white text-slate-600 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500"
                        >
                            <ArrowLeft size={24} />
                        </Button>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                                <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em]">Batch Management</p>
                            </div>
                            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">รายละเอียดล็อต {data.lot}</h1>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            variant="flat"
                            className="h-14 px-8 rounded-2xl bg-white text-slate-600 font-black shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-xl transition-all duration-500"
                            startContent={<Edit3 size={18} />}
                            onPress={onOpen}
                        >
                            แก้ไขพื้นฐาน
                        </Button>
                        <Button
                            className="h-14 px-10 rounded-2xl bg-red-600 text-white font-black shadow-[0_15px_40px_rgba(220,38,38,0.25)] hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(220,38,38,0.35)] transition-all duration-700"
                            startContent={<FileText size={18} />}
                            onPress={() => exportConsignmentPDF(data)}
                        >
                            Export PDF
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Consignor Information Column */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.06)] hover:shadow-[0_40px_100px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-700 p-10 space-y-8">
                            <div className="space-y-8">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shadow-sm">
                                        <User size={28} />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">ชื่อผู้ฝากขาย / พาร์ทเนอร์</p>
                                        <p className="text-xl font-black text-slate-800">{data.consignorName}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shadow-sm">
                                        <Phone size={28} />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">เบอร์โทรติดต่อ</p>
                                        <p className="text-xl font-black text-slate-800">{data.contactNumber}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shadow-sm">
                                        <Calendar size={28} />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">วันที่นำเข้าล็อต</p>
                                        <p className="text-xl font-black text-slate-800">{new Date(data.date).toLocaleDateString("th-TH", { dateStyle: 'long' })}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5">
                                    <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                                        <MapPin size={28} />
                                    </div>
                                    <div className="space-y-0.5 pt-1">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">ข้อมูลที่อยู่</p>
                                        <p className="text-slate-600 font-bold leading-relaxed">{data.address || "-"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent" />

                            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group/card text-center">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover/card:bg-white/10 transition-colors"></div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">ยอดค่าประกันรวมล็อต</p>
                                <div className="flex items-baseline justify-center gap-3">
                                    <span className="text-5xl font-black text-white tracking-tighter">฿{data.totalPrice?.toLocaleString()}</span>
                                    <span className="text-slate-500 font-black text-lg">บาท</span>
                                </div>
                            </div>
                        </div>

                        {/* Images Gallery with luxury cards */}
                        {data.images && data.images.length > 0 && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 px-2">
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">รูปภาพประกอบ</h3>
                                    <span className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-[10px] font-black">{data.images.length}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    {data.images.map((img: any) => (
                                        <div key={img.id} className="
                                            aspect-square 
                                            rounded-[2.5rem] 
                                            overflow-hidden 
                                            bg-white 
                                            shadow-[0_10px_40px_rgba(0,0,0,0.04)] 
                                            hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] 
                                            hover:-translate-y-1 
                                            transition-all duration-700 
                                            p-2
                                            group
                                        ">
                                            <div className="w-full h-full rounded-[2rem] overflow-hidden">
                                                <Image
                                                    src={img.imageUrl}
                                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                    alt="Consignment Image"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Items Table Section */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white rounded-[3.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.06)] overflow-hidden h-full">
                            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-gradient-to-r from-white to-slate-50/30">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Inventory List</p>
                                    <h3 className="text-3xl font-black text-slate-900 flex items-center gap-4">
                                        <div className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
                                            <Package size={20} />
                                        </div>
                                        รายการสินค้าในล็อต
                                    </h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">รวมทั้งหมด</p>
                                    <span className="text-2xl font-black text-slate-900">
                                        {data.items?.length || 0} <span className="text-slate-400 text-sm">ชิ้น</span>
                                    </span>
                                </div>
                            </div>

                            <div className="p-4">
                                <Table
                                    aria-label="Product items in batch"
                                    removeWrapper
                                    classNames={{
                                        th: "bg-transparent text-slate-400 font-black uppercase text-[10px] tracking-widest py-6 px-4",
                                        td: "py-6 px-4 text-slate-600 font-bold border-b border-slate-50/50",
                                    }}
                                >
                                    <TableHeader>
                                        <TableColumn>ข้อมูลสินค้า</TableColumn>
                                        <TableColumn>หมวดหมู่</TableColumn>
                                        <TableColumn>สถานะ</TableColumn>
                                        <TableColumn align="end">ราคาประเมิน</TableColumn>
                                        <TableColumn align="center">รายละเอียด</TableColumn>
                                    </TableHeader>
                                    <TableBody emptyContent="ไม่มีรายการสินค้าในล็อตนี้">
                                        {(data.items || []).map((item: any) => (
                                            <TableRow key={item.id} className="group hover:bg-slate-50/70 transition-all duration-300">
                                                <TableCell>
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-16 h-14 rounded-2xl overflow-hidden bg-slate-50 shadow-inner p-1 group-hover:scale-105 transition-transform duration-500">
                                                            {item.imageUrl ? (
                                                                <img src={item.imageUrl} className="w-full h-full object-contain rounded-xl" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-slate-200">
                                                                    <Package size={24} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="space-y-0.5">
                                                            <p className="font-black text-slate-900 group-hover:text-red-600 transition-colors uppercase tracking-tight">{item.productName}</p>
                                                            <p className="text-[10px] text-slate-400 font-bold">ID: #{item.id?.slice(0, 6).toUpperCase()}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip size="sm" variant="flat" className="font-black text-[10px] uppercase bg-slate-100 text-slate-500 rounded-lg px-2" startContent={<Tag size={10} className="ml-1" />}>
                                                        {item.category}
                                                    </Chip>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        size="sm"
                                                        variant="dot"
                                                        color={item.status === "ready" ? "success" : "warning"}
                                                        className="font-black text-[10px] uppercase border-none bg-slate-100/50"
                                                    >
                                                        {item.status === 'ready' ? 'พร้อมขาย' :
                                                            item.status === 'reserved' ? 'ติดจอง' : item.status}
                                                    </Chip>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <span className="font-black text-slate-900 text-lg tracking-tighter">
                                                        ฿{item.confirmedPrice?.toLocaleString()}
                                                    </span>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Button
                                                        isIconOnly
                                                        variant="flat"
                                                        size="md"
                                                        className="bg-transparent group-hover:bg-red-50 text-slate-300 group-hover:text-red-500 rounded-[1rem] transition-all duration-300"
                                                        onPress={() => router.push(`/history/${item.id}`)}
                                                    >
                                                        <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Modal (Luxury Style) */}
                <Modal
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    size="2xl"
                    backdrop="blur"
                    className="rounded-[3rem] p-4 bg-white/95 backdrop-blur-md shadow-2xl"
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-2 pt-8 px-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg">
                                            <Edit3 size={18} />
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">แก้ไขข้อมูลล็อต</h3>
                                    </div>
                                    <p className="text-slate-400 font-bold text-sm ml-1">ข้อมูลพื้นฐานของพาร์ทเนอร์และสินค้าที่นำเข้า</p>
                                </ModalHeader>
                                <ModalBody className="space-y-6 py-8 px-8">
                                    <div className="grid grid-cols-2 gap-6">
                                        <Input
                                            labelPlacement="outside"
                                            placeholder="เลขล็อตสินค้า"
                                            value={editData.lot}
                                            onChange={(e) => setEditData({ ...editData, lot: e.target.value })}
                                            variant="bordered"
                                            classNames={{
                                                label: "font-black text-slate-400 uppercase tracking-widest text-[10px]",
                                                input: "font-bold text-slate-700",
                                                inputWrapper: "h-14 rounded-2xl bg-slate-50/50 border-slate-100 focus-within:border-slate-200 transition-all hover:bg-slate-50",
                                            }}
                                        />
                                        <Input
                                            labelPlacement="outside"
                                            placeholder="ชื่อผู้ฝากขาย / พาร์ทเนอร์"
                                            value={editData.consignorName}
                                            onChange={(e) => setEditData({ ...editData, consignorName: e.target.value })}
                                            variant="bordered"
                                            classNames={{
                                                label: "font-black text-slate-400 uppercase tracking-widest text-[10px]",
                                                input: "font-bold text-slate-700",
                                                inputWrapper: "h-14 rounded-2xl bg-slate-50/50 border-slate-100 focus-within:border-slate-200 transition-all hover:bg-slate-50",
                                            }}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <Input
                                            labelPlacement="outside"
                                            placeholder="เบอร์โทรติดต่อ"
                                            value={editData.contactNumber}
                                            onChange={(e) => setEditData({ ...editData, contactNumber: e.target.value })}
                                            variant="bordered"
                                            classNames={{
                                                label: "font-black text-slate-400 uppercase tracking-widest text-[10px]",
                                                input: "font-bold text-slate-700",
                                                inputWrapper: "h-14 rounded-2xl bg-slate-50/50 border-slate-100 focus-within:border-slate-200 transition-all hover:bg-slate-50",
                                            }}
                                        />
                                        <Input
                                            labelPlacement="outside"
                                            type="date"
                                            value={editData.date ? new Date(editData.date).toISOString().split('T')[0] : ""}
                                            onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                                            variant="bordered"
                                            classNames={{
                                                label: "font-black text-slate-400 uppercase tracking-widest text-[10px]",
                                                input: "font-bold text-slate-700",
                                                inputWrapper: "h-14 rounded-2xl bg-slate-50/50 border-slate-100 focus-within:border-slate-200 transition-all hover:bg-slate-50",
                                            }}
                                        />
                                    </div>
                                    <Input
                                        labelPlacement="outside"
                                        type="number"
                                        placeholder="ค่าประกันรวมของล็อต"
                                        value={editData.totalPrice}
                                        onChange={(e) => setEditData({ ...editData, totalPrice: parseFloat(e.target.value) })}
                                        variant="bordered"
                                        startContent={<span className="text-slate-400 font-bold">฿</span>}
                                        classNames={{
                                            label: "font-black text-slate-400 uppercase tracking-widest text-[10px]",
                                            input: "font-black text-slate-900",
                                            inputWrapper: "h-14 rounded-2xl bg-slate-50/50 border-slate-100 focus-within:border-slate-200 transition-all hover:bg-slate-50",
                                        }}
                                    />
                                    <Textarea
                                        label="ข้อมูลที่อยู่"
                                        labelPlacement="outside"
                                        placeholder="ระบุที่อยู่ของพาร์ทเนอร์"
                                        value={editData.address}
                                        onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                                        variant="bordered"
                                        classNames={{
                                            label: "font-black text-slate-400 uppercase tracking-widest text-[10px]",
                                            input: "font-bold text-slate-700 leading-relaxed",
                                            inputWrapper: "rounded-3xl bg-slate-50/50 border-slate-100 focus-within:border-slate-200 transition-all hover:bg-slate-50",
                                        }}
                                    />
                                </ModalBody>
                                <ModalFooter className="px-8 pb-8 pt-2">
                                    <Button variant="flat" onPress={onClose} className="h-14 rounded-2xl font-black bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all px-8">
                                        ยกเลิก
                                    </Button>
                                    <Button
                                        color="danger"
                                        onPress={handleSave}
                                        isLoading={saving}
                                        className="h-14 rounded-2xl font-black px-12 shadow-[0_15px_40px_rgba(220,38,38,0.2)] hover:shadow-[0_25px_60px_rgba(220,38,38,0.3)] transition-all duration-700"
                                        startContent={<Save size={18} />}
                                    >
                                        บันทึกการเปลี่ยนแปลง
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
