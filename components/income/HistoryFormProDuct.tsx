"use client";

import React, { useEffect, useState } from "react";
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
} from "@heroui/react";
import {
    Search,
    ChevronLeft,
    ChevronRight,

    RotateCcw
} from "lucide-react";
import axios from "axios";

import DownloadExcelButton from "@/components/downloadfile/DownloadExcelButton";

export default function ConsignmentHistory() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterValue, setFilterValue] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/consignments?type=CONSIGNMENT");
            // Flatten the data: each consignment has items
            const flattened = res.data.flatMap((c: any) =>
                c.items.map((item: any) => ({
                    ...item,
                    lot: c.lot,
                    date: new Date(c.date).toLocaleDateString("th-TH"),
                    consignorName: c.consignorName,
                    // Use item.imageUrl or fallback to first general image or placeholder
                    displayImage: item.imageUrl || (c.images && c.images.length > 0 ? c.images[0].imageUrl : "https://avatars.githubusercontent.com/u/30373425?v=4")
                }))
            );
            setData(flattened);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = React.useMemo(() => {
        return data.filter((item) =>
            item.productName.toLowerCase().includes(filterValue.toLowerCase()) ||
            item.consignorName.toLowerCase().includes(filterValue.toLowerCase()) ||
            item.lot.toLowerCase().includes(filterValue.toLowerCase())
        );
    }, [data, filterValue]);

    return (
        <div className="p-8 bg-[#F9FAFB] min-h-screen font-sans text-gray-800">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <p className="text-xs text-purple-600 font-semibold tracking-wider uppercase">การฝากขาย</p>
                        <h1 className="text-3xl font-bold text-gray-900">ประวัติการฝากขายสินค้า</h1>
                        <p className="text-sm text-gray-500">ข้อมูลรายการฝากขายทั้งหมดในระบบ</p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <DownloadExcelButton />
                        <div className="w-px h-8 bg-gray-200 mx-2" />
                        <Button isIconOnly variant="light" radius="full" size="sm" onClick={() => fetchData()}>
                            <RotateCcw size={20} className="text-gray-400" />
                        </Button>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="w-full md:max-w-xl">
                        <Input
                            isClearable
                            placeholder="ค้นหาชื่อสินค้า, ชื่อผู้ฝาก หรือล็อต..."
                            startContent={<Search size={18} className="text-gray-400" />}
                            variant="bordered"
                            value={filterValue}
                            onClear={() => setFilterValue("")}
                            onValueChange={setFilterValue}
                            classNames={{
                                inputWrapper: "h-11 border-gray-200 shadow-sm",
                            }}
                        />
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <Select
                            placeholder="หมวดหมู่"
                            variant="bordered"
                            className="w-full md:w-40"
                            size="sm"
                        >
                            <SelectItem key="Filing">Filing</SelectItem>
                            <SelectItem key="Camera">กล้อง</SelectItem>
                            <SelectItem key="Other">อื่นๆ</SelectItem>
                        </Select>
                        <Select
                            placeholder="สถานะ"
                            variant="bordered"
                            className="w-full md:w-40"
                            size="sm"
                        >
                            <SelectItem key="ขายได้">ปกติ</SelectItem>
                            <SelectItem key="ขายไม่ได้">ชำรุด</SelectItem>
                        </Select>
                    </div>
                </div>

                {/* Data Table */}
                <div className="border border-gray-100 rounded-xl shadow-sm overflow-hidden bg-white">
                    <Table
                        aria-label="Consignment history table"
                        removeWrapper
                        className="min-w-full"
                    >
                        <TableHeader>
                            <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold py-4">รูปภาพ</TableColumn>
                            <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold">ชื่อสินค้า/รายละเอียด</TableColumn>
                            <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold">ผู้ฝากขาย</TableColumn>
                            <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold text-center">วันที่</TableColumn>
                            <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold text-center">ล็อต</TableColumn>
                            <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold text-center">หมวดหมู่</TableColumn>
                            <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold text-center">สถานะ</TableColumn>
                            <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold text-right pr-6">ราคาคอนเฟิร์ม</TableColumn>
                        </TableHeader>
                        <TableBody
                            items={filteredItems}
                            emptyContent={loading ? " " : "ไม่พบข้อมูลรายการฝากขาย"}
                            isLoading={loading}
                            loadingContent={<Spinner label="กำลังโหลดข้อมูล..." />}
                        >
                            {(item: any) => (
                                <TableRow key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                    <TableCell className="py-4">
                                        <div className="w-16 h-12 rounded-lg border border-gray-100 overflow-hidden bg-gray-50">
                                            <img src={item.displayImage} alt={item.productName} className="w-full h-full object-cover" />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">{item.productName}</span>
                                            <span className="text-xs text-gray-500">{item.year}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-600">{item.consignorName}</TableCell>
                                    <TableCell align="center" className="text-gray-600">{item.date}</TableCell>
                                    <TableCell align="center">
                                        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600">
                                            {item.lot}
                                        </span>
                                    </TableCell>
                                    <TableCell align="center" className="text-gray-600">{item.category}</TableCell>
                                    <TableCell align="center">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${item.status === "ขายได้" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                            }`}>
                                            {item.status}
                                        </span>
                                    </TableCell>
                                    <TableCell align="right" className="text-right font-bold text-purple-600 pr-6">
                                        {item.confirmedPrice?.toLocaleString()}.-
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* Footer / Pagination */}
                    <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-gray-50/30 border-t border-gray-100 gap-4">
                        <span className="text-xs text-gray-400 italic">แสดง {filteredItems.length} รายการ</span>
                        <div className="flex items-center gap-2">
                            <Pagination total={1} initialPage={1} size="sm" color="secondary" variant="flat" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
