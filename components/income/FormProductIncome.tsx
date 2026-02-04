"use client";

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import {
    Button,
    Input,
    Textarea,
    Card,
    CardBody,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Select,
    SelectItem,
    Tooltip,
    Chip,
} from "@heroui/react";
import {
    Plus,
    Trash2,
    Save,
    RotateCcw,
    PlusCircle,
    Calendar,
    Hash,
    User as UserIcon,
    Phone,
    MapPin,
    Package,
    Image as ImageIcon,
    Camera,
    Aperture,
    Video,
    BatteryMedium,
    Film,
    MoreHorizontal,
    AlertCircle,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import IncomeProductStatus from "./IncomeProductStatus";

export default function ConsignmentForm() {
    const { data: session } = useSession();
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split("T")[0],
        lot: "",
        consignorName: "",
        contactNumber: "",
        address: "",
        totalPrice: "",
        images: [] as string[],
    });

    const [items, setItems] = useState([
        {
            id: "initial-item",
            productName: "",
            category: "",
            year: "",
            status: "ขายได้",
            confirmedPrice: "",
            salesChannel: "",
            imageUrl: "",
        },
    ]);

    useEffect(() => {
        setMounted(true);
        fetchSaleLot();
    }, []);

    const fetchSaleLot = async () => {
        try {
            const res = await axios.get("/api/lots/generate?prefix=SL");
            setFormData(prev => ({ ...prev, lot: res.data.lot }));
        } catch (error) {
            console.error("Fetch Sale LOT failed", error);
            toast.error("ไม่สามารถสร้างรหัส SL LOT ได้อัตโนมัติ");
        }
    };

    // 🔥 Auto-calculate total value
    useEffect(() => {
        const total = items.reduce((sum, item) => sum + (Number(item.confirmedPrice) || 0), 0);
        setFormData(prev => ({ ...prev, totalPrice: total.toString() }));
    }, [items]);

    const handleAddItem = () => {
        setItems([
            ...items,
            {
                id: crypto.randomUUID(),
                productName: "",
                category: "",
                year: "",
                status: "ขายได้",
                confirmedPrice: "",
                salesChannel: "",
                imageUrl: "",
            },
        ]);
    };

    const handleRemoveItem = (id: string) => {
        if (items.length > 1) {
            setItems(items.filter((item) => item.id !== id));
        } else {
            setItems([]);
        }
    };

    const handleItemChange = (id: string, field: string, value: any) => {
        setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
    };

    const handleItemImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleItemChange(id, "imageUrl", reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClear = () => {
        setFormData({
            date: new Date().toISOString().split("T")[0],
            lot: "",
            consignorName: "",
            contactNumber: "",
            address: "",
            totalPrice: "",
            images: [],
        });
        setItems([
            {
                id: "initial-item",
                productName: "",
                category: "",
                year: "",
                status: "ขายได้",
                confirmedPrice: "",
                salesChannel: "",
                imageUrl: "",
            },
        ]);
        fetchSaleLot();
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData((prev) => ({
                        ...prev,
                        images: [...prev.images, reader.result as string],
                    }));
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.date) newErrors.date = "กรุณาเลือกวันที่";
        if (!formData.lot) newErrors.lot = "กรุณาตรวจสอบรหัสล๊อต";
        if (!formData.consignorName) newErrors.consignorName = "กรุณากรอกชื่อผู้ฝากขาย";
        if (!formData.contactNumber) newErrors.contactNumber = "กรุณากรอกเบอร์โทร";
        if (!formData.totalPrice) newErrors.totalPrice = "กรุณากรอกยอดรวม";

        items.forEach((item, index) => {
            if (!item.productName) newErrors[`item.${item.id}.productName`] = `กรุณากรอกชื่อสินค้า (แถว ${index + 1})`;
            if (!item.category) newErrors[`item.${item.id}.category`] = `กรุณาเลือกหมวดหมู่ (แถว ${index + 1})`;
            if (!item.confirmedPrice) newErrors[`item.${item.id}.confirmedPrice`] = `กรุณากรอกราคา (แถว ${index + 1})`;
            if (!item.imageUrl) newErrors[`item.${item.id}.imageUrl`] = `กรุณาเพิ่มรูปสินค้า (แถว ${index + 1})`;
        });

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        setLoading(true);
        try {
            const payload = { ...formData, items, type: "CONSIGNMENT" };
            await axios.post("/api/consignments", payload);
            toast.success("บันทึกข้อมูลการฝากขายสำเร็จ!");
            handleClear();
        } catch (error) {
            console.error("Save error:", error);
            toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen font-sans text-slate-800">
            <Toaster richColors position="top-right" />
            <div className="max-w-[1600px] mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1">
                        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-1">
                            <span>Consignment Management</span>
                            <span className="w-1 h-1 rounded-full bg-emerald-200" />
                            <span>Sales Record</span>
                        </nav>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            บันทึกการฝากขาย
                        </h1>
                        <p className="text-sm text-slate-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis">จัดการข้อมูลและรายละเอียดการฝากขายสินค้าเข้าร้าน</p>
                    </div>
                    <div className="hidden md:flex gap-3">
                        <Button
                            variant="flat"
                            startContent={<RotateCcw size={20} />}
                            onPress={handleClear}
                            className="bg-white border border-slate-200 font-bold text-slate-600 h-14 px-8 rounded-2xl hover:bg-slate-50 transition-all"
                        >
                            ล้างฟอร์ม
                        </Button>
                        <Button
                            color="success"
                            startContent={<Save size={20} />}
                            onPress={handleSubmit}
                            isLoading={loading}
                            className="bg-emerald-600 font-black text-white h-14 px-12 rounded-2xl shadow-xl shadow-emerald-100 transition-all active:scale-95"
                        >
                            บันทึกรายการ
                        </Button>
                    </div>
                </div>

                {/* Form Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Info Card */}
                    <Card className="lg:col-span-2 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 backdrop-blur-xl" radius="lg">
                        <CardBody className="p-8 space-y-10">
                            <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                    <UserIcon size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">ข้อมูลผู้ฝากขาย</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Consignor Information</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <label className="text-lg font-bold text-slate-700">วันที่รับสินค้าฝากขาย</label>
                                    <Input
                                        type="date"
                                        variant="bordered"
                                        labelPlacement="outside"
                                        value={formData.date}
                                        isInvalid={!!errors.date}
                                        errorMessage={errors.date}
                                        startContent={<Calendar className="text-slate-400" size={18} />}
                                        className="font-medium"
                                        classNames={{
                                            inputWrapper: "h-14 border-slate-100 bg-slate-50/50 rounded-2xl focus-within:!border-emerald-500 transition-all group-data-[focus=true]:bg-white",
                                        }}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-lg font-bold text-slate-700">รหัสล๊อต (อัตโนมัติ)</label>
                                    <Input
                                        placeholder="SL-YYYY-XXXX"
                                        variant="bordered"
                                        labelPlacement="outside"
                                        value={formData.lot}
                                        isReadOnly
                                        isInvalid={!!errors.lot}
                                        errorMessage={errors.lot}
                                        startContent={<Hash className="text-slate-400 font-black" size={18} />}
                                        className="font-medium"
                                        classNames={{
                                            inputWrapper: "h-14 border-slate-100 bg-slate-100/50 rounded-2xl focus-within:!border-emerald-500 transition-all cursor-not-allowed",
                                            input: "font-black text-emerald-600"
                                        }}
                                    />
                                    <p className="text-[10px] text-emerald-500 font-bold px-1 italic text-center">Gen อัตโนมัติ: SL (Sales Consignment)</p>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-lg font-bold text-slate-700">ชื่อผู้ฝากขาย</label>
                                    <Input
                                        placeholder="กรอกชื่อผู้ฝากขาย"
                                        variant="bordered"
                                        labelPlacement="outside"
                                        value={formData.consignorName}
                                        isInvalid={!!errors.consignorName}
                                        errorMessage={errors.consignorName}
                                        startContent={<UserIcon className="text-slate-400" size={18} />}
                                        className="font-medium"
                                        classNames={{
                                            inputWrapper: "h-14 border-slate-100 bg-slate-50/50 rounded-2xl focus-within:!border-emerald-500 transition-all group-data-[focus=true]:bg-white",
                                        }}
                                        onChange={(e) => setFormData({ ...formData, consignorName: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-lg font-bold text-slate-700">เบอร์ติดต่อ</label>
                                    <Input
                                        placeholder="08X-XXX-XXXX"
                                        variant="bordered"
                                        labelPlacement="outside"
                                        value={formData.contactNumber}
                                        isInvalid={!!errors.contactNumber}
                                        errorMessage={errors.contactNumber}
                                        startContent={<Phone className="text-slate-400" size={18} />}
                                        className="font-medium"
                                        classNames={{
                                            inputWrapper: "h-14 border-slate-100 bg-slate-50/50 rounded-2xl focus-within:!border-emerald-500 transition-all group-data-[focus=true]:bg-white",
                                        }}
                                        onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                                    />
                                </div>
                            </div>

                            <Textarea
                                label="ที่อยู่ผู้ฝากขาย"
                                placeholder="กรอกที่อยู่ผู้ฝากขาย..."
                                variant="bordered"
                                labelPlacement="outside"
                                minRows={3}
                                value={formData.address}
                                startContent={<MapPin className="text-slate-400 mt-1" size={18} />}
                                className="font-medium px-0"
                                classNames={{
                                    label: "font-bold text-slate-700 text-lg",
                                    inputWrapper: "border-slate-100 bg-slate-50/50 rounded-2xl focus-within:!border-emerald-500 transition-all group-data-[focus=true]:bg-white p-4",
                                }}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />

                            <div className="flex justify-between items-center p-6 bg-slate-900 rounded-[2rem] text-white">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Total Value</p>
                                    <p className="text-2xl font-black italic">ราคารวม</p>
                                </div>
                                <div className="relative">
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-black text-emerald-400">฿</span>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        readOnly
                                        className="bg-transparent text-4xl font-black text-right outline-none w-48 pl-8 placeholder:text-slate-700 cursor-default"
                                        value={formData.totalPrice}
                                    />
                                </div>
                            </div>

                            {/* Recorder Display */}
                            <div className="flex items-center gap-3 px-6 py-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                                    <UserIcon size={14} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Recorded By (System Internal)</span>
                                    <span className="text-xs font-black text-slate-700">
                                        {(session as any)?.user?.name || "Initializing..."} ({(session as any)?.user?.role || "STAFF"})
                                    </span>
                                </div>
                                <div className="ml-auto flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[10px] font-black text-green-600 uppercase">Verified Session</span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Image Upload Card */}
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 backdrop-blur-xl" radius="lg">
                        <CardBody className="p-8 space-y-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600">
                                    <ImageIcon size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">รูปภาพประกอบ</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Reference Images</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center py-12 rounded-[2.5rem] bg-slate-50/50 border-2 border-dashed border-slate-100 relative group overflow-hidden">
                                <input
                                    type="file" multiple accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                />
                                <div className="w-20 h-20 rounded-full bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                                    <PlusCircle size={32} />
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-base font-bold text-slate-700 tracking-tight">เพิ่มรูปภาพฝากขาย</p>
                                    <p className="text-xs text-slate-400 font-medium">PNG, JPG up to 10MB</p>
                                </div>
                            </div>

                            <AnimatePresence>
                                {formData.images.length > 0 && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-4 mt-2">
                                        {formData.images.map((src, index) => (
                                            <motion.div key={index} layout className="relative group aspect-square rounded-[2rem] overflow-hidden border-4 border-white shadow-lg shadow-slate-100">
                                                <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                                                    <Button isIconOnly size="md" color="danger" radius="full" variant="shadow" onPress={() => removeImage(index)}>
                                                        <Trash2 size={20} />
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </CardBody>
                    </Card>
                </div>

                {/* Product Items Table Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                                <Package size={20} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">รายการสินค้าฝากขาย</h2>
                        </div>
                        <Button
                            variant="shadow"
                            color="success"
                            startContent={<PlusCircle size={24} />}
                            onPress={handleAddItem}
                            className="font-black h-14 px-10 rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-200 w-full md:w-auto"
                        >
                            เพิ่มสินค้าใหม่
                        </Button>
                    </div>

                    <Card className="hidden md:block border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden" radius="lg">
                        <div className="overflow-x-auto no-scrollbar w-full">
                            <Table aria-label="Items List" removeWrapper className="text-sm font-medium min-w-[1200px]">
                                <TableHeader>
                                    <TableColumn className="bg-slate-50/50 py-6 text-slate-400 font-black h-14 uppercase tracking-wider text-[10px] text-center w-24">IMAGE</TableColumn>
                                    <TableColumn className="bg-slate-50/50 py-6 text-slate-400 font-black h-14 uppercase tracking-wider text-[10px]">PRODUCT DETAILS</TableColumn>
                                    <TableColumn className="bg-slate-50/50 py-6 text-slate-400 font-black h-14 uppercase tracking-wider text-[10px] w-48">CATEGORY</TableColumn>
                                    <TableColumn className="bg-slate-50/50 py-6 text-slate-400 font-black h-14 uppercase tracking-wider text-[10px] w-24">YEAR</TableColumn>
                                    <TableColumn className="bg-slate-50/50 py-6 text-slate-400 font-black h-14 uppercase tracking-wider text-[10px] w-44">STATUS</TableColumn>
                                    <TableColumn className="bg-slate-50/50 py-6 text-slate-400 font-black h-14 uppercase tracking-wider text-[10px] w-40">PRICE</TableColumn>
                                    <TableColumn className="bg-slate-50/50 py-6 text-slate-400 font-black h-14 uppercase tracking-wider text-[10px]">CHANNELS</TableColumn>
                                    <TableColumn className="bg-slate-50/50 py-6 text-slate-400 font-black h-14 uppercase tracking-wider text-[10px] text-center w-20">ACTION</TableColumn>
                                </TableHeader>
                                <TableBody items={items}>
                                    {(item) => (
                                        <TableRow key={item.id} className="group border-b border-slate-50 transition-colors hover:bg-slate-50/30">
                                            <TableCell>
                                                <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50/50 flex items-center justify-center cursor-pointer overflow-hidden shadow-inner" onClick={() => document.getElementById(`file-${item.id}`)?.click()}>
                                                    {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : <Plus className="text-slate-300" size={20} />}
                                                    <input id={`file-${item.id}`} type="file" className="hidden" accept="image/*" onChange={(e) => handleItemImageUpload(item.id, e)} />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Input variant="faded" placeholder="รุ่น / แบรนด์" value={item.productName} onChange={(e) => handleItemChange(item.id, "productName", e.target.value)} classNames={{ inputWrapper: "border-none bg-transparent hover:bg-white rounded-xl" }} />
                                            </TableCell>
                                            <TableCell>
                                                <Select variant="faded" placeholder="หมวดหมู่" selectedKeys={item.category ? [item.category] : []} onChange={(e) => handleItemChange(item.id, "category", e.target.value)} classNames={{ trigger: "bg-white border-none rounded-xl" }}>
                                                    <SelectItem key="Camera">กล้อง</SelectItem>
                                                    <SelectItem key="Lens">เลนส์</SelectItem>
                                                    <SelectItem key="Tripod">ขาตั้งกล้อง</SelectItem>
                                                    <SelectItem key="Other">อื่นๆ</SelectItem>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <Input variant="faded" value={item.year} className="w-20" onChange={(e) => handleItemChange(item.id, "year", e.target.value)} classNames={{ input: "text-center", inputWrapper: "border-none bg-transparent" }} />
                                            </TableCell>
                                            <TableCell><IncomeProductStatus item={item} onItemChangeAction={handleItemChange} /></TableCell>
                                            <TableCell>
                                                <Input type="number" variant="faded" value={item.confirmedPrice} startContent={<span className="text-emerald-400 font-bold">฿</span>} onChange={(e) => handleItemChange(item.id, "confirmedPrice", e.target.value)} classNames={{ input: "text-right font-black text-emerald-600", inputWrapper: "border-none bg-slate-50" }} />
                                            </TableCell>
                                            <TableCell>
                                                <Input variant="faded" value={item.salesChannel} onChange={(e) => handleItemChange(item.id, "salesChannel", e.target.value)} classNames={{ inputWrapper: "border-none bg-transparent" }} />
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Button isIconOnly color="danger" variant="light" onPress={() => handleRemoveItem(item.id)}><Trash2 size={20} /></Button>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>

                    {/* Mobile Card List */}
                    <div className="md:hidden space-y-4 pb-32">
                        {items.map((item, index) => (
                            <Card key={item.id} className="border-none shadow-md overflow-hidden bg-white rounded-[2rem]">
                                <CardBody className="p-6 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black">{index + 1}</span>
                                        <Button isIconOnly color="danger" variant="light" radius="full" onPress={() => handleRemoveItem(item.id)}><Trash2 size={18} /></Button>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-24 h-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-100 flex-shrink-0 flex items-center justify-center overflow-hidden" onClick={() => document.getElementById(`mobile-file-${item.id}`)?.click()}>
                                            {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : <ImageIcon size={24} className="text-slate-300" />}
                                            <input id={`mobile-file-${item.id}`} type="file" className="hidden" accept="image/*" onChange={(e) => handleItemImageUpload(item.id, e)} />
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <Input label="ชื่อสินค้า" variant="bordered" value={item.productName} onChange={(e) => handleItemChange(item.id, "productName", e.target.value)} classNames={{ inputWrapper: "h-12 rounded-xl" }} />
                                            <Select label="หมวดหมู่" variant="bordered" selectedKeys={item.category ? [item.category] : []} onChange={(e) => handleItemChange(item.id, "category", e.target.value)} classNames={{ trigger: "h-12 rounded-xl" }}>
                                                <SelectItem key="Camera">กล้อง</SelectItem>
                                                <SelectItem key="Lens">เลนส์</SelectItem>
                                                <SelectItem key="Other">อื่นๆ</SelectItem>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Price</p>
                                            <Input type="number" variant="flat" value={item.confirmedPrice} startContent={<span className="text-emerald-500 font-bold">฿</span>} onChange={(e) => handleItemChange(item.id, "confirmedPrice", e.target.value)} classNames={{ inputWrapper: "h-14 rounded-2xl bg-emerald-50/50", input: "font-black text-emerald-600 text-lg" }} />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Status</p>
                                            <IncomeProductStatus item={item} onItemChangeAction={handleItemChange} />
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Mobile Sticky Actions */}
                <div className="md:hidden fixed bottom-16 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-slate-100 flex gap-3 z-50">
                    <Button isIconOnly variant="flat" onPress={handleClear} className="w-14 h-14 bg-slate-100 rounded-2xl text-slate-600">
                        <RotateCcw size={24} />
                    </Button>
                    <Button color="success" className="flex-1 h-14 rounded-2xl font-black text-lg bg-emerald-600 shadow-xl shadow-emerald-100" isLoading={loading} onPress={handleSubmit} startContent={!loading && <Save size={24} />}>
                        บันทึกรายการฝากขาย
                    </Button>
                </div>

                {/* Desktop Bottom Action Buttons */}
                <div className="hidden md:flex justify-center flex-col md:flex-row items-center gap-4 py-12">
                    <Button variant="flat" startContent={<RotateCcw size={24} />} onPress={handleClear} className="bg-white border border-slate-200 font-bold text-slate-500 px-12 h-16 rounded-[1.5rem] hover:bg-slate-50">
                        ล้างข้อมูลทั้งหมด
                    </Button>
                    <Button color="success" startContent={<Save size={24} />} onPress={handleSubmit} isLoading={loading} className="bg-emerald-600 font-black text-white w-[400px] h-16 rounded-[1.5rem] shadow-2xl shadow-emerald-200 text-xl">
                        ยืนยันการบันทึกรายการฝากขาย
                    </Button>
                </div>
            </div>
        </div>
    );
}
