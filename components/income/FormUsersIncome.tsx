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
    Tooltip
} from "@heroui/react";
import {
    Plus,
    Trash2,
    Upload,
    Save,
    RotateCcw,
    PlusCircle,
    LogOut,
    UserCircle
} from "lucide-react";
import axios from "axios";
import UploadForm from "../uploadform/UpLoadForm";

export default function Projects() {
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
            status: "ขายได้",
            confirmedPrice: "",
            salesChannel: "",
            imageUrl: "https://avatars.githubusercontent.com/u/30373425?v=4" // Placeholder
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
                status: "ขายได้",
                confirmedPrice: "",
                salesChannel: "",
                imageUrl: "https://avatars.githubusercontent.com/u/30373425?v=4"
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
            status: "ขายได้",
            confirmedPrice: "",
            salesChannel: "",
            imageUrl: "https://avatars.githubusercontent.com/u/30373425?v=4"
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
                items
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

    return (
        <div className="p-8 bg-[#F9FAFB] min-h-screen font-sans text-gray-800">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <p className="text-xs text-blue-600 font-semibold tracking-wider uppercase">การนำเข้า</p>
                        <h1 className="text-3xl font-bold text-gray-900">บันทึกการนำเข้า</h1>
                        <p className="text-sm text-gray-500">บันทึกข้อมูลการนำเข้า</p>
                    </div>
                    <div className="flex gap-2">
                        <Button isIconOnly variant="light" radius="full" size="sm">
                            <UserCircle size={20} className="text-gray-400" />
                        </Button>
                        <Button isIconOnly variant="light" radius="full" size="sm">
                            <LogOut size={20} className="text-gray-400" />
                        </Button>
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

                {/* Product Items Table */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">รายการสินค้า</h2>
                    <Table
                        aria-label="Consignment items table"
                        removeWrapper
                        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                        <TableHeader>
                            <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold">รูปภาพสินค้า</TableColumn>
                            <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold">ชื่อสินค้า/รายละเอียด</TableColumn>
                            <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold">หมวดหมู่</TableColumn>
                            <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold">ปี</TableColumn>
                            <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold">สถานะการฝากขาย</TableColumn>
                            <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold">ราคาคอนเฟิร์ม</TableColumn>
                            <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold">ช่องทางการขาย</TableColumn>
                            <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold text-center w-10"></TableColumn>
                        </TableHeader>
                        <TableBody items={items}>
                            {(item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div
                                            className="flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg w-16 h-12 bg-blue-50/30 cursor-pointer hover:border-blue-400 transition group relative overflow-hidden"
                                            onClick={() => document.getElementById(`file-item-${item.id}`)?.click()}
                                        >
                                            {item.imageUrl && (item.imageUrl.startsWith("data:") || item.imageUrl.startsWith("/")) ? (
                                                <img src={item.imageUrl} className="w-full h-full object-cover" />
                                            ) : (
                                                <Plus className="text-blue-400 group-hover:text-blue-600" size={16} />
                                            )}
                                            <input
                                                type="file"
                                                id={`file-item-${item.id}`}
                                                className="hidden"
                                                onChange={(e) => handleItemImageUpload(item.id, e)}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            placeholder="กรอกชื่อสินค้า..."
                                            variant="underlined"
                                            value={item.productName}
                                            onChange={(e) => handleItemChange(item.id, "productName", e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            placeholder="เลือก"
                                            variant="underlined"
                                            size="sm"
                                            selectedKeys={item.category ? [item.category] : []}
                                            onChange={(e) => handleItemChange(item.id, "category", e.target.value)}
                                            classNames={{
                                                trigger: "text-sm",
                                                value: "text-sm",
                                            }}
                                        >
                                            <SelectItem key="Filing" className="text-sm font-normal">Filing</SelectItem>
                                            <SelectItem key="Camera" className="text-sm font-normal">กล้อง</SelectItem>
                                            <SelectItem key="Other" className="text-sm font-normal">อื่นๆ</SelectItem>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            placeholder="กรอกข้อมูล..."
                                            variant="underlined"
                                            value={item.year}
                                            onChange={(e) => handleItemChange(item.id, "year", e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            placeholder="เลือก"
                                            variant="underlined"
                                            size="sm"
                                            selectedKeys={[item.status]}
                                            onChange={(e) => handleItemChange(item.id, "status", e.target.value)}
                                            classNames={{
                                                trigger: "text-sm",
                                                value: "text-sm",
                                            }}
                                        >
                                            <SelectItem key="ขายได้" className="text-sm font-normal">ขายได้</SelectItem>
                                            <SelectItem key="ขายไม่ได้" className="text-sm font-normal">ขายไม่ได้</SelectItem>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            placeholder="กรอกข้อมูล..."
                                            variant="underlined"
                                            type="number"
                                            value={item.confirmedPrice}
                                            onChange={(e) => handleItemChange(item.id, "confirmedPrice", e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            placeholder="เช่น Shopee"
                                            variant="underlined"
                                            value={item.salesChannel}
                                            onChange={(e) => handleItemChange(item.id, "salesChannel", e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip content="ลบรายการ" color="danger">
                                            <Button
                                                isIconOnly
                                                variant="light"
                                                color="danger"
                                                size="sm"
                                                onClick={() => handleRemoveItem(item.id)}
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

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

            </div>
        </div>
    );
}
