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
            <PopoverContent className="w-[320px] bg-white rounded-3xl overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 bg-gradient-to-r from-slate-50 to-white border-b">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Repair Status
                    </p>
                    <h4 className="font-black text-slate-800 text-sm">
                        จัดการสถานะงานซ่อม
                    </h4>
                </div>

                {/* Body */}
                <div className="p-4 space-y-4">
                    {/* Status Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                        {statusOptions.map((opt) => (
                            <Button
                                key={opt.key}
                                size="sm"
                                variant={value === opt.key ? "solid" : "bordered"}
                                color={value === opt.key ? opt.btnColor : "default"}
                                className={`
            h-11 rounded-2xl font-bold justify-start gap-2
            ${value === opt.key
                                        ? "shadow-md"
                                        : "text-slate-500 hover:bg-slate-50"}
          `}
                                onPress={() => handleStatusSelect(opt.key)}
                            >
                                {opt.icon}
                                <span>{opt.label}</span>
                            </Button>
                        ))}
                    </div>

                    {/* Repair Date Section */}
                    <AnimatePresence>
                        {value === "repairing" && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 8 }}
                                className="bg-slate-50 rounded-2xl p-4 space-y-3"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                                        <Calendar size={16} />
                                        <span>ช่วงเวลาการซ่อม</span>
                                    </div>

                                    {hasDates && (
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                                            <CheckCircle2 size={12} />
                                            ระบุแล้ว
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400">
                                            เริ่มซ่อม
                                        </label>
                                        <Input
                                            type="date"
                                            size="sm"
                                            value={item.repairStartDate || ""}
                                            onChange={(e) =>
                                                onItemChangeAction(item.id, "repairStartDate", e.target.value)
                                            }
                                            classNames={{
                                                inputWrapper: "h-9 rounded-xl",
                                                input: "text-xs font-bold",
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400">
                                            เสร็จประมาณ
                                        </label>
                                        <Input
                                            type="date"
                                            size="sm"
                                            value={item.repairEndDate || ""}
                                            onChange={(e) =>
                                                onItemChangeAction(item.id, "repairEndDate", e.target.value)
                                            }
                                            classNames={{
                                                inputWrapper: "h-9 rounded-xl",
                                                input: "text-xs font-bold",
                                            }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Actions */}
                <div className="px-4 py-3 border-t bg-white flex gap-2">
                    <Button
                        size="sm"
                        variant="light"
                        className="flex-1 rounded-xl font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100 active:scale-95 transition-all border border-slate-200"
                        onPress={() => setIsOpen(false)}
                    >
                        ปิด
                    </Button>

                    <Button
                        size="sm"
                        color="primary"
                        className="flex-1 rounded-xl font-bold shadow-md shadow-blue-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all border border-slate-200"
                        onPress={() => setIsOpen(false)}
                    >
                        บันทึก
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
