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
                content: "p-0 border-none shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden rounded-[2.5rem] bg-white",
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
                            <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 italic">
                                <CheckCircle2 size={10} className="text-emerald-500" />
                                <span className="text-[9px] font-black text-emerald-600">PAID</span>
                            </div>
                        )}
                        {(value === "active" || value === "extended") && item.pawnEndDate && (
                            <div className="flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 italic">
                                <Calendar size={10} className="text-blue-500" />
                                <span className="text-[9px] font-black text-blue-600 uppercase italic leading-none">{item.pawnEndDate}</span>
                            </div>
                        )}

                    </div>
                    <ChevronRight
                        size={16}
                        className={`text-slate-400 transition-transform ${isOpen ? "rotate-90" : ""}`}
                    />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[360px] bg-white">
                <div className="p-4 bg-slate-50/50 border-b border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Pawn Status
                    </p>
                    <h4 className="font-black text-slate-800">อัปเดตสถานะจำนำ</h4>
                </div>

                <div className="p-3 space-y-3">
                    {/* Status Grid */}
                    <div className="grid grid-cols-3 gap-2">
                        {statusOptions.map((opt) => (
                            <Button
                                key={opt.key}
                                size="sm"
                                variant={value === opt.key ? "solid" : "flat"}
                                color={value === opt.key ? (opt.btnColor as any) : "default"}
                                className={`font-black rounded-2xl h-14 flex flex-col gap-1 transition-all
                                    ${value === opt.key
                                        ? "shadow-lg scale-105 z-10"
                                        : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                                    }`}
                                onPress={() => handleStatusSelect(opt.key)}
                            >
                                {opt.icon}
                                <span className="text-[10px]">{opt.label}</span>
                            </Button>
                        ))}
                    </div>

                    {/* Content: Active (ยังไม่ครบกำหนด) */}
                    {value === "active" && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100/50 space-y-3"
                        >
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                                <Clock3 size={18} strokeWidth={2.5} />
                                <span>กำหนดระยะเวลาจำนำ</span>
                            </div>
                            <Input
                                type="date"
                                size="lg"
                                labelPlacement="inside"
                                variant="bordered"
                                placeholder="dd/mm/yyyy"
                                value={item.pawnEndDate || ""}
                                onChange={(e) => onItemChangeAction(item.id, "pawnEndDate", e.target.value)}
                                classNames={{
                                    label: "text-blue-500 font-black uppercase tracking-tighter",
                                    inputWrapper: "h-16 bg-white border-2 border-blue-100/50 rounded-2xl group-data-[focus=true]:border-blue-500",
                                    input: "font-black text-slate-700 pt-2"
                                }}
                            />
                        </motion.div>
                    )}

                    {/* Content: Extended (ต่อยอด) */}
                    {value === "extended" && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-orange-50/50 rounded-2xl p-4 border border-orange-100/50 space-y-3"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-orange-600 font-bold text-sm">
                                    <ChevronsRight size={18} strokeWidth={2.5} />
                                    <span>ขยายเวลาจำนำ</span>
                                </div>
                                {item.pawnEndDate && (
                                    <div className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase">
                                        Updated
                                    </div>
                                )}
                            </div>
                            <Input
                                type="date"
                                size="lg"
                                variant="bordered"
                                labelPlacement="inside"
                                placeholder="dd/mm/yyyy"
                                value={item.pawnEndDate || ""}
                                onChange={(e) => onItemChangeAction(item.id, "pawnEndDate", e.target.value)}
                                classNames={{
                                    label: "text-orange-500 font-black uppercase tracking-tighter",
                                    inputWrapper: "h-16 bg-white border-2 border-orange-100/50 rounded-2xl group-data-[focus=true]:border-orange-500",
                                    input: "font-black text-slate-700 pt-2"
                                }}
                            />
                        </motion.div>
                    )}

                    {/* Content: Redeemed (ปิดยอด) */}
                    {value === "redeemed" && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/50 space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                                    <ImageIcon size={18} strokeWidth={2.5} />
                                    <span>หลักฐานปิดยอดสลิป</span>
                                </div>
                                {item.redemptionSlip && (
                                    <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-lg">
                                        Uploaded
                                    </span>
                                )}
                            </div>

                            <Divider className="bg-emerald-200/30" />

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="relative w-full aspect-[16/9] rounded-2xl border-2 border-dashed border-emerald-200 bg-white hover:bg-emerald-50 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-100 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 text-emerald-400 overflow-hidden group shadow-sm"
                            >
                                {item.redemptionSlip ? (
                                    <img src={item.redemptionSlip} className="w-full h-full object-cover" alt="Slip" />
                                ) : (
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mb-1 group-hover:scale-110 transition-transform">
                                            <ImageIcon size={20} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">คลิกเพื่ออัปโหลดสลิป</span>
                                    </div>
                                )}

                                {item.redemptionSlip && (
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <span className="text-white text-[10px] font-black uppercase tracking-widest bg-emerald-600 px-4 py-2 rounded-xl">เปลี่ยนรูปภาพ</span>
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

                <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex gap-3">
                    <Button
                        fullWidth
                        size="md"
                        variant="flat"
                        onPress={() => setIsOpen(false)}
                        className="font-black text-slate-400 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50"
                    >
                        ปิดหน้าต่าง
                    </Button>
                    <Button
                        fullWidth
                        size="md"
                        color="primary"
                        onPress={() => setIsOpen(false)}
                        className="font-black text-white bg-slate-900 rounded-2xl shadow-xl shadow-slate-200 active:scale-95 transition-all"
                    >
                        เสร็จสิ้น
                    </Button>
                </div>

            </PopoverContent>
        </Popover>


    );
}
