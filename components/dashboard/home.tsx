"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { MoreVertical, Search, Filter, Pencil, Trash2, X, Package, Calendar, Hash, Tag, Layers, Info } from "lucide-react"
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Tooltip
} from "@heroui/react"
import DownloadExcelButton from "../downloadfile/DownloadExcelButton"
import toast, { Toaster } from "react-hot-toast"
import axios from "axios"
import { useSession } from "next-auth/react"
import ProductDetailModal from "../modal/ProductDetailModal"

// Types
export type ConsignmentImage = {
    id: string
    imageUrl: string
}

export type ConsignmentItem = {
    id: string
    productName: string
    category: string
    year: string
    status: string
    repairStatus?: string
    isReserveOpen?: string
    reserveEndDate?: string
    confirmedPrice: number
    salesPrice: number // ✅ Added
    imageUrl: string | null
    salesChannel: string
    consignmentId: string
}

export type Consignment = {
    id: string
    date: string
    lot: string
    type: string
    userId: string // ✅ Added
    images: ConsignmentImage[]
    items: ConsignmentItem[]
}

export type DashboardItem = ConsignmentItem & {
    date: string
    lot: string
    type: string
    userId: string
    user: any; // ✅ Combined user data
    parentImages: ConsignmentImage[]
}

const statusTranslation: Record<string, string> = {
    // General Status
    "READY": "พร้อม",
    "READY_SALE": "พร้อมขาย",
    "RESERVED": "ติดจอง",
    "SOLD": "ขายแล้ว",
    "REPAIR": "ซ่อม",
    "RETURN_CUSTOMER": "ส่งคืนลูกค้า",
    "ยังไม่ถึงกำหนด": "ยังไม่ถึงกำหนด",
    "ขายได้": "พร้อม",
    "ขายไม่ได้": "ขายไม่ได้",
    "READY_TO_SELL": "พร้อมขาย",
    "EXTENDED": "ขยายเวลา",

    // Repair Status
    "REPAIRING": "กำลังซ่อม",
    "REPAIRED": "ซ่อมเสร็จสิ้น",
    "NOT_REPAIR": "-",
    "COMPLETED": "สำเร็จ",
    "PENDING": "รอดำเนินการ",
    "REPAIR_DONE": "ซ่อมเสร็จสิ้น",
};

const statusColor: Record<string, string> = {
    "พร้อม": "bg-green-100 text-green-700",
    "พร้อมขาย": "bg-green-100 text-green-700",
    "ติดจอง": "bg-yellow-100 text-yellow-700",
    "ซ่อม": "bg-red-100 text-red-700",
    "กำลังซ่อม": "bg-blue-100 text-blue-700",
    "ซ่อมเสร็จสิ้น": "bg-emerald-100 text-emerald-700",
    "ขายแล้ว": "bg-gray-100 text-gray-700",
    "ส่งคืนลูกค้า": "bg-purple-100 text-purple-700",
    "ยังไม่ถึงกำหนด": "bg-orange-100 text-orange-700",
    "รอดำเนินการ": "bg-yellow-50 text-yellow-600",
    "ขยายเวลา": "bg-indigo-100 text-indigo-700",
}

export default function DashboardHome() {
    const { data: session } = useSession()
    const [items, setItems] = useState<DashboardItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const user = session?.user as any;
    const isManager = user?.role === "MANAGER";

    // Modal state
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const [selectedItem, setSelectedItem] = useState<DashboardItem | null>(null)

    // Filters
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด")
    const [selectedType, setSelectedType] = useState("ทั้งหมด")
    const [selectedStatus, setSelectedStatus] = useState("ทั้งหมด")

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    useEffect(() => {
        fetchData()
    }, [])

    // Reset pagination when search or filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, selectedCategory, selectedType, selectedStatus])

    const fetchData = async () => {
        try {
            setLoading(true)
            const res = await fetch("/api/consignments")
            if (!res.ok) {
                const errText = await res.text();
                let errMsg = "Failed to fetch data";
                try {
                    const errJson = JSON.parse(errText);
                    errMsg = errJson.error || errMsg;
                } catch {
                    errMsg = errText || errMsg;
                }
                throw new Error(errMsg);
            }

            let consignments: Consignment[] = await res.json()

            // ✅ Filter for Employee (Limited view)
            if (user?.role === "EMPLOYEE") {
                consignments = consignments.filter(c => c.userId === user.id)
            }

            const allItems: DashboardItem[] = consignments.flatMap((c) =>
                c.items.map((item) => ({
                    ...item,
                    date: new Date(c.date).toLocaleDateString("th-TH", {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                    }),
                    lot: c.lot,
                    type: c.type,
                    userId: c.userId,
                    user: (c as any).user, // ✅ Include user info for the modal
                    parentImages: c.images || []
                }))
            )

            setItems(allItems)
        } catch (err: any) {
            console.error("Error fetching data:", err)
            setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล")
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (item: DashboardItem) => {
        setSelectedItem(item)
        onOpen()
    }

    const handleDelete = async (item: DashboardItem) => {
        if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบรายการ "${item.productName}"?`)) return

        try {
            // Check if we should delete the whole consignment or just the item
            // For now, based on UnifiedPersonView, we delete the lot (consignment)
            const res = await axios.delete(`/api/consignments/${item.consignmentId}`)
            if (res.data.success) {
                toast.success("ลบข้อมูลเสร็จสิ้น", {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                        fontWeight: 'bold'
                    },
                })
                fetchData()
            }
        } catch (error) {
            console.error("Delete error:", error)
            toast.error("ลบข้อมูลไม่สำเร็จ")
        }
    }

    const handleSave = async (formData: any) => {
        try {
            const res = await axios.patch(`/api/consignments/items/${formData.id}`, formData)
            if (res.data.success) {
                toast.success("บันทึกการเปลี่ยนแปลงเสร็จสิ้น", {
                    icon: '✅',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                        fontWeight: 'bold'
                    },
                })
                fetchData() // Refresh list
                onOpenChange() // Close modal
            }
        } catch (error: any) {
            console.error("Save error:", error)
            const errMsg = error.response?.data?.error || "ไม่สามารถบันทึกข้อมูลได้"
            toast.error(errMsg)
        }
    }

    // Filter Logic
    const filteredItems = items.filter((item) => {
        const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.lot.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesCategory = selectedCategory === "ทั้งหมด" || item.category === selectedCategory

        let matchesType = true
        if (selectedType !== "ทั้งหมด") {
            if (selectedType === "การนำเข้า") matchesType = item.type === "INCOME"
            else if (selectedType === "การฝากขาย") matchesType = item.type === "CONSIGNMENT"
            else if (selectedType === "การฝากซ่อม") matchesType = item.type === "REPAIR"
            else if (selectedType === "การจำนำ") matchesType = item.type === "PAWN"
        }

        const matchesStatus = selectedStatus === "ทั้งหมด" || item.status === selectedStatus

        return matchesSearch && matchesCategory && matchesType && matchesStatus
    })

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium animate-pulse">กำลังโหลดข้อมูล...</p>
        </div>
    )

    if (error) return (
        <div className="p-12 text-center bg-red-50 rounded-2xl border border-red-100">
            <p className="text-red-500 font-bold text-lg mb-2">Oops!</p>
            <p className="text-red-400">{error}</p>
        </div>
    )

    return (
        <div className="space-y-6">
            <Toaster position="top-center" />

            {/* ===== Filter / Search ===== */}
            <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="relative flex-1 min-w-[300px] group">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        placeholder="พิมพ์เพื่อค้นหา (ชื่อสินค้า, รหัส, หรือล็อต)..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 ring-blue-500/10 focus:bg-white transition-all shadow-inner"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-2">
                    <select
                        className="bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-medium text-gray-600 outline-none hover:bg-gray-100 transition-colors cursor-pointer"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option>ทั้งหมด</option>
                        <option>กล้องดิจิตอล</option>
                        <option>เลนส์</option>
                        <option>ขาตั้งกล้อง</option>
                        <option>อุปกรณ์เสริม</option>
                        <option>แบต</option>
                        <option>ฟิลม์</option>
                        <option>สายคล้อง</option>
                    </select>

                    <select
                        className="bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-medium text-gray-600 outline-none hover:bg-gray-100 transition-colors cursor-pointer"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                    >
                        <option>ทั้งหมด</option>
                        <option>การนำเข้า</option>
                        <option>การฝากขาย</option>
                        <option>การฝากซ่อม</option>
                        <option>การจำนำ</option>
                    </select>

                    <select
                        className="bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-medium text-gray-600 outline-none hover:bg-gray-100 transition-colors cursor-pointer"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option>ทั้งหมด</option>
                        <option>พร้อม</option>
                        <option>ติดจอง</option>
                        <option>ซ่อม</option>
                        <option>ขายแล้ว</option>
                    </select>
                </div>

                <div className="ml-auto">
                    <DownloadExcelButton />
                </div>
            </div>

            {/* ===== Table ===== */}
            <div className="bg-white rounded-[1.5rem] border border-gray-100 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="overflow-x-auto no-scrollbar w-full">
                    <table className="w-full text-sm min-w-[1200px]">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 font-bold text-[11px] uppercase tracking-wider border-b border-gray-100">
                                <th className="p-4 text-left font-bold">ข้อมูลสินค้า</th>
                                <th className="p-4 text-center font-bold">รหัสกำกับ</th>
                                <th className="p-4 text-center font-bold">วันที่บันทึก</th>
                                <th className="p-4 text-center font-bold">ล็อต</th>
                                <th className="p-4 text-center font-bold">สถานะสินค้า</th>
                                <th className="p-4 text-center font-bold">สถานะซ่อม</th>
                                <th className="p-4 text-center font-bold">สถานะการจอง</th>
                                <th className="p-4 text-center font-bold">ราคาทุน</th>
                                <th className="p-4 text-center font-bold">ราคาขาย</th>
                                <th className="p-4 text-right pr-6 font-bold">จัดการ</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-50">
                            {paginatedItems.length > 0 ? (
                                paginatedItems.map((item, index) => (
                                    <tr key={`${item.id}-${index}`} className="group hover:bg-blue-50/30 transition-all duration-300">
                                        <td className="p-4 min-w-[300px]">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 relative flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden border border-gray-100 shadow-sm group-hover:scale-105 transition-transform duration-300">
                                                    {item.imageUrl ? (
                                                        <Image
                                                            src={item.imageUrl}
                                                            alt={item.productName}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full bg-gray-50">
                                                            <Package size={20} className="text-gray-300" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col space-y-0.5">
                                                    <p className="font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors" title={item.productName}>
                                                        {item.productName}
                                                    </p>
                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                        <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                                            {item.category}
                                                        </span>
                                                        <span className="text-xs text-gray-400 font-medium truncate italic">
                                                            Year: {item.year}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="text-center p-4">
                                            <span className="font-mono text-[11px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                                #{item.id.slice(0, 8)}
                                            </span>
                                        </td>
                                        <td className="text-center p-4 font-bold text-gray-600">{item.date}</td>
                                        <td className="text-center p-4">
                                            <div className="inline-flex items-center justify-center min-w-[60px] h-7 bg-blue-50 text-blue-600 text-xs font-black rounded-lg border border-blue-100">
                                                {item.lot}
                                            </div>
                                        </td>

                                        <td className="text-center p-4">
                                            {(() => {
                                                // 🔥 Normalize status to uppercase to prevent case mismatch
                                                const normalizedStatus = item.status?.toUpperCase() || "";
                                                const displayStatus = statusTranslation[normalizedStatus] || item.status;
                                                return (
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight shadow-sm inline-block ${statusColor[displayStatus] || "bg-gray-100 text-gray-600"
                                                            }`}
                                                    >
                                                        {displayStatus}
                                                    </span>
                                                )
                                            })()}
                                        </td>

                                        <td className="text-center p-4">
                                            {item.repairStatus && item.repairStatus !== "NOT_REPAIR" ? (
                                                (() => {
                                                    // 🔥 Normalize repair status to uppercase
                                                    const normalizedRepairStatus = item.repairStatus?.toUpperCase() || "";
                                                    const displayRepairStatus = statusTranslation[normalizedRepairStatus] || item.repairStatus;
                                                    return (
                                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black ${statusColor[displayRepairStatus] || "bg-blue-50 text-blue-600"}`}>
                                                            {displayRepairStatus}
                                                        </span>
                                                    )
                                                })()
                                            ) : "-"}
                                        </td>
                                        <td className="text-center p-4">
                                            {item.isReserveOpen === "true" ? (
                                                <div className="flex flex-col items-center">
                                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-[10px] font-black uppercase">ติดจอง</span>
                                                    {item.reserveEndDate && <span className="text-[9px] text-gray-400 font-bold mt-1">{new Date(item.reserveEndDate).toLocaleDateString("th-TH")}</span>}
                                                </div>
                                            ) : "-"}
                                        </td>

                                        <td className="text-center p-4">
                                            <span className="text-orange-600 font-black text-base">
                                                {isManager || item.userId === user?.id ? `฿${item.confirmedPrice.toLocaleString()}` : '***'}
                                            </span>
                                        </td>

                                        <td className="text-center p-4">
                                            <span className="text-blue-600 font-black text-base">
                                                {item.salesPrice > 0 ? `฿${item.salesPrice.toLocaleString()}` : "-"}
                                            </span>
                                        </td>

                                        <td className="text-right p-4 pr-6">
                                            {(isManager || item.userId === user?.id) && (
                                                <Dropdown placement="bottom-end" shadow="lg" className="rounded-2xl border border-gray-100">
                                                    <DropdownTrigger>
                                                        <Button
                                                            isIconOnly
                                                            variant="light"
                                                            size="sm"
                                                            className="rounded-full text-gray-400 hover:text-gray-900 transition-colors"
                                                        >
                                                            <MoreVertical size={18} />
                                                        </Button>
                                                    </DropdownTrigger>
                                                    <DropdownMenu aria-label="Action menu" variant="faded" className="p-2 gap-1">
                                                        <DropdownItem
                                                            key="edit"
                                                            startContent={<Pencil size={16} className="text-blue-500" />}
                                                            className="rounded-xl h-10 px-3 hover:bg-blue-50"
                                                            onPress={() => handleEdit(item)}
                                                        >
                                                            <span className="font-bold text-gray-700">ดูข้อมูล / แก้ไข</span>
                                                        </DropdownItem>
                                                        <DropdownItem
                                                            key="delete"
                                                            className="rounded-xl h-10 px-3 hover:bg-red-50 text-red-500"
                                                            color="danger"
                                                            startContent={<Trash2 size={16} />}
                                                            onPress={() => handleDelete(item)}
                                                        >
                                                            <span className="font-bold">ลบรายการนี้</span>
                                                        </DropdownItem>
                                                    </DropdownMenu>
                                                </Dropdown>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={10} className="text-center py-20">
                                        <div className="flex flex-col items-center justify-center space-y-3 opacity-30">
                                            <Layers size={48} className="text-gray-400" />
                                            <p className="font-bold text-gray-500 text-lg">ไม่พบข้อมูลสินค้า</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination / Info Footer */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest order-2 sm:order-1">
                    Showing {paginatedItems.length} of {filteredItems.length} records in total
                </p>
                <div className="flex items-center gap-1 order-1 sm:order-2">
                    <Button
                        size="sm"
                        variant="flat"
                        className="rounded-xl font-bold bg-white border border-gray-100 h-9 disabled:opacity-50"
                        onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        isDisabled={currentPage === 1}
                    >
                        Previous
                    </Button>

                    <div className="flex gap-1 mx-2">
                        {[...Array(totalPages)].map((_, i) => (
                            <Button
                                key={i + 1}
                                size="sm"
                                isIconOnly
                                variant={currentPage === i + 1 ? "solid" : "flat"}
                                className={`rounded-xl font-bold h-9 w-9 ${currentPage === i + 1
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                    : "bg-white border border-gray-100"
                                    }`}
                                onPress={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </Button>
                        )).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}
                    </div>

                    <Button
                        size="sm"
                        variant="flat"
                        className="rounded-xl font-bold bg-white border border-gray-100 h-9 disabled:opacity-50"
                        onPress={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        isDisabled={currentPage === totalPages || totalPages === 0}
                    >
                        Next
                    </Button>
                </div>
            </div>

            {/* ===== New Modern Detail Modal ===== */}
            <ProductDetailModal
                isOpen={isOpen}
                onOpenChangeAction={onOpenChange}
                item={selectedItem}
                onSaveAction={handleSave}
                isManager={isManager}
            />
        </div>
    )
}
