"use client"

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react"
import Image from "next/image"
import { Package, Hash, Tag, Calendar, Layers, Info } from "lucide-react"
import type { DashboardItem } from "./home"

const statusColor: Record<string, string> = {
    "พร้อม": "bg-green-100 text-green-700",
    "ติดจอง": "bg-yellow-100 text-yellow-700",
    "ซ่อม": "bg-red-100 text-red-700",
    "ขายแล้ว": "bg-gray-100 text-gray-700",
    "ส่งคืนลูกค้า": "bg-emerald-100 text-emerald-700",
    "ยังไม่ถึงกำหนด": "bg-orange-100 text-orange-700",
}

interface EditBoxProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    selectedItem: DashboardItem | null
    onSave: () => void
}

export default function EditBox({ isOpen, onOpenChange, selectedItem, onSave }: EditBoxProps) {
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="5xl"
            radius="lg"
            backdrop="blur"
            classNames={{
                base: "bg-white overflow-visible", // Allow close button to 'pop out'
                header: "border-b border-gray-100 py-8 px-10 relative bg-slate-50/30",
                body: "py-10 px-10",
                footer: "border-t border-gray-100 py-6 px-10",
                closeButton: "absolute -top-4 -right-4 z-50 bg-white shadow-2xl rounded-full p-3 border border-slate-100 hover:bg-red-50 hover:text-red-500 transition-all hover:scale-110 active:scale-95"
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                                {selectedItem?.productName || "รายละเอียดสินค้า"}
                            </h2>
                        </ModalHeader>
                        <ModalBody>
                            <div className="space-y-8">
                                {/* Images Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {selectedItem?.parentImages && selectedItem.parentImages.length > 0 ? (
                                        selectedItem.parentImages.slice(0, 3).map((img, i) => (
                                            <div key={img.id} className="relative h-48 rounded-[1.5rem] overflow-hidden border border-gray-100 shadow-sm transition-transform hover:scale-[1.02] duration-300">
                                                <Image src={img.imageUrl} alt="Product view" fill className="object-cover" />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-3 h-48 rounded-[1.5rem] bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-200">
                                            <div className="text-center space-y-2">
                                                <Package className="mx-auto text-gray-300" size={32} />
                                                <p className="text-gray-400 font-bold text-sm tracking-tight italic">ไม่มีรูปภาพประกอบ</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Details Form Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <Hash size={14} className="text-blue-500 font-black" />
                                            <span className="text-[11px] font-black uppercase tracking-widest">รหัสสินค้า</span>
                                        </div>
                                        <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100/50">
                                            <p className="font-bold text-gray-700">#{selectedItem?.id.slice(0, 8)}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <Tag size={14} className="text-blue-500 font-black" />
                                            <span className="text-[11px] font-black uppercase tracking-widest">ล็อตที่</span>
                                        </div>
                                        <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100/50">
                                            <p className="font-bold text-gray-700">{selectedItem?.lot || "-"}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <Calendar size={14} className="text-blue-500 font-black" />
                                            <span className="text-[11px] font-black uppercase tracking-widest">วันที่บันทึก</span>
                                        </div>
                                        <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100/50">
                                            <p className="font-bold text-gray-700">{selectedItem?.date || "-"}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <Layers size={14} className="text-blue-500 font-black" />
                                            <span className="text-[11px] font-black uppercase tracking-widest">หมวดหมู่</span>
                                        </div>
                                        <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100/50">
                                            <p className="font-bold text-gray-700 truncate">{selectedItem?.category || "-"}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <Package size={14} className="text-blue-500 font-black" />
                                            <span className="text-[11px] font-black uppercase tracking-widest">จำนวน</span>
                                        </div>
                                        <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100/50">
                                            <p className="font-bold text-gray-700">1</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <Info size={14} className="text-blue-500 font-black" />
                                            <span className="text-[11px] font-black uppercase tracking-widest">สถานะ</span>
                                        </div>
                                        <div className={`${statusColor[selectedItem?.status || ""] || "bg-gray-50"} p-4 rounded-2xl border border-gray-100/50`}>
                                            <p className="font-bold capitalize">{selectedItem?.status || "ไม่ระบุ"}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Accessories / Extra Description */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <span className="text-[11px] font-black uppercase tracking-widest">อุปกรณ์เพิ่มเติม</span>
                                    </div>
                                    <div className="bg-gray-50/80 p-6 rounded-[2rem] border border-gray-100/50">
                                        <p className="text-gray-500 font-medium italic">
                                            {selectedItem?.salesChannel || "ไม่มีข้อมูลรายละเอียดเพิ่มเติมหรืออุปกรณเสริม"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <div className="w-full flex justify-end gap-3">
                                <Button
                                    variant="light"
                                    onPress={onClose}
                                    className="rounded-2xl h-14 px-8 font-black text-gray-400 hover:text-gray-900"
                                >
                                    ยกเลิก
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={onSave}
                                    className="rounded-2xl h-14 px-12 font-black text-white shadow-xl shadow-blue-200 bg-blue-600 hover:bg-blue-700 transition-all active:scale-95"
                                >
                                    บันทึกการเปลี่ยนแปลง
                                </Button>
                            </div>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}