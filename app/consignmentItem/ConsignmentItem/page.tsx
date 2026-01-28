"use client";

import React, { useState, useRef } from "react";
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
    BadgeDollarSign
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PledgeStatusCell from "./PledgeStatusCell";

// Define local interfaces for the form
export interface ConsignmentFormItem {
    id: string;
    productName: string;
    category: string;
    year: string;
    pledgePrice: string; // ราคาจำนำ
    closingPrice: string; // ราคาปิดยอด
    pledgeStatus: string; // สถานะจำนำ
    imageUrl: string;
}

export default function ConsignmentItemPage() {
    const [loading, setLoading] = useState(false);
    const masterFileRef = useRef<HTMLInputElement>(null);
    const defectFileRef = useRef<HTMLInputElement>(null);

    // Form State
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split("T")[0],
        lot: "",
        consignorName: "",
        contactNumber: "",
        address: "",
        totalPrice: "",
        masterImages: [] as string[],
        defectImages: [] as string[],
    });

    const [items, setItems] = useState<ConsignmentFormItem[]>([
        {
            id: "initial-item",
            productName: "",
            category: "",
            year: "",
            pledgePrice: "",
            closingPrice: "",
            pledgeStatus: "active",
            imageUrl: "",
        },
    ]);

    // --- Handlers ---

    const handleAddItem = () => {
        setItems([
            ...items,
            {
                id: crypto.randomUUID(),
                productName: "",
                category: "",
                year: "",
                pledgePrice: "",
                closingPrice: "",
                pledgeStatus: "active",
                imageUrl: "",
            },
        ]);
    };

    const handleRemoveItem = (id: string) => {
        if (items.length > 1) {
            setItems(items.filter((item) => item.id !== id));
        }
    };

    const handleItemChange = (id: string, field: keyof ConsignmentFormItem, value: any) => {
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
        // Reset value so same file can be selected again if needed
        e.target.value = "";
    };

    const handleMasterImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData((prev) => ({
                        ...prev,
                        masterImages: [...prev.masterImages, reader.result as string],
                    }));
                };
                reader.readAsDataURL(file);
            });
        }
        e.target.value = "";
    };

    const handleDefectImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData((prev) => ({
                        ...prev,
                        defectImages: [...prev.defectImages, reader.result as string],
                    }));
                };
                reader.readAsDataURL(file);
            });
        }
        e.target.value = "";
    };

    const removeMasterImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            masterImages: prev.masterImages.filter((_, i) => i !== index),
        }));
    };

    const removeDefectImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            defectImages: prev.defectImages.filter((_, i) => i !== index),
        }));
    };

    const handleClear = () => {
        setFormData({
            date: new Date().toISOString().split("T")[0],
            lot: "",
            consignorName: "",
            contactNumber: "",
            address: "",
            totalPrice: "",
            masterImages: [],
            defectImages: [],
        });
        setItems([
            {
                id: "initial-item",
                productName: "",
                category: "",
                year: "",
                pledgePrice: "",
                closingPrice: "",
                pledgeStatus: "active",
                imageUrl: "",
            },
        ]);
    };

    const handleSubmit = async () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            alert("บันทึกข้อมูลการรับจำนำเรียบร้อย (Simulation)");
            setLoading(false);
            handleClear();
        }, 1500);
    };

    return (
        <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen font-sans text-slate-800 animate-in fade-in duration-500">
            <div className="max-w-[1600px] mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-1">
                            <span>Pledge Management</span>
                            <span className="w-1 h-1 rounded-full bg-orange-200" />
                            <span>New Record</span>
                        </nav>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            บันทึกการรับจำนำ
                        </h1>
                        <p className="text-sm text-slate-500 font-medium">จัดการข้อมูลการรับจำนำสินค้าและรายละเอียดสัญญา</p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="flat"
                            startContent={<RotateCcw size={18} />}
                            onPress={handleClear}
                            className="bg-white border border-slate-200 font-bold text-slate-600 h-12 px-6 rounded-2xl hover:bg-slate-50 transition-all"
                        >
                            ล้างฟอร์ม
                        </Button>
                        <Button
                            color="primary"
                            startContent={<Save size={18} />}
                            onPress={handleSubmit}
                            isLoading={loading}
                            className="bg-slate-900 font-black text-white h-12 px-10 rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-95"
                        >
                            บันทึกรายการ
                        </Button>
                    </div>
                </div>

                {/* Info & Images Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                    {/* 1. Main Info Card (Left) */}
                    <Card className="xl:col-span-2 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 backdrop-blur-xl" radius="lg">
                        <CardBody className="p-8 space-y-10">
                            <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                                    <BadgeDollarSign size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">ข้อมูลสัญญาจำนำ</h3>
                                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Contract Details</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <label className="text-lg font-bold text-slate-700">วันที่ทำรายการ</label>
                                    <Input
                                        type="date"
                                        variant="bordered"
                                        labelPlacement="outside"
                                        value={formData.date}
                                        startContent={<Calendar className="text-slate-400" size={18} />}
                                        className="font-medium"
                                        classNames={{
                                            inputWrapper: "h-14 border-slate-100 bg-slate-50/50 rounded-2xl focus-within:!border-orange-500 hover:border-orange-200 transition-all",
                                        }}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-lg font-bold text-slate-700">รหัสสัญญา / Lot ID</label>
                                    <Input
                                        placeholder="Auto Generate or Enter ID"
                                        variant="bordered"
                                        labelPlacement="outside"
                                        value={formData.lot}
                                        startContent={<Hash className="text-slate-400" size={18} />}
                                        className="font-medium"
                                        classNames={{
                                            inputWrapper: "h-14 border-slate-100 bg-slate-50/50 rounded-2xl focus-within:!border-orange-500 hover:border-orange-200 transition-all",
                                        }}
                                        onChange={(e) => setFormData({ ...formData, lot: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-lg font-bold text-slate-700">ชื่อผู้จำนำ</label>
                                    <Input
                                        placeholder="ระบุชื่อลูกค้า"
                                        variant="bordered"
                                        labelPlacement="outside"
                                        value={formData.consignorName}
                                        startContent={<UserIcon className="text-slate-400" size={18} />}
                                        className="font-medium"
                                        classNames={{
                                            inputWrapper: "h-14 border-slate-100 bg-slate-50/50 rounded-2xl focus-within:!border-orange-500 hover:border-orange-200 transition-all",
                                        }}
                                        onChange={(e) => setFormData({ ...formData, consignorName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-lg font-bold text-slate-700">เบอร์โทรศัพท์</label>
                                    <Input
                                        placeholder="08X-XXX-XXXX"
                                        variant="bordered"
                                        labelPlacement="outside"
                                        value={formData.contactNumber}
                                        startContent={<Phone className="text-slate-400" size={18} />}
                                        className="font-medium"
                                        classNames={{
                                            inputWrapper: "h-14 border-slate-100 bg-slate-50/50 rounded-2xl focus-within:!border-orange-500 hover:border-orange-200 transition-all",
                                        }}
                                        onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                                    />
                                </div>
                            </div>

                            <Textarea
                                label="ที่อยู่ติดต่อ"
                                placeholder="ระบุที่อยู่..."
                                variant="bordered"
                                labelPlacement="outside"
                                minRows={3}
                                value={formData.address}
                                startContent={<MapPin className="text-slate-400 mt-1" size={18} />}
                                classNames={{
                                    label: "text-lg font-bold text-slate-700 mb-2",
                                    inputWrapper: "border-slate-100 bg-slate-50/50 rounded-2xl focus-within:!border-orange-500 hover:border-orange-200 transition-all p-4",
                                }}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />

                            <div className="flex justify-between items-center p-6 bg-orange-500 rounded-[2rem] text-white shadow-xl shadow-orange-200">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Total Pledge Amount</p>
                                    <p className="text-2xl font-black italic">ยอดรวมจำนำทั้งสิ้น</p>
                                </div>
                                <div className="relative">
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-black text-orange-200">฿</span>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="bg-transparent text-4xl font-black text-right outline-none w-48 pl-6 placeholder:text-orange-300 text-white"
                                        value={formData.totalPrice}
                                        onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })}
                                    />
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* 2. Images Section (Right - Stacked) */}
                    <div className="space-y-6">

                        {/* Master Batch Images (Blue) */}
                        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white" radius="lg">
                            <CardBody className="p-6 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                        <ImageIcon size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900">รูปภาพรวม</h3>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">Master Batch Images</p>
                                    </div>
                                </div>

                                {/* Upload Area */}
                                <div
                                    className="flex flex-col items-center justify-center py-8 rounded-[2rem] bg-blue-50/30 border-2 border-dashed border-blue-100 relative group cursor-pointer overflow-hidden transition-all hover:bg-blue-50 hover:border-blue-200"
                                    onClick={() => masterFileRef.current?.click()}
                                >
                                    <div className="w-14 h-14 rounded-full bg-blue-600 shadow-lg shadow-blue-200 text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                                        <Plus size={24} strokeWidth={3} />
                                    </div>
                                    <p className="text-sm font-bold text-slate-700">เพิ่มรูปภาพสินค้าในล๊อต</p>
                                    <p className="text-[10px] text-slate-400 font-medium mt-1">PNG, JPG up to 10MB</p>

                                    {/* Decorative Icon */}
                                    <div className="absolute top-2 right-2 text-blue-100 opacity-20">
                                        <ImageIcon size={40} />
                                    </div>
                                </div>
                                {/* Hidden Input */}
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    ref={masterFileRef}
                                    onChange={handleMasterImageUpload}
                                />

                                {/* Preview Grid */}
                                <AnimatePresence>
                                    {formData.masterImages.length > 0 && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-4 gap-2 mt-2">
                                            {formData.masterImages.map((src, i) => (
                                                <div key={i} className="aspect-square relative group rounded-xl overflow-hidden shadow-sm">
                                                    <img src={src} className="w-full h-full object-cover" alt="preview" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <button onClick={() => removeMasterImage(i)} className="text-white hover:text-red-400"><Trash2 size={16} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </CardBody>
                        </Card>

                        {/* Defect Images (Purple) */}
                        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white" radius="lg">
                            <CardBody className="p-6 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                                        <Camera size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900">รูปภาพอาการเสีย</h3>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">Defect Images</p>
                                    </div>
                                </div>

                                {/* Upload Area */}
                                <div
                                    className="flex flex-col items-center justify-center py-8 rounded-[2rem] bg-purple-50/30 border-2 border-dashed border-purple-100 relative group cursor-pointer overflow-hidden transition-all hover:bg-purple-50 hover:border-purple-200"
                                    onClick={() => defectFileRef.current?.click()}
                                >
                                    <div className="w-14 h-14 rounded-full bg-purple-600 shadow-lg shadow-purple-200 text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                                        <Plus size={24} strokeWidth={3} />
                                    </div>
                                    <p className="text-sm font-bold text-slate-700">เพิ่มรูปภาพสินค้าฝากซ่อม</p>
                                    <p className="text-[10px] text-slate-400 font-medium mt-1">PNG, JPG up to 10MB</p>

                                    {/* Decorative Icon */}
                                    <div className="absolute top-2 right-2 text-purple-100 opacity-20">
                                        <ImageIcon size={40} />
                                    </div>
                                </div>
                                {/* Hidden Input */}
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    ref={defectFileRef}
                                    onChange={handleDefectImageUpload}
                                />

                                {/* Preview Grid */}
                                <AnimatePresence>
                                    {formData.defectImages.length > 0 && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-4 gap-2 mt-2">
                                            {formData.defectImages.map((src, i) => (
                                                <div key={i} className="aspect-square relative group rounded-xl overflow-hidden shadow-sm">
                                                    <img src={src} className="w-full h-full object-cover" alt="defect" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <button onClick={() => removeDefectImage(i)} className="text-white hover:text-red-400"><Trash2 size={16} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                            </CardBody>
                        </Card>

                    </div>
                </div>

                {/* Items Table Section */}
                <div className="space-y-4">

                    <div className="flex items-center justify-between bg-white p-4 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-500 p-2 rounded-xl text-white">
                                <Package size={20} />
                            </div>
                            <h2 className="text-lg font-black text-slate-800">รายการสินค้าจำนำ</h2>
                        </div>
                        <Button
                            color="default"
                            variant="flat"
                            className="bg-orange-50 text-orange-600 font-bold"
                            startContent={<Plus size={18} />}
                            onPress={handleAddItem}
                        >
                            เพิ่มสินค้าจำนำ
                        </Button>
                    </div>

                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-visible" radius="lg">
                        <Table aria-label="Consignment items" removeWrapper classNames={{
                            th: "bg-slate-50 text-slate-500 font-bold text-xs py-4",
                            td: "py-4 border-b border-slate-50 last:border-none"
                        }}>
                            <TableHeader>
                                <TableColumn width={80}>รูปภาพ</TableColumn>
                                <TableColumn>ชื่อสินค้า/รายละเอียด</TableColumn>
                                <TableColumn width={180}>หมวดหมู่</TableColumn>
                                <TableColumn width={120}>ปี/รุ่น</TableColumn>
                                <TableColumn width={180}>สถานะจำนำ</TableColumn>
                                <TableColumn width={150}>ราคาจำนำ</TableColumn>
                                <TableColumn width={150}>ราคาปิดยอด</TableColumn>
                                <TableColumn width={80} align="center">การกระทำ</TableColumn>
                            </TableHeader>
                            <TableBody items={items}>
                                {(item) => (
                                    <TableRow key={item.id}>
                                        {/* Image */}
                                        <TableCell>
                                            <div
                                                className="w-12 h-12 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center cursor-pointer overflow-hidden hover:border-orange-200 transition-all relative group"
                                                onClick={() => document.getElementById(`item-file-${item.id}`)?.click()}
                                            >
                                                {item.imageUrl ? (
                                                    <img src={item.imageUrl} className="w-full h-full object-cover" alt="item" />
                                                ) : (
                                                    <Plus size={18} className="text-slate-300 group-hover:text-orange-400" />
                                                )}
                                                <input
                                                    id={`item-file-${item.id}`}
                                                    type="file"
                                                    className="hidden"
                                                    onChange={(e) => handleItemImageUpload(item.id, e)}
                                                />
                                            </div>
                                        </TableCell>

                                        {/* Name */}
                                        <TableCell>
                                            <Input
                                                variant="bordered"
                                                placeholder="ชื่อสินค้า..."
                                                size="sm"
                                                value={item.productName}
                                                classNames={{
                                                    inputWrapper: "border-0 border-b border-slate-200 rounded-none px-0 hover:border-orange-400 focus-within:!border-orange-500 shadow-none bg-transparent"
                                                }}
                                                onChange={(e) => handleItemChange(item.id, "productName", e.target.value)}
                                            />
                                        </TableCell>

                                        {/* Category */}
                                        <TableCell>
                                            <Select
                                                variant="bordered"
                                                placeholder="เลือก"
                                                size="sm"
                                                selectedKeys={item.category ? [item.category] : []}
                                                classNames={{
                                                    trigger: "border-0 border-b border-slate-200 rounded-none px-0 shadow-none bg-transparent"
                                                }}
                                                onChange={(e) => handleItemChange(item.id, "category", e.target.value)}
                                            >
                                                <SelectItem key="Camera">กล้อง</SelectItem>
                                                <SelectItem key="Lens">เลนส์</SelectItem>
                                                <SelectItem key="Accessory">อุปกรณ์</SelectItem>
                                            </Select>
                                        </TableCell>

                                        {/* Year */}
                                        <TableCell>
                                            <Input
                                                variant="bordered"
                                                placeholder="ปี/รุ่น..."
                                                size="sm"
                                                value={item.year}
                                                classNames={{
                                                    inputWrapper: "border-0 border-b border-slate-200 rounded-none px-0 shadow-none bg-transparent"
                                                }}
                                                onChange={(e) => handleItemChange(item.id, "year", e.target.value)}
                                            />
                                        </TableCell>

                                        {/* Status */}
                                        <TableCell>
                                            <PledgeStatusCell item={item} onItemChangeAction={handleItemChange} />
                                        </TableCell>

                                        {/* Pledge Price */}
                                        <TableCell>
                                            <Input
                                                type="number"
                                                variant="bordered"
                                                placeholder="0.00"
                                                size="sm"
                                                value={item.pledgePrice}
                                                classNames={{
                                                    input: "text-right font-bold text-orange-600",
                                                    inputWrapper: "border-0 border-b border-slate-200 rounded-none px-0 shadow-none bg-transparent"
                                                }}
                                                onChange={(e) => handleItemChange(item.id, "pledgePrice", e.target.value)}
                                            />
                                        </TableCell>

                                        {/* Closing Price */}
                                        <TableCell>
                                            <Input
                                                type="number"
                                                variant="bordered"
                                                placeholder="0.00"
                                                size="sm"
                                                value={item.closingPrice}
                                                classNames={{
                                                    input: "text-right font-bold text-emerald-600",
                                                    inputWrapper: "border-0 border-b border-slate-200 rounded-none px-0 shadow-none bg-transparent"
                                                }}
                                                onChange={(e) => handleItemChange(item.id, "closingPrice", e.target.value)}
                                            />
                                        </TableCell>

                                        {/* Delete */}
                                        <TableCell>
                                            <div className="flex justify-center">
                                                <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => handleRemoveItem(item.id)}>
                                                    <Trash2 size={18} />
                                                </Button>
                                            </div>
                                        </TableCell>

                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Card>

                </div>
            </div>
        </div>
    );
}
