"use client";

import React, { useEffect, useState } from "react";
import {
    Input,
    Button,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Tooltip,
} from "@heroui/react";
import { Search, Pencil, Trash2, Plus, Info, Wrench } from "lucide-react";
import { toast } from "react-hot-toast";

type RepairStatus = {
    id: number;
    name: string;
    count: number;
};

export default function RepairGoods() {
    const [data, setData] = useState<RepairStatus[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/repair-status");
            const result = await res.json();
            setData(result);
        } catch (error) {
            toast.error("โหลดข้อมูลซ่อมล้มเหลว");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filtered = data.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="w-full sm:max-w-md">
                    <Input
                        placeholder="ค้นหาหมวดหมู่การฝากซ่อม..."
                        startContent={<Search size={20} className="text-gray-400" />}
                        variant="flat"
                        radius="lg"
                        size="lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        classNames={{
                            inputWrapper: "bg-gray-100/50 hover:bg-gray-100 transition-colors border-none",
                            input: "text-base",
                        }}
                    />
                </div>
                <Button
                    color="danger"
                    size="lg"
                    radius="lg"
                    startContent={<Plus size={22} strokeWidth={3} />}
                    className="font-bold px-8 shadow-xl shadow-red-200 bg-red-600 text-white"
                    onClick={() => toast.info("ฟีเจอร์นี้ผูกกับสถานะในรายการซ่อมโดยตรง")}
                >
                    เพิ่มหมวดหมู่ใหม่
                </Button>
            </div>

            <div className="flex items-center gap-3 border-l-4 border-red-500 pl-4 py-1">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">รายการสถานะการฝากซ่อม</h2>
                <Tooltip content="หมวดหมู่ที่ใช้ในการบันทึกสถานะงานซ่อมเพื่อติดตามความคืบหน้า">
                    <Info size={18} className="text-gray-300 cursor-help" />
                </Tooltip>
            </div>

            <div className="overflow-hidden rounded-3xl border border-gray-100">
                <Table aria-label="Repair categories table" shadow="none" classNames={{
                    th: "bg-gray-50/50 text-gray-500 font-bold text-sm py-5 border-b border-gray-100 first:pl-8 last:pr-8",
                    td: "py-5 px-4 first:pl-8 last:pr-8",
                    tr: "group hover:bg-gray-50/80 transition-all duration-300 border-b border-gray-50 last:border-0",
                }}>
                    <TableHeader>
                        <TableColumn width={400}>ชื่อสถานะการซ่อม</TableColumn>
                        <TableColumn align="center">จำนวนสินค้า</TableColumn>
                        <TableColumn align="end">การจัดการ</TableColumn>
                    </TableHeader>
                    <TableBody isLoading={loading} emptyContent={
                        <div className="flex flex-col items-center justify-center py-20 bg-gray-50/30">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Wrench size={32} className="text-gray-300" />
                            </div>
                            <p className="text-gray-500 font-medium">ไม่พบข้อมูลการฝากซ่อม</p>
                        </div>
                    }>
                        {filtered.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-900 text-lg">{category.name}</span>
                                        <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">STATUS CODE: {category.name.toUpperCase()}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-center">
                                        <div className="bg-red-50 text-red-600 px-4 py-1.5 rounded-full font-black text-lg border border-red-100 min-w-[60px] text-center">
                                            {category.count}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-end gap-2 text-gray-300">
                                        <Tooltip content="สถานะระบบ (อ่านอย่างเดียว)">
                                            <Info size={18} />
                                        </Tooltip>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
