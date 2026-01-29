"use client";

import React from "react";
import { Select, SelectItem } from "@heroui/react";
import { Clock, Wrench, CheckCircle2 } from "lucide-react";

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

export default function RepairingForm({
    value,
    onStatusChangeAction,
}: RepairingFormProps) {
    const statusOptions: StatusOption[] = [
        {
            key: "READY",
            label: "พร้อม",
            icon: <Clock size={16} className="text-slate-500" />,
            color: "text-slate-600",
            bg: "bg-slate-50",
        },
        {
            key: "BOOKED",
            label: "ติดจอง",
            icon: <Wrench size={16} className="text-amber-500" />,
            color: "text-amber-600",
            bg: "bg-amber-50",
        },
        {
            key: "REPAIR_DONE",
            label: "ซ่อมเสร็จ",
            icon: <CheckCircle2 size={16} className="text-emerald-500" />,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
        },
    ];

    return (
        <Select
            variant="faded"
            size="sm"
            placeholder="เลือกสถานะงานซ่อม"
            selectedKeys={value ? new Set([value]) : undefined}
            onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                if (selected) onStatusChangeAction(selected);
            }}
            className="max-w-full"
            classNames={{
                trigger:
                    "bg-white border border-slate-200 hover:bg-slate-50 rounded-xl h-10 px-3 transition-all",
                value: "font-bold",
                popoverContent:
                    "bg-white border border-slate-100 shadow-xl rounded-2xl p-1",
                listbox: "gap-1",
            }}
            renderValue={(items) =>
                items.map((item) => {
                    const opt = statusOptions.find((o) => o.key === item.key);
                    return (
                        <div
                            key={item.key}
                            className={`flex items-center gap-2 px-2 py-1 rounded-lg ${opt?.bg}`}
                        >
                            {opt?.icon}
                            <span className={`${opt?.color} font-black text-sm`}>
                                {opt?.label}
                            </span>
                        </div>
                    );
                })
            }
        >
            {statusOptions.map((opt) => (
                <SelectItem
                    key={opt.key}
                    textValue={opt.label}
                    startContent={opt.icon}
                    className="rounded-xl py-3 font-bold transition hover:bg-slate-50"
                >
                    <span className={`${opt.color} font-black`}>
                        {opt.label}
                    </span>
                </SelectItem>
            ))}
        </Select>
    );
}