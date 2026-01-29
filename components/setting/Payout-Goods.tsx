"use client";

import React, { useState } from "react";
import {
    Input,
    Tooltip,
} from "@heroui/react";
import { Search, Info } from "lucide-react";
import PayoutItemsTable from "./PayoutItemsTable";

export default function PayoutGoods() {
    const [search, setSearch] = useState("");

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header & Search */}
            <div className="flex flex-col sm:flex-row gap-6 items-center justify-between">
                <div className="w-full sm:max-w-md">
                    <Input
                        placeholder="ค้นหาชื่อสินค้า หรือ รายละเอียด..."
                        startContent={<Search size={22} className="text-gray-400" />}
                        variant="flat"
                        radius="lg"
                        size="lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        classNames={{
                            inputWrapper: "bg-white shadow-sm hover:shadow-md transition-all border border-gray-100 h-16",
                            input: "text-lg font-medium",
                        }}
                    />
                </div>

                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-50">
                    <div className="px-4 py-2 bg-emerald-50 rounded-xl">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Total Sold</p>
                        <p className="text-xl font-black text-emerald-700 leading-tight">LIVE</p>
                    </div>
                    <div className="px-4 py-2 bg-amber-50 rounded-xl">
                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Pending</p>
                        <p className="text-xl font-black text-amber-700 leading-tight">ACTIVE</p>
                    </div>
                </div>
            </div>

            {/* Title Section */}
            <div className="flex items-center gap-3 border-l-4 border-red-500 pl-4 py-1">
                <div className="space-y-0.5">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">รายการสินค้าเบิกจ่ายรายชิ้น</h2>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Individual Payout Management</p>
                </div>
                <Tooltip content="รายการสินค้าทั้งหมดและสถานะการเบิกจ่ายจริง (Audit View)">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 cursor-help hover:bg-gray-200 transition-colors">
                        <Info size={18} />
                    </div>
                </Tooltip>
            </div>

            {/* Detailed Table Component */}
            <PayoutItemsTable searchQuery={search} />
        </div>
    );
}
