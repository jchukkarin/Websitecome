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
import { exportBatchExcel } from "@/lib/export/exportBatchExcel";
import { exportImportExcel } from "@/lib/export/exportImportExcel";
import { exportConsignmentPDF } from "@/lib/export/exportPDF";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function HistoryForm() {
    const router = useRouter();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [consignments, setConsignments] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const rowsPerPage = 10;

    const user = session?.user as any;
    const isManager = user?.role === "MANAGER";

    useEffect(() => {
        fetchConsignments();
    }, []);

    const fetchConsignments = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/consignments?type=INCOME");
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
            c.lot?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.consignorName?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [consignments, searchQuery]);

    const pages = Math.ceil(filteredConsignments.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredConsignments.slice(start, end);
    }, [page, filteredConsignments]);

    const handleExportFullExcel = () => {
        const allItems = filteredConsignments.flatMap(c =>
            (c.items || []).map((item: any) => ({
                ...item,
                lot: c.lot,
                consignorName: c.consignorName,
                createdAt: c.createdAt
            }))
        );
        exportImportExcel(allItems);
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
        <div className="p-4 sm:p-8 bg-[#F8FAFC]">
            <div className="w-full mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <span className="w-2 h-10 bg-red-600 rounded-full inline-block"></span>
                            ประวัติการนำเข้าของผู้นำเข้า
                        </h1>
                        <p className="text-slate-500 mt-2 text-lg font-light">
                            รายละเอียดและสถานะการบันทึกข้อมูลนำเข้าสินค้า (History)
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="ค้นหาล็อตหรือชื่อ..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-red-600/5 focus:border-red-600 transition-all w-64 shadow-sm"
                            />
                        </div>
                        <Button
                            variant="flat"
                            className="rounded-2xl font-black px-6 h-11 bg-white border border-slate-200 text-slate-600"
                            startContent={<FileSpreadsheet size={18} />}
                            onPress={handleExportFullExcel}
                        >
                            Export สินค้าทั้งหมด (Excel)
                        </Button>
                        <Button
                            color="danger"
                            className="rounded-2xl font-black px-6 shadow-xl shadow-red-200 h-11"
                            startContent={<FileSpreadsheet size={18} />}
                            onPress={() => exportBatchExcel(filteredConsignments)}
                        >
                            ส่งออก Excel
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden ring-1 ring-slate-200/50">
                    <Table
                        aria-label="Import history table"
                        removeWrapper
                        className="min-w-full"
                        classNames={{
                            th: "bg-slate-50/50 text-slate-400 font-bold uppercase text-[10px] tracking-widest py-6 border-b border-slate-100 first:pl-10 last:pr-10",
                            td: "py-6 text-slate-600 font-medium first:pl-10 last:pr-10 border-b border-slate-50",
                        }}
                    >
                        <TableHeader>
                            <TableColumn>รูปภาพ</TableColumn>
                            <TableColumn>ล็อตสินค้า</TableColumn>
                            <TableColumn>วันที่นำเข้า</TableColumn>
                            <TableColumn>ชื่อผู้ฝากขาย</TableColumn>
                            <TableColumn>เบอร์ติดต่อ</TableColumn>
                            <TableColumn>ที่อยู่</TableColumn>
                            <TableColumn align="end">ราคารวม (บาท)</TableColumn>
                            <TableColumn align="center">จัดการ</TableColumn>
                        </TableHeader>

                        <TableBody
                            items={items}
                            loadingContent={<Spinner label="กำลังโหลดข้อมูล..." color="danger" />}
                            isLoading={loading}
                            emptyContent={!loading && "ไม่พบข้อมูลการนำเข้า"}
                        >
                            {(item) => (
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
                                        <span className="text-blue-700 font-black text-xl">
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

                                            {(isManager || item.userId === user?.id) && (
                                                <>
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
                                                            className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl"
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
                                                            className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                                                            onClick={() => handleDelete(item.id)}
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </Button>
                                                    </Tooltip>
                                                </>
                                            )}
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
                            <Pagination total={pages || 1} page={page} onChange={setPage} size="md" radius="full" classNames={{ cursor: "bg-red-600 text-white font-black" }} />
                            <Button isIconOnly variant="flat" size="md" isDisabled={page === pages} onPress={() => setPage(p => Math.min(pages, p + 1))} className="bg-white border rounded-2xl shadow-sm">
                                <ChevronRight size={20} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
