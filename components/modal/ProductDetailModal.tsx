"use client";

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Chip,
    Divider,
    ScrollShadow
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import ProductInfoSection from "./ProductInfoSection";
import UserInfoSection from "./UserInfoSection";
import toast from "react-hot-toast";
import { exportProductPDF } from "@/lib/export/exportPDF";

interface ProductDetailModalProps {
    isOpen: boolean;
    onOpenChangeAction: (isOpen: boolean) => void;
    item: any;
    onSaveAction: (formData: any) => void;
    isManager?: boolean;
}

export default function ProductDetailModal({
    isOpen,
    onOpenChangeAction,
    item,
    onSaveAction,
    isManager = false
}: ProductDetailModalProps) {
    const [isEdit, setIsEdit] = useState(false);
    const [form, setForm] = useState<any>(null);
    const [isExporting, setIsExporting] = useState(false);

    // Sync form state when item changes or modal opens
    useEffect(() => {
        if (item) {
            setForm({ ...item });
        }
    }, [item, isOpen]);

    const handleToggleEdit = () => {
        if (isEdit) {
            setForm({ ...item });
        }
        setIsEdit(!isEdit);
    };

    const handleExportPDF = async () => {
        try {
            setIsExporting(true);
            await exportProductPDF(form);
            toast.success("ส่งออกรายงาน PDF สำเร็จ");
        } catch (error) {
            console.error("PDF Export error:", error);
            toast.error("ไม่สามารถสร้างไฟล์ PDF ได้");
        } finally {
            setIsExporting(false);
        }
    };

    if (!form) return null;

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChangeAction}
            size="5xl"
            backdrop="blur"
            scrollBehavior="inside"
            classNames={{
                base: "bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden",
                header: "border-b border-slate-100 py-6 px-10 bg-slate-50/50",
                body: "p-0",
                footer: "border-t border-slate-100 py-6 px-10 bg-slate-50/20",
                closeButton: "hover:bg-red-50 hover:text-red-500 transition-all p-2 top-6 right-6"
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                    <Icon icon="mdi:package-variant-closed" width={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">
                                        Product Insight
                                    </h2>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
                                        Management & Tracking System
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button
                                    size="sm"
                                    variant="bordered"
                                    className="font-black rounded-xl h-10 px-4 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm hover:scale-105 transition-all active:scale-95"
                                    startContent={<Icon icon="mdi:file-pdf-box" className="text-red-500" width={18} />}
                                    onPress={handleExportPDF}
                                    isLoading={isExporting}
                                >
                                    Export PDF
                                </Button>

                                {isManager && (
                                    <div className="flex items-center gap-3">
                                        {!isEdit ? (
                                            <Button
                                                size="sm"
                                                className="font-black rounded-xl h-10 px-6 text-white shadow-lg shadow-blue-200 bg-blue-600 hover:scale-105 transition-all active:scale-95"
                                                startContent={<Icon icon="mdi:pencil" width={18} />}
                                                onPress={() => setIsEdit(true)}
                                            >
                                                แก้ไขข้อมูล
                                            </Button>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="flat"
                                                    className="font-black rounded-xl h-10 px-5 bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all active:scale-95"
                                                    startContent={<Icon icon="mdi:close" width={18} />}
                                                    onPress={handleToggleEdit}
                                                >
                                                    ยกเลิก
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="font-black rounded-xl h-10 px-6 text-white shadow-lg shadow-green-200 bg-green-600 hover:scale-105 transition-all active:scale-95"
                                                    startContent={<Icon icon="mdi:check-circle" width={18} />}
                                                    onPress={() => {
                                                        onSaveAction(form);
                                                        setIsEdit(false);
                                                    }}
                                                >
                                                    บันทึก
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </ModalHeader>

                        <ModalBody>
                            <ScrollShadow className="h-full">
                                <div id="product-detail-content" className="p-10 space-y-10 bg-white">
                                    {/* Meta Info Row */}
                                    <div className="flex items-center justify-between bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                                        <div className="flex items-center gap-6">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Item ID</span>
                                                <span className="text-sm font-black text-slate-700">#{form.id?.slice(0, 12)}</span>
                                            </div>
                                            <div className="w-px h-8 bg-slate-200" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Batch Lot</span>
                                                <span className="text-sm font-black text-slate-700">{form.lot}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Entry Date</p>
                                            <p className="text-base font-black text-slate-800">{form.date}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                        {/* Left Side: Product Info (8 cols) */}
                                        <div className="lg:col-span-8 space-y-8">
                                            <ProductInfoSection isEdit={isEdit} form={form} setFormAction={setForm} />
                                        </div>

                                        {/* Right Side: User & Extra Info (4 cols) */}
                                        <div className="lg:col-span-4 space-y-8">
                                            <UserInfoSection user={form.user} />

                                            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white overflow-hidden relative group shadow-xl shadow-slate-200">
                                                <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                                    <Icon icon="mdi:security" width={140} />
                                                </div>
                                                <div className="relative z-10 space-y-6">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">Security Log</h4>
                                                        <div className="h-px flex-1 bg-blue-400/20" />
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Access Level</span>
                                                            <div className="flex items-center gap-2">
                                                                <Icon icon={isManager ? "mdi:shield-check" : "mdi:eye"} className={isManager ? "text-green-400" : "text-blue-400"} />
                                                                <span className="text-sm font-black text-slate-100">
                                                                    {isManager ? "Full Administrative" : "View-Only Restricted"}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Database Link</span>
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" />
                                                                <span className="text-sm font-black text-slate-100 font-mono">LIVE_SYNC_READY</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <button className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
                                                        View Audit Trail
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ScrollShadow>
                        </ModalBody>

                        <ModalFooter>
                            <div className="w-full flex justify-between items-center">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Icon icon="mdi:shield-lock" width={16} />
                                    <p className="text-[10px] font-black uppercase tracking-[0.1em]">
                                        Data Protected by AES-256 Encryption Standard
                                    </p>
                                </div>
                                <Button
                                    variant="light"
                                    className="font-black uppercase tracking-widest text-xs h-12 px-10 rounded-2xl hover:bg-slate-100 transition-all hover:scale-105 active:scale-95"
                                    onPress={onClose}
                                >
                                    Close Window
                                </Button>
                            </div>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
