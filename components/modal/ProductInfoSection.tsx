"use client";

import { Input, Select, SelectItem } from "@heroui/react";

interface ProductInfoSectionProps {
    isEdit: boolean;
    form: any;
    setFormAction: (form: any) => void;
}

const CATEGORIES = [
    "กล้องดิจิตอล", "เลนส์", "ขาตั้งกล้อง", "อุปกรณ์เสริม", "แบต", "ฟิลม์", "สายคล้อง"
];

const STATUSES = [
    "พร้อม", "ติดจอง", "ซ่อม", "ขายแล้ว", "ส่งคืนลูกค้า", "ยังไม่ถึงกำหนด"
];

export default function ProductInfoSection({ isEdit, form, setFormAction }: ProductInfoSectionProps) {
    const handleChange = (field: string, value: any) => {
        setFormAction({ ...form, [field]: value });
    };

    return (
        <section className="space-y-8">
            <div className="flex items-center gap-3 border-l-4 border-orange-500 pl-4 py-1">
                <h4 className="font-black text-slate-800 uppercase tracking-wider text-sm">
                    Product Details
                </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <Input
                    labelPlacement="outside"
                    placeholder="ระบุชื่อสินค้า..."
                    variant="faded"
                    value={form.productName}
                    isReadOnly={!isEdit}
                    onChange={(e) => handleChange("productName", e.target.value)}
                    classNames={{
                        label: "font-black text-slate-500 uppercase text-[10px] tracking-widest",
                        input: "font-bold text-slate-700",
                        inputWrapper: "h-12 rounded-xl bg-slate-50/50 border-slate-200"
                    }}
                />

                <Input
                    labelPlacement="outside"
                    type="number"
                    placeholder="0.00"
                    variant="faded"
                    startContent={<span className="text-slate-400 font-bold">฿</span>}
                    value={form.confirmedPrice}
                    isReadOnly={!isEdit}
                    onChange={(e) => handleChange("confirmedPrice", Number(e.target.value))}
                    classNames={{
                        label: "font-black text-slate-500 uppercase text-[10px] tracking-widest",
                        input: "font-bold text-slate-700",
                        inputWrapper: "h-12 rounded-xl bg-slate-50/50 border-slate-200"
                    }}
                />

                <Select
                    labelPlacement="outside"
                    placeholder="เลือกหมวดหมู่..."
                    variant="faded"
                    isDisabled={!isEdit}
                    selectedKeys={form.category ? [form.category] : []}
                    onSelectionChange={(keys) => handleChange("category", Array.from(keys)[0])}
                    classNames={{
                        label: "font-black text-slate-500 uppercase text-[10px] tracking-widest",
                        value: "font-bold text-slate-700",
                        trigger: "h-12 rounded-xl bg-slate-50/50 border-slate-200"
                    }}
                >
                    {CATEGORIES.map((cat) => (
                        <SelectItem key={cat}>
                            {cat}
                        </SelectItem>
                    ))}
                </Select>

                <Select
                    labelPlacement="outside"
                    placeholder="เลือกสถานะ..."
                    variant="faded"
                    isDisabled={!isEdit}
                    selectedKeys={form.status ? [form.status] : []}
                    onSelectionChange={(keys) => handleChange("status", Array.from(keys)[0])}
                    classNames={{
                        label: "font-black text-slate-500 uppercase text-[10px] tracking-widest",
                        value: "font-bold text-slate-700",
                        trigger: "h-12 rounded-xl bg-slate-50/50 border-slate-200"
                    }}
                >
                    {STATUSES.map((status) => (
                        <SelectItem key={status}>
                            {status}
                        </SelectItem>
                    ))}
                </Select>

                <Input
                    labelPlacement="outside"
                    placeholder="เช่น 2023 หรือ สภาพ 99%..."
                    variant="faded"
                    className="md:col-span-2"
                    value={form.year}
                    isReadOnly={!isEdit}
                    onChange={(e) => handleChange("year", e.target.value)}
                    classNames={{
                        label: "font-black text-slate-500 uppercase text-[10px] tracking-widest",
                        input: "font-bold text-slate-700",
                        inputWrapper: "h-12 rounded-xl bg-slate-50/50 border-slate-200"
                    }}
                />
            </div>
        </section>
    );
}
