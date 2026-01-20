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
import { ChevronLeft, ChevronRight, Trash2, Edit3, Eye, Search, FileSpreadsheet } from "lucide-react";

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
    const [loading, setLoading] = useState(true);
    const [consignments, setConsignments] = useState<Consignment[]>([]);
    const [page, setPage] = useState(1);
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
    const [searchQuery, setSearchQuery] = useState("");
    const rowsPerPage = 5;

    const getNextUIColor = (color: string) => {
        if (color.includes("red")) return "danger";
        if (color.includes("purple")) return "secondary";
        if (color.includes("blue")) return "primary";
        if (color.includes("orange")) return "warning";
        if (color.includes("green")) return "success";
        return "primary";
    };

    const nextUIColor = getNextUIColor(themeColor);
    const textThemeClass = `text-${themeColor}`;
    const ringClass = `focus:ring-${themeColor}/5`;
    const shadowClass = `shadow-${themeColor.split('-')[0]}-200`;

    useEffect(() => {
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

        fetchConsignments();
    }, [type]);

    const filteredConsignments = useMemo(() => {
        return consignments.filter((c) =>
            c.consignorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.lot?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [consignments, searchQuery]);

    
    const pages = Math.ceil(filteredConsignments.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredConsignments.slice(start, end);
    }, [page, filteredConsignments]);

    const selectedValue = useMemo(() => {
        if (selectedKeys === "all") return filteredConsignments.length;
        return selectedKeys.size;
    }, [selectedKeys, filteredConsignments.length]);

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
                        className={`h-14 px-8 rounded-2xl text-white font-black shadow-lg ${shadowClass} transition-all active:scale-95`}
                        style={{ backgroundColor: `var(--${themeColor.split('-')[0]}-600, ${themeColor.split('-')[0]})` }}
                        startContent={<FileSpreadsheet size={18} />}
                        onPress={() => { }} // Export function placeholder
                        color={nextUIColor}
                    >
                        Export Excel
                    </Button>
                </div>
            </div>

            {/* Data Table Container */}
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
                        td: "py-6 text-slate-600 font-medium first:pl-10 last:pr-10 border-b border-slate-50 group-hover:bg-slate-50/30 transition-colors",
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
                                        <span className={`${textThemeClass} font-black text-xl`}>
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
                            {selectedValue} of {filteredConsignments.length} records selected
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
                            color={nextUIColor}
                            classNames={{
                                wrapper: "gap-3",
                                item: "bg-transparent text-slate-400 font-black hover:bg-slate-200/50 min-w-[40px] h-10",
                                cursor: `text-white shadow-2xl ${shadowClass} font-black min-w-[40px] h-10`,
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
    );
}
