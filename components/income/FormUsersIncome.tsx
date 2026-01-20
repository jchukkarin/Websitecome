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
  TableCell
} from "@heroui/react";
import {
  Select,
  SelectItem,
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@nextui-org/react";
import {
  Plus,
  Trash2,
  Save,
  RotateCcw,
  PlusCircle,
  Edit3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Components
import RepairingForm from "./Repairing";
import { RepairingItem } from "./RepairStatusItem";

// Interface definitions
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

export default function Projects() {
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
    <div className="p-8 bg-[#F9FAFB] min-h-screen rounded-2xl shadow font-sans text-gray-800">
      <div className="w-full mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-xs text-blue-600 font-semibold tracking-wider uppercase">การนำเข้า</p>
            <h1 className="text-3xl font-bold text-gray-900">บันทึกการนำเข้า</h1>
            <p className="text-sm text-gray-500">บันทึกข้อมูลและรายละเอียดการนำเข้าสินค้า</p>
          </div>
        </div>

        {/* Top Forms Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Card */}
          <Card className="lg:col-span-2 border border-gray-100 shadow-sm" radius="lg">
            <CardBody className="p-6 space-y-8">
              <div>
                <h3 className="text-base font-semibold text-gray-900">ข้อมูลผู้ฝากขาย</h3>
                <p className="text-sm text-gray-500">กรุณากรอกข้อมูลผู้ฝากขายให้ครบถ้วน</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700">วันที่รับสินค้าฝากขาย</p>
                  <Input
                    type="date"
                    variant="bordered"
                    value={formData.date}
                    classNames={{ inputWrapper: "h-10 border-gray-200" }}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700">ล๊อต</p>
                  <Input
                    placeholder="ระบุล๊อต"
                    variant="bordered"
                    value={formData.lot}
                    classNames={{ inputWrapper: "h-10 border-gray-200" }}
                    onChange={(e) => setFormData({ ...formData, lot: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700">ชื่อผู้ฝากขาย</p>
                  <Input
                    placeholder="ชื่อ-นามสกุล"
                    variant="bordered"
                    value={formData.consignorName}
                    classNames={{ inputWrapper: "h-10 border-gray-200" }}
                    onChange={(e) => setFormData({ ...formData, consignorName: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700">เบอร์ติดต่อ</p>
                  <Input
                    placeholder="เบอร์โทรศัพท์"
                    variant="bordered"
                    value={formData.contactNumber}
                    classNames={{ inputWrapper: "h-10 border-gray-200" }}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">ที่อยู่ผู้ฝากขาย</p>
                <Textarea
                  placeholder="ที่อยู่โดยละเอียด"
                  variant="bordered"
                  minRows={3}
                  classNames={{ inputWrapper: "border-gray-200" }}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="space-y-1 max-w-xs">
                <p className="text-sm font-medium text-gray-700">ราคารวม</p>
                <Input
                  placeholder="0.00"
                  type="number"
                  variant="bordered"
                  classNames={{ inputWrapper: "h-10 border-gray-200" }}
                  value={formData.totalPrice}
                  onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })}
                />
              </div>
            </CardBody>
          </Card>

          {/* Master Image Upload Section */}
          <Card radius="lg" className="border border-dashed border-gray-200 shadow-sm">
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
                  <p className="text-sm font-medium text-gray-700">รูปภาพรวมสินค้า</p>
                  <p className="text-xs text-gray-400">คลิกเพื่ออัปโหลด หรือลากไฟล์มาวาง</p>
                </div>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                  {formData.images.map((src, index) => (
                    <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-100">
                      <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button isIconOnly size="sm" color="danger" variant="flat" onPress={() => removeImage(index)}>
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

        {/* Items Table Section */}
        <div className="w-full overflow-x-auto">
          <Table
            aria-label="Items List"
            removeWrapper
            className="bg-white rounded-2xl shadow border border-gray-200 text-sm"
          >
            <TableHeader>
              <TableColumn className="bg-gray-50 text-center w-24">รูปภาพ</TableColumn>
              <TableColumn className="bg-gray-50">ชื่อสินค้า</TableColumn>
              <TableColumn className="bg-gray-50 w-36">หมวดหมู่</TableColumn>
              <TableColumn className="bg-gray-50 w-24">ปี</TableColumn>
              <TableColumn className="bg-gray-50 w-32">ราคาสินค้า</TableColumn>
              <TableColumn className="bg-gray-50 w-36">ราคาขาย</TableColumn>
              <TableColumn className="bg-gray-50 w-36">สถานะสินค้า</TableColumn>
              <TableColumn className="bg-gray-50 w-36">สถานะซ่อม</TableColumn>
              <TableColumn className="bg-gray-50 text-center w-20">ลบ</TableColumn>
              <TableColumn className="bg-gray-50 text-center w-20">แก้ไข</TableColumn>
            </TableHeader>
            <TableBody items={items}>
              {(item) => (
                <TableRow key={item.id} className="h-[72px] border-b border-gray-50">
                  {/* Image Column */}
                  <TableCell>
                    <div
                      className="mx-auto w-12 h-12 rounded-lg border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center cursor-pointer hover:border-blue-400 group relative"
                      onClick={() => document.getElementById(`file-${item.id}`)?.click()}
                    >
                      {item.imageUrl ? (
                        <img src={item.imageUrl} className="w-full h-full object-cover rounded-lg" alt="product" />
                      ) : (
                        <Plus className="text-gray-400 group-hover:text-blue-500" size={18} />
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
                      variant="bordered"
                      size="sm"
                      placeholder="ระบุชื่อรุ่น/สินค้า"
                      value={item.productName}
                      onChange={(e) => handleItemChange(item.id, "productName", e.target.value)}
                    />
                  </TableCell>

                  {/* Category */}
                  <TableCell>
                    <Select
                      variant="bordered"
                      size="sm"
                      selectedKeys={item.category ? new Set([item.category]) : new Set()}
                      onSelectionChange={(keys) => handleItemChange(item.id, "category", Array.from(keys)[0] as string)}
                    >
                      <SelectItem key="Camera">กล้อง</SelectItem>
                      <SelectItem key="Lens">เลนส์</SelectItem>
                      <SelectItem key="Accessory">อุปกรณ์เสริม</SelectItem>
                      <SelectItem key="Other">อื่นๆ</SelectItem>
                    </Select>
                  </TableCell>

                  {/* Year */}
                  <TableCell>
                    <Input
                      variant="bordered"
                      size="sm"
                      placeholder="ปี"
                      value={item.year}
                      onChange={(e) => handleItemChange(item.id, "year", e.target.value)}
                    />
                  </TableCell>

                  {/* Cost Price */}
                  <TableCell>
                    <Input
                      type="number"
                      variant="bordered"
                      size="sm"
                      placeholder="0.00"
                      value={item.confirmedPrice}
                      onChange={(e) => handleItemChange(item.id, "confirmedPrice", e.target.value)}
                    />
                  </TableCell>

                  {/* Sale Price */}
                  <TableCell>
                    <Input
                      type="number"
                      variant="bordered"
                      size="sm"
                      placeholder="0.00"
                      value={item.salesPrice}
                      onChange={(e) => handleItemChange(item.id, "salesPrice", e.target.value)}
                    />
                  </TableCell>

                  {/* Product Status */}
                  <TableCell>
                    <Select
                      variant="bordered"
                      size="sm"
                      selectedKeys={item.productStatus ? new Set([item.productStatus]) : new Set(["ready"])}
                      onSelectionChange={(keys) => handleItemChange(item.id, "productStatus", Array.from(keys)[0] as string)}
                    >
                      <SelectItem key="ready">พร้อมขาย</SelectItem>
                      <SelectItem key="reserved">ติดจอง</SelectItem>
                      <SelectItem key="sold">ขายแล้ว</SelectItem>
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
                          className="w-full text-xs"
                          color={item.repairStatus === "repairing" ? "warning" : "default"}
                        >
                          {item.repairStatus === "not_repair" ? "ไม่ซ่อม" :
                            item.repairStatus === "repairing" ? "กำลังซ่อม" : "ซ่อมเสร็จแล้ว"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 border-none shadow-xl">
                        <div className="w-[240px] bg-white rounded-xl overflow-hidden shadow-2xl">
                          <div className="p-2 space-y-1">
                            <div
                              className="px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer rounded-lg transition-colors flex items-center gap-2"
                              onClick={() => {
                                handleItemChange(item.id, "repairStatus", "not_repair");
                                setIsOpenRepair(false);
                              }}
                            >
                              <div className="w-2 h-2 rounded-full bg-gray-400" />
                              ไม่ซ่อม
                            </div>

                            <Popover placement="right-start">
                              <PopoverTrigger>
                                <div className="hover:bg-yellow-50 cursor-pointer rounded-lg transition-colors group">
                                  <RepairingItem />
                                </div>
                              </PopoverTrigger>
                              <PopoverContent className="p-0">
                                <RepairingForm onComplete={() => setIsOpenRepair(false)} />
                              </PopoverContent>
                            </Popover>

                            <div
                              className="px-4 py-2 text-sm hover:bg-green-50 cursor-pointer rounded-lg transition-colors flex items-center gap-2"
                              onClick={() => {
                                handleItemChange(item.id, "repairStatus", "completed");
                                setIsOpenRepair(false);
                              }}
                            >
                              <div className="w-2 h-2 rounded-full bg-success" />
                              ซ่อมเสร็จสิ้น
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-center">
                    <Button isIconOnly color="danger" variant="light" onPress={() => handleRemoveItem(item.id)}>
                      <Trash2 size={18} />
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button isIconOnly color="primary" variant="light">
                      <Edit3 size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Action Buttons Section */}
        <div className="flex justify-between items-center py-6 border-t border-gray-100 mt-4">
          <Button
            variant="flat"
            color="primary"
            startContent={<PlusCircle size={20} />}
            onPress={handleAddItem}
            className="font-semibold bg-blue-50 text-blue-600"
          >
            เพิ่มสินค้าใหม่
          </Button>
          <div className="flex gap-4">
            <Button
              variant="flat"
              startContent={<RotateCcw size={20} />}
              onPress={handleClear}
              className="bg-gray-100 font-semibold text-gray-600 px-8"
            >
              ล้างข้อมูล
            </Button>
            <Button
              color="success"
              startContent={<Save size={20} />}
              onPress={handleSubmit}
              isLoading={loading}
              className="bg-green-600 hover:bg-green-700 font-bold text-white px-10 shadow-lg shadow-green-100"
            >
              บันทึกรายการ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}