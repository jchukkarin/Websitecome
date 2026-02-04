"use client";

import React, { useState, useRef, useEffect } from "react";
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
  HandCoins,
  Clock,
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
import PawnStatusCell from "./PawnStatusCell";

export default function PawnRecording() {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    endDate: "", // วันที่จำนำเสร็จสิ้น
    lot: "", // ชื่อผู้รับจำนำ
    consignorName: "",
    contactNumber: "",
    address: "",
    totalPrice: "0",
    images: [] as string[],
    receiverId: "", // ID พนักงานผู้รับจำนำ
  });

  const [employees, setEmployees] = useState<any[]>([]);

  const [items, setItems] = useState([
    {
      id: "initial-item",
      productName: "",
      category: "",
      year: "",
      status: "active",
      confirmedPrice: "",
      redemptionPrice: "",
      salesChannel: "",
      imageUrl: "",
    },
  ]);

  // 🔥 Auto Generate Lot & Fetch Employees
  useEffect(() => {
    const fetchLot = async () => {
      try {
        const res = await axios.get("/api/pawn/lot");
        if (res.data.lot) {
          setFormData((prev) => ({ ...prev, lot: res.data.lot }));
        }
      } catch (error) {
        console.error("Failed to fetch lot:", error);
      }
    };

    const fetchEmployees = async () => {
      try {
        const res = await axios.get("/api/employees");
        setEmployees(res.data);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };

    if (!formData.lot) fetchLot();
    fetchEmployees();
  }, []);

  // 🔥 Auto Sum Total Price
  useEffect(() => {
    const total = items.reduce(
      (sum, item) => sum + Number(item.confirmedPrice || 0),
      0
    );
    setFormData((prev) => ({
      ...prev,
      totalPrice: total.toString()
    }));
  }, [items]);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: crypto.randomUUID(),
        productName: "",
        category: "",
        year: "",
        status: "active",
        confirmedPrice: "",
        redemptionPrice: "",
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
    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
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
      endDate: "",
      lot: "",
      consignorName: "",
      contactNumber: "",
      address: "",
      totalPrice: "0",
      images: [],
      receiverId: "",
    });
    setItems([
      {
        id: "initial-item",
        productName: "",
        category: "",
        year: "",
        status: "active",
        confirmedPrice: "",
        redemptionPrice: "",
        salesChannel: "",
        imageUrl: "",
      },
    ]);

    // Re-fetch lot after clear
    const fetchLot = async () => {
      try {
        const res = await axios.get("/api/pawn/lot");
        if (res.data.lot) {
          setFormData((prev) => ({ ...prev, lot: res.data.lot }));
        }
      } catch (error) {
        console.error("Failed to fetch lot:", error);
      }
    };
    fetchLot();
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
    if (!formData.endDate) newErrors.endDate = "กรุณาเลือกวันครบกำหนด";
    if (!formData.lot) newErrors.lot = "กรุณารอสักครู่เพื่อสร้างเลขที่สัญญา";
    if (!formData.receiverId) newErrors.receiverId = "กรุณาเลือกพนักงานผู้รับจำนำ";
    if (!formData.consignorName) newErrors.consignorName = "กรุณากรอกชื่อผู้นำมาจำนำ";
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
        newErrors[`item.${item.id}.confirmedPrice`] = `กรุณากรอกราคาจำนำ (แถว ${index + 1})`;

      if (!item.redemptionPrice)
        newErrors[`item.${item.id}.redemptionPrice`] = `กรุณากรอกราคาไถ่ถอน (แถว ${index + 1})`;

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
        type: "PAWN",
      };
      await axios.post("/api/consignments", payload);
      toast.success("บันทึกข้อมูลการจำนำสำเร็จ!");
      handleClear();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen font-sans text-slate-800">
      <Toaster richColors position="top-right" />
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 mb-1">
              <span>Pawn Management</span>
              <span className="w-1 h-1 rounded-full bg-orange-200" />
              <span>Financial Record</span>
            </nav>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              บันทึกการจำนำสินค้า
            </h1>
            <p className="text-sm text-slate-500 font-medium">จัดการข้อมูลและรายละเอียดการรับจำนำสินค้า</p>
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
              color="warning"
              startContent={<Save size={18} />}
              onPress={handleSubmit}
              isLoading={loading}
              className="bg-orange-600 font-black text-white h-14 px-10 rounded-2xl shadow-xl shadow-orange-100 transition-all active:scale-95"
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
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                  <UserIcon size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">ข้อมูลผู้นำมาจำนำ</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pawner Information</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-lg font-bold text-slate-700">วันที่รับจำนำ</label>
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
                      inputWrapper: "h-14 border-slate-100 bg-slate-50/50 rounded-2xl focus-within:!border-orange-500 transition-all group-data-[focus=true]:bg-white",
                    }}
                    onChange={(e) => {
                      setFormData({ ...formData, date: e.target.value })
                      setErrors((prev) => ({ ...prev, date: "" }));
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-lg font-bold text-slate-700">วันที่จำนำเสร็จสิ้น</label>
                  <Input
                    type="date"
                    variant="bordered"
                    labelPlacement="outside"
                    value={formData.endDate}
                    isInvalid={!!errors.endDate}
                    errorMessage={errors.endDate}
                    startContent={<Clock className="text-slate-400" size={18} />}
                    className="font-medium"
                    classNames={{
                      inputWrapper: "h-14 border-slate-100 bg-slate-50/50 rounded-2xl focus-within:!border-orange-500 transition-all group-data-[focus=true]:bg-white",
                    }}
                    onChange={(e) => {
                      setFormData({ ...formData, endDate: e.target.value });
                      setErrors((prev) => ({ ...prev, endDate: "" }));
                    }}
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-lg font-bold text-slate-700">เลขที่สัญญาจำนำ (LOT)</label>
                  <Input
                    placeholder="กำลังสร้างเลขที่สัญญา..."
                    variant="bordered"
                    labelPlacement="outside"
                    value={formData.lot}
                    readOnly
                    isInvalid={!!errors.lot}
                    errorMessage={errors.lot}
                    startContent={<Hash className="text-slate-400" size={18} />}
                    className="font-medium"
                    classNames={{
                      inputWrapper: "h-14 border-slate-100 bg-slate-100 rounded-2xl font-black text-slate-900 cursor-default select-none",
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-lg font-bold text-slate-700">ชื่อผู้นำมาจำนำ</label>
                  <Input
                    placeholder="กรอกชื่อผู้นำมาจำนำ"
                    variant="bordered"
                    labelPlacement="outside"
                    value={formData.consignorName}
                    isInvalid={!!errors.consignorName}
                    errorMessage={errors.consignorName}
                    startContent={<UserIcon className="text-slate-400" size={18} />}
                    className="font-medium"
                    classNames={{
                      inputWrapper: "h-14 border-slate-100 bg-slate-50/50 rounded-2xl focus-within:!border-orange-500 transition-all group-data-[focus=true]:bg-white",
                    }}
                    onChange={(e) => {
                      setFormData({ ...formData, consignorName: e.target.value });
                      setErrors((prev) => ({ ...prev, consignorName: "" }));
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-lg font-bold text-slate-700">พนักงานผู้รับจำนำ</label>
                  <Select
                    placeholder="เลือกพนักงานผู้รับจำนำ"
                    variant="bordered"
                    labelPlacement="outside"
                    selectedKeys={formData.receiverId ? [formData.receiverId] : []}
                    isInvalid={!!errors.receiverId}
                    errorMessage={errors.receiverId}
                    startContent={<UserIcon className="text-slate-400" size={18} />}
                    className="font-medium"
                    classNames={{
                      trigger: "h-14 border-slate-100 bg-slate-50/50 rounded-2xl focus-within:!border-orange-500 transition-all",
                      value: "text-slate-700 font-bold"
                    }}
                    onChange={(e) => {
                      setFormData({ ...formData, receiverId: e.target.value });
                      setErrors((prev) => ({ ...prev, receiverId: "" }));
                    }}
                  >
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} textValue={emp.name || emp.username}>
                        {emp.name || emp.username} ({emp.role})
                      </SelectItem>
                    ))}
                  </Select>
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
                      inputWrapper: "h-14 border-slate-100 bg-slate-50/50 rounded-2xl focus-within:!border-orange-500 transition-all group-data-[focus=true]:bg-white",
                    }}
                    onChange={(e) => {
                      setFormData({ ...formData, contactNumber: e.target.value });
                      setErrors((prev) => ({ ...prev, contactNumber: "" }));
                    }}
                  />
                </div>
              </div>

              <Textarea
                label="ที่อยู่ผู้นำมาจำนำ"
                placeholder="กรอกที่อยู่โดยละเอียด..."
                variant="bordered"
                labelPlacement="outside"
                minRows={3}
                value={formData.address}
                startContent={<MapPin className="text-slate-400 mt-1" size={18} />}
                className="font-medium px-0"
                classNames={{
                  label: "font-bold text-slate-700 text-lg",
                  inputWrapper: "border-slate-100 bg-slate-50/50 rounded-2xl focus-within:!border-orange-500 transition-all group-data-[focus=true]:bg-white p-4",
                }}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />

              <div className="flex justify-between items-center p-6 bg-slate-900 rounded-[2rem] text-white">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Pawn Value</p>
                  <p className="text-2xl font-black italic">ยอดรวมจำนำทั้งหมด</p>
                </div>
                <div className="relative">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-black text-orange-400">฿</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="bg-transparent text-4xl font-black text-right outline-none w-48 pl-8 placeholder:text-slate-700"
                    value={formData.totalPrice}
                    readOnly
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

          {/* Image Upload Card */}
          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 backdrop-blur-xl" radius="lg">
            <CardBody className="p-8 space-y-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600">
                  <ImageIcon size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">รูปภาพสินค้าจำนำ</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Item Reference Images</p>
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
                <div className="w-20 h-20 rounded-full bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500">
                  <PlusCircle size={32} />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-base font-bold text-slate-700 tracking-tight">เพิ่มรูปภาพสินค้า</p>
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
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-200">
                <HandCoins size={20} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">รายการสินค้าจำนำ</h2>
            </div>
            <Button
              color="warning"
              variant="flat"
              startContent={<Plus size={18} />}
              onPress={handleAddItem}
              className="bg-orange-50 text-orange-700 font-black px-6 rounded-xl hover:bg-orange-100 transition-all"
            >
              เพิ่มสินค้าจำนำ
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
                <TableColumn className="bg-slate-50/50 text-slate-400 font-black h-14 uppercase tracking-wider text-[10px]">สถานะจำนำ</TableColumn>
                <TableColumn className="bg-slate-50/50 text-slate-400 font-black h-14 uppercase tracking-wider text-[10px]">ราคาจำนำ</TableColumn>
                <TableColumn className="bg-slate-50/50 text-slate-400 font-black h-14 uppercase tracking-wider text-[10px] text-center">ราคาปิดยอด</TableColumn>
                <TableColumn className="bg-slate-50/50 text-slate-400 font-black h-14 uppercase tracking-wider text-[10px] text-center">การกระทำ</TableColumn>
              </TableHeader>
              <TableBody items={items}>
                {(item) => (
                  <TableRow key={item.id} className="group border-b border-slate-50 last:border-none transition-colors hover:bg-slate-50/30">
                    <TableCell>
                      <div
                        className="relative w-16 h-12 rounded-xl overflow-hidden cursor-pointer group/img border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-orange-400"
                        onClick={() => document.getElementById(`pawn-file-item-${item.id}`)?.click()}
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
                          id={`pawn-file-item-${item.id}`}
                          className="hidden"
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
                    <TableCell>
                      <Input
                        placeholder="ชื่อสินค้า..."
                        variant="flat"
                        size="sm"
                        value={item.productName}
                        isInvalid={!!errors[`item.${item.id}.productName`]}
                        errorMessage={errors[`item.${item.id}.productName`]}
                        classNames={{
                          input: "font-semibold text-slate-700",
                          inputWrapper: "bg-transparent h-10 px-0 group-data-[hover=true]:bg-transparent",
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
                      <PawnStatusCell item={item} onItemChangeAction={handleItemChange} />
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="0.00"
                        variant="flat"
                        size="sm"
                        type="number"
                        value={item.confirmedPrice}
                        isInvalid={!!errors[`item.${item.id}.confirmedPrice`]}
                        errorMessage={errors[`item.${item.id}.confirmedPrice`]}
                        classNames={{
                          input: "font-black text-orange-600 text-right",
                          inputWrapper: "bg-transparent h-10 px-0 group-data-[hover=true]:bg-transparent",
                        }}
                        onChange={(e) => {
                          handleItemChange(item.id, "confirmedPrice", e.target.value);
                          setErrors((prev) => ({
                            ...prev,
                            [`item.${item.id}.confirmedPrice`]: "",
                          }));
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="0.00"
                        variant="flat"
                        size="sm"
                        type="number"
                        value={(item as any).redemptionPrice}
                        isInvalid={!!errors[`item.${item.id}.redemptionPrice`]}
                        errorMessage={errors[`item.${item.id}.redemptionPrice`]}
                        classNames={{
                          input: "font-black text-emerald-600 text-right",
                          inputWrapper: "bg-transparent h-10 px-0 group-data-[hover=true]:bg-transparent",
                        }}
                        onChange={(e) => {
                          handleItemChange(item.id, "redemptionPrice", e.target.value);
                          setErrors((prev) => ({
                            ...prev,
                            [`item.${item.id}.redemptionPrice`]: "",
                          }));
                        }}
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
            variant="bordered"
            startContent={<RotateCcw size={20} />}
            onPress={handleClear}
            className="bg-white border-2 border-slate-100 font-bold text-slate-500 w-full md:w-auto px-10 h-14 rounded-full hover:bg-slate-50 hover:border-slate-200 transition-all"
          >
            ล้างข้อมูลทั้งหมด
          </Button>
          <Button
            color="warning"
            startContent={<Save size={20} />}
            onPress={handleSubmit}
            isLoading={loading}
            className="bg-orange-600 font-black text-white w-full md:w-[400px] h-14 rounded-full shadow-2xl shadow-orange-200 transition-all active:scale-[0.98] text-lg"
          >
            ยืนยันการบันทึกรายการจำนำ
          </Button>
        </div>
      </div>
    </div>
  );
}
