"use client";

import React, { useEffect, useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Avatar,
    Spinner,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Button,
} from "@heroui/react";
import { toast } from "react-hot-toast";

// HeroUI Styled Icons
const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height="1em"
        role="presentation"
        viewBox="0 0 24 24"
        width="1em"
        {...props}
    >
        <path
            d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
            fill="currentColor"
        />
        <path
            d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"
            fill="currentColor"
        />
    </svg>
);

const PackageIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height="1em"
        role="presentation"
        viewBox="0 0 24 24"
        width="1em"
        {...props}
    >
        <path
            d="M20.5 7.28L12 12L3.5 7.28C3.19 7.1 3 6.76 3 6.41V5.72C3 5.37 3.19 5.03 3.5 4.85L12 0.13L20.5 4.85C20.81 5.03 21 5.37 21 5.72V6.41C21 6.76 20.81 7.1 20.5 7.28Z"
            fill="currentColor"
        />
        <path
            d="M3.5 18.28L12 23L20.5 18.28C20.81 18.1 21 17.76 21 17.41V8.72L12 13.5L3 8.72V17.41C3 17.76 3.19 18.1 3.5 18.28Z"
            fill="currentColor"
            opacity="0.4"
        />
    </svg>
);

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height="1em"
        role="presentation"
        viewBox="0 0 24 24"
        width="1em"
        {...props}
    >
        <path
            d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.41 16.78 9.7Z"
            fill="currentColor"
        />
    </svg>
);

const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height="1em"
        role="presentation"
        viewBox="0 0 24 24"
        width="1em"
        {...props}
    >
        <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"
            fill="currentColor"
        />
    </svg>
);

type PayoutItem = {
    id: string;
    imageUrl: string | null;
    productName: string;
    category: string;
    payoutStatus: "SOLD" | "NOT_SOLD";
    price: number;
};

export default function PayoutItemsTable({ searchQuery = "" }: { searchQuery?: string }) {
    const [items, setItems] = useState<PayoutItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<"SOLD" | "NOT_SOLD" | null>(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await fetch("/api/payout-items");
                const data = await res.json();
                setItems(Array.isArray(data) ? data : []);
            } catch (error) {
                toast.error("โหลดข้อมูลล้มเหลว");
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    const summary = [
        {
            status: "NOT_SOLD" as const,
            label: "รอดำเนินการ (ยังไม่ขาย)",
            count: items.filter(i => i.payoutStatus === "NOT_SOLD").length,
            color: "text-amber-500",
            bgColor: "bg-amber-50",
            dotColor: "bg-amber-500"
        },
        {
            status: "SOLD" as const,
            label: "เบิกจ่ายแล้ว (ขายแล้ว)",
            count: items.filter(i => i.payoutStatus === "SOLD").length,
            color: "text-emerald-500",
            bgColor: "bg-emerald-50",
            dotColor: "bg-emerald-500"
        },
    ];

    const filteredSummary = summary.filter(s =>
        s.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <Table
                    aria-label="Payout summary table"
                    shadow="none"
                    classNames={{
                        th: "bg-gray-50/80 text-gray-500 font-bold text-[10px] py-6 uppercase tracking-[0.2em] border-b border-gray-100 px-8",
                        td: "py-10 px-8",
                        tr: "group hover:bg-gray-50/50 transition-all duration-300 border-b border-gray-50/50 last:border-0",
                    }}
                >
                    <TableHeader>
                        <TableColumn>สถานะการเบิกจ่าย</TableColumn>
                        <TableColumn align="center">จำนวนสินค้า</TableColumn>
                        <TableColumn align="center">ดูรายการ</TableColumn>
                    </TableHeader>

                    <TableBody
                        isLoading={loading}
                        loadingContent={<Spinner color="danger" size="lg" />}
                    >
                        {filteredSummary.map((row) => (
                            <TableRow key={row.status}>
                                <TableCell>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-2xl ${row.bgColor} flex items-center justify-center`}>
                                            <div className={`w-3 h-3 rounded-full animate-pulse ${row.dotColor}`} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-black text-gray-900 text-2xl leading-none mb-1">
                                                {row.label}
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                PAYOUT STATUS
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
                                            onClick={() => {
                                                setSelectedStatus(row.status);
                                                setIsModalOpen(true);
                                            }}
                                            className="px-8 py-3 h-auto rounded-2xl bg-gray-900 text-white font-black text-sm hover:bg-orange-600 transition-all shadow-lg shadow-gray-200 hover:shadow-orange-200 hover:scale-105 active:scale-95"
                                            startContent={<EyeIcon className="text-lg" />}
                                        >
                                            ดูรายการ
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Modal Detail */}
            <Modal
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
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
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                                        <PackageIcon className="text-2xl" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                                            รายการสินค้า:
                                            {selectedStatus === "SOLD" ? (
                                                <span className="flex items-center gap-1.5 text-emerald-600">
                                                    <CheckIcon className="text-xl" /> เบิกจ่ายแล้ว
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-amber-600">
                                                    <ClockIcon className="text-xl" /> รอดำเนินการ
                                                </span>
                                            )}
                                        </h3>
                                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                                            PAYOUT MANAGEMENT SYSTEM
                                        </p>
                                    </div>
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <PayoutItemsList
                                    items={items.filter(i => i.payoutStatus === selectedStatus)}
                                />
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}

function PayoutItemsList({ items }: { items: PayoutItem[] }) {
    return (
        <Table
            aria-label="Payout detailed items"
            shadow="none"
            classNames={{
                th: "bg-gray-50/50 text-gray-500 font-black text-[10px] py-4 uppercase tracking-widest",
                td: "py-4 font-medium text-gray-900 border-b border-gray-50",
            }}
        >
            <TableHeader>
                <TableColumn width={80}>รูป</TableColumn>
                <TableColumn>รายละเอียดสินค้า</TableColumn>
                <TableColumn>หมวดหมู่</TableColumn>
                <TableColumn align="end">ราคาเบิกจ่าย</TableColumn>
            </TableHeader>
            <TableBody
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
                                src={item.imageUrl ?? "/placeholder-camera.png"}
                                radius="lg"
                                className="w-12 h-12 border border-gray-100 shadow-sm"
                                fallback={<PackageIcon className="text-2xl text-gray-300" />}
                            />
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <span className="font-black text-gray-900 leading-none mb-1">
                                    {item.productName}
                                </span>
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                                    ID: {item.id}
                                </span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 rounded-xl">
                                <span className="text-[10px] font-black uppercase tracking-wider">{item.category}</span>
                            </div>
                        </TableCell>
                        <TableCell align="right">
                            <span className="font-black text-lg">
                                {item.price > 0 ? `฿${item.price.toLocaleString()}` : "—"}
                            </span>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
