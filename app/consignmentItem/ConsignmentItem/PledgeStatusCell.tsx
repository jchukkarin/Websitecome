"use client";

import React, { useState, useRef } from "react";
import {
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Chip,
    Divider,
} from "@heroui/react";
import {
    ChevronRight,
    Clock,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";
import { ConsignmentFormItem } from "./page";

interface PledgeStatusCellProps {
    item: ConsignmentFormItem;
    onItemChangeAction: (id: string, field: keyof ConsignmentFormItem, value: any) => void;
}

export default function PledgeStatusCell({ item, onItemChangeAction }: PledgeStatusCellProps) {
    const [isOpen, setIsOpen] = useState(false);

    const statusOptions = [
        { label: "ยังไม่ครบกำหนด", value: "active", color: "primary" as const, icon: Clock },
        { label: "หลุดจำนำ", value: "overdue", color: "danger" as const, icon: AlertCircle },
        { label: "ไถ่ถอนแล้ว", value: "redeemed", color: "success" as const, icon: CheckCircle2 },
    ];

    const currentOption = statusOptions.find((opt) => opt.value === item.pledgeStatus) || statusOptions[0];
    const Icon = currentOption.icon;

    const handleStatusSelect = (value: string) => {
        onItemChangeAction(item.id, "pledgeStatus", value);
        setIsOpen(false);
    };

    return (
        <Popover
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            placement="bottom"
            offset={10}
            showArrow
        >
            <PopoverTrigger>
                <Button
                    variant="flat"
                    size="sm"
                    className="bg-white/50 border border-slate-200 hover:bg-white hover:border-slate-300 transition-all rounded-xl font-bold min-h-[40px] w-full flex justify-between px-3 group"
                >
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full bg-${currentOption.color}-500`} />
                        <span className={`text-${currentOption.color}-600`}>{currentOption.label}</span>
                    </div>
                    <ChevronRight size={16} className={`text-slate-400 group-hover:text-slate-600 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 border-none shadow-xl overflow-hidden rounded-2xl bg-white w-[240px]">
                <div className="p-3 bg-slate-50 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-500">เลือกสถานะจำนำ</p>
                </div>
                <div className="p-2 space-y-1">
                    {statusOptions.map((opt) => (
                        <Button
                            key={opt.value}
                            fullWidth
                            variant={item.pledgeStatus === opt.value ? "flat" : "light"}
                            color={item.pledgeStatus === opt.value ? opt.color : "default"}
                            className={`justify-start h-10 rounded-xl ${item.pledgeStatus === opt.value ? "font-bold" : "font-medium text-slate-600"}`}
                            startContent={<opt.icon size={18} />}
                            onPress={() => handleStatusSelect(opt.value)}
                        >
                            {opt.label}
                        </Button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}
