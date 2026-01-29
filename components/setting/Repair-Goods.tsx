"use client";

import React, { useEffect, useState } from "react";
import {
    Input,
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
    Spinner,
    Avatar,
    Button,
} from "@heroui/react";
import { toast } from "react-hot-toast";

// HeroUI Styled Icons
const WrenchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg aria-hidden="true" fill="none" focusable="false" height="1em" role="presentation" viewBox="0 0 24 24" width="1em" {...props}>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z" fill="currentColor" />
    </svg>
);

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg aria-hidden="true" fill="none" focusable="false" height="1em" role="presentation" viewBox="0 0 24 24" width="1em" {...props}>
        <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.41 16.78 9.7Z" fill="currentColor" />
    </svg>
);

const ReturnIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg aria-hidden="true" fill="none" focusable="false" height="1em" role="presentation" viewBox="0 0 24 24" width="1em" {...props}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.45 12.15l-2.79 2.79c-.31.31-.82.31-1.13 0l-2.79-2.79c-.31-.31-.31-.82 0-1.13.31-.31.82-.31 1.13 0l1.43 1.43V10c0-1.1.9-2 2-2h3c.55 0 1 .45 1 1s-.45 1-1 1h-3v3.45l1.43-1.43c.31-.31.82-.31 1.13 0 .31.32.31.82 0 1.13z" fill="currentColor" />
    </svg>
);

const PackageIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg aria-hidden="true" fill="none" focusable="false" height="1em" role="presentation" viewBox="0 0 24 24" width="1em" {...props}>
        <path d="M20.5 7.28L12 12L3.5 7.28C3.19 7.1 3 6.76 3 6.41V5.72C3 5.37 3.19 5.03 3.5 4.85L12 0.13L20.5 4.85C20.81 5.03 21 5.37 21 5.72V6.41C21 6.76 20.81 7.1 20.5 7.28Z" fill="currentColor" />
        <path d="M3.5 18.28L12 23L20.5 18.28C20.81 18.1 21 17.76 21 17.41V8.72L12 13.5L3 8.72V17.41C3 17.76 3.19 18.1 3.5 18.28Z" fill="currentColor" opacity="0.4" />
    </svg>
);

const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg aria-hidden="true" fill="none" focusable="false" height="1em" role="presentation" viewBox="0 0 24 24" width="1em" {...props}>
        <path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="currentColor" />
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" fill="currentColor" />
    </svg>
);

type RepairStatusRow = {
    status: "REPAIRING" | "REPAIRED" | "RETURN_CUSTOMER";
    label: string;
    count: number;
};

type RepairItem = {
    id: string;
    productName: string;
    repairStatus: string;
    imageUrl: string;
    confirmedPrice: number;
    consignment: {
        consignorName: string;
        lot: string;
    };
};

export default function RepairGoods() {
    const [data, setData] = useState<RepairStatusRow[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<RepairStatusRow | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/repair-status");
            const result = await res.json();
            if (Array.isArray(result)) {
                // Remove emoji from label for display
                const cleanedData = result.map((item: any) => ({
                    ...item,
                    label: item.label.replace(/[^\w\s\u0E00-\u0E7F]/g, '').trim()
                }));
                setData(cleanedData);
            } else {
                setData([]);
            }
        } catch (error) {
            toast.error("โหลดข้อมูลซ่อมล้มเหลว");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenDetail = (row: RepairStatusRow) => {
        setSelectedStatus(row);
        setIsModalOpen(true);
    };

    const getStatusIcon = (status: string, className: string) => {
        switch (status) {
            case "REPAIRING": return <WrenchIcon className={className} />;
            case "REPAIRED": return <CheckIcon className={className} />;
            case "RETURN_CUSTOMER": return <ReturnIcon className={className} />;
            default: return <PackageIcon className={className} />;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-3 border-l-4 border-red-500 pl-4 py-1">
                <div className="space-y-0.5">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                        สรุปสถานะการซ่อมทั้งหมด
                    </h2>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                        REPAIR STATUS SUMMARY
                    </p>
                </div>
            </div>

            <div className="overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <Table
                    aria-label="Repair status summary table"
                    shadow="none"
                    classNames={{
                        th: "bg-gray-50/50 text-gray-500 font-bold text-[11px] py-6 uppercase tracking-[0.2em] border-b border-gray-100 first:pl-10 last:pr-10",
                        td: "py-8 px-4 first:pl-10 last:pr-10",
                        tr: "group hover:bg-gray-50/50 transition-all duration-300 border-b border-gray-50 last:border-0",
                    }}
                >
                    <TableHeader>
                        <TableColumn>สถานะการซ่อม</TableColumn>
                        <TableColumn align="center">จำนวนสินค้า</TableColumn>
                        <TableColumn align="center">ดูรายการ</TableColumn>
                    </TableHeader>
                    <TableBody
                        isLoading={loading}
                        loadingContent={
                            <div className="flex flex-col items-center gap-2">
                                <Spinner color="danger" size="lg" />
                                <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">
                                    Loading Repair Data...
                                </span>
                            </div>
                        }
                    >
                        {data.map((row) => (
                            <TableRow key={row.status}>
                                <TableCell>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center
                                            ${row.status === "REPAIRING" ? "bg-blue-50 text-blue-500" :
                                                row.status === "REPAIRED" ? "bg-emerald-50 text-emerald-500" :
                                                    "bg-orange-50 text-orange-500"}`}>
                                            {getStatusIcon(row.status, "text-2xl")}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-black text-gray-900 text-2xl leading-none mb-1">
                                                {row.label}
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                Repair Status
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-center">
                                        <span className="font-black text-4xl text-slate-800">
                                            {row.count}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-center">
                                        <Button
                                            onClick={() => handleOpenDetail(row)}
                                            className="px-8 py-4 h-auto rounded-2xl bg-gray-900 text-white font-black text-sm hover:bg-orange-600 transition-all shadow-lg shadow-gray-200 hover:shadow-orange-200 hover:scale-105 active:scale-95"
                                            startContent={<EyeIcon className="text-lg" />}
                                        >
                                            ดูรายการสินค้า
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Detail Modal */}
            <Modal
                isOpen={isModalOpen}
                onOpenChange={(open) => setIsModalOpen(open)}
                size="5xl"
                scrollBehavior="inside"
                classNames={{
                    base: "bg-white rounded-[2.5rem]",
                    header: "border-b border-gray-100 py-6 px-10",
                    body: "py-6 px-10",
                    footer: "border-t border-gray-100 py-6 px-10",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center
                                        ${selectedStatus?.status === "REPAIRING" ? "bg-blue-50 text-blue-600" :
                                            selectedStatus?.status === "REPAIRED" ? "bg-emerald-50 text-emerald-600" :
                                                "bg-orange-50 text-orange-600"}`}>
                                        {selectedStatus && getStatusIcon(selectedStatus.status, "text-2xl")}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                                            รายการสินค้า: {selectedStatus?.label}
                                        </h3>
                                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                                            REPAIR MANAGEMENT SYSTEM
                                        </p>
                                    </div>
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                {selectedStatus && (
                                    <RepairItemList status={selectedStatus.status} />
                                )}
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}

function RepairItemList({ status }: { status: string }) {
    const [items, setItems] = useState<RepairItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/repair-items?status=${status}`);
                const result = await res.json();
                setItems(Array.isArray(result) ? result : []);
            } catch (error) {
                toast.error("โหลดรายการสินค้าล้มเหลว");
                setItems([]);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, [status]);

    return (
        <Table
            aria-label="Repair items list"
            shadow="none"
            classNames={{
                th: "bg-gray-50/50 text-gray-500 font-black text-[10px] py-4 uppercase tracking-widest",
                td: "py-4 font-medium text-gray-900 border-b border-gray-50",
            }}
        >
            <TableHeader>
                <TableColumn width={80}>รูป</TableColumn>
                <TableColumn>ชื่อสินค้า / LOT</TableColumn>
                <TableColumn>ลูกค้าผู้ฝาก</TableColumn>
                <TableColumn align="end">ราคาประเมิน</TableColumn>
            </TableHeader>
            <TableBody
                isLoading={loading}
                loadingContent={<Spinner color="danger" />}
                emptyContent={
                    <div className="py-20 flex flex-col items-center justify-center opacity-30">
                        <PackageIcon className="text-6xl" />
                        <p className="mt-4 font-bold text-xl">ไม่พบรายการสินค้า</p>
                    </div>
                }
            >
                {items.map((item) => (
                    <TableRow key={item.id} className="hover:bg-slate-50 transition-colors">
                        <TableCell>
                            <Avatar
                                src={item.imageUrl}
                                radius="lg"
                                className="w-12 h-12 border border-gray-100 shadow-sm"
                                fallback={<PackageIcon className="text-xl text-gray-300" />}
                            />
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <span className="font-black text-gray-900 leading-none mb-1">
                                    {item.productName}
                                </span>
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                                    LOT: {item.consignment?.lot || "-"}
                                </span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <span className="text-sm font-bold text-slate-600">
                                {item.consignment?.consignorName || "-"}
                            </span>
                        </TableCell>
                        <TableCell align="right">
                            <span className="font-black text-lg text-orange-600">
                                ฿{item.confirmedPrice.toLocaleString()}
                            </span>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
