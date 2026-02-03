"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Pagination,
    Spinner,
    Button,
    Avatar,
    Tooltip,
    Selection,
} from "@heroui/react";
import {
    ChevronLeft,
    ChevronRight,
    Trash2,
    Edit3,
    Eye,
    Search,
    FileSpreadsheet,
    FileText,
    Package
} from "lucide-react";
import { useRouter } from "next/navigation";
import { exportConsignmentPDF } from "@/lib/export/exportPDF";
import { exportImportExcel } from "@/lib/export/exportImportExcel";
import { exportRepairExcel } from "@/lib/export/exportRepairExcel";
import { exportBatchExcel } from "@/lib/export/exportBatchExcel";
import toast from "react-hot-toast";

interface UnifiedPersonViewProps {
    type: "INCOME" | "CONSIGNMENT" | "PAWN" | "REPAIR";
    title: string;
    subtitle: string;
    themeColor?: string; // e.g., "red-600", "purple-600", "blue-600"
    personLabel?: string; // e.g., "ผู้นำเข้า", "ผู้ฝากขาย", "ผู้นำมาจำนำ", "ผู้ฝากซ่อม"
    priceLabel?: string; // e.g., "ราคารวม", "ยอดจำนำ", "ราคาซ่อม"
}

export default function UnifiedPersonView({
    type,
    title,
    subtitle,
    themeColor = "red-600",
    personLabel = "ผู้ฝากขาย",
    priceLabel = "ราคารวม"
}: UnifiedPersonViewProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [consignments, setConsignments] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
    const [searchQuery, setSearchQuery] = useState("");
    const rowsPerPage = 5;

    const getNextUIColor = (color: string) => {
        if (color.includes("red")) return "danger" as const;
        if (color.includes("purple")) return "secondary" as const;
        if (color.includes("blue")) return "primary" as const;
        if (color.includes("orange")) return "warning" as const;
        if (color.includes("green")) return "success" as const;
        return "primary" as const;
    };

    const nextUIColor = getNextUIColor(themeColor);
    const textThemeClass = `text-${themeColor}`;
    const ringClass = `focus:ring-${themeColor}/5`;
    const shadowClass = `shadow-${themeColor.split('-')[0]}-200`;

    useEffect(() => {
        fetchConsignments();
    }, [type]);

    const fetchConsignments = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/consignments?type=${type}`);
            if (response.ok) {
                const data = await response.json();
                setConsignments(data);
            }
        } catch (error) {
            console.error("Failed to fetch consignments:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredConsignments = useMemo(() => {
        return consignments.filter((c) =>
            c.consignorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.lot?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [consignments, searchQuery]);

    // ✅ Reset หน้ากลับไปที่ 1 เมื่อมีการค้นหาใหม่
    useEffect(() => {
        setPage(1);
    }, [searchQuery]);

    const pages = Math.ceil(filteredConsignments.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        // ดึงข้อมูลมาแค่ 5 รายการตามหน้าปัจจุบัน
        return filteredConsignments.slice(start, end);
    }, [page, filteredConsignments, rowsPerPage]);

    const handleExportFullExcel = () => {
        const allItems = filteredConsignments.flatMap(c =>
            (c.items || []).map((item: any) => ({
                ...item,
                lot: c.lot,
                consignorName: c.consignorName,
                createdAt: c.createdAt,
                date: c.date // for repair
            }))
        );

        if (type === "REPAIR") {
            exportRepairExcel(allItems);
        } else {
            exportImportExcel(allItems);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?")) {
            try {
                const response = await fetch(`/api/consignments/${id}`, {
                    method: "DELETE",
                });
                if (response.ok) {
                    setConsignments(consignments.filter((c) => c.id !== id));
                    toast.success("ลบรายการเรียบร้อยแล้ว");
                }
            } catch (error) {
                console.error("Delete failed:", error);
                toast.error("ไม่สามารถลบรายการได้");
            }
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row gap-4 items-center bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 mb-8">
                <div className="relative flex-1 group w-full">
                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:${textThemeClass} transition-colors`} />
                    <input
                        type="text"
                        placeholder={`ค้นหาล็อต หรือชื่อ${personLabel}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl text-slate-900 font-medium focus:ring-4 ${ringClass} focus:bg-white transition-all outline-none`}
                    />
                </div>
                <div className="flex gap-3 w-full lg:w-auto">
                    <Button
                        variant="flat"
                        className={`h-14 px-8 rounded-2xl bg-white text-slate-600 font-black border border-slate-200 transition-all active:scale-95`}
                        startContent={<FileSpreadsheet size={18} />}
                        onPress={handleExportFullExcel}
                    >
                        Export สินค้าทั้งหมด (Excel)
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden ring-1 ring-slate-200/50">
                <Table
                    aria-label={`${title} table`}
                    removeWrapper
                    selectionMode="multiple"
                    selectedKeys={selectedKeys}
                    onSelectionChange={setSelectedKeys}
                    className="min-w-full"
                    classNames={{
                        th: "bg-slate-50/50 text-slate-400 font-bold uppercase text-[10px] tracking-widest py-6 border-b border-slate-100 first:pl-10 last:pr-10",
                        td: "py-6 text-slate-600 font-medium first:pl-10 last:pr-10 border-b border-slate-50",
                    }}
                >
                    <TableHeader>
                        <TableColumn>รูปภาพ</TableColumn>
                        <TableColumn>ล็อตสินค้า</TableColumn>
                        <TableColumn>วันที่บันทึก</TableColumn>
                        <TableColumn>ชื่อ{personLabel}</TableColumn>
                        <TableColumn>เบอร์ติดต่อ</TableColumn>
                        <TableColumn>ที่อยู่</TableColumn>
                        <TableColumn align="end">{priceLabel} (บาท)</TableColumn>
                        <TableColumn align="center">จัดการ</TableColumn>
                    </TableHeader>

                    <TableBody
                        items={items}
                        loadingContent={<Spinner label="กำลังโหลดข้อมูล..." color={nextUIColor} />}
                        isLoading={loading}
                        emptyContent={!loading && `ไม่พบข้อมูล${title}`}
                    >
                        {(item: any) => (
                            <TableRow key={item.id} className="group transition-all hover:bg-slate-50/50">
                                <TableCell>
                                    <div className="flex -space-x-4 overflow-hidden">
                                        {(item.images && item.images.length > 0) ? (
                                            item.images.slice(0, 3).map((img: any) => (
                                                <Avatar
                                                    key={img.id}
                                                    src={img.imageUrl}
                                                    className="w-12 h-12 border-2 border-white shadow-sm"
                                                    isBordered
                                                    radius="lg"
                                                />
                                            ))
                                        ) : (
                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-200/50">
                                                <Package className="w-5 h-5 text-slate-300" />
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="bg-blue-600/10 text-blue-600 px-4 py-1.5 rounded-xl text-xs font-black tracking-tight border border-blue-600/5">
                                        {item.lot}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-slate-900 font-bold whitespace-nowrap">
                                            {new Date(item.date).toLocaleDateString("th-TH")}
                                        </span>
                                        <span className="text-[10px] text-slate-400 uppercase font-black">
                                            {new Date(item.date).toLocaleTimeString("th-TH", { hour: '2-digit', minute: '2-digit' })} น.
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-slate-900 font-black text-base">{item.consignorName}</span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-slate-500 font-bold bg-slate-100 px-3 py-1 rounded-lg text-sm">{item.contactNumber}</span>
                                </TableCell>
                                <TableCell>
                                    <Tooltip content={item.address} className="rounded-2xl px-4 py-2 font-bold shadow-2xl">
                                        <p className="max-w-[120px] truncate text-slate-400 text-sm font-medium italic">
                                            {item.address}
                                        </p>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>
                                    <span className={`${textThemeClass} font-black text-xl`}>
                                        {item.totalPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-center gap-1">
                                        <Tooltip content="ดูรายละเอียด">
                                            <Button
                                                isIconOnly
                                                variant="light"
                                                size="sm"
                                                className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl"
                                                onPress={() => router.push(`/history/batch/${item.id}`)}
                                            >
                                                <Eye className="w-5 h-5" />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip content="แก้ไข">
                                            <Button
                                                isIconOnly
                                                variant="light"
                                                size="sm"
                                                className="text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl"
                                                onPress={() => router.push(`/history/batch/${item.id}`)}
                                            >
                                                <Edit3 className="w-5 h-5" />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip content="ส่งออก PDF">
                                            <Button
                                                isIconOnly
                                                variant="light"
                                                size="sm"
                                                className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl"
                                                onPress={() => exportConsignmentPDF(item)}
                                            >
                                                <FileText className="w-5 h-5" />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip content="ลบ" color="danger">
                                            <Button
                                                isIconOnly
                                                variant="light"
                                                size="sm"
                                                color="danger"
                                                className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </Tooltip>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <div className="flex flex-col sm:flex-row justify-between items-center px-10 py-10 bg-slate-50/30 border-t border-slate-100 gap-6">
                    <span className="text-sm font-black text-slate-900/40 uppercase tracking-[0.2em]">
                        {filteredConsignments.length} records in total
                    </span>

                    <div className="flex items-center gap-4">
                        <Button isIconOnly variant="flat" size="md" isDisabled={page === 1} onPress={() => setPage(p => Math.max(1, p - 1))} className="bg-white border rounded-2xl shadow-sm">
                            <ChevronLeft size={20} />
                        </Button>
                        <Pagination
                            total={pages > 0 ? pages : 1}
                            page={page}
                            onChange={(p) => setPage(p)}
                            size="md"
                            radius="full"
                            color={nextUIColor}
                            classNames={{
                                cursor: `text-white shadow-2xl ${shadowClass} font-black`,
                                base: "flex justify-center",
                            }}
                        />
                        <Button isIconOnly variant="flat" size="md" isDisabled={page === pages} onPress={() => setPage(p => Math.min(pages, p + 1))} className="bg-white border rounded-2xl shadow-sm">
                            <ChevronRight size={20} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
