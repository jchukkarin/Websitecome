"use client";

import React, { useEffect, useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Input,
    Skeleton,
    Chip,
} from "@heroui/react";
import {
    Search,
    CheckCircle2,
    XCircle,
    ArrowRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

type StatusRow = {
    key: "SELLABLE" | "UNSELLABLE";
    label: string;
    count: number;
};

export default function ConsignmentGoods() {
    const router = useRouter();
    const [data, setData] = useState<StatusRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/consignment-status");
                const result = await res.json();
                setData(Array.isArray(result) ? result : []);
            } catch {
                toast.error("โหลดข้อมูลสถานะสินค้าล้มเหลว");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filtered = data.filter((d) =>
        (d.label || "").toLowerCase().includes(search.toLowerCase())
    );

    const statusConfig = {
        SELLABLE: {
            icon: CheckCircle2,
            color: "success",
            bg: "bg-emerald-50",
            text: "text-emerald-600",
        },
        UNSELLABLE: {
            icon: XCircle,
            color: "default",
            bg: "bg-slate-100",
            text: "text-slate-600",
        },
    };

    return (
        <div className="space-y-6">
            {/* Search */}
            <Input
                placeholder="ค้นหาสถานะสินค้า..."
                startContent={<Search size={18} className="text-orange-400" />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                radius="full"
                variant="bordered"
                classNames={{
                    inputWrapper:
                        "h-12 bg-orange-50/40 border-orange-100 hover:bg-orange-50 focus-within:border-orange-400",
                }}
            />

            {/* Table */}
            <div className="rounded-[2.2rem] overflow-hidden border border-orange-100 shadow-lg bg-white">
                <Table
                    shadow="none"
                    aria-label="Consignment Status"
                    classNames={{
                        th: "bg-orange-50 text-orange-700 font-bold text-xs uppercase tracking-widest py-6 px-6",
                        td: "py-6 px-6",
                        tr: "group hover:bg-orange-50/40 transition-all cursor-pointer",
                    }}
                >
                    <TableHeader>
                        <TableColumn>หมวดหมู่สินค้า</TableColumn>
                        <TableColumn align="center">จำนวนสินค้า</TableColumn>
                        <TableColumn align="end">ดูรายการ</TableColumn>
                    </TableHeader>

                    <TableBody
                        isLoading={loading}
                        loadingContent={
                            <div className="p-6 space-y-4">
                                {[1, 2].map((i) => (
                                    <Skeleton key={i} className="h-14 rounded-xl" />
                                ))}
                            </div>
                        }
                        emptyContent={
                            <div className="py-20 text-center text-orange-400 font-bold">
                                ไม่พบข้อมูล
                            </div>
                        }
                    >
                        {filtered.map((row) => {
                            const cfg = statusConfig[row.key] || statusConfig.UNSELLABLE;
                            const IconComp = cfg.icon;

                            return (
                                <TableRow
                                    key={row.key}
                                    onClick={() =>
                                        router.push(`/consignment/list?status=${row.key}`)
                                    }
                                >
                                    {/* Category */}
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${cfg.bg} ${cfg.text} group-hover:scale-110 transition shadow-sm`}
                                            >
                                                <IconComp size={22} />
                                            </div>
                                            <div>
                                                <p className="font-black text-lg text-slate-800 group-hover:text-orange-600 transition tracking-tight">
                                                    {row.label}
                                                </p>
                                                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                                                    {row.key}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Count */}
                                    <TableCell>
                                        <div className="flex justify-center">
                                            <Chip
                                                color={cfg.color as any}
                                                variant="flat"
                                                className="px-6 py-2 h-10 text-lg font-black shadow-sm group-hover:scale-105 transition"
                                            >
                                                {row.count}
                                            </Chip>
                                        </div>
                                    </TableCell>

                                    {/* Action */}
                                    <TableCell>
                                        <div className="flex justify-end pr-4">
                                            <div className="flex items-center gap-2 text-orange-500 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                <span className="text-sm font-black uppercase tracking-wider">ดูรายการ</span>
                                                <div className="p-1.5 bg-orange-500 text-white rounded-full shadow-md">
                                                    <ArrowRight size={14} strokeWidth={3} />
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
