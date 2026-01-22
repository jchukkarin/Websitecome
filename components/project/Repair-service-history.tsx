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
    RotateCcw
} from "lucide-react";
import axios from "axios";
import UnifiedPersonView from "../history/UnifiedPersonView";
import { useSession } from "next-auth/react";

export default function RepairServiceHistory() {
    const { data: session } = useSession();
    const [view, setView] = useState<"product" | "repair_person">("product");
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const user = session?.user as any;
    const isManager = user?.role === "MANAGER";

    useEffect(() => {
        fetchData();
    }, [session]);

    const fetchData = async () => {
        if (!session) return;
        setLoading(true);
        try {
            const res = await axios.get("/api/consignments?type=REPAIR");
            let consignments = res.data;

            // ✅ Filter for Employee (Limited view)
            if (user?.role === "EMPLOYEE") {
                consignments = consignments.filter((c: any) => c.userId === user.id);
            }

            // Flatten the data: each record has items
            const flattened = consignments.flatMap((c: any) =>
                c.items.map((item: any) => ({
                    ...item,
                    lot: c.lot,
                    date: c.date,
                    userId: c.userId, // ✅ Added for check
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
            item.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.lot?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.consignorName?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [data, searchQuery]);

    return (
        <div className="p-4 sm:p-8 bg-[#FAFBFC] min-h-screen">
            <div className="w-full mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
                            <p className="text-sm font-black text-blue-600 uppercase tracking-widest">Repair History</p>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">ประวัติการฝากซ่อมสินค้า</h1>
                        <p className="text-slate-500 font-medium text-lg">จัดการและตรวจสอบรายการฝากซ่อมสินค้าทั้งหมดในระบบ</p>
                    </div>

                    <div className="flex bg-white p-1.5 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                        <Button
                            onPress={() => setView("product")}
                            className={`rounded-[1.75rem] px-8 h-12 font-black transition-all ${view === "product"
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                : "bg-transparent text-slate-400 hover:text-slate-600"
                                }`}
                            startContent={<Package size={18} />}
                        >
                            รายการสินค้า
                        </Button>
                        <Button
                            onPress={() => setView("repair_person")}
                            className={`rounded-[1.75rem] px-8 h-12 font-black transition-all ${view === "repair_person"
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                : "bg-transparent text-slate-400 hover:text-slate-600"
                                }`}
                            startContent={<Users size={18} />}
                        >
                            ข้อมูลผู้ฝากซ่อม
                        </Button>
                    </div>
                </div>

                {view === "product" ? (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        {/* Filter Bar */}
                        <div className="flex flex-col lg:flex-row gap-4 items-center bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100">
                            <div className="relative flex-1 group w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="ค้นหารหัสสินค้า, ชื่อสินค้า หรือล็อต..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl text-slate-900 font-medium focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all outline-none"
                                />
                            </div>
                            <div className="flex gap-3 w-full lg:w-auto">
                                <Select
                                    placeholder="หมวดหมู่"
                                    className="w-full lg:w-44"
                                    classNames={{ trigger: "h-14 bg-slate-50 border-none rounded-2xl" }}
                                    startContent={<Filter size={18} className="text-slate-400" />}
                                >
                                    <SelectItem key="Filing">Filing</SelectItem>
                                    <SelectItem key="Camera">กล้อง</SelectItem>
                                    <SelectItem key="Other">อื่นๆ</SelectItem>
                                </Select>
                                <Button className="h-14 px-8 rounded-2xl bg-slate-900 text-white font-black shadow-lg shadow-slate-200" startContent={<FileSpreadsheet size={18} />}>
                                    Export Excel
                                </Button>
                            </div>
                        </div>

                        {/* Data Table */}
                        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden ring-1 ring-slate-200/50">
                            <Table
                                aria-label="Repair product history table"
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
                                    <TableColumn>วันที่รับซ่อม</TableColumn>
                                    <TableColumn>ชื่อสินค้า</TableColumn>
                                    <TableColumn>ผู้ฝากซ่อม</TableColumn>
                                    <TableColumn>สถานะ</TableColumn>
                                    <TableColumn align="end">ราคาซ่อม (บาท)</TableColumn>
                                </TableHeader>
                                <TableBody
                                    items={filteredData}
                                    loadingContent={<Spinner label="กำลังจัดเตรียมข้อมูล..." color="primary" />}
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
                                                <span className="text-blue-700 font-black text-lg">
                                                    {isManager || item.userId === user?.id ? item.confirmedPrice?.toLocaleString() : '***'}
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
                                    <Pagination total={1} initialPage={1} size="md" radius="full" classNames={{ cursor: "bg-blue-600 text-white font-black" }} />
                                    <Button isIconOnly variant="flat" size="md" className="bg-white border border-slate-200 text-slate-600 rounded-2xl shadow-sm">
                                        <ChevronRight size={20} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <UnifiedPersonView
                        type="REPAIR"
                        title="ประวัติการบันทึกข้อมูลผู้ฝากซ่อม"
                        subtitle="รายละเอียดและสถานะการบันทึกข้อมูลฝากซ่อมสินค้า"
                        themeColor="blue-600"
                        personLabel="ผู้ฝากซ่อม"
                        priceLabel="ราคาซ่อมรวม"
                    />
                )}

            </div>
        </div>
    );
}
