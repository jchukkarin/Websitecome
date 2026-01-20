"use client";

import React, { useState, useRef } from "react";
import axios from "axios";
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
  Wrench,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Projects() {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleItemChange = (id: string, field: string, value: string) => {
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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        items,
        type: "REPAIR",
      };
      await axios.post("/api/consignments", payload);
      alert("บันทึกข้อมูลการฝากซ่อมสำเร็จ!");
      handleClear();
    } catch (error) {
      console.error("Save error:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen font-sans text-slate-800">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-1">
              <span>Repair Management</span>
              <span className="w-1 h-1 rounded-full bg-blue-200" />
              <span>Service Record</span>
            </nav>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              บันทึกการฝากซ่อม
            </h1>
            <p className="text-sm text-slate-500 font-medium">จัดการข้อมูลและรายละเอียดการรับฝากซ่อมสินค้า</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="flat"
              startContent={<RotateCcw size={18} />}
              onPress={handleClear}
              className="bg-white border border-slate-200 font-bold text-slate-600 h-14 px-6 rounded-2xl hover:bg-slate-50 transition-all"
            >
              ล้างฟอร์ม
            </Button>
            <Button
              color="primary"
              startContent={<Save size={18} />}
              onPress={handleSubmit}
              isLoading={loading}
              className="bg-blue-600 font-black text-white h-14 px-10 rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-95"
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
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <UserIcon size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">ข้อมูลผู้ฝากซ่อม</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Customer Information</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-lg font-bold text-slate-700">วันที่รับสินค้าฝากซ่อม</label>
                  <Input
                    type="date"
                    variant="bordered"
                    labelPlacement="outside"
                    value={formData.date}
                    startContent={<Calendar className="text-slate-400" size={18} />}
                    className="font-medium"
                    classNames={{
                      inputWrapper: "h-14 border-slate-100 bg-slate-50/50 rounded-2xl focus-within:!border-blue-500 transition-all group-data-[focus=true]:bg-white",
                    }}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-lg font-bold text-slate-700">ล๊อต</label>
                  <Input
                    placeholder="LOT-XXXXXX"
                    variant="bordered"
                    labelPlacement="outside"
                    value={formData.lot}
                    startContent={<Hash className="text-slate-400" size={18} />}
                    className="font-medium"
                    classNames={{
                      inputWrapper: "h-14 border-slate-100 bg-slate-50/50 rounded-2xl focus-within:!border-blue-500 transition-all group-data-[focus=true]:bg-white",
                    }}
                    onChange={(e) => setFormData({ ...formData, lot: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-lg font-bold text-slate-700">ชื่อผู้ฝากซ่อม</label>
                  <Input
                    placeholder="กรอกชื่อ-นามสกุล ผู้ฝากซ่อม"
                    variant="bordered"
                    labelPlacement="outside"
                    value={formData.consignorName}
                    startContent={<UserIcon className="text-slate-400" size={18} />}
                    className="font-medium"
                    classNames={{
                      inputWrapper: "h-14 border-slate-100 bg-slate-50/50 rounded-2xl focus-within:!border-blue-500 transition-all group-data-[focus=true]:bg-white",
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
                    startContent={<Phone className="text-slate-400" size={18} />}
                    className="font-medium"
                    classNames={{
                      inputWrapper: "h-14 border-slate-100 bg-slate-50/50 rounded-2xl focus-within:!border-blue-500 transition-all group-data-[focus=true]:bg-white",
                    }}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  />
                </div>
              </div>

              <Textarea
                label="ที่อยู่ผู้ฝากซ่อม"
                placeholder="กรอกที่อยู่สำหรับการจัดส่งคืน..."
                variant="bordered"
                labelPlacement="outside"
                minRows={3}
                value={formData.address}
                startContent={<MapPin className="text-slate-400 mt-1" size={18} />}
                className="font-medium px-0"
                classNames={{
                  label: "font-bold text-slate-700 text-lg",
                  inputWrapper: "border-slate-100 bg-slate-50/50 rounded-2xl focus-within:!border-blue-500 transition-all group-data-[focus=true]:bg-white p-4",
                }}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />

              <div className="flex justify-between items-center p-6 bg-slate-900 rounded-[2rem] text-white">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Total Value</p>
                  <p className="text-2xl font-black italic">ยอดรวมค่าซ่อมโดยประมาณ</p>
                </div>
                <div className="relative">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-black text-blue-400">฿</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="bg-transparent text-4xl font-black text-right outline-none w-48 pl-8 placeholder:text-slate-700"
                    value={formData.totalPrice}
                    onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })}
                  />
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
                  <h3 className="text-lg font-bold text-slate-900">รูปภาพอาการเสีย</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Defect Reference Images</p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center py-12 rounded-[2.5rem] bg-slate-50/50 border-2 border-dashed border-slate-100 relative group overflow-hidden">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
                <div className="w-20 h-20 rounded-full bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  <PlusCircle size={32} />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-base font-bold text-slate-700 tracking-tight">เพิ่มรูปภาพสินค้าฝากซ่อม</p>
                  <p className="text-xs text-slate-400 font-medium">PNG, JPG up to 10MB</p>
                </div>
              </div>

              <AnimatePresence>
                {formData.images.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 gap-4 mt-2"
                  >
                    {formData.images.map((src, index) => (
                      <motion.div
                        key={index}
                        layout
                        className="relative group aspect-square rounded-[2rem] overflow-hidden border-4 border-white shadow-lg shadow-slate-100"
                      >
                        <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                          <Button
                            isIconOnly
                            size="md"
                            color="danger"
                            radius="full"
                            variant="shadow"
                            className="scale-0 group-hover:scale-100 transition-transform duration-300"
                            onPress={() => removeImage(index)}
                          >
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
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <Wrench size={20} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">รายการสินค้าฝากซ่อม</h2>
            </div>
            <Button
              color="primary"
              variant="flat"
              startContent={<Plus size={18} />}
              onPress={handleAddItem}
              className="bg-blue-50 text-blue-700 font-black px-6 rounded-xl hover:bg-blue-100 transition-all"
            >
              เพิ่มรายการใหม่
            </Button>
          </div>

          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden" radius="lg">
            <Table
              aria-label="Items List"
              removeWrapper
              className="text-sm font-medium"
            >
              <TableHeader>
                <TableColumn className="bg-slate-50/50 text-slate-400 font-black h-14 uppercase tracking-wider text-[10px]">รูปภาพ</TableColumn>
                <TableColumn className="bg-slate-50/50 text-slate-400 font-black h-14 uppercase tracking-wider text-[10px]">ชื่อสินค้า/รายละเอียด</TableColumn>
                <TableColumn className="bg-slate-50/50 text-slate-400 font-black h-14 uppercase tracking-wider text-[10px]">หมวดหมู่</TableColumn>
                <TableColumn className="bg-slate-50/50 text-slate-400 font-black h-14 uppercase tracking-wider text-[10px]">ปี/รุ่น</TableColumn>
                <TableColumn className="bg-slate-50/50 text-slate-400 font-black h-14 uppercase tracking-wider text-[10px]">สถานะ</TableColumn>
                <TableColumn className="bg-slate-50/50 text-slate-400 font-black h-14 uppercase tracking-wider text-[10px]">ราคาเบื้องต้น</TableColumn>
                <TableColumn className="bg-slate-50/50 text-slate-400 font-black h-14 uppercase tracking-wider text-[10px]">หมายเหตุ</TableColumn>
                <TableColumn className="bg-slate-50/50 text-slate-400 font-black h-14 uppercase tracking-wider text-[10px] text-center">การกระทำ</TableColumn>
              </TableHeader>
              <TableBody items={items}>
                {(item) => (
                  <TableRow key={item.id} className="group border-b border-slate-50 last:border-none transition-colors hover:bg-slate-50/30">
                    <TableCell>
                      <div
                        className="relative w-16 h-12 rounded-xl overflow-hidden cursor-pointer group/img border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-blue-400"
                        onClick={() => document.getElementById(`repair-file-item-${item.id}`)?.click()}
                      >
                        {item.imageUrl ? (
                          <img src={item.imageUrl} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Plus size={16} />
                          </div>
                        )}
                        <input
                          type="file"
                          id={`repair-file-item-${item.id}`}
                          className="hidden"
                          onChange={(e) => handleItemImageUpload(item.id, e)}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="ชื่อสินค้า..."
                        variant="flat"
                        size="sm"
                        value={item.productName}
                        classNames={{
                          input: "font-semibold text-slate-700",
                          inputWrapper: "bg-transparent h-10 px-0 group-data-[hover=true]:bg-transparent",
                        }}
                        onChange={(e) => handleItemChange(item.id, "productName", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        placeholder="เลือก"
                        variant="flat"
                        size="sm"
                        className="min-w-[120px]"
                        selectedKeys={item.category ? [item.category] : []}
                        classNames={{
                          trigger: "bg-transparent shadow-none h-10 px-0 group-data-[hover=true]:bg-transparent",
                          value: "font-semibold text-slate-700",
                        }}
                        onChange={(e) => handleItemChange(item.id, "category", e.target.value)}
                      >
                        <SelectItem key="Filing">Filing</SelectItem>
                        <SelectItem key="Camera">กล้อง</SelectItem>
                        <SelectItem key="Other">อื่นๆ</SelectItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="ปี/รุ่น..."
                        variant="flat"
                        size="sm"
                        value={item.year}
                        classNames={{
                          input: "font-semibold text-slate-700",
                          inputWrapper: "bg-transparent h-10 px-0 group-data-[hover=true]:bg-transparent",
                        }}
                        onChange={(e) => handleItemChange(item.id, "year", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        placeholder="สถานะ"
                        variant="flat"
                        size="sm"
                        className="min-w-[120px]"
                        selectedKeys={[item.status]}
                        classNames={{
                          trigger: "bg-transparent shadow-none h-10 px-0 group-data-[hover=true]:bg-transparent",
                          value: "font-semibold text-slate-700",
                        }}
                        onChange={(e) => handleItemChange(item.id, "status", e.target.value)}
                      >
                        <SelectItem key="ขายได้">ปกติ</SelectItem>
                        <SelectItem key="ขายไม่ได้">ชำรุด</SelectItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="0.00"
                        variant="flat"
                        size="sm"
                        type="number"
                        value={item.confirmedPrice}
                        classNames={{
                          input: "font-black text-blue-600 text-right",
                          inputWrapper: "bg-transparent h-10 px-0 group-data-[hover=true]:bg-transparent",
                        }}
                        onChange={(e) => handleItemChange(item.id, "confirmedPrice", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="ระบุเพิ่มเติม..."
                        variant="flat"
                        size="sm"
                        value={item.salesChannel}
                        classNames={{
                          input: "font-semibold text-slate-600",
                          inputWrapper: "bg-transparent h-10 px-0 group-data-[hover=true]:bg-transparent",
                        }}
                        onChange={(e) => handleItemChange(item.id, "salesChannel", e.target.value)}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Tooltip content="ลบรายการนี้" color="danger">
                          <Button
                            isIconOnly
                            color="danger"
                            variant="light"
                            size="md"
                            radius="lg"
                            className="hover:bg-red-50"
                            onPress={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 size={20} />
                          </Button>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>

          {/* Empty State */}
          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-6">
                <Package size={40} />
              </div>
              <p className="text-xl font-bold text-slate-600">ยังไม่มีรายการสินค้า</p>
              <p className="text-sm text-slate-400 mb-8 font-medium italic">กรุณากดปุ่มเพิ่มรายการเพื่อเริ่มบันทึกข้อมูลฝากซ่อม</p>
              <Button
                color="primary"
                startContent={<Plus size={20} />}
                onPress={handleAddItem}
                className="bg-slate-900 font-bold px-10 rounded-2xl h-12"
              >
                เพิ่มรายการใหม่
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
