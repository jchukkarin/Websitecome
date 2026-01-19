"use client";

import React, { useState } from "react";
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
    User,
    Tooltip,
    Checkbox
} from "@heroui/react";
import {
    Plus,
    Trash2,
    Upload,
    Save,
    RotateCcw,
    PlusCircle,

} from "lucide-react";
import axios from "axios";
import UploadForm from "../uploadform/UpLoadForm";

// เพิ่ม slipImage?: string; เข้าไปในโครงสร้างของคุณ
interface SoldItem {
    id: string;
    productName: string;
    category: string;
    year: string;
    confirmedPrice: string;
    salesPrice: string;
    productStatus: string;
    repairStatus: string;
    isReserveOpen: string;
    reserveStartDate: string;
    reserveDays: string;
    reserveEndDate: string;
    imageUrl: string;
    
    // ✅ เพิ่มบรรทัดนี้ (เครื่องหมาย ? หมายถึงจะมีค่าหรือไม่มีก็ได้)
    slipImage?: string; 
}

export default function Projects() {
    const [openSlipItemId, setOpenSlipItemId] = useState<string | null>(null);
    const [openReserveId, setOpenReserveId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split("T")[0],
        lot: "",
        consignorName: "",
        contactNumber: "",
        address: "",
        totalPrice: "",
        images: [] as string[], // Base64 or URLs
    });

    const [items, setItems] = useState([
        {
            id: "initial-item",
            productName: "",
            category: "",
            year: "",
            confirmedPrice: "",
            salesPrice: "",
            productStatus: "ready",   // ✅
            repairStatus: "",
            isReserveOpen: "boolean", // ⭐ เพิ่ม

            // 🔥 สำหรับ "ติดจอง"
            reserveStartDate: "",   // วันที่เริ่มจอง
            reserveDays: "",        // จำนวนวัน
            reserveEndDate: "",     // วันที่หมดอายุ (คำนวณ)// ✅
            imageUrl: ""
        },
    ]);

    const handleAddItem = () => {
        setItems([
            ...items,
            {
                id: crypto.randomUUID(),
                productName: "",
                category: "",
                year: "",
                productStatus: "ready",
                repairStatus: "",
                confirmedPrice: "",
                salesPrice: "",
                isReserveOpen: "boolean", // ⭐ เพิ่ม

                // 🔥 สำหรับ "ติดจอง"
                reserveStartDate: "",   // วันที่เริ่มจอง
                reserveDays: "",        // จำนวนวัน
                reserveEndDate: "",     // วันที่หมดอายุ (คำนวณ)
                imageUrl: ""

            },
        ]);
    };

    const handleRemoveItem = (id: string) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const handleItemChange = (id: string, field: string, value: string) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
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
        setItems([{
            id: "initial-item",
            productName: "",
            category: "",
            year: "",
            productStatus: "ready",
            repairStatus: "",
            confirmedPrice: "",
            salesPrice: "",
            isReserveOpen: "boolean", // ⭐ เพิ่ม

            // 🔥 สำหรับ "ติดจอง"
            reserveStartDate: "",   // วันที่เริ่มจอง
            reserveDays: "",        // จำนวนวัน
            reserveEndDate: "",     // วันที่หมดอายุ (คำนวณ)
            imageUrl: ""

        }]);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newImages: string[] = [];
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

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                ...formData,
                items,
                type: "INCOME"
            };
            await axios.post("/api/consignments", payload);
            alert("บันทึกข้อมูลการฝากขายสำเร็จ!");
            handleClear();
        } catch (error) {
            console.error("Save error:", error);
            alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        } finally {
            setLoading(false);
        }
    };

    const calculateReserveEndDate = (
        startDate: string,
        days: number
    ): string => {
        if (!startDate || !days) return "";

        const start = new Date(startDate);
        start.setDate(start.getDate() + days);

        return start.toISOString().split("T")[0];
    };

    function calculateDays(start: string, end: string) {
        if (!start || !end) return "";

        const startDate = new Date(start);
        const endDate = new Date(end);

        const diffTime = endDate.getTime() - startDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays > 0 ? diffDays.toString() : "";
    }

    const handleSlipUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;

                // ต้องอัปเดต State รวมของคุณที่นี่ (สมมติว่าชื่อ items)
                setItems((prevItems) =>
                    prevItems.map((it) =>
                        it.id === id ? { ...it, slipImage: base64String } : it
                    )
                );
            };
            reader.readAsDataURL(file);
        }
    };

    async function updateSoldItem(item: any) {
        if (!item.slipImage) {
            alert("กรุณาอัปโหลดสลิปก่อน");
            return;
        }

        await fetch("/api/consignment-items/sold", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                itemId: item.id,
                slipImage: item.slipImage,
            }),
        });

        fetchData(); // refresh table
    }

    return (
        <div className="p-8 bg-[#F9FAFB] min-h-screen rounded-2xl shadow font-sans text-gray-800">
            <div className="max-w-screen-2xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <p className="text-xs text-blue-600 font-semibold tracking-wider uppercase">การนำเข้า</p>
                        <h1 className="text-3xl font-bold text-gray-900">บันทึกการนำเข้า</h1>
                        <p className="text-sm text-gray-500">บันทึกข้อมูลการนำเข้า</p>
                    </div>
                </div>

                {/* Form Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Info */}
                    <Card className="lg:col-span-2 border border-gray-100 shadow-sm" radius="lg">
                        <CardBody className="p-6 space-y-8">

                            {/* Section Title */}
                            <div>
                                <h3 className="text-base font-semibold text-gray-900">
                                    ข้อมูลผู้ฝากขาย
                                </h3>
                                <p className="text-sm text-gray-500">
                                    กรุณากรอกข้อมูลผู้ฝากขายให้ครบถ้วน
                                </p>
                            </div>

                            {/* Grid Inputs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-700">
                                        วันที่รับสินค้าฝากขาย
                                    </p>
                                    <Input
                                        type="date"
                                        variant="bordered"
                                        value={formData.date}
                                        classNames={{
                                            inputWrapper: "h-10 border-gray-200",
                                        }}
                                        onChange={(e) =>
                                            setFormData({ ...formData, date: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-700">
                                        ล๊อต
                                    </p>
                                    <Input
                                        placeholder="ล๊อต"
                                        variant="bordered"
                                        value={formData.lot}
                                        classNames={{
                                            inputWrapper: "h-10 border-gray-200",
                                        }}
                                        onChange={(e) =>
                                            setFormData({ ...formData, lot: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-700">
                                        ชื่อผู้ฝากขาย
                                    </p>
                                    <Input
                                        placeholder="กรอกชื่อผู้ฝากขาย"
                                        variant="bordered"
                                        value={formData.consignorName}
                                        classNames={{
                                            inputWrapper: "h-10 border-gray-200",
                                        }}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                consignorName: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-700">
                                        เบอร์ติดต่อ
                                    </p>
                                    <Input
                                        placeholder="กรอกเบอร์ติดต่อ"
                                        variant="bordered"
                                        value={formData.contactNumber}
                                        classNames={{
                                            inputWrapper: "h-10 border-gray-200",
                                        }}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                contactNumber: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-700">
                                    ที่อยู่ผู้ฝากขาย
                                </p>
                                <Textarea
                                    placeholder="กรอกที่อยู่ผู้ฝากขาย"
                                    variant="bordered"
                                    minRows={3}
                                    classNames={{
                                        inputWrapper: "border-gray-200",
                                    }}
                                    value={formData.address}
                                    onChange={(e) =>
                                        setFormData({ ...formData, address: e.target.value })
                                    }
                                />
                            </div>

                            {/* Total Price */}
                            <div className="space-y-1 max-w-xs">
                                <p className="text-sm font-medium text-gray-700">
                                    ราคารวม
                                </p>
                                <Input
                                    placeholder="กรอกราคารวม"
                                    type="number"
                                    variant="bordered"
                                    classNames={{
                                        inputWrapper: "h-10 border-gray-200",
                                    }}
                                    value={formData.totalPrice}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            totalPrice: e.target.value,
                                        })
                                    }
                                />
                            </div>

                        </CardBody>
                    </Card>

                    {/* Upload Section */}
                    <Card
                        radius="lg"
                        className="border border-dashed border-gray-200 shadow-sm"
                    >
                        <CardBody className="p-6 space-y-4">
                            <div className="flex flex-col items-center justify-center py-10 space-y-4">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                />
                                <div
                                    className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <PlusCircle className="text-blue-500" size={32} />
                                </div>

                                <div className="text-center space-y-1">
                                    <p className="text-sm font-medium text-gray-700">
                                        เพิ่มรูปภาพสินค้า
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        คลิกเพื่อเลือก หรือลากไฟล์มาวาง (รองรับหลายไฟล์)
                                    </p>
                                </div>
                            </div>

                            {/* Image Preview Grid */}
                            {formData.images.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                                    {formData.images.map((src, index) => (
                                        <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-100">
                                            <img
                                                src={src}
                                                alt={`Preview ${index}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    color="danger"
                                                    variant="flat"
                                                    onPress={() => removeImage(index)}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>

                {/* TABLE */}
                <div className="w-full overflow-x-auto">
                    <Table
                        aria-label="Consignment items table"
                        removeWrapper
                        className="bg-white rounded-2xl shadow border border-gray-200 text-sm"
                    >
                        <TableHeader>
                            <TableColumn className="bg-gray-50 text-center w-24">
                                รูปภาพ
                            </TableColumn>
                            <TableColumn className="bg-gray-50">ชื่อสินค้า</TableColumn>
                            <TableColumn className="bg-gray-50 w-36">หมวดหมู่</TableColumn>
                            <TableColumn className="bg-gray-50 w-24">ปี</TableColumn>
                            <TableColumn className="bg-gray-50 w-32">ราคาสินค้า</TableColumn>
                            <TableColumn className="bg-gray-50 w-36">ราคาขาย</TableColumn>
                            <TableColumn className="bg-gray-50 w-36">สถานะสินค้า</TableColumn>
                            <TableColumn className="bg-gray-50 w-36">สถานะซ่อม</TableColumn>
                            <TableColumn className="bg-gray-50 text-center w-20">
                                ลบ
                            </TableColumn>
                        </TableHeader>

                        <TableBody items={items}>
                            {(item) => (
                                <TableRow key={item.id} className="h-[64px]">
                                    {/* IMAGE */}
                                    <TableCell className="align-middle">
                                        <div
                                            className="mx-auto w-14 h-14 rounded-lg border border-dashed
                       border-gray-300 bg-gray-50 flex items-center
                       justify-center cursor-pointer hover:border-blue-400"
                                            onClick={() =>
                                                document.getElementById(`file-${item.id}`)?.click()
                                            }
                                        >
                                            {item.imageUrl ? (
                                                <img
                                                    src={item.imageUrl}
                                                    className="w-full h-full object-cover rounded-lg"
                                                    alt="product"
                                                />
                                            ) : (
                                                <Plus className="text-gray-500" size={20} />
                                            )}

                                            <input
                                                id={`file-${item.id}`}
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    handleItemImageUpload(item.id, e)
                                                }
                                            />
                                        </div>
                                    </TableCell>

                                    {/* NAME */}
                                    <TableCell className="w-64 align-middle">
                                        <Input
                                            variant="bordered"
                                            radius="sm"
                                            size="sm"
                                            value={item.productName}
                                            placeholder="ชื่อสินค้า"
                                            classNames={{
                                                input: "text-sm",
                                                inputWrapper: "min-h-[44px]",

                                            }}
                                            onChange={(e) =>
                                                handleItemChange(item.id, "productName", e.target.value)
                                            }
                                        />
                                    </TableCell>

                                    {/* CATEGORY */}
                                    <TableCell className="align-middle">
                                        <Select
                                            variant="bordered"
                                            radius="sm"
                                            size="sm"
                                            selectedKeys={
                                                item.category ? new Set([item.category]) : new Set()
                                            }
                                            onSelectionChange={(keys) =>
                                                handleItemChange(
                                                    item.id,
                                                    "category",
                                                    Array.from(keys)[0] as string
                                                )
                                            }
                                            classNames={{
                                                trigger: "min-h-[44px] text-sm",
                                            }}
                                        >
                                            <SelectItem key="Camera" className="bg-white text-center">กล้อง</SelectItem>
                                            <SelectItem key="Other" className="bg-white text-center">อื่นๆ</SelectItem>
                                        </Select>
                                    </TableCell>

                                    {/* YEAR */}
                                    <TableCell className="w-48 align-middle">
                                        <Input
                                            variant="bordered"
                                            radius="sm"
                                            size="sm"
                                            placeholder="ปี"
                                            value={item.year}
                                            classNames={{
                                                inputWrapper: "min-h-[44px]",
                                            }}
                                            onChange={(e) =>
                                                handleItemChange(item.id, "year", e.target.value)
                                            }
                                        />
                                    </TableCell>

                                    {/* PRICE */}
                                    <TableCell className="w-64 align-middle">
                                        <Input
                                            type="number"
                                            variant="bordered"
                                            radius="sm"
                                            size="sm"
                                            placeholder="ราคาสินค้า"
                                            value={item.confirmedPrice}
                                            classNames={{
                                                inputWrapper: "min-h-[44px]",
                                            }}
                                            onChange={(e) =>
                                                handleItemChange(item.id, "confirmedPrice", e.target.value)
                                            }
                                        />
                                    </TableCell>

                                    {/* CHANNEL */}
                                    <TableCell className="align-middle">
                                        <Input
                                            variant="bordered"
                                            radius="sm"
                                            size="sm"
                                            placeholder="ราคาขาย"
                                            value={item.salesPrice}
                                            classNames={{
                                                inputWrapper: "min-h-[44px]",
                                            }}
                                            onChange={(e) =>
                                                handleItemChange(item.id, "salesPrice", e.target.value)
                                            }
                                        />
                                    </TableCell>


                                    {/* สภานะสินค้า */}
                                    <TableCell className="align-middle">
                                        <Select
                                            variant="bordered"
                                            radius="sm"
                                            size="sm"
                                            placeholder="สถานะสินค้า"
                                            selectedKeys={
                                                item.productStatus ? new Set([item.productStatus]) : new Set()
                                            }
                                            onSelectionChange={(keys) => {
                                                const status = Array.from(keys)[0] as string;
                                                handleItemChange(item.id, "productStatus", status);

                                                if (status === "reserved") {
                                                    setOpenReserveId(item.id); // ✅ เปิดฟอร์ม
                                                } else {
                                                    setOpenReserveId(null); // ✅ ปิดฟอร์ม
                                                    handleItemChange(item.id, "reserveStartDate", "");
                                                    handleItemChange(item.id, "reserveDays", "");
                                                    handleItemChange(item.id, "reserveEndDate", "");
                                                }

                                            }}
                                            classNames={{
                                                trigger: "min-h-[44px] text-sm",
                                            }}
                                        >
                                            <SelectItem key="ready" className="bg-white text-center">พร้อม</SelectItem>
                                            <SelectItem key="reserved" className="bg-white text-center">ติดจอง</SelectItem>
                                            <SelectItem key="sold" className="bg-white text-center">
                                                ขายแล้ว
                                            </SelectItem>
                                        </Select>
                                        {/* กล่องอัปโหลดที่จะปรากฏขึ้นเมื่อสถานะเป็น final repaired และ ID ตรงกัน */}
                                        {openSlipItemId === item.id && (
                                            <div className="absolute z-50 mt-2 w-[280px] bg-white rounded-xl shadow-2xl border p-4 space-y-3 right-0">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-sm font-bold text-green-600">
                                                        🎉 ซ่อมเสร็จแล้ว! กรุณาอัปโหลดสลิป
                                                    </p>
                                                </div>

                                                {/* ส่วนแสดงรูป Preview หรือที่คลิกอัปโหลด */}
                                                <div
                                                    className="h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 transition-colors"
                                                    onClick={() => document.getElementById(`slip-${item.id}`)?.click()}
                                                >
                                                    {(item as any).slipImage ? (
                                                        <img src={(item as any).slipImage} className="w-full h-full object-contain" alt="preview" />
                                                    ) : (
                                                        <>
                                                            <span className="text-2xl">📸</span>
                                                            <span className="text-xs mt-1">คลิกเพื่อเลือกรูปสลิป</span>
                                                        </>
                                                    )}
                                                </div>

                                                <input
                                                    id={`slip-${item.id}`}
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => handleSlipUpload(item.id, e)}
                                                />

                                                <div className="flex gap-2">
                                                    <Button
                                                        color="success"
                                                        className="w-full text-white font-medium"
                                                        isDisabled={!(item as any).slipImage} // ปุ่มจะกดได้ก็ต่อเมื่ออัปโหลดรูปแล้ว
                                                        onPress={async () => {
                                                            try{
                                                            await updateSoldItem(item); // บันทึกข้อมูล
                                                            setOpenSlipItemId(null);    // ปิดกล่อง
                                                            }catch(error){
                                                                console.log("Final Update",error);
                                                            }
                                                        }}
                                                    >
                                                        เสร็จสิ้น
                                                    </Button>
                                                    {/* ปุ่มของสถานะสินค้า ..ที่บอกข้อความไว้ ภายหลัง */}
                                                    <Button
                                                        variant="flat"
                                                        color="danger"
                                                        className="w-full"
                                                        onPress={() => setOpenSlipItemId(null)}
                                                    >
                                                        ภายหลัง
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {item.productStatus === "reserved" && openReserveId === item.id && (
                                            <div className="mt-3 w-[300px] bg-white rounded-xl shadow-lg border border-gray-200 p-4 space-y-4">
                                                {/* หัวข้อ */}
                                                <p className="text-sm font-semibold text-gray-800 tracking-wider mb-2">
                                                    ระยะเวลาจอง
                                                </p>

                                                {/* วันที่เริ่มจอง */}

                                                <Input
                                                    type="date"
                                                    size="sm"
                                                    label="วันที่เริ่มจอง"
                                                    value={item.reserveStartDate}
                                                    onChange={(e) => {
                                                        const start = e.target.value;
                                                        handleItemChange(item.id, "reserveStartDate", start);

                                                        const endDate = calculateReserveEndDate(
                                                            start,
                                                            Number(item.reserveDays)
                                                        );
                                                        handleItemChange(item.id, "reserveEndDate", endDate);
                                                    }}
                                                    classNames={{
                                                        label: "text-xs tracking-wide text-gray-500 mb-5",
                                                        inputWrapper: "min-h-[44px]",
                                                        input: "text-sm"
                                                    }}
                                                />

                                                {/* ระยะเวลา */}
                                                <Input
                                                    type="number"
                                                    size="sm"
                                                    label="จำนวนวัน"
                                                    placeholder="วัน"
                                                    value={item.reserveDays}
                                                    onChange={(e) => {
                                                        const days = e.target.value;
                                                        handleItemChange(item.id, "reserveDays", days);

                                                        const endDate = calculateReserveEndDate(
                                                            item.reserveStartDate,
                                                            Number(days)
                                                        );
                                                        handleItemChange(item.id, "reserveEndDate", endDate);
                                                    }}
                                                    classNames={{
                                                        label: "text-xs tracking-wide text-gray-500 mb-5",
                                                        inputWrapper: "min-h-[44px]",
                                                        input: "text-sm"
                                                    }}
                                                />

                                                {/* ปุ่มปิดฟอร์ม */}
                                                <button
                                                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md text-sm"
                                                    onClick={() => {
                                                        setOpenReserveId(null); // ✅ ปิด UI
                                                    }}
                                                >
                                                    เสร็จสิ้น
                                                </button>
                                            </div>
                                        )}


                                    </TableCell>

                                    {/*สถานะซ่อม */}
                                    <TableCell className="w-128 align-middle text-black">
                                        <Select
                                            variant="bordered"
                                            radius="sm"
                                            size="sm"
                                            placeholder="สถานะซ่อม"
                                            selectedKeys={
                                                item.repairStatus ? new Set([item.repairStatus]) : new Set()
                                            }
                                            onSelectionChange={(keys) => {
                                                const selectedValue = Array.from(keys)[0] as string;
                                                if (selectedValue === "final repaired") {
                                                    setOpenSlipItemId(item.id);
                                                } else {
                                                    handleItemChange(item.id, "repairStatus", selectedValue);
                                                }
                                            }}
                                            classNames={{
                                                trigger: "min-h-[44px] text-sm",
                                            }}
                                        >
                                            <SelectItem key="not repaired" className="bg-white text-sm">ไม่ซ่อม</SelectItem>
                                            <SelectItem key="repaired" className="bg-white text-sm">กำลังซ่อม</SelectItem>
                                            <SelectItem key="final repaired" className="bg-white text-sm">ซ่อมเสร็จสิ้น</SelectItem>
                                        </Select>
                                    </TableCell>

                                    {/* ACTION */}
                                    <TableCell className="align-middle text-center">
                                        <Button
                                            isIconOnly
                                            color="danger"
                                            variant="light"
                                            onPress={() => handleRemoveItem(item.id)}
                                        >
                                            <Trash2 size={18} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Table Actions */}
            <div className="flex justify-between items-center py-4">
                <Button
                    variant="flat"
                    color="primary"
                    startContent={<PlusCircle size={20} />}
                    onPress={handleAddItem}
                    className="font-semibold"
                >
                    เพิ่มข้อมูลนำเข้า
                </Button>
                <div className="flex gap-4">
                    <Button
                        variant="light"
                        startContent={<RotateCcw size={20} />}
                        onPress={handleClear}
                        className="bg-gray-500 font-semibold text-white px-8"
                    >
                        ล้างข้อมูล
                    </Button>
                    <Button
                        color="success"
                        startContent={<Save size={20} />}
                        onPress={handleSubmit}
                        isLoading={loading}
                        className="bg-green-700 font-bold text-white px-8"
                    >
                        บันทึก
                    </Button>
                </div>
            </div>
        </div>

    );
}
