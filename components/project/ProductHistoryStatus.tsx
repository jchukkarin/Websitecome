"use client";

import React, { useState, useRef } from "react";
import {
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Checkbox,
    Divider,
} from "@heroui/react";
import {
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    ImageIcon,
    X,
    Plus,
    UploadCloud,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductHistoryStatusProps {
    item: any;
    onItemChangeAction: (id: string, key: string, value: any) => void;
}

export default function ProductHistoryStatus({
    item,
    onItemChangeAction,
}: ProductHistoryStatusProps) {
    const [isOpen, setIsOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Safely parse defectImages if it's a string, or default to empty array
    const currentImages: string[] = Array.isArray(item.defectImages)
        ? item.defectImages
        : typeof item.defectImages === "string"
            ? JSON.parse(item.defectImages || "[]")
            : [];

    const statusOptions = [
        {
            key: "final",
            label: "ซ่อมได้",
            icon: <CheckCircle2 size={16} className="text-emerald-500" />,
            color: "text-emerald-600",
            btnColor: "success" as const,
        },
        {
            key: "not_final",
            label: "ซ่อมไม่ได้",
            icon: <AlertCircle size={16} className="text-amber-500" />,
            color: "text-amber-600",
            btnColor: "warning" as const,
        },
    ];

    const handleStatusSelect = (key: string) => {
        onItemChangeAction(item.id, "productStatus", key);
        // If switching away from not_final, maybe clear images? Or keep them. 
        // Keeping them is safer.
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const remainingSlots = 6 - currentImages.length;
            const filesToProcess = Array.from(files).slice(0, remainingSlots);

            filesToProcess.forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const newImages = [...currentImages, reader.result as string];
                    // Update item state - storing as array directly if supported, or JSON string
                    // Assuming explicit array support in parent or using any type
                    onItemChangeAction(item.id, "defectImages", newImages);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        const newImages = currentImages.filter((_, i) => i !== index);
        onItemChangeAction(item.id, "defectImages", newImages);
    };

    const selectedStatus = statusOptions.find((opt) => opt.key === item.productStatus) || null;

    return (
        <Popover
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            placement="bottom-end"
            offset={10}
            classNames={{
                content: "p-0 border-none shadow-2xl overflow-hidden rounded-[2rem] bg-white",
            }}
        >
            <PopoverTrigger>
                <Button
                    variant="flat"
                    size="sm"
                    className="bg-white border-none shadow-none hover:bg-slate-50 transition-all rounded-xl font-bold min-h-[40px] w-full flex justify-between px-3"
                >
                    <div className="flex items-center gap-2">
                        {selectedStatus ? (
                            <>
                                {selectedStatus.icon}
                                <span className={`${selectedStatus.color} font-bold`}>
                                    {selectedStatus.label}
                                </span>
                            </>
                        ) : (
                            <span className="text-slate-400 font-bold">เลือกสถานะ</span>
                        )}

                        {/* Minimal indicator for upload status */}
                        {item.productStatus === "not_final" && currentImages.length > 0 && (
                            <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full">
                                <CheckCircle2 size={10} className="text-emerald-500" />
                                <span className="text-[10px] font-bold text-emerald-600">{currentImages.length}/6</span>
                            </div>
                        )}
                    </div>
                    <ChevronRight
                        size={16}
                        className={`text-slate-400 transition-transform ${isOpen ? "rotate-90" : ""
                            }`}
                    />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[320px] bg-white">
                <div className="p-4 bg-slate-50/50 border-b border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Status Management
                    </p>
                    <h4 className="font-black text-slate-800">จัดการสถานะการซ่อม</h4>
                </div>

                <div className="p-3 space-y-3">
                    {/* Status Selection */}
                    <div className="flex gap-2">
                        {statusOptions.map((opt) => (
                            <Button
                                key={opt.key}
                                size="sm"
                                variant={item.productStatus === opt.key ? "solid" : "light"}
                                color={item.productStatus === opt.key ? opt.btnColor : "default"}
                                className={`flex-1 font-bold rounded-xl h-10 transition-all ${item.productStatus === opt.key ? "shadow-md" : "text-slate-500"
                                    }`}
                                onPress={() => handleStatusSelect(opt.key)}
                            >
                                <div className="flex items-center gap-2">
                                    {opt.icon}
                                    <span>{opt.label}</span>
                                </div>
                            </Button>
                        ))}
                    </div>

                    {/* Content for Not Final/Cannot Repair */}
                    {item.productStatus === "not_final" && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-3 pt-2"
                        >
                            <Divider className="opacity-50" />

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
                                    <ImageIcon size={16} />
                                    <span>อัปโหลดรูปภาพ ({currentImages.length}/6)</span>
                                </div>
                                {/* Checkbox to indicate completeness visually */}
                                <Checkbox
                                    isSelected={currentImages.length > 0}
                                    isReadOnly
                                    color="success"
                                    size="sm"
                                    classNames={{ label: "text-xs font-bold text-slate-500" }}
                                >
                                    อัปโหลดแล้ว
                                </Checkbox>
                            </div>

                            {/* Image Grid */}
                            <div className="grid grid-cols-3 gap-2">
                                <AnimatePresence>
                                    {currentImages.map((src, idx) => (
                                        <motion.div
                                            key={idx}
                                            layout
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                            className="relative aspect-square rounded-xl overflow-hidden group border border-slate-100 shadow-sm"
                                        >
                                            <img src={src} className="w-full h-full object-cover" alt="defect" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                                <button
                                                    onClick={() => removeImage(idx)}
                                                    className="text-white bg-red-500 rounded-full p-1 hover:scale-110 transition-transform"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {/* Upload Button */}
                                {currentImages.length < 6 && (
                                    <motion.div
                                        layout
                                        onClick={() => fileInputRef.current?.click()}
                                        className="aspect-square rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-amber-400 hover:text-amber-500 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 text-slate-400"
                                    >
                                        <Plus size={20} />
                                        <span className="text-[8px] font-bold uppercase">เพิ่มรูป</span>
                                    </motion.div>
                                )}
                            </div>

                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                            />

                            {/* Success Message */}
                            {currentImages.length > 0 && (
                                <div className="flex items-center gap-2 justify-center py-2 bg-emerald-50 rounded-xl">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                    <span className="text-xs font-black text-emerald-600 uppercase tracking-wide">
                                        อัปเดตข้อมูลรูปภาพเสร็จสิ้น
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}