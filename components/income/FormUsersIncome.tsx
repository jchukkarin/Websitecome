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
  Popover,
  PopoverTrigger,
  PopoverContent,
  Chip,
  Tooltip
} from "@heroui/react";
import {
  Plus,
  Trash2,
  Save,
  RotateCcw,
  PlusCircle,
  Edit3,
  Calendar,
  Hash,
  User as UserIcon,
  Phone,
  MapPin,
  Package,
  Wrench,
  CheckCircle2,
  Clock,
  AlertCircle,
  Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Components
import RepairingForm from "./Repairing";
import { RepairingItem } from "./RepairStatusItem";

interface ConsignmentItem {
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
  slipImage?: string;
}

export default function ImportForm() {
  const [loading, setLoading] = useState(false);
  const [isOpenRepair, setIsOpenRepair] = useState(false);
  const [activeRepairItemId, setActiveRepairItemId] = useState<string | null>(null);

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

  const [items, setItems] = useState<ConsignmentItem[]>([
    {
      id: "initial-item",
      productName: "",
      category: "",
      year: "",
      confirmedPrice: "",
      salesPrice: "",
      productStatus: "ready",
      repairStatus: "not_repair",
      isReserveOpen: "false",
      reserveStartDate: "",
      reserveDays: "",
      reserveEndDate: "",
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
        confirmedPrice: "",
        salesPrice: "",
        productStatus: "ready",
        repairStatus: "not_repair",
        isReserveOpen: "false",
        reserveStartDate: "",
        reserveDays: "",
        reserveEndDate: "",
        imageUrl: "",
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const handleItemChange = (id: string, field: keyof ConsignmentItem, value: string) => {
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
        confirmedPrice: "",
        salesPrice: "",
        productStatus: "ready",
        repairStatus: "not_repair",
        isReserveOpen: "false",
        reserveStartDate: "",
        reserveDays: "",
        reserveEndDate: "",
        imageUrl: "",
      },
    ]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = { ...formData, items, type: "INCOME" };
      await axios.post("/api/consignments", payload);
      alert("บันทึกข้อมูลการนำเข้าสินค้าสำเร็จ!");
      handleClear();
    } catch (error) {
      console.error("Save error:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { label: "พร้อมขาย", value: "ready", color: "success" as const },
    { label: "ติดจอง", value: "reserved", color: "warning" as const },
    { label: "ขายแล้ว", value: "danger" as const },
  ];

  return (
    <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen font-sans text-slate-800">
      <div className="max-w-[1600px] mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-1">
              <span>Import Management</span>
              <span className="w-1 h-1 rounded-full bg-blue-200" />
              <span>Inventory Record</span>
            </nav>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              บันทึกการนำเข้า
            </h1>
            <p className="text-sm text-slate-500 font-medium">จัดการข้อมูลและรายละเอียดการนำเข้าสินค้าใหม่เข้าระบบ</p>
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
              className="bg-blue-600 font-black text-white h-12 px-10 rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-95"
            >
              บันทึกรายการ
            </Button>
          </div>
        </div>

        {/* Top Forms Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Card */}
          <Card className="lg:col-span-2 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 backdrop-blur-xl" radius="lg">
            <CardBody className="p-8 space-y-10">
              <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <UserIcon size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">บันทึกข้อมูลการนำเข้า / แหล่งที่มา</h3>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">บันทึกข้อมูลการนำเข้าสินค้า</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
                <div className="space-y-1">
                  <label className="text-lg font-bold text-slate-700">วันที่รับสินค้า</label>
                  <Input
                    type="date"
                    variant="bordered"
                    labelPlacement="outside"
                    placeholder=" "
                    value={formData.date}
                    startContent={<Calendar className="text-slate-400" size={18} />}
                    className="font-medium"
                    classNames={{
                      label: "font-bold text-slate-700",
                      inputWrapper: "h-14 border-slate-100 bg-slate-50/50 rounded-2xl focus-within:!border-blue-500 transition-all group-data-[focus=true]:bg-white",
                    }}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-lg font-bold text-slate-700">รหัสล๊อตสินค้า</label>
                  <Input
                    placeholder="ระบุล๊อต (e.g. LOT-2024-001)"
                    variant="bordered"
                    labelPlacement="outside"
                    value={formData.lot}
                    startContent={<Hash className="text-slate-400" size={18} />}
                    className="font-medium"
                    classNames={{
                      label: "font-bold text-slate-700",
                      inputWrapper: "h-14 border-slate-100 bg-slate-50/50 rounded-2xl focus-within:!border-blue-500 transition-all group-data-[focus=true]:bg-white",
                    }}
                    onChange={(e) => setFormData({ ...formData, lot: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-lg font-bold text-slate-700">ชื่อผู้ขาย</label>
                  <Input
                    placeholder="กรอกชื่อ-นามสกุล หรือชื่อร้าน"
                    variant="bordered"
                    labelPlacement="outside"
                    value={formData.consignorName}
                    startContent={<UserIcon className="text-slate-400" size={18} />}
                    className="font-medium"
                    classNames={{
                      label: "font-bold text-slate-700",
                      inputWrapper: "h-14 border-slate-100 bg-slate-50/50 rounded-2xl focus-within:!border-blue-500 transition-all group-data-[focus=true]:bg-white",
                    }}
                    onChange={(e) => setFormData({ ...formData, consignorName: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-lg font-bold text-slate-700">เบอร์โทรศัพท์ติดต่อ</label>
                  <Input
                    placeholder="08X-XXX-XXXX"
                    variant="bordered"
                    labelPlacement="outside"
                    value={formData.contactNumber}
                    startContent={<Phone className="text-slate-400" size={18} />}
                    className="font-medium"
                    classNames={{
                      label: "font-bold text-slate-700",
                      inputWrapper: "h-14 border-slate-100 bg-slate-50/50 rounded-2xl focus-within:!border-blue-500 transition-all group-data-[focus=true]:bg-white ",
                    }}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  />
                </div>
              </div>

              <Textarea
                label="ที่อยู่ติดต่อ"
                placeholder="ระบุที่อยู่โดยละเอียด..."
                variant="bordered"
                labelPlacement="outside"
                minRows={3}
                value={formData.address}
                startContent={<MapPin className="text-slate-400 mt-1" size={18} />}
                className="font-medium"
                classNames={{
                  label: "font-bold text-slate-700",
                  inputWrapper: "border-slate-100 bg-slate-50/50 rounded-2xl focus-within:!border-blue-500 transition-all group-data-[focus=true]:bg-white p-4",
                }}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />

              <div className="flex justify-between items-center p-6 bg-slate-900 rounded-[2rem] text-white">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Total Value</p>
                  <p className="text-2xl font-black italic">ยอดรวมทั้งหมด</p>
                </div>
                <div className="relative">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-black text-white">฿</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="bg-transparent text-4xl font-black text-right outline-none w-48 pl-6 placeholder:text-slate-700"
                    value={formData.totalPrice}
                    onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })}
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Master Image Upload Section */}
          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 backdrop-blur-xl" radius="lg">
            <CardBody className="p-8 space-y-6">
              <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600">
                  <ImageIcon size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">รูปภาพรวม</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Master Batch Images</p>
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
                  <p className="text-base font-bold text-slate-700 tracking-tight">เพิ่มรูปภาพสินค้าในล๊อต</p>
                  <p className="text-xs text-slate-400 font-medium">PNG, JPG up to 10MB</p>
                </div>

                {/* Visual decoration */}
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                  <ImageIcon size={64} className="text-slate-300" />
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

        {/* Items Table Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <Package size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">รายการสินค้าทั้งหมด</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Detailed Product Inventory ({items.length} items)</p>
              </div>
            </div>
            <Button
              variant="shadow"
              color="primary"
              startContent={<PlusCircle size={20} />}
              onPress={handleAddItem}
              className="font-black h-12 px-8 rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-200"
            >
              เพิ่มสินค้าใหม่
            </Button>
          </div>

          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden" radius="lg">
            <Table
              aria-label="Items List"
              removeWrapper
              className="text-sm font-medium"
            >
              <TableHeader>
                <TableColumn className="bg-slate-50/50 py-6 text-slate-400 font-black uppercase tracking-widest text-[10px] text-center w-24">IMAGE</TableColumn>
                <TableColumn className="bg-slate-50/50 py-6 text-slate-400 font-black uppercase tracking-widest text-[10px]">PRODUCT DETAILS</TableColumn>
                <TableColumn className="bg-slate-50/50 py-6 text-slate-400 font-black uppercase tracking-widest text-[10px] w-48">CATEGORY</TableColumn>
                <TableColumn className="bg-slate-50/50 py-6 text-slate-400 font-black uppercase tracking-widest text-[10px] w-24">YEAR</TableColumn>
                <TableColumn className="bg-slate-50/50 py-6 text-slate-400 font-black uppercase tracking-widest text-[10px] w-40">COST / CONFIRMED</TableColumn>
                <TableColumn className="bg-slate-50/50 py-6 text-slate-400 font-black uppercase tracking-widest text-[10px] w-40">SELLING PRICE</TableColumn>
                <TableColumn className="bg-slate-50/50 py-6 text-slate-400 font-black uppercase tracking-widest text-[10px] w-44">PRODUCT STATUS</TableColumn>
                <TableColumn className="bg-slate-50/50 py-6 text-slate-400 font-black uppercase tracking-widest text-[10px] w-44">REPAIR STATUS</TableColumn>
                <TableColumn className="bg-slate-50/50 py-6 text-slate-400 font-black uppercase tracking-widest text-[10px] text-center w-20">ACTIONS</TableColumn>
              </TableHeader>
              <TableBody items={items}>
                {(item) => (
                  <TableRow key={item.id} className="group border-b border-slate-50 last:border-none transition-colors hover:bg-slate-50/30">
                    {/* Image Column */}
                    <TableCell>
                      <div
                        className="mx-auto w-16 h-16 rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50/50 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-white transition-all group/img relative overflow-hidden shadow-inner"
                        onClick={() => document.getElementById(`file-${item.id}`)?.click()}
                      >
                        {item.imageUrl ? (
                          <img src={item.imageUrl} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500" alt="product" />
                        ) : (
                          <Plus className="text-slate-300 group-hover/img:text-blue-500 group-hover/img:scale-125 transition-all" size={20} />
                        )}
                        <input
                          id={`file-${item.id}`}
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleItemImageUpload(item.id, e)}
                        />
                      </div>
                    </TableCell>

                    {/* Product Name */}
                    <TableCell>
                      <Input
                        variant="faded"
                        placeholder="ระบุชื่อรุ่น / แบรนด์สินค้า"
                        value={item.productName}
                        className="font-bold"
                        classNames={{
                          input: "text-slate-800",
                          inputWrapper: "border-none bg-transparent hover:bg-white focus-within:bg-white transition-all rounded-xl",
                        }}
                        onChange={(e) => handleItemChange(item.id, "productName", e.target.value)}
                      />
                    </TableCell>

                    {/* Category */}
                    <TableCell>
                      <Select
                        variant="faded"
                        placeholder="เลือกหมวดหมู่"
                        className="max-w-[160px] font-bold"
                        selectedKeys={item.category ? new Set([item.category]) : new Set()}
                        classNames={{
                          trigger: "border-none bg-transparent hover:bg-white shadow-none rounded-xl h-10",
                        }}
                        onSelectionChange={(keys) => handleItemChange(item.id, "category", Array.from(keys)[0] as string)}
                      >
                        <SelectItem key="Camera" startContent={<ImageIcon size={16} />}>กล้อง</SelectItem>
                        <SelectItem key="Lens" startContent={<Package size={16} />}>เลนส์</SelectItem>
                        <SelectItem key="Accessory" startContent={<Plus size={16} />}>อุปกรณ์เสริม</SelectItem>
                        <SelectItem key="Other">อื่นๆ</SelectItem>
                      </Select>
                    </TableCell>

                    {/* Year */}
                    <TableCell>
                      <Input
                        variant="faded"
                        placeholder="ปีที่ผลิต"
                        value={item.year}
                        className="font-bold w-20"
                        classNames={{
                          input: "text-center",
                          inputWrapper: "border-none bg-transparent hover:bg-white rounded-xl h-10 shadow-none",
                        }}
                        onChange={(e) => handleItemChange(item.id, "year", e.target.value)}
                      />
                    </TableCell>

                    {/* Cost Price */}
                    <TableCell>
                      <div className="relative group/price">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">฿</span>
                        <Input
                          type="number"
                          variant="faded"
                          placeholder="0.00"
                          value={item.confirmedPrice}
                          className="font-black text-blue-600"
                          classNames={{
                            input: "text-right font-black text-blue-600 pr-1",
                            inputWrapper: "border-none bg-slate-50 group-hover/price:bg-blue-50 transition-all rounded-xl pl-6",
                          }}
                          onChange={(e) => handleItemChange(item.id, "confirmedPrice", e.target.value)}
                        />
                      </div>
                    </TableCell>

                    {/* Sale Price */}
                    <TableCell>
                      <div className="relative group/price">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">฿</span>
                        <Input
                          type="number"
                          variant="faded"
                          placeholder="0.00"
                          value={item.salesPrice}
                          className="font-black text-green-600"
                          classNames={{
                            input: "text-right font-black text-green-600 pr-1",
                            inputWrapper: "border-none bg-slate-50 group-hover/price:bg-green-50 transition-all rounded-xl pl-6",
                          }}
                          onChange={(e) => handleItemChange(item.id, "salesPrice", e.target.value)}
                        />
                      </div>
                    </TableCell>

                    {/* Product Status */}
                    <TableCell>
                      <Select
                        variant="faded"
                        size="sm"
                        selectedKeys={item.productStatus ? new Set([item.productStatus]) : new Set(["ready"])}
                        classNames={{
                          trigger: "border-none bg-transparent hover:bg-white shadow-none rounded-xl font-bold min-h-[40px]",
                        }}
                        renderValue={(items) => {
                          return items.map((item) => {
                            const option = statusOptions.find(o => o.value === item.key);
                            return (
                              <Chip key={item.key} color={option?.color} variant="flat" size="sm" className="font-bold border-none">
                                {option?.label}
                              </Chip>
                            );
                          });
                        }}
                        onSelectionChange={(keys) => handleItemChange(item.id, "productStatus", Array.from(keys)[0] as string)}
                      >
                        {statusOptions.map((opt) => (
                          <SelectItem key={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </TableCell>

                    {/* Repair Status */}
                    <TableCell>
                      <Popover
                        isOpen={isOpenRepair && activeRepairItemId === item.id}
                        onOpenChange={(open) => {
                          setIsOpenRepair(open);
                          if (open) setActiveRepairItemId(item.id);
                        }}
                        placement="bottom-end"
                        offset={10}
                      >
                        <PopoverTrigger>
                          <Button
                            size="sm"
                            variant="flat"
                            startContent={
                              item.repairStatus === "not_repair" ? <CheckCircle2 size={14} className="text-slate-400" /> :
                                item.repairStatus === "repairing" ? <Wrench size={14} className="text-amber-500 animate-pulse" /> :
                                  <AlertCircle size={14} className="text-blue-500" />
                            }
                            className={`w-full font-bold h-10 rounded-xl border-none transition-all ${item.repairStatus === "repairing" ? "bg-amber-50 text-amber-600" :
                              item.repairStatus === "not_repair" ? "bg-slate-50 text-slate-500" :
                                "bg-blue-50 text-blue-600"
                              }`}
                          >
                            {item.repairStatus === "not_repair" ? "ไม่ซ่อม" :
                              item.repairStatus === "repairing" ? "กำลังซ่อม" : "ซ่อมเสร็จแล้ว"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 border-none shadow-2xl overflow-hidden rounded-[2rem] bg-white">
                          <div className="w-[300px] bg-white">
                            <div className="p-3 bg-slate-50/50 border-b border-slate-100 mb-2">
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Update Management</p>
                              <h4 className="font-black text-slate-800">จัดการสถานะสินค้า</h4>
                            </div>
                            <div className="p-4 space-y-2">
                              <div
                                className="px-6 py-4 text-sm font-bold text-slate-600 hover:bg-slate-50 cursor-pointer rounded-2xl transition-all flex items-center gap-3 border border-transparent hover:border-slate-100"
                                onClick={() => {
                                  handleItemChange(item.id, "repairStatus", "not_repair");
                                  setIsOpenRepair(false);
                                }}
                              >
                                <div className="w-4 h-4 rounded-full border-4 border-slate-200" />
                                ไม่ประสงค์ซ่อมสินค้า
                              </div>

                              <Popover placement="right-start" offset={20}>
                                <PopoverTrigger>
                                  <div className="px-6 py-4 text-sm font-bold text-amber-600 bg-amber-50/30 hover:bg-amber-50 cursor-pointer rounded-2xl transition-all flex items-center justify-between border border-transparent hover:border-amber-100 group">
                                    <div className="flex items-center gap-3">
                                      <Clock size={18} />
                                      ระบุกำหนดการซ่อม
                                    </div>
                                    <Edit3 size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 bg-transparent shadow-none border-none">
                                  <RepairingForm onComplete={() => setIsOpenRepair(false)} />
                                </PopoverContent>
                              </Popover>

                              <div
                                className="px-6 py-4 text-sm font-bold text-blue-600 bg-blue-50/30 hover:bg-blue-50 cursor-pointer rounded-2xl transition-all flex items-center gap-3 border border-transparent hover:border-blue-100"
                                onClick={() => {
                                  handleItemChange(item.id, "repairStatus", "completed");
                                  setIsOpenRepair(false);
                                }}
                              >
                                <CheckCircle2 size={18} />
                                ยืนยันซ่อมเสร็จสิ้น
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>

                    {/* Actions */}
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
              <p className="text-sm text-slate-400 mb-8 font-medium italic">กรุณากดปุ่มเพิ่มสินค้าใหม่เพื่อเริ่มบันทึกรายการ</p>
              <Button
                color="primary"
                startContent={<Plus size={20} />}
                onPress={handleAddItem}
                className="bg-slate-900 font-bold px-10 rounded-2xl h-12"
              >
                เพิ่มสินค้ากระบอกแรก
              </Button>
            </div>
          )}
        </div>

        {/* Action Buttons Section */}
        <div className="flex justify-center flex-col md:flex-row items-center gap-4 py-12">
          <Button
            variant="flat"
            startContent={<RotateCcw size={20} />}
            onPress={handleClear}
            className="bg-white border border-slate-200 font-bold text-slate-500 w-full md:w-auto px-10 h-14 rounded-[1.5rem] hover:bg-slate-50 transition-all"
          >
            ล้างข้อมูลทั้งหมด
          </Button>
          <Button
            color="primary"
            startContent={<Save size={20} />}
            onPress={handleSubmit}
            isLoading={loading}
            className="bg-blue-600 font-black text-white w-full md:w-[400px] h-14 rounded-[1.5rem] shadow-2xl shadow-blue-200 transition-all active:scale-[0.98] text-lg"
          >
            ยืนยันการบันทึกรายการนำเข้า
          </Button>
        </div>
      </div>
    </div>
  );
}
