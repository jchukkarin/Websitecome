"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Badge,
    Skeleton
} from "@heroui/react";
import { Package, ChevronRight, ArrowLeft } from "lucide-react";
import Image from "next/image";

type ItemData = {
    id: string;
    productName: string;
    category: string;
    year: string;
    status: string;
    confirmedPrice: number;
    salesPrice: number | null;
    imageUrl: string | null;
    date: string;
    lot: string;
    consignorName: string;
};

function ConsignmentListContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const status = searchParams.get("status");
    const [items, setItems] = useState<ItemData[]>([]);
    const [loading, setLoading] = useState(true);

    const statusLabel =
        status === "SELLABLE"
            ? "ขายได้"
            : status === "UNSELLABLE"
                ? "ขายไม่ได้"
                : "ทั้งหมด";

    const badgeColor =
        status === "SELLABLE"
            ? "bg-emerald-500"
            : status === "UNSELLABLE"
                ? "bg-rose-500"
                : "bg-orange-500";

    useEffect(() => {
        if (status) {
            fetchData();
        }
    }, [status]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/consignments/items-by-status?status=${status}`);
            const data = await res.json();
            setItems(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium px-1">
                    <button
                        onClick={() => router.back()}
                        className="hover:text-orange-500 transition-colors cursor-pointer"
                    >
                        จัดการสินค้า
                    </button>
                    <ChevronRight size={14} />
                    <span className="text-orange-500">รายการฝากขาย</span>
                </div>

                <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-5">
                        <Button
                            isIconOnly
                            variant="flat"
                            className="bg-orange-50 text-orange-600 rounded-2xl w-12 h-12"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft size={24} />
                        </Button>
                        <div className="space-y-0.5">
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                                {statusLabel}
                            </h1>
                            <p className="text-gray-400 text-sm font-medium">
                                พบทั้งหมด {items.length} รายการในระบบ
                            </p>
                        </div>
                    </div>

                    <div className={`px-6 py-2 rounded-2xl text-white text-sm font-black shadow-lg shadow-gray-200/50 ${badgeColor}`}>
                        {status}
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-xl shadow-gray-100/30">
                <Table
                    aria-label="Items Table"
                    shadow="none"
                    classNames={{
                        th: "bg-gray-50/50 text-gray-400 font-bold text-[11px] uppercase tracking-wider py-6 px-6 border-b border-gray-50",
                        td: "py-5 px-6",
                        tr: "hover:bg-orange-50/30 transition-all",
                    }}
                >
                    <TableHeader>
                        <TableColumn>ข้อมูลสินค้า</TableColumn>
                        <TableColumn>วันที่ฝาก</TableColumn>
                        <TableColumn align="center">ล็อต</TableColumn>
                        <TableColumn align="center">สถานะสินค้า</TableColumn>
                        <TableColumn align="end">ต้นทุน/ทุนยืน</TableColumn>
                    </TableHeader>
                    <TableBody
                        isLoading={loading}
                        loadingContent={
                            <div className="space-y-4 p-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <Skeleton className="w-12 h-12 rounded-xl" />
                                        <Skeleton className="h-8 flex-1 rounded-lg" />
                                        <Skeleton className="w-20 h-8 rounded-lg" />
                                    </div>
                                ))}
                            </div>
                        }
                        emptyContent={
                            <div className="py-20 flex flex-col items-center opacity-30">
                                <Package size={64} />
                                <p className="mt-4 font-bold text-lg">ไม่พบข้อมูลในสถานะนี้</p>
                            </div>
                        }
                    >
                        {items.map((item) => (
                            <TableRow key={item.id} className="border-b border-gray-50 last:border-none">
                                <TableCell>
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 relative rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
                                            {item.imageUrl ? (
                                                <Image
                                                    src={item.imageUrl}
                                                    alt={item.productName}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <Package size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-800 line-clamp-1">{item.productName}</span>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded uppercase">{item.category}</span>
                                                <span className="text-[10px] font-bold text-gray-400">ID: {item.id.slice(0, 8)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-600 text-sm">
                                            {new Date(item.date).toLocaleDateString("th-TH")}
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-medium">{item.consignorName}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-black text-[11px]">
                                        {item.lot}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight shadow-sm ${item.status === 'ready' ? 'bg-green-100 text-green-700' :
                                            item.status === 'reserved' ? 'bg-yellow-100 text-yellow-700' :
                                                item.status === 'repair' ? 'bg-blue-100 text-blue-700' :
                                                    item.status === 'sold' ? 'bg-rose-100 text-rose-700' :
                                                        'bg-gray-100 text-gray-700'
                                        }`}>
                                        {item.status === 'ready' ? 'พร้อม' :
                                            item.status === 'reserved' ? 'ติดจอง' :
                                                item.status === 'repair' ? 'ส่งซ่อม' :
                                                    item.status === 'sold' ? 'ขายแล้ว' :
                                                        item.status}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className="font-black text-orange-600 text-base">
                                        ฿{item.confirmedPrice.toLocaleString()}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default function ConsignmentListPage() {
    return (
        <Suspense fallback={
            <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <ConsignmentListContent />
        </Suspense>
    );
}
