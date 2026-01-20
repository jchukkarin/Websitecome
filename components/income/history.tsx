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
    Tabs,
    Tab,
    Chip,
} from "@heroui/react";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Package,
    Users,
    Filter,
    FileSpreadsheet
} from "lucide-react";
import axios from "axios";
import HistoryForm from "./HistoryForm";

export default function History() {
    const [view, setView] = useState<"product" | "importer">("product");
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/consignments?type=INCOME");
            // Flatten the data: each consignment has items
            const flattened = res.data.flatMap((c: any) =>
                c.items.map((item: any) => ({
                    ...item,
                    lot: c.lot,
                    date: c.date,
                    consignorName: c.consignorName,
                    // Use item.imageUrl or fallback to first general image or placeholder
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
            item.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.lot?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [data, searchQuery]);

    return (
        <div className="p-4 sm:p-8 bg-[#FAFBFC] min-h-screen">
            <div className="w-full mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="w-8 h-1 bg-red-600 rounded-full"></span>
                            <p className="text-sm font-black text-red-600 uppercase tracking-widest">History Management</p>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">ประวัติข้อมูลการนำเข้า</h1>
                        <p className="text-slate-500 font-medium text-lg">จัดการและตรวจสอบรายการนำเข้าสินค้าทั้งหมดในระบบ</p>
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
                            onPress={() => setView("importer")}
                            className={`rounded-[1.75rem] px-8 h-12 font-black transition-all ${view === "importer"
                                ? "bg-red-600 text-white shadow-lg shadow-red-200"
                                : "bg-transparent text-slate-400 hover:text-slate-600"
                                }`}
                            startContent={<Users size={18} />}
                        >
                            ข้อมูลผู้นำเข้า
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
                                <Select
                                    placeholder="หมวดหมู่"
                                    className="w-full lg:w-44"
                                    classNames={{ trigger: "h-14 bg-slate-50 border-none rounded-2xl" }}
                                    startContent={<Filter size={18} className="text-slate-400" />}
                                >
                                    <SelectItem key="film">กล้องฟิล์ม</SelectItem>
                                    <SelectItem key="digital">กล้องดิจิตอล</SelectItem>
                                </Select>
                                <Button className="h-14 px-8 rounded-2xl bg-slate-900 text-white font-black shadow-lg shadow-slate-200" startContent={<FileSpreadsheet size={18} />}>
                                    Export Excel
                                </Button>
                            </div>
                        </div>

                        {/* Data Table */}
                        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden ring-1 ring-slate-200/50">
                            <Table
                                aria-label="Product history table"
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
                                    <TableColumn>วันที่นำเข้า</TableColumn>
                                    <TableColumn>ชื่อสินค้า</TableColumn>
                                    <TableColumn>สถานะ</TableColumn>
                                    <TableColumn>หมวดหมู่</TableColumn>
                                    <TableColumn align="end">ราคา (บาท)</TableColumn>
                                </TableHeader>
                                <TableBody
                                    items={filteredData}
                                    loadingContent={<Spinner label="กำลังจัดเตรียมข้อมูล..." color="danger" />}
                                    isLoading={loading}
                                    emptyContent={!loading && "ไม่มีข้อมูลที่ตรงกับการค้นหา"}
                                >
                                    {(item) => (
                                        <TableRow key={item.id} className="group transition-all hover:bg-slate-50/50">
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
                                                <span className="text-slate-500 font-bold italic">{item.category}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-slate-900 font-black text-lg">
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
                    <div className="animate-in slide-in-from-bottom-4 duration-500">
                        <HistoryForm />
                    </div>
                )}

            </div>
        </div>
    );
}
