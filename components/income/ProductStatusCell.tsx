"use client";

import React, { useState, useRef } from "react";
import {
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Chip,
    Input,
    Checkbox,
    Divider,
} from "@heroui/react";
import {
    Calendar,
    Camera,
    CheckCircle2,
    Clock,
    ChevronRight,
    ImageIcon,
} from "lucide-react";
import { ConsignmentItem } from "./FormUsersIncome";

interface ProductStatusCellProps {
    item: ConsignmentItem;
    onItemChangeAction: (id: string, field: keyof ConsignmentItem, value: any) => void;
}

export default function ProductStatusCell({ item, onItemChangeAction }: ProductStatusCellProps) {
    const [isOpen, setIsOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const statusOptions = [
        { label: "ไม่ซ่อม", value: "reserved", color: "warning" as const },
        { label: "กำลังซ่อม", value: "repair", color: "primary" as const },
        { label: "ซ่อมเสร็จสิ้น", value: "sold", color: "danger" as const },
    ];

    const currentOption = statusOptions.find((opt) => opt.value === (item as any).status) || statusOptions[0];

    const handleStatusSelect = (value: string) => {
        onItemChangeAction(item.id, "status" as any, value);

        if (value === "reserved") {
            // เคลียร์ข้อมูลที่เกี่ยวกับการซ่อม / การจอง
            onItemChangeAction(item.id, "repairStartDate", "");
            onItemChangeAction(item.id, "repairEndDate", "");
            onItemChangeAction(item.id, "isReserveOpen", "false");
            onItemChangeAction(item.id, "reserveStartDate", "");

            // ปิด popover ทันที
            setIsOpen(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onItemChangeAction(item.id, "slipImage", reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Popover
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            placement="bottom-end"
            offset={10}
        >
            <PopoverTrigger>
                <Button
                    variant="flat"
                    size="sm"
                    className="bg-white border-none shadow-none hover:bg-slate-50 transition-all rounded-xl font-bold min-h-[40px] w-full flex justify-between px-3"
                >
                    <div className="flex items-center gap-2">
                        <Chip
                            variant="flat"
                            color={currentOption.color}
                            size="sm"
                            className="font-bold border-none"
                        >
                            {currentOption.label}
                        </Chip>
                        {item.status === "repair" && item.repairStartDate && item.repairEndDate && (
                            <Clock size={14} className="text-primary animate-pulse" />
                        )}
                        {item.status === "sold" && item.slipImage && (
                            <CheckCircle2 size={14} className="text-success" />
                        )}
                    </div>
                    <ChevronRight size={16} className={`text-slate-400 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 border-none shadow-2xl overflow-hidden rounded-[2rem] bg-white">
                <div className="w-[320px] bg-white">
                    <div className="p-4 bg-slate-50/50 border-b border-slate-100">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status Management</p>
                        <h4 className="font-black text-slate-800">จัดการสถานะสินค้า</h4>
                    </div>

                    <div className="p-3 space-y-2">
                        {/* Status Options */}
                        <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl">
                            {statusOptions.map((opt) => (
                                <Button
                                    key={opt.value}
                                    size="sm"
                                    variant={(item as any).status === opt.value ? "solid" : "light"}
                                    color={(item as any).status === opt.value ? opt.color : "default"}
                                    className={`flex-1 font-bold rounded-xl h-9 transition-all ${(item as any).status === opt.value ? "shadow-md" : "text-slate-500"
                                        }`}
                                    onPress={() => handleStatusSelect(opt.value)}
                                >
                                    {opt.label}
                                </Button>
                            ))}
                        </div>

                        <Divider className="my-2 opacity-50" />

                        {/* Repair Details (New) */}
                        {item.status === "repair" && (
                            <div className="space-y-3 p-4 bg-blue-50/40 rounded-2xl border border-blue-100 animate-in fade-in slide-in-from-top-2">
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                                        <Calendar size={16} />
                                        <span>ช่วงเวลาการซ่อม</span>
                                    </div>

                                    {item.repairStartDate && item.repairEndDate && (
                                        <div className="flex items-center gap-1 text-[10px] font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                                            <CheckCircle2 size={12} />
                                            ระบุแล้ว
                                        </div>
                                    )}
                                </div>

                                {/* Date Inputs */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">
                                            เริ่มซ่อม
                                        </label>
                                        <Input
                                            type="date"
                                            size="sm"
                                            variant="faded"
                                            value={item.repairStartDate || ""}
                                            onChange={(e) =>
                                                onItemChangeAction(item.id, "repairStartDate", e.target.value)
                                            }
                                            classNames={{
                                                inputWrapper: "rounded-xl h-9",
                                                input: "text-xs font-bold",
                                            }}
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">
                                            เสร็จประมาณ
                                        </label>
                                        <Input
                                            type="date"
                                            size="sm"
                                            variant="faded"
                                            value={item.repairEndDate || ""}
                                            onChange={(e) =>
                                                onItemChangeAction(item.id, "repairEndDate", e.target.value)
                                            }
                                            classNames={{
                                                inputWrapper: "rounded-xl h-9",
                                                input: "text-xs font-bold",
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Action */}
                                <Button
                                    size="sm"
                                    color="primary"
                                    className="w-full font-black text-white h-10 rounded-xl shadow-md shadow-blue-100 bg-blue-500"
                                    isDisabled={!item.repairStartDate || !item.repairEndDate}
                                    onPress={() => setIsOpen(false)}
                                >
                                    บันทึกช่วงเวลาซ่อม
                                </Button>
                            </div>
                        )}

                        {/* Sold Details */}
                        {item.status === "sold" && (
                            <div className="space-y-3 p-2 bg-emerald-50/30 rounded-2xl border border-emerald-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                                        <Camera size={18} />
                                        <span>อัปโหลดหลักฐานการโอน</span>
                                    </div>
                                    <Checkbox
                                        isSelected={!!item.slipImage}
                                        isReadOnly
                                        color="success"
                                        size="sm"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div
                                        className="relative group h-32 rounded-xl border-2 border-dashed border-emerald-100 bg-white flex items-center justify-center cursor-pointer overflow-hidden transition-all hover:bg-emerald-50"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {item.slipImage ? (
                                            <>
                                                <img src={item.slipImage} className="w-full h-full object-cover" alt="slip" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                                    <p className="text-white text-xs font-bold">เปลี่ยนรูปสลิป</p>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center gap-1 text-slate-400">
                                                <ImageIcon size={24} />
                                                <span className="text-[10px] font-bold">เพิ่มรูปภาพสลิป</span>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    {item.slipImage && (
                                        <div className="flex items-center gap-2 justify-center py-1">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            <span className="text-[10px] font-black text-emerald-600 uppercase">อัปโหลดสำเร็จแล้ว</span>
                                        </div>
                                    )}
                                    <Button
                                        size="sm"
                                        color="success"
                                        className="w-full font-black text-white h-10 rounded-xl shadow-lg shadow-emerald-100 bg-emerald-500"
                                        onPress={() => setIsOpen(false)}
                                    >
                                        บันทึกหลักฐาน
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
