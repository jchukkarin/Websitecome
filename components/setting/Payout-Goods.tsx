"use client";

import React, { useEffect, useState } from "react";
import {
    Input,
    Button,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Tooltip,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/react";
import { Search, Pencil, Trash2, Plus, Info, ArrowUpRight } from "lucide-react";
import { toast } from "react-hot-toast";

type PayoutStatus = {
    id: number;
    name: string;
    count: number;
    soldCount: number;
    notSoldCount: number;
};

export default function PayoutGoods() {
    const [statuses, setStatuses] = useState<PayoutStatus[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [editStatus, setEditStatus] = useState<PayoutStatus | null>(null);
    const [newName, setNewName] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchStatuses = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/payout-status");
            const data = await res.json();
            setStatuses(data);
        } catch (error) {
            toast.error("โหลดข้อมูลล้มเหลว");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatuses();
    }, []);

    const handleOpenAdd = () => {
        setEditStatus(null);
        setNewName("");
        onOpen();
    };

    const handleOpenEdit = (status: PayoutStatus) => {
        setEditStatus(status);
        setNewName(status.name);
        onOpen();
    };

    const handleSubmit = async () => {
        if (!newName) return toast.error("กรุณาระบุชื่อ");
        setSubmitting(true);
        try {
            const url = editStatus ? `/api/payout-status/${editStatus.id}` : "/api/payout-status";
            const method = editStatus ? "PATCH" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName }),
            });
            if (res.ok) {
                toast.success(editStatus ? "แก้ไขสำเร็จ" : "เพิ่มสำเร็จ");
                onOpenChange();
                fetchStatuses();
            } else {
                toast.error("ดำเนินการไม่สำเร็จ");
            }
        } catch (error) {
            toast.error("เกิดข้อผิดพลาด");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("คุณต้องการลบหมวดหมู่นี้ใช่หรือไม่?")) return;
        try {
            const res = await fetch(`/api/payout-status/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("ลบสำเร็จ");
                fetchStatuses();
            } else {
                toast.error("ลบไม่สำเร็จ");
            }
        } catch (error) {
            toast.error("เกิดข้อผิดพลาด");
        }
    };

    // Aggregate totals for Sold / Not Sold
    const totals = {
        sold: statuses.reduce((sum, s) => sum + (s.soldCount || 0), 0),
        notSold: statuses.reduce((sum, s) => sum + (s.notSoldCount || 0), 0),
    };

    const summaryRows = [
        { id: 'not_sold', label: 'ยังไม่ขาย', count: totals.notSold, code: 'NOT_SOLD' },
        { id: 'sold', label: 'ขาย', count: totals.sold, code: 'SOLD' },
    ];

    const filtered = summaryRows.filter((r) =>
        r.label.toLowerCase().includes(search.toLowerCase()) ||
        r.code.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="w-full sm:max-w-md">
                    <Input
                        placeholder="ค้นหาสถานะการเบิกจ่าย..."
                        startContent={<Search size={20} className="text-gray-400" />}
                        variant="flat"
                        radius="lg"
                        size="lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        classNames={{
                            inputWrapper: "bg-gray-100/50 hover:bg-gray-100 transition-colors border-none",
                            input: "text-base",
                        }}
                    />
                </div>
                <Button
                    color="danger"
                    size="lg"
                    radius="lg"
                    startContent={<Plus size={22} strokeWidth={3} />}
                    className="font-bold px-8 shadow-xl shadow-red-200 bg-red-600 text-white"
                    onClick={handleOpenAdd}
                >
                    เพิ่มหมวดหมู่ใหม่
                </Button>
            </div>

            <div className="flex items-center gap-3 border-l-4 border-red-500 pl-4 py-1">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">รายการสถานะการเบิกจ่ายสินค้า</h2>
                <Tooltip content="หมวดหมู่ที่ใช้ในการบันทึกการจ่ายเงินออกหรือการคืนสินค้า">
                    <Info size={18} className="text-gray-300 cursor-help" />
                </Tooltip>
            </div>

            <div className="overflow-hidden rounded-3xl border border-gray-100">
                <Table aria-label="Payout summary table" shadow="none" classNames={{
                    th: "bg-gray-50/50 text-gray-500 font-bold text-sm py-5 border-b border-gray-100 first:pl-8 last:pr-8",
                    td: "py-5 px-4 first:pl-8 last:pr-8",
                    tr: "group hover:bg-gray-50/80 transition-all duration-300 border-b border-gray-50 last:border-0",
                }}>
                    <TableHeader>
                        <TableColumn width={400}>ชื่อสถานะการเบิกจ่าย</TableColumn>
                        <TableColumn align="center">จำนวนรายการ</TableColumn>
                        <TableColumn align="end">การจัดการ</TableColumn>
                    </TableHeader>
                    <TableBody isLoading={loading} emptyContent={
                        <div className="flex flex-col items-center justify-center py-20 bg-gray-50/30">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <ArrowUpRight size={32} className="text-gray-300" />
                            </div>
                            <p className="text-gray-500 font-medium">ไม่พบข้อมูลสถานะ</p>
                        </div>
                    }>
                        {filtered.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-900 text-lg">{item.label}</span>
                                        <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">STATUS CODE: {item.code}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-center">
                                        <div className="bg-red-50 text-red-600 px-4 py-1.5 rounded-full font-black text-lg border border-red-100 min-w-[60px] text-center">
                                            {item.count}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-end gap-2 text-gray-300">
                                        <Tooltip content="สถานะระบบ (อ่านอย่างเดียว)">
                                            <Info size={18} className="cursor-help" />
                                        </Tooltip>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                radius="lg"
                classNames={{
                    base: "bg-white",
                    header: "border-b border-gray-100",
                    footer: "border-t border-gray-100"
                }}
            >
                <ModalContent className="bg-white">
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{editStatus ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่ใหม่"}</ModalHeader>
                            <ModalBody className="py-6">
                                <Input label="ชื่อหมวดหมู่" placeholder="กรอกชื่อหมวดหมู่..." variant="bordered" radius="lg" value={newName} onChange={(e) => setNewName(e.target.value)} />
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onPress={onClose} radius="lg">ยกเลิก</Button>
                                <Button color="danger" onPress={handleSubmit} radius="lg" isLoading={submitting} className="font-bold px-8 bg-red-600">บันทึกข้อมูล</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
