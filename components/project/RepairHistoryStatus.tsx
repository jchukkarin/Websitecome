"use client";

import React, { useState } from "react";
import {
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Checkbox,
    Input,
    Divider,
} from "@heroui/react";
import {
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Wrench,
    Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RepairHistoryStatusProps {
    item: any;
    onItemChangeAction: (id: string, key: string, value: any) => void;
}

interface StatusOption {
    key: string;
    label: string;
    icon: React.ReactNode;
    color: string;
    btnColor: "primary" | "success" | "warning" | "default" | "danger" | "secondary";
}

export default function RepairHistoryStatus({
    item,
    onItemChangeAction,
}: RepairHistoryStatusProps) {
    const [isOpen, setIsOpen] = useState(false);

    const statusOptions: StatusOption[] = [
        {
            key: "repairing",
            label: "กำลังซ่อม",
            icon: <Wrench size={16} className="text-blue-500" />,
            color: "text-blue-600",
            btnColor: "primary",
        },
        {
            key: "repair_done",
            label: "ซ่อมเสร็จสิ้น",
            icon: <CheckCircle2 size={16} className="text-emerald-500" />,
            color: "text-emerald-600",
            btnColor: "success",
        },
        {
            key: "return_customer",
            label: "ส่งคืนลูกค้า",
            icon: <AlertCircle size={16} className="text-purple-500" />,
            color: "text-purple-600",
            btnColor: "secondary",
        },
    ];

    const value = item?.status;
    const currentOption = statusOptions.find((o) => o.key === value);

    const handleStatusSelect = (key: string) => {
        onItemChangeAction(item.id, "status", key);
        // Keep popover open if "repairing" to allow date input, otherwise close
        if (key !== "repairing") {
            setIsOpen(false);
        }
    };

    const hasDates = !!(item?.repairStartDate && item?.repairEndDate);

    return (
        <Popover
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            placement="bottom-end"
            offset={10}
            classNames={{
                content:
                    "p-0 border-none shadow-2xl overflow-hidden rounded-[2rem] bg-white",
            }}
        >
            <PopoverTrigger>
                <Button
                    variant="flat"
                    size="sm"
                    className="bg-white border-none shadow-none hover:bg-slate-50 transition-all rounded-xl font-bold min-h-[40px] w-full flex justify-between px-3"
                >
                    <div className="flex items-center gap-2">
                        {currentOption ? (
                            <>
                                {currentOption.icon}
                                <span className={`${currentOption.color} font-bold`}>
                                    {currentOption.label}
                                </span>
                            </>
                        ) : (
                            <span className="text-slate-400 font-bold">เลือกสถานะ</span>
                        )}
                        {/* Indicator for configured dates */}
                        {value === "repairing" && hasDates && (
                            <div className="flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-full">
                                <Calendar size={10} className="text-blue-500" />
                                <span className="text-[10px] font-bold text-blue-600">นัดหมายแล้ว</span>
                            </div>
                        )}
                    </div>
                    <ChevronRight
                        size={16}
                        className={`text-slate-400 transition-transform ${isOpen ? "rotate-90" : ""
                            }`}
                    />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] bg-white">
                <div className="p-4 bg-slate-50/50 border-b border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Status Management
                    </p>
                    <h4 className="font-black text-slate-800">อัปเดตสถานะงานซ่อม</h4>
                </div>

                <div className="p-3 space-y-3">
                    {/* Status Grid */}
                    <div className="flex flex-wrap gap-2">
                        {statusOptions.map((opt) => (
                            <Button
                                key={opt.key}
                                size="sm"
                                variant={value === opt.key ? "solid" : "light"}
                                color={value === opt.key ? opt.btnColor : "default"}
                                className={`flex-1 font-bold rounded-xl h-10 transition-all justify-start min-w-[120px] ${value === opt.key ? "shadow-md" : "text-slate-500"
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

                    {/* Repairing - Date Inputs */}
                    {value === "repairing" && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-3 pt-2"
                        >
                            <Divider className="opacity-50" />

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                                    <Calendar size={16} />
                                    <span>กำหนดระยะเวลาซ่อม</span>
                                </div>
                                <Checkbox
                                    isSelected={hasDates}
                                    isReadOnly
                                    color="primary"
                                    size="sm"
                                    classNames={{ label: "text-xs font-bold text-slate-500" }}
                                >
                                    ระบุแล้ว
                                </Checkbox>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400">เริ่มซ่อม</label>
                                    <Input
                                        type="date"
                                        size="sm"
                                        variant="bordered"
                                        value={item.repairStartDate || ""}
                                        onChange={(e) => onItemChangeAction(item.id, "repairStartDate", e.target.value)}
                                        classNames={{
                                            input: "text-xs font-bold text-slate-700",
                                            inputWrapper: "h-9 rounded-lg border-slate-200"
                                        }}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400">ซ่อมเสร็จ (ประมาณ)</label>
                                    <Input
                                        type="date"
                                        size="sm"
                                        variant="bordered"
                                        value={item.repairEndDate || ""}
                                        onChange={(e) => onItemChangeAction(item.id, "repairEndDate", e.target.value)}
                                        classNames={{
                                            input: "text-xs font-bold text-slate-700",
                                            inputWrapper: "h-9 rounded-lg border-slate-200"
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Checkbox to Confirm/Toggle? - Logic implies just filling inputs IS the confirmation */}
                            {hasDates && (
                                <div className="flex items-center gap-2 justify-center py-2 bg-blue-50 rounded-xl">
                                    <CheckCircle2 size={16} className="text-blue-500" />
                                    <span className="text-xs font-black text-blue-600 uppercase tracking-wide">
                                        บันทึกข้อมูลนัดหมายแล้ว
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
