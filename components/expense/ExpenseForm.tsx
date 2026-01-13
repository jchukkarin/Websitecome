"use client";

import React, { useState, useEffect } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    Pagination,
    Spinner,
} from "@heroui/react";
import { Search, Plus } from "lucide-react";
import axios from "axios";

export default function PawnHistory() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterValue, setFilterValue] = useState("");

    useEffect(() => {
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
            item.consignorName.toLowerCase().includes(filterValue.toLowerCase())
        );
    }, [data, filterValue]);

    return (
        <div className="p-8 bg-[#F9FAFB] min-h-screen font-sans text-gray-800">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 text-center italic">ประวัติการจำนำ</h1>
                        <p className="text-sm text-gray-500">ข้อมูลรายการจำนำทั้งหมดในระบบ</p>
                    </div>
                </div>

                {/* Filters & Actions */}
                <div className="flex justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="ค้นหาชื่อสินค้า หรือชื่อผู้นำมาจำนำ..."
                        startContent={<Search className="text-gray-400" size={18} />}
                        value={filterValue}
                        onClear={() => setFilterValue("")}
                        onValueChange={setFilterValue}
                        variant="bordered"
                        size="sm"
                    />
                    <div className="flex gap-3">
                        <Button color="primary" startContent={<Plus size={18} />} size="sm" className="font-semibold">
                            เพิ่มข้อมูลใหม่
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <Table
                        aria-label="Pawn history table"
                        removeWrapper
                        className="min-h-[400px]"
                    >
                        <TableHeader>
                            <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold w-24">รูปภาพ</TableColumn>
                            <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold">ชื่อสินค้า/รายละเอียด</TableColumn>
                            <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold">ชื่อผู้นำมาจำนำ</TableColumn>
                            <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold text-center">วันที่รับจำนำ</TableColumn>
                            <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold text-center">ล๊อต</TableColumn>
                            <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold text-center">หมวดหมู่</TableColumn>
                            <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold text-center">สถานะ</TableColumn>
                            <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold text-right">ยอดจำนำ</TableColumn>
                        </TableHeader>
                        <TableBody
                            items={filteredItems}
                            emptyContent={loading ? " " : "ไม่พบข้อมูลรายการจำนำ"}
                            isLoading={loading}
                            loadingContent={<Spinner label="กำลังโหลดข้อมูล..." />}
                        >
                            {(item: any) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="w-16 h-12 rounded-lg overflow-hidden border border-gray-100">
                                            <img
                                                src={item.displayImage}
                                                alt={item.productName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">{item.productName}</span>
                                            <span className="text-xs text-gray-500">{item.year}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{item.consignorName}</TableCell>
                                    <TableCell align="center">{item.date}</TableCell>
                                    <TableCell align="center">
                                        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600">
                                            {item.lot}
                                        </span>
                                    </TableCell>
                                    <TableCell align="center">{item.category}</TableCell>
                                    <TableCell align="center">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${item.status === "ขายได้" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                            }`}>
                                            {item.status}
                                        </span>
                                    </TableCell>
                                    <TableCell align="right">
                                        <span className="font-bold text-red-600">
                                            {item.confirmedPrice?.toLocaleString()}.-
                                        </span>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination Placeholder */}
                    <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
                        <p className="text-xs text-gray-500 italic">แสดง {filteredItems.length} รายการ</p>
                        <Pagination
                            total={1}
                            initialPage={1}
                            size="sm"
                            variant="flat"
                            color="primary"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}