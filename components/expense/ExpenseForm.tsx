"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    Select,
    SelectItem,
    Pagination,
    Spinner,
    Chip,
} from "@heroui/react";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Package,
    Users,
    Filter,
    FileSpreadsheet,
    RotateCcw,
    Camera,
    Aperture,
    Video,
    BatteryMedium,
    Film,
    MoreHorizontal,
} from "lucide-react";
import axios from "axios";
import UnifiedPersonView from "../history/UnifiedPersonView";
import { useRouter } from "next/navigation";
import { exportPawnExcel } from "@/lib/export/exportPawnExcel";

export default function PawnHistory() {
    const router = useRouter();
    const [view, setView] = useState<"product" | "pawn_person">("product");
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/consignments?type=PAWN");
            // Flatten the data: each record has items
            const flattened = res.data.flatMap((c: any) =>
                c.items.map((item: any) => ({
                    ...item,
                    lot: c.lot,
                    date: c.date,
                    consignorName: c.consignorName,
                    displayImage: item.imageUrl || (c.images && c.images.length > 0 ? c.images[0].imageUrl : null)
                }))
            );
            setData(flattened);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredData = useMemo(() => {
        return data.filter((item) =>
            (item.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.lot?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.consignorName?.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (selectedCategory === "" || selectedCategory === "all" || item.category === selectedCategory)
        );
    }, [data, searchQuery, selectedCategory]);

    return (
        <div className="p-4 sm:p-8 bg-[#FAFBFC] min-h-screen">
            <div className="w-full mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="w-8 h-1 bg-red-600 rounded-full"></span>
                            <p className="text-sm font-black text-red-600 uppercase tracking-widest">Pawn History</p>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">ประวัติการรับจำนำ</h1>
                        <p className="text-slate-500 font-medium text-lg">จัดการและตรวจสอบรายการรับจำนำสินค้าทั้งหมดในระบบ</p>
                    </div>

                    <div className="flex bg-white p-1.5 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                        <Button
                            onPress={() => setView("product")}
                            className={`rounded-[1.75rem] px-8 h-12 font-black transition-all ${view === "product"
                                ? "bg-red-600 text-white shadow-lg shadow-red-200"
                                : "bg-transparent text-slate-400 hover:text-slate-600"
                                }`}
                            startContent={<Package size={18} />}
                        >
                            รายการสินค้า
                        </Button>
                        <Button
                            onPress={() => setView("pawn_person")}
                            className={`rounded-[1.75rem] px-8 h-12 font-black transition-all ${view === "pawn_person"
                                ? "bg-red-600 text-white shadow-lg shadow-red-200"
                                : "bg-transparent text-slate-400 hover:text-slate-600"
                                }`}
                            startContent={<Users size={18} />}
                        >
                            ข้อมูลผู้นำมาจำนำ
                        </Button>
                    </div>
                </div>

                {view === "product" ? (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        {/* Filter Bar */}
                        <div className="flex flex-col lg:flex-row gap-4 items-center bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100">
                            <div className="relative flex-1 group w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="ค้นหารหัสสินค้า, ชื่อสินค้า หรือล็อต..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl text-slate-900 font-medium focus:ring-4 focus:ring-red-500/5 focus:bg-white transition-all outline-none"
                                />
                            </div>
                            <div className="flex gap-3 w-full lg:w-auto">
                                {isMounted ? (
                                    <Select
                                        items={[
                                            { key: "all", label: "ทั้งหมด", icon: <Filter className="text-slate-400" size={18} /> },
                                            { key: "กล้อง", label: "กล้อง", icon: <Camera className="text-blue-500 " size={18} /> },
                                            { key: "เลนส์", label: "เลนส์", icon: <Aperture className="text-emerald-500" size={18} /> },
                                            { key: "ขาตั้งกล้อง", label: "ขาตั้งกล้อง", icon: <Video className="text-orange-500" size={18} /> },
                                            { key: "แบต", label: "แบต", icon: <BatteryMedium className="text-pink-500" size={18} /> },
                                            { key: "ฟิลม์", label: "ฟิลม์", icon: <Film className="text-purple-500" size={18} /> },
                                            { key: "อื่นๆ", label: "อื่นๆ", icon: <MoreHorizontal className="text-slate-400" size={18} /> },
                                        ]}
                                        placeholder="หมวดหมู่"
                                        className="w-full lg:w-44"
                                        selectedKeys={selectedCategory ? [selectedCategory] : []}
                                        classNames={{
                                            trigger: "h-14 bg-slate-50 border-none rounded-2xl data-[hover=true]:bg-slate-100 transition-colors",
                                            popoverContent: "rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)]",
                                            value: "text-slate-700 font-bold",
                                        }}
                                        renderValue={(items) => {
                                            return items.map((item) => (
                                                <div key={item.key} className="flex items-center gap-2">
                                                    {item.data?.icon}
                                                    <span>{item.data?.label}</span>
                                                </div>
                                            ));
                                        }}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                    >
                                        {(category) => (
                                            <SelectItem
                                                key={category.key}
                                                textValue={category.label}
                                                startContent={category.icon}
                                                className="bg-white text-slate-700 font-bold"
                                            >
                                                {category.label}
                                            </SelectItem>
                                        )}
                                    </Select>
                                ) : (
                                    <div className="w-full lg:w-44 h-14 bg-slate-50 rounded-2xl animate-pulse" />
                                )}
                                <Button
                                    className="h-14 px-8 rounded-2xl bg-slate-900 text-white font-black shadow-lg shadow-slate-200 hover:scale-105 active:scale-95 transition-all"
                                    startContent={<FileSpreadsheet size={18} />}
                                    onPress={() => exportPawnExcel(filteredData)}
                                >
                                    Export Excel
                                </Button>
                            </div>
                        </div>

                        {/* Data Table */}
                        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden ring-1 ring-slate-200/50">
                            <Table
                                aria-label="Pawn product history table"
                                removeWrapper
                                className="min-w-full"
                                classNames={{
                                    th: "bg-slate-50/50 text-slate-400 font-bold uppercase text-[10px] tracking-widest py-6 border-b border-slate-100 first:pl-10 last:pr-10",
                                    td: "py-6 text-slate-600 font-medium first:pl-10 last:pr-10 border-b border-slate-50 group-hover:bg-slate-50/30 transition-colors",
                                }}
                            >
                                <TableHeader>
                                    <TableColumn>รูปภาพ</TableColumn>
                                    <TableColumn>รหัสสินค้า</TableColumn>
                                    <TableColumn>ล็อต</TableColumn>
                                    <TableColumn>วันที่รับจำนำ</TableColumn>
                                    <TableColumn>ชื่อสินค้า</TableColumn>
                                    <TableColumn>ผู้นำมาจำนำ</TableColumn>
                                    <TableColumn>สถานะ</TableColumn>
                                    <TableColumn align="end">ยอดจำนำ (บาท)</TableColumn>
                                </TableHeader>
                                <TableBody
                                    items={filteredData}
                                    loadingContent={<Spinner label="กำลังจัดเตรียมข้อมูล..." color="danger" />}
                                    isLoading={loading}
                                    emptyContent={!loading && "ไม่มีข้อมูลที่ตรงกับการค้นหา"}
                                >
                                    {(item) => (
                                        <TableRow
                                            key={item.id}
                                            className="group transition-all hover:bg-red-50/40 cursor-pointer"
                                            onClick={() => router.push(`/pawn/history/${item.id}`)}
                                        >
                                            <TableCell>
                                                <div className="w-16 h-12 rounded-xl border border-slate-100 overflow-hidden bg-slate-50 shadow-sm">
                                                    {item.displayImage ? (
                                                        <img src={item.displayImage} alt={item.productName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                            <Package size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-tighter bg-slate-100 px-2 py-1 rounded-md">
                                                    #{item.id.slice(0, 8)}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-blue-600 font-black text-sm">{item.lot}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-slate-900 font-bold whitespace-nowrap">
                                                    {new Date(item.date).toLocaleDateString("th-TH")}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-slate-900 font-black">{item.productName}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-slate-500 font-bold italic">{item.consignorName}</span>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    variant="flat"
                                                    size="sm"
                                                    className="font-black text-[10px] uppercase"
                                                    color={item.status === "ขายได้" ? "success" : "warning"}
                                                >
                                                    {item.status}
                                                </Chip>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-red-700 font-black text-lg">
                                                    {item.confirmedPrice?.toLocaleString()}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>

                            {/* Footer */}
                            <div className="flex flex-col sm:flex-row justify-between items-center px-10 py-8 bg-slate-50/30 border-t border-slate-100 gap-6">
                                <span className="text-sm font-black text-slate-900/40 uppercase tracking-[0.2em]">
                                    {filteredData.length} records in total
                                </span>
                                <div className="flex items-center gap-4">
                                    <Button isIconOnly variant="flat" size="md" className="bg-white border border-slate-200 text-slate-600 rounded-2xl shadow-sm">
                                        <ChevronLeft size={20} />
                                    </Button>
                                    <Pagination total={1} initialPage={1} size="md" radius="full" classNames={{ cursor: "bg-red-600 text-white font-black" }} />
                                    <Button isIconOnly variant="flat" size="md" className="bg-white border border-slate-200 text-slate-600 rounded-2xl shadow-sm">
                                        <ChevronRight size={20} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <UnifiedPersonView
                        type="PAWN"
                        title="ประวัติการบันทึกข้อมูลผู้นำมาจำนำ"
                        subtitle="รายละเอียดและสถานะการบันทึกข้อมูลรับจำนำสินค้า"
                        themeColor="red-600"
                        personLabel="ผู้นำมาจำนำ"
                        priceLabel="ยอดจำนำรวม"
                    />
                )}

            </div>
        </div>
    );
}
