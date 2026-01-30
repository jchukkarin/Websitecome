"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Button,
    Card,
    CardBody,
    Chip,
    Divider,
    Spinner,
    Image
} from "@heroui/react";
import {
    ArrowLeft,
    FileText,
    Package,
    Clock,
    Shield,
    User,
    Camera,
    Tag,
    Info,
    HandCoins
} from "lucide-react";
import axios from "axios";
import { exportPawnPDF } from "@/lib/export/exportPawnPDF";
import toast from "react-hot-toast";

export default function PawnDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                // We use the same generic consignment item details endpoint
                const res = await axios.get(`/api/consignments/items/${id}`);
                setData(res.data);
            } catch (error) {
                console.error("Fetch detail error:", error);
                toast.error("ไม่สามารถโหลดข้อมูลได้");
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
                <Spinner size="lg" color="danger" />
                <p className="text-slate-500 font-bold animate-pulse">กำลังเรียกข้อมูลรายละเอียดการรับจำนำ...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100 text-center space-y-4">
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-red-100">
                        <Info size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">ไม่พบข้อมูลการรับจำนำนี้</h2>
                    <Button
                        variant="flat"
                        onPress={() => router.back()}
                        className="font-black rounded-2xl h-12 bg-slate-100 text-slate-600"
                    >
                        ย้อนกลับ
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8 bg-[#FAFBFC] min-h-screen">
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-6">
                        <Button
                            isIconOnly
                            variant="flat"
                            onPress={() => router.back()}
                            className="w-14 h-14 rounded-2xl bg-white border border-slate-200 text-slate-600 shadow-sm hover:scale-110 active:scale-90 transition-all"
                        >
                            <ArrowLeft size={24} />
                        </Button>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="w-8 h-1 bg-red-600 rounded-full"></span>
                                <p className="text-sm font-black text-red-600 uppercase tracking-widest">Pawn Detail</p>
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">รายละเอียดการรับจำนำ</h1>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            className="h-14 px-8 rounded-2xl bg-red-600 text-white font-black shadow-lg shadow-red-200 hover:scale-105 active:scale-95 transition-all"
                            startContent={<FileText size={18} />}
                            onPress={() => exportPawnPDF(data)}
                        >
                            Export PDF Receipt
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Side: Photo & Quick Status */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white p-4 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden group">
                            <div className="aspect-square rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-100 relative">
                                {data.displayImage ? (
                                    <Image
                                        src={data.displayImage}
                                        alt={data.productName}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <Camera size={64} strokeWidth={1} />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 z-10">
                                    <Chip
                                        color={data.status === "ไถ่ถอนแล้ว" ? "success" : "warning"}
                                        variant="shadow"
                                        className="font-black px-4 h-8"
                                    >
                                        {data.status}
                                    </Chip>
                                </div>
                            </div>
                        </div>

                        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                            <CardBody className="p-8 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Recorded By</p>
                                        <p className="text-sm font-black text-slate-700">{data.user?.name || "System"}</p>
                                    </div>
                                </div>
                                <Divider className="bg-slate-100" />
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Pawn Date</p>
                                        <p className="text-sm font-black text-slate-700">{new Date(data.date).toLocaleDateString("th-TH", { dateStyle: 'long' })}</p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Right Side: Primary Info */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 space-y-10">

                            <div className="space-y-2">
                                <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">CONTRACT NO: #{data.id?.slice(-8).toUpperCase() || "N/A"}</p>
                                <h2 className="text-4xl font-black text-slate-900 leading-tight">{data.productName}</h2>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    <Chip color="danger" variant="flat" className="font-black uppercase text-[10px]" startContent={<Tag size={12} className="ml-1" />}>
                                        {data.category}
                                    </Chip>
                                    <Chip className="bg-slate-100 text-slate-600 font-black uppercase text-[10px]" startContent={<Package size={12} className="ml-1" />}>
                                        Receipt ID: {data.lot}
                                    </Chip>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-red-50 p-8 rounded-[2rem] border border-red-100">
                                    <p className="text-xs font-black text-red-400 uppercase tracking-widest mb-1">Pawn Amount</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-black text-red-600">฿{data.confirmedPrice?.toLocaleString() || "0"}</span>
                                        <span className="text-red-400 font-bold">THB</span>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Pawner Name</p>
                                    <p className="text-2xl font-black text-slate-800">{data.consignorName}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <h4 className="font-black text-slate-800 uppercase tracking-wider">Specifications & Condition</h4>
                                    <div className="h-px flex-1 bg-slate-100"></div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Year / Detail</p>
                                        <p className="font-bold text-slate-700">{data.year || "-"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Redemption Price</p>
                                        <p className="font-bold text-emerald-600">฿{data.redemptionPrice?.toLocaleString() || "-"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Status</p>
                                        <p className="font-bold text-slate-700">{data.status || "-"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
                                <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                    <HandCoins size={140} />
                                </div>
                                <div className="relative z-10 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-orange-400">Pledge Security</h4>
                                    </div>
                                    <p className="text-sm text-slate-400 font-medium">This item is held as collateral under legal pawn standards. All records are encrypted and timestamped.</p>
                                    <div className="pt-2">
                                        <span className="text-[10px] font-mono text-slate-500">PAWN_AUTH_HASH: {data.id?.toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
