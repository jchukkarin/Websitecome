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
} from "@nextui-org/react";
import { ChevronLeft, ChevronRight, Trash2, Edit3, Eye, Search } from "lucide-react";

// Consignment Interface based on Prisma schema
interface ConsignmentImage {
    id: string;
    imageUrl: string;
}

interface Consignment {
    id: string;
    date: string;
    lot: string;
    consignorName: string;
    contactNumber: string;
    address: string;
    totalPrice: number;
    type: string;
    images: ConsignmentImage[];
}

export default function HistoryForm() {
    const [loading, setLoading] = useState(true);
    const [consignments, setConsignments] = useState<Consignment[]>([]);
    const [page, setPage] = useState(1);
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
    const rowsPerPage = 10;

    useEffect(() => {
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

        fetchConsignments();
    }, []);

    const pages = Math.ceil(consignments.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return consignments.slice(start, end);
    }, [page, consignments]);

    const selectedValue = useMemo(() => {
        if (selectedKeys === "all") return consignments.length;
        return selectedKeys.size;
    }, [selectedKeys, consignments.length]);

    const handleDelete = async (id: string) => {
        if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?")) {
            try {
                const response = await fetch(`/api/consignments/${id}`, {
                    method: "DELETE",
                });
                if (response.ok) {
                    setConsignments(consignments.filter((c) => c.id !== id));
                }
            } catch (error) {
                console.error("Delete failed:", error);
            }
        }
    };

    return (
        <div className="p-4 sm:p-8 bg-[#F8FAFC] min-h-screen">
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
                                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-red-600/5 focus:border-red-600 transition-all w-64 shadow-sm"
                            />
                        </div>
                        <Button color="danger" className="rounded-2xl font-black px-6 shadow-xl shadow-red-200 h-11">
                            ส่งออก Excel
                        </Button>
                    </div>
                </div>

                {/* Data Table Container */}
                <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden ring-1 ring-slate-200/50">
                    <Table
                        aria-label="Import history table"
                        removeWrapper
                        selectionMode="multiple"
                        selectedKeys={selectedKeys}
                        onSelectionChange={setSelectedKeys}
                        className="min-w-full"
                        classNames={{
                            th: "bg-slate-50/50 text-slate-400 font-bold uppercase text-[10px] tracking-widest py-6 border-b border-slate-100 first:pl-10 last:pr-10",
                            td: "py-6 text-slate-600 font-medium first:pl-10 last:pr-10 border-b border-slate-50 group-hover:bg-slate-50/30 transition-colors",
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
                                            {item.images.length > 0 ? (
                                                item.images.slice(0, 3).map((img) => (
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
                                                    <Eye className="w-5 h-5 text-slate-300" />
                                                </div>
                                            )}
                                            {item.images.length > 3 && (
                                                <div className="w-12 h-12 rounded-2xl bg-slate-900 border-2 border-white flex items-center justify-center text-xs font-black text-white z-10 shadow-sm">
                                                    +{item.images.length - 3}
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
                                                {new Date(item.date).toLocaleDateString("th-TH", { day: 'numeric', month: 'short', year: 'numeric' })}
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
                                        <Tooltip content={item.address} showArrow placement="top" className="rounded-2xl px-4 py-2 font-bold shadow-2xl">
                                            <p className="max-w-[120px] truncate text-slate-400 text-sm font-medium italic">
                                                {item.address}
                                            </p>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col items-end">
                                            <span className="text-blue-700 font-black text-xl">
                                                {item.totalPrice.toLocaleString(undefined, {
                                                    minimumFractionDigits: 2,
                                                })}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center gap-1">
                                            <Tooltip content="ดูรายละเอียด" size="sm">
                                                <Button
                                                    isIconOnly
                                                    variant="light"
                                                    size="sm"
                                                    className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip content="แก้ไข" size="sm">
                                                <Button
                                                    isIconOnly
                                                    variant="light"
                                                    size="sm"
                                                    className="text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl"
                                                >
                                                    <Edit3 className="w-5 h-5" />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip content="ลบ" color="danger" size="sm">
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

                    {/* Footer / Pagination */}
                    <div className="flex flex-col sm:flex-row justify-between items-center px-10 py-10 bg-slate-50/30 border-t border-slate-100 gap-6">
                        <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-900/40 uppercase tracking-[0.2em]">
                                {selectedValue} of {consignments.length} rows selected
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button
                                isIconOnly
                                variant="flat"
                                size="md"
                                isDisabled={page === 1}
                                onPress={() => setPage((p) => Math.max(1, p - 1))}
                                className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-2xl shadow-sm min-w-0"
                            >
                                <ChevronLeft size={20} />
                            </Button>

                            <Pagination
                                total={pages || 1}
                                page={page}
                                onChange={setPage}
                                size="md"
                                radius="full"
                                showControls={false}
                                classNames={{
                                    wrapper: "gap-3",
                                    item: "bg-transparent text-slate-400 font-black hover:bg-slate-200/50 min-w-[40px] h-10",
                                    cursor: "bg-red-600 text-white shadow-2xl shadow-red-200 font-black min-w-[40px] h-10",
                                }}
                            />

                            <Button
                                isIconOnly
                                variant="flat"
                                size="md"
                                isDisabled={page === pages}
                                onPress={() => setPage((p) => Math.min(pages, p + 1))}
                                className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-2xl shadow-sm min-w-0"
                            >
                                <ChevronRight size={20} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
