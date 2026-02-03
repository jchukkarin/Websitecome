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
  Wrench,
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
import ProductHistoryStatus from "./ProductHistoryStatus";
import RepairingHistoryStatus from "./RepairHistoryStatus";


interface RepairItem {
  id: string;
  productName: string;
  category: string;
  year: string;
  status: string;
  repairStatus: string;
  productStatus: string; // เพิ่มมาใหม่ สำหรับ RepairHistoryStatus
  confirmedPrice: string;
  salesChannel: string;
  imageUrl: string;
  defectImages?: string[] | string;
  slipImage?: string;
  repairStartDate?: string;
  repairEndDate?: string;
}

export default function Projects() {
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

  const [items, setItems] = useState<RepairItem[]>([
    {
      id: "initial-item",
      productName: "",
      category: "",
      year: "",
      status: "pending",
      repairStatus: "NOT_REPAIR",
      productStatus: "normal",
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
        status: "pending",
        repairStatus: "NOT_REPAIR",
        productStatus: "normal",
        confirmedPrice: "",
        salesChannel: "",
        imageUrl: "",
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const handleItemChange = (id: string, field: string, value: any) => {
    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, [field as keyof RepairItem]: value } : item)));
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
        status: "pending",
        repairStatus: "NOT_REPAIR",
        productStatus: "normal",
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // -------- Form หลัก --------
    if (!formData.date) newErrors.date = "กรุณาเลือกวันที่";
    if (!formData.lot) newErrors.lot = "กรุณากรอกรหัสล๊อต";
    if (!formData.consignorName) newErrors.consignorName = "กรุณากรอกชื่อผู้ฝากซ่อม";
    if (!formData.contactNumber) newErrors.contactNumber = "กรุณากรอกเบอร์โทร";
    if (!formData.totalPrice) newErrors.totalPrice = "กรุณากรอกยอดรวม";

    // -------- Items --------
    if (items.length === 0) {
      toast.error("ต้องมีสินค้าอย่างน้อย 1 รายการ");
      return false;
    }

    items.forEach((item, index) => {
      if (!item.productName)
        newErrors[`item.${item.id}.productName`] = `กรุณากรอกชื่อสินค้า (แถว ${index + 1})`;

      if (!item.category)
        newErrors[`item.${item.id}.category`] = `กรุณาเลือกหมวดหมู่ (แถว ${index + 1})`;

      if (!item.confirmedPrice)
        newErrors[`item.${item.id}.confirmedPrice`] = `กรุณากรอกราคา (แถว ${index + 1})`;

      if (!item.imageUrl)
        newErrors[`item.${item.id}.imageUrl`] = `กรุณาเพิ่มรูปสินค้า (แถว ${index + 1})`;
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
      const payload = {
        ...formData,
        items,
        type: "REPAIR",
      };
      await axios.post("/api/consignments", payload);
      toast.success("บันทึกข้อมูลการฝากซ่อมสำเร็จ!");
      handleClear();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { label: "รอดำเนินการ", value: "pending", color: "warning" as const },
    { label: "กำลังซ่อม", value: "repairing", color: "primary" as const },
    { label: "ซ่อมเสร็จแล้ว", value: "completed", color: "success" as const },
  ];

  return (
    <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen font-sans text-slate-800">
      <Toaster richColors position="top-right" />
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-purple-600 mb-1">
              <span>Repair Management</span>
              <span className="w-1 h-1 rounded-full bg-purple-200" />
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
              className="bg-white border border-slate-200 font-bold text-slate-600 h-12 px-6 rounded-2xl hover:bg-slate-50 transition-all"
            >
              ล้างฟอร์ม
            </Button>
            <Button
              color="primary"
              startContent={<Save size={18} />}
              onPress={handleSubmit}
              isLoading={loading}
              className="bg-purple-600 font-black text-white h-12 px-10 rounded-2xl shadow-xl shadow-purple-100 transition-all active:scale-95"
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
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <UserIcon size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">ข้อมูลผู้ฝากซ่อม</h3>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Customer Information</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
                <div className="space-y-1">
                  <label className="text-lg font-bold text-slate-700">วันที่รับสินค้าฝากซ่อม</label>
                  <Input
                    type="date"
                    variant="bordered"
                    labelPlacement="outside"
                    placeholder=" "
                    value={formData.date}
                    isInvalid={!!errors.date}
                    errorMessage={errors.date}
                    startContent={<Calendar className="text-slate-400" size={18} />}
                    className="font-medium"
                    classNames={{
                      label: "font-bold text-slate-700",
                      inputWrapper: "h-14 border-slate-100 bg-slate-50/50 rounded-2xl focus-within:!border-purple-500 transition-all group-data-[focus=true]:bg-white",
                    }}
                    onChange={(e) => {
                      setFormData({ ...formData, date: e.target.value });
                      setErrors((prev) => ({ ...prev, date: "" }));
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-lg font-bold text-slate-700">รหัสล๊อตสินค้า</label>
                  <Input
                    placeholder="ระบุล๊อต (e.g. REPAIR-2024-001)"
                    variant="bordered"
                    labelPlacement="outside"
                    value={formData.lot}
                    isInvalid={!!errors.lot}
                    errorMessage={errors.lot}
                    startContent={<Hash className="text-slate-400" size={18} />}
                    className="font-medium"
                    classNames={{
                      label: "font-bold text-slate-700",
                      inputWrapper: "h-14 border-slate-100 bg-slate-50/50 rounded-2xl focus-within:!border-purple-500 transition-all group-data-[focus=true]:bg-white",
                    }}
                    onChange={(e) => {
                      setFormData({ ...formData, lot: e.target.value });
                      setErrors((prev) => ({ ...prev, lot: "" }));
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-lg font-bold text-slate-700">ชื่อผู้ฝากซ่อม</label>
                  <Input
                    placeholder="กรอกชื่อ-นามสกุล ผู้ฝากซ่อม"
                    variant="bordered"
                    labelPlacement="outside"
                    value={formData.consignorName}
                    isInvalid={!!errors.consignorName}
                    errorMessage={errors.consignorName}
                    startContent={<UserIcon className="text-slate-400" size={18} />}
                    className="font-medium"
                    classNames={{
                      label: "font-bold text-slate-700",
                      inputWrapper: "h-14 border-slate-100 bg-slate-50/50 rounded-2xl focus-within:!border-purple-500 transition-all group-data-[focus=true]:bg-white",
                    }}
                    onChange={(e) => {
                      setFormData({ ...formData, consignorName: e.target.value });
                      setErrors((prev) => ({ ...prev, consignorName: "" }));
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-lg font-bold text-slate-700">เบอร์โทรศัพท์ติดต่อ</label>
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
                      label: "font-bold text-slate-700",
                      inputWrapper: "h-14 border-slate-100 bg-slate-50/50 rounded-2xl focus-within:!border-purple-500 transition-all group-data-[focus=true]:bg-white ",
                    }}
                    onChange={(e) => {
                      setFormData({ ...formData, contactNumber: e.target.value });
                      setErrors((prev) => ({ ...prev, contactNumber: "" }));
                    }}
                  />
                </div>
              </div>

              <Textarea
                label="ที่อยู่ติดต่อ"
                placeholder="ระบุที่อยู่สำหรับการจัดส่งคืน..."
                variant="bordered"
                labelPlacement="outside"
                minRows={3}
                value={formData.address}
                startContent={<MapPin className="text-slate-400 mt-1" size={18} />}
                className="font-medium"
                classNames={{
                  label: "font-bold text-slate-700",
                  inputWrapper: "border-slate-100 bg-slate-50/50 rounded-2xl focus-within:!border-purple-500 transition-all group-data-[focus=true]:bg-white p-4",
                }}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />

              <div className="flex justify-between items-center p-6 bg-slate-900 rounded-[2rem] text-white">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Total Estimate</p>
                  <p className="text-2xl font-black italic">ค่าซ่อมโดยประมาณ</p>
                </div>
                <div className="relative">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-black text-white">฿</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="bg-transparent text-4xl font-black text-right outline-none w-48 pl-6 placeholder:text-slate-700"
                    value={formData.totalPrice}
                    onChange={(e) => {
                      setFormData({ ...formData, totalPrice: e.target.value });
                      setErrors((prev) => ({ ...prev, totalPrice: "" }));
                    }}
                  />
                  {errors.totalPrice && (
                    <p className="text-red-500 text-xs font-semibold mt-2 flex items-center gap-1 absolute top-full right-0">
                      <AlertCircle size={14} /> {errors.totalPrice}
                    </p>
                  )}
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
                  <h3 className="text-lg font-bold text-slate-900">รูปภาพอาการเสีย</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Defect Images</p>
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
                <div className="w-20 h-20 rounded-full bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500">
                  <PlusCircle size={32} />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-base font-bold text-slate-700 tracking-tight">เพิ่มรูปภาพสินค้าฝากซ่อม</p>
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
                <Wrench size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">รายการสินค้าทั้งหมด</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Repair Item List ({items.length} items)</p>
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
            <div className="overflow-x-auto no-scrollbar w-full">
              <Table
                aria-label="Items List"
                removeWrapper
                className="text-sm font-medium min-w-[1200px]"
              >
                <TableHeader>
                  <TableColumn className="bg-slate-50/50 py-6 text-slate-400 font-black uppercase tracking-widest text-[10px] text-center w-24">IMAGE</TableColumn>
                  <TableColumn className="bg-slate-50/50 py-6 text-slate-400 font-black uppercase tracking-widest text-[10px]">PRODUCT DETAILS</TableColumn>
                  <TableColumn className="bg-slate-50/50 py-6 text-slate-400 font-black uppercase tracking-widest text-[10px] w-48">CATEGORY</TableColumn>
                  <TableColumn className="bg-slate-50/50 py-6 text-slate-400 font-black uppercase tracking-widest text-[10px] w-24">YEAR</TableColumn>
                  <TableColumn className="bg-slate-50/50 py-6 text-slate-400 font-black uppercase tracking-widest text-[10px] w-40">ESTIMATED COST</TableColumn>
                  <TableColumn className="bg-slate-50/50 py-6 text-slate-400 font-black uppercase tracking-widest text-[10px] w-24">REPAIR STATUS</TableColumn>
                  <TableColumn className="bg-slate-50/50 py-6 text-slate-400 font-black uppercase tracking-widest text-[10px] w-44">PRODUCT STATUS</TableColumn>
                  <TableColumn className="bg-slate-50/50 py-6 text-slate-400 font-black uppercase tracking-widest text-[10px] text-center w-20">ACTIONS</TableColumn>
                </TableHeader>
                <TableBody items={items}>
                  {(item) => (
                    <TableRow key={item.id} className="group border-b border-slate-50 last:border-none transition-colors hover:bg-slate-50/30">
                      {/* Image Column */}
                      <TableCell>
                        <div
                          className="mx-auto w-16 h-16 rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50/50 flex items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-white transition-all group/img relative overflow-hidden shadow-inner"
                          onClick={() => document.getElementById(`file-${item.id}`)?.click()}
                        >
                          {item.imageUrl ? (
                            <img src={item.imageUrl} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500" alt="product" />
                          ) : (
                            <Plus className="text-slate-300 group-hover/img:text-purple-500 group-hover/img:scale-125 transition-all" size={20} />
                          )}
                          <input
                            id={`file-${item.id}`}
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              handleItemImageUpload(item.id, e);
                              setErrors((prev) => ({
                                ...prev,
                                [`item.${item.id}.imageUrl`]: "",
                              }));
                            }}
                          />
                        </div>
                        {errors[`item.${item.id}.imageUrl`] && (
                          <div className="mt-1 flex justify-center">
                            <Chip color="danger" size="sm" variant="flat" className="h-[20px] text-[10px] px-1">
                              {errors[`item.${item.id}.imageUrl`]}
                            </Chip>
                          </div>
                        )}
                      </TableCell>

                      {/* Product Name */}
                      <TableCell>
                        <Input
                          variant="faded"
                          placeholder="ระบุชื่อรุ่น / แบรนด์สินค้า"
                          value={item.productName}
                          className="font-bold"
                          isInvalid={!!errors[`item.${item.id}.productName`]}
                          errorMessage={errors[`item.${item.id}.productName`]}
                          classNames={{
                            input: "text-slate-800",
                            inputWrapper: "border-none bg-transparent hover:bg-white focus-within:bg-white transition-all rounded-xl",
                          }}
                          onChange={(e) => {
                            handleItemChange(item.id, "productName", e.target.value);
                            setErrors((prev) => ({
                              ...prev,
                              [`item.${item.id}.productName`]: "",
                            }));
                          }}
                        />
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <Select
                          items={[
                            { key: "กล้อง", label: "กล้อง", icon: <Camera className="text-blue-500 " size={18} /> },
                            { key: "เลนส์", label: "เลนส์", icon: <Aperture className="text-emerald-500" size={18} /> },
                            { key: "ขาตั้งกล้อง", label: "ขาตั้งกล้อง", icon: <Video className="text-orange-500" size={18} /> },
                            { key: "แบต", label: "แบต", icon: <BatteryMedium className="text-pink-500" size={18} /> },
                            { key: "ฟิลม์", label: "ฟิลม์", icon: <Film className="text-purple-500" size={18} /> },
                            { key: "อื่นๆ", label: "อื่นๆ", icon: <MoreHorizontal className="text-slate-400" size={18} /> },
                          ]}
                          placeholder="เลือก"
                          variant="bordered"
                          size="sm"
                          className="min-w-[130px]"
                          selectedKeys={item.category ? [item.category] : []}
                          isInvalid={!!errors[`item.${item.id}.category`]}
                          errorMessage={errors[`item.${item.id}.category`]}
                          classNames={{
                            trigger: "bg-white border border-slate-200 h-10 rounded-lg data-[hover=true]:border-slate-300 transition-all",
                            value: "font-bold text-slate-700 text-sm",
                            popoverContent: "rounded-xl shadow-xl w-[140px]",
                          }}
                          renderValue={(items) => {
                            return items.map((item) => (
                              <div key={item.key} className="flex items-center gap-2">
                                {item.data?.icon}
                                <span>{item.data?.label}</span>
                              </div>
                            ));
                          }}
                          onChange={(e) => {
                            handleItemChange(item.id, "category", e.target.value);
                            setErrors((prev) => ({
                              ...prev,
                              [`item.${item.id}.category`]: "",
                            }));
                          }}
                        >
                          {(category) => (
                            <SelectItem
                              key={category.key}
                              textValue={category.label}
                              startContent={category.icon}
                              className="bg-white text-slate-700 font-bold"
                            >
                              {category.label}
                            </SelectItem>
                          )}
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

                      {/* Estimated Cost */}
                      <TableCell>
                        <div className="relative group/price">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">฿</span>
                          <Input
                            type="number"
                            variant="faded"
                            placeholder="0.00"
                            value={item.confirmedPrice}
                            className="font-black text-purple-600"
                            isInvalid={!!errors[`item.${item.id}.confirmedPrice`]}
                            errorMessage={errors[`item.${item.id}.confirmedPrice`]}
                            classNames={{
                              input: "text-right font-black text-purple-600 pr-1",
                              inputWrapper: "border-none bg-slate-50 group-hover/price:bg-purple-50 transition-all rounded-xl pl-6",
                            }}
                            onChange={(e) => {
                              handleItemChange(item.id, "confirmedPrice", e.target.value)
                              setErrors((prev) => ({
                                ...prev,
                                [`item.${item.id}.confirmedPrice`]: "",
                              }));
                            }}
                          />
                        </div>
                      </TableCell>

                      {/* Repair Status */}
                      <TableCell>
                        <RepairingHistoryStatus
                          item={item}
                          onItemChangeAction={handleItemChange}
                        />
                      </TableCell>

                      {/* Product Status */}
                      <TableCell>
                        <ProductHistoryStatus
                          item={item}
                          onItemChangeAction={handleItemChange}
                        />
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
            </div>
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
            className="bg-purple-600 font-black text-white w-full md:w-[400px] h-14 rounded-[1.5rem] shadow-2xl shadow-purple-200 transition-all active:scale-[0.98] text-lg"
          >
            ยืนยันการบันทึกรายการฝากซ่อม
          </Button>
        </div>
      </div>
    </div>
  );
}
