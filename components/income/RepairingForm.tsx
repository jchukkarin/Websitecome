"use client";

import React from "react";
import { Select, SelectItem } from "@heroui/react";
import { CheckCircle2, Wrench, AlertCircle } from "lucide-react";

interface RepairingFormProps {
    value: string;
    onStatusChangeAction: (status: string) => void;
}

interface StatusOption {
    key: string;
    label: string;
    icon: React.ReactNode;
    color: string;
    bg: string;
}

export default function RepairingForm({ value, onStatusChangeAction }: RepairingFormProps) {
    const statusOptions: StatusOption[] = [
        {
            key: "NOT_REPAIR",
            label: "ไม่ซ่อม",
            icon: <CheckCircle2 size={16} className="text-slate-400" />,
            color: "text-slate-500",
            bg: "bg-slate-50",
        },
        {
            key: "REPAIRING",
            label: "กำลังซ่อม",
            icon: <Wrench size={16} className="text-amber-500" />,
            color: "text-amber-600",
            bg: "bg-amber-50",
        },
        {
            key: "REPAIRED",
            label: "ซ่อมเสร็จแล้ว",
            icon: <CheckCircle2 size={16} className="text-blue-500" />,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
    ];

    return (
        <Select
            variant="faded"
            size="sm"
            placeholder="เลือกสถานะซ่อม"
            selectedKeys={new Set([value])}
            onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                if (selected) onStatusChangeAction(selected);
            }}
            className="max-w-full"
            classNames={{
                trigger: "bg-white border-none shadow-none hover:bg-slate-50 transition-all rounded-xl h-10 font-bold",
                value: "font-bold",
                popoverContent: "bg-white border-none shadow-xl rounded-2xl p-1",
                listbox: "bg-white",
            }}
            renderValue={(items) => {
                return items.map((item) => {
                    const opt = statusOptions.find((o) => o.key === item.key);
                    return (
                        <div key={item.key} className="flex items-center gap-2">
                            {opt?.icon}
                            <span className={`${opt?.color} font-black`}>{opt?.label}</span>
                        </div>
                    );
                });
            }}
        >
            {statusOptions.map((opt) => (
                <SelectItem
                    key={opt.key}
                    startContent={opt.icon}
                    textValue={opt.label}
                    className="font-bold py-3 rounded-xl transition-all hover:bg-slate-50"
                >
                    <span className={`${opt.color} font-black`}>{opt.label}</span>
                </SelectItem>
            ))}
        </Select>
    );
}