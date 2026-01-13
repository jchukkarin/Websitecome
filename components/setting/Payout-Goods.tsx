"use client";

import React from "react";
import {
    Input,
    Button,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@heroui/react";
import { Search, Pencil, Trash2, Plus } from "lucide-react";

export default function PayoutGoods() {
    const categoriesData = [
        { id: 1, name: "จ่ายขาด", count: 5 },
        { id: 2, name: "คืนเงิน", count: 1 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">สถานะการเบิกจ่าย</h2>
            </div>

            <div className="flex gap-4 items-center">
                <div className="flex-1">
                    <Input
                        placeholder="ค้นหาหมวดหมู่การเบิกจ่าย"
                        startContent={<Search size={18} className="text-gray-400" />}
                        variant="bordered"
                        radius="md"
                        classNames={{
                            inputWrapper: "border-gray-200 h-10",
                        }}
                    />
                </div>
                <Button
                    color="danger"
                    startContent={<Plus size={18} />}
                    className="font-bold px-6 h-10 bg-red-600"
                >
                    เพิ่มหมวดหมู่
                </Button>
            </div>

            <Table aria-label="Payout categories table" removeWrapper className="mt-4">
                <TableHeader>
                    <TableColumn className="bg-transparent border-b border-gray-100 py-4 font-bold text-gray-800">ชื่อ</TableColumn>
                    <TableColumn className="bg-transparent border-b border-gray-100 py-4 font-bold text-gray-800 text-right pr-12">จำนวนรายการ</TableColumn>
                </TableHeader>
                <TableBody>
                    {categoriesData.map((category) => (
                        <TableRow key={category.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                            <TableCell className="py-4 text-gray-600 font-medium">{category.name}</TableCell>
                            <TableCell className="py-4 text-right pr-8">
                                <div className="flex items-center justify-end gap-16">
                                    <span className="text-gray-500 font-medium">{category.count}</span>
                                    <div className="flex gap-2">
                                        <Button isIconOnly variant="light" size="sm"><Pencil size={16} className="text-gray-400" /></Button>
                                        <Button isIconOnly variant="light" size="sm"><Trash2 size={16} className="text-gray-400" /></Button>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
