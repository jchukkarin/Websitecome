"use client";

import React, { useState, useRef } from "react";
import {
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Checkbox,
    Divider,
    Input,
} from "@heroui/react";
import {
    ChevronsRight,
    ChevronRight,
    CircleDollarSign,
    Clock3,
    CheckCircle2,
    Calendar,
    ImageIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PawnStatusCellProps {
    item: any;
    onItemChangeAction: (id: string, key: string, value: any) => void;
}

export default function PawnStatusCell({
    item,
    onItemChangeAction,
}: PawnStatusCellProps) {
    const [isOpen, setIsOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const statusOptions = [
        {
            key: "active",
            label: "ยังไม่ครบกำหนด",
            icon: <Clock3 size={16} className="text-blue-500" />,
            color: "text-blue-600",
            btnColor: "primary",
        },
        {
            key: "extended",
            label: "ต่อยอด",
            icon: <ChevronsRight size={16} className="text-orange-500" />,
            color: "text-orange-600",
            btnColor: "warning",
        },
        {
            key: "redeemed",
            label: "ปิดยอด",
            icon: <CircleDollarSign size={16} className="text-emerald-500" />,
            color: "text-emerald-600",
            btnColor: "success",
        },
    ];

    const value = item.status || "active";
    const selectedStatus = statusOptions.find((opt) => opt.key === value) || statusOptions[0];

    const handleStatusSelect = (key: string) => {
        onItemChangeAction(item.id, "status", key);
        // Keep open for inputs
    };

    const handleSlipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onItemChangeAction(item.id, "redemptionSlip", reader.result as string);
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
            classNames={{
                content: "p-0 border-none shadow-2xl overflow-hidden rounded-[2rem] bg-white",
            }}
        >
            <PopoverTrigger>
                <Button
                    variant="flat"
                    size="sm"
                    className="bg-transparent border-none shadow-none hover:bg-slate-50 transition-all rounded-xl font-bold min-h-[40px] w-full flex justify-between px-0"
                >
                    <div className="flex items-center gap-2">
                        {selectedStatus ? (
                            <>
                                {selectedStatus.icon}
                                <span className={`${selectedStatus.color} font-bold`}>
                                    {selectedStatus.label}
                                </span>
                            </>
                        ) : (
                            <span className="text-slate-400 font-bold">เลือกสถานะ</span>
                        )}

                        {/* Indicators */}
                        {value === "redeemed" && item.redemptionSlip && (
                            <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full">
                                <CheckCircle2 size={10} className="text-emerald-500" />
                                <span className="text-[10px] font-bold text-emerald-600">แนบสลิปแล้ว</span>
                            </div>
                        )}
                        {(value === "active" || value === "extended") && item.pawnEndDate && (
                            <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full">
                                <Calendar size={10} className="text-slate-500" />
                                <span className="text-[10px] font-bold text-slate-600">{item.pawnEndDate}</span>
                            </div>
                        )}

                    </div>
                    <ChevronRight
                        size={16}
                        className={`text-slate-400 transition-transform ${isOpen ? "rotate-90" : ""}`}
                    />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[320px] bg-white">
                <div className="p-4 bg-slate-50/50 border-b border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Pawn Status
                    </p>
                    <h4 className="font-black text-slate-800">อัปเดตสถานะจำนำ</h4>
                </div>

                <div className="p-3 space-y-3">
                    {/* Status Grid */}
                    <div className="flex flex-wrap gap-2">
                        {statusOptions.map((opt) => (
                            <Button
                                key={opt.key}
                                size="sm"
                                variant={value === opt.key ? "solid" : "light"}
                                color={value === opt.key ? (opt.btnColor as any) : "default"}
                                className={`flex-1 font-bold rounded-xl h-10 transition-all justify-start min-w-[90px] ${value === opt.key ? "shadow-md" : "text-slate-500"
                                    }`}
                                onPress={() => handleStatusSelect(opt.key)}
                            >
                                <div className="flex items-center gap-2">
                                    {opt.icon}
                                    <span>{opt.label}</span>
                                </div>
                            </Button>
                        ))}
                    </div>

                    {/* Content: Active (ยังไม่ครบกำหนด) */}
                    {value === "active" && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="space-y-3 pt-2"
                        >
                            <Divider className="opacity-50" />
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                                    <Clock3 size={16} />
                                    <span>กำหนดระยะเวลาจำนำ</span>
                                </div>
                                <Input
                                    type="date"
                                    size="sm"
                                    label="วันครบกำหนด (Due Date)"
                                    variant="bordered"
                                    description="ระบุวันที่ครบกำหนดชำระ/ไถ่ถอน"
                                    value={item.pawnEndDate || ""}
                                    onChange={(e) => onItemChangeAction(item.id, "pawnEndDate", e.target.value)}
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* Content: Extended (ต่อยอด) */}
                    {value === "extended" && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="space-y-3 pt-2"
                        >
                            <Divider className="opacity-50" />
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-orange-600 font-bold text-sm">
                                        <ChevronsRight size={16} />
                                        <span>ขยายเวลาจำนำ</span>
                                    </div>
                                    <Checkbox
                                        isSelected={!!item.pawnEndDate}
                                        isReadOnly
                                        color="warning"
                                        size="sm"
                                        classNames={{ label: "text-xs font-bold text-slate-500" }}
                                    >
                                        อัปเดตแล้ว
                                    </Checkbox>
                                </div>

                                <Input
                                    type="date"
                                    size="sm"
                                    variant="bordered"
                                    label="วันสิ้นสุดสัญญาใหม่"
                                    value={item.pawnEndDate || ""}
                                    onChange={(e) => onItemChangeAction(item.id, "pawnEndDate", e.target.value)}
                                    classNames={{
                                        input: "text-xs font-bold text-slate-700",
                                    }}
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* Content: Redeemed (ปิดยอด) */}
                    {value === "redeemed" && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="space-y-3 pt-2"
                        >
                            <Divider className="opacity-50" />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                                    <ImageIcon size={16} />
                                    <span>หลักฐานการโอนเงิน (สลิป)</span>
                                </div>
                                <Checkbox
                                    isSelected={!!item.redemptionSlip}
                                    isReadOnly
                                    color="success"
                                    size="sm"
                                    classNames={{ label: "text-xs font-bold text-slate-500" }}
                                >
                                    อัปโหลดแล้ว
                                </Checkbox>
                            </div>

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="relative w-full aspect-[16/9] rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-400 hover:text-emerald-600 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 text-slate-400 overflow-hidden group"
                            >
                                {item.redemptionSlip ? (
                                    <img src={item.redemptionSlip} className="w-full h-full object-cover" alt="Slip" />
                                ) : (
                                    <>
                                        <ImageIcon size={24} />
                                        <span className="text-[10px] font-bold uppercase">คลิกเพื่ออัปโหลด</span>
                                    </>
                                )}

                                {/* Overlay for change image */}
                                {item.redemptionSlip && (
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold">
                                        เปลี่ยนรูปภาพ
                                    </div>
                                )}
                            </div>

                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleSlipUpload}
                            />

                        </motion.div>
                    )}

                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                    <Button
                        size="sm"
                        variant="light"
                        color="default"
                        onPress={() => setIsOpen(false)}
                        className="font-bold text-slate-400"
                    >
                        ปิดหน้าต่าง
                    </Button>
                    <Button
                        size="sm"
                        color="primary"
                        onPress={() => setIsOpen(false)}
                        className="font-bold text-white shadow-lg shadow-blue-200"
                    >
                        เสร็จสิ้น
                    </Button>
                </div>

            </PopoverContent>
        </Popover>


    );
}
