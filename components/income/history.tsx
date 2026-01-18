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
    MoreHorizontal
} from "lucide-react";
import axios from "axios";

export default function History() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="p-8 bg-white min-h-screen font-sans text-gray-800">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <p className="text-xs text-blue-600 font-semibold tracking-wider uppercase">การนำเข้า</p>
                        <h1 className="text-3xl font-bold text-gray-900">ประวัติข้อมูลการนำเข้า</h1>
                        <p className="text-sm text-gray-500">แสดงข้อมูลของสินค้านำเข้าทั้งหมด</p>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="w-full md:max-w-xl">
                        <Input
                            placeholder="ค้นหา"
                            startContent={<Search size={18} className="text-gray-400" />}
                            variant="bordered"
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
                            classNames={{
                                trigger: "h-11 border-gray-200 shadow-sm",
                            }}
                        >
                            <SelectItem key="film">กล้องฟิล์ม</SelectItem>
                            <SelectItem key="digital">กล้องดิจิตอล</SelectItem>
                        </Select>
                        <Select
                            placeholder="สถานะ"
                            variant="bordered"
                            className="w-full md:w-40"
                            classNames={{
                                trigger: "h-11 border-gray-200 shadow-sm",
                            }}
                        >
                            <SelectItem key="ready">พร้อม</SelectItem>
                            <SelectItem key="reserved">ติดจอง</SelectItem>
                        </Select>
                    </div>
                </div>

                {/* Data Table */}
                <div className="border border-gray-100 rounded-xl shadow-sm overflow-hidden bg-white">
                    <Table
                        aria-label="Import history table"
                        removeWrapper
                        selectionMode="multiple"
                        className="min-w-full"
                    >
                        <TableHeader>
                            <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold py-4">รูปภาพสินค้า</TableColumn>
                            <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold">รหัสสินค้า</TableColumn>
                            <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold">ล็อตสินค้า</TableColumn>
                            <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold">วันที่</TableColumn>
                            <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold">ปี</TableColumn>
                            <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold">ชื่อสินค้า</TableColumn>
                            <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold">สถานะสินค้า</TableColumn>
                            <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold">หมวดหมู่</TableColumn>
                            <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold text-right pr-6">ราคา</TableColumn>
                        </TableHeader>
                        <TableBody
                            items={data}
                            loadingContent={<Spinner label="Loading..." />}
                            isLoading={loading}
                        >
                            {(item) => (
                                <TableRow key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                    <TableCell className="py-4">
                                        <div className="w-16 h-12 rounded-lg border border-gray-100 overflow-hidden bg-gray-50">
                                            <img src={item.displayImage} alt={item.productName} className="w-full h-full object-cover" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-semibold text-gray-900">{item.id.slice(0, 8)}</TableCell>
                                    <TableCell className="text-gray-400">{item.lot}</TableCell>
                                    <TableCell className="text-gray-600">{item.date}</TableCell>
                                    <TableCell className="text-gray-600">{item.year}</TableCell>
                                    <TableCell className="text-gray-600 font-medium">{item.productName}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === "ขายได้" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                                            }`}>
                                            {item.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-gray-600">{item.category}</TableCell>
                                    <TableCell className="text-right font-bold text-gray-900 pr-6">
                                        {item.confirmedPrice?.toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* Footer / Pagination */}
                    <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-white border-t border-gray-50 gap-4">
                        <span className="text-sm text-gray-400">{data.length} row(s) total.</span>
                        <div className="flex items-center gap-2">
                            <Button isIconOnly variant="bordered" size="sm" className="border-gray-200">
                                <ChevronLeft size={16} />
                            </Button>
                            <Pagination total={1} initialPage={1} size="sm" color="primary" />
                            <Button isIconOnly variant="bordered" size="sm" className="border-gray-200">
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
