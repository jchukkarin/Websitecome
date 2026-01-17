"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { MoreVertical, Search, Filter } from "lucide-react"

// Types based on your schema and needs
type ConsignmentItem = {
    id: string
    productName: string
    category: string
    year: string
    status: string
    confirmedPrice: number
    imageUrl: string | null
    salesChannel: string
    consignmentId: string
}

type Consignment = {
    id: string
    date: string
    lot: string
    type: string
    items: ConsignmentItem[]
}

type DashboardItem = ConsignmentItem & {
    date: string
    lot: string
    type: string // "INCOME", "CONSIGNMENT", etc.
}

const statusColor: Record<string, string> = {
    "พร้อม": "bg-green-100 text-green-700",
    "ซ่อม": "bg-red-100 text-red-700",
    "ยังไม่ถึงกำหนด": "bg-orange-100 text-orange-700",
    "ส่งคืนลูกค้า": "bg-emerald-100 text-emerald-700",
    "ขายแล้ว": "bg-gray-100 text-gray-700",
    "ติดจอง": "bg-yellow-100 text-yellow-700",
    // Add default fallback in code logic
}

export default function DashboardHome() {
    const [items, setItems] = useState<DashboardItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Filters
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("หมวดหมู่")
    const [selectedType, setSelectedType] = useState("ตาราง") // Maps to Consignment Type
    const [selectedStatus, setSelectedStatus] = useState("สถานะ")

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const res = await fetch("/api/consignments") // This returns all consignments
            if (!res.ok) throw new Error("Failed to fetch data")

            const consignments: Consignment[] = await res.json()

            // Flatten consignments into a list of items
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
                }))
            )

            setItems(allItems)
        } catch (err) {
            console.error("Error fetching data:", err)
            setError("เกิดข้อผิดพลาดในการโหลดข้อมูล")
        } finally {
            setLoading(false)
        }
    }

    // Filter Logic
    const filteredItems = items.filter((item) => {
        // Exclude "reports" if that's a specific type, or just follow user instruction to "combine all except reports"
        // Assuming 'reports' might be a type, if not, we just show all items that match filters.

        const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.lot.includes(searchTerm) ||
            item.id.includes(searchTerm)

        const matchesCategory = selectedCategory === "หมวดหมู่" || selectedCategory === "ทั้งหมด" || item.category === selectedCategory

        // Map UI "Table" selection to DB "Type"
        // "ตาราง" = All? Or specific default? Assuming "ตาราง" or "ทั้งหมด" means show all types.
        // If user selects "การนำเข้า", match "INCOME" (assuming mapping)
        // Let's implement fuzzy matching or exact mapping if we knew the DB values. 
        // For now, I'll allow exact match if the user's DB types match the dropdown, or mostly ignore if "ทั้งหมด"

        let matchesType = true
        if (selectedType !== "ตาราง" && selectedType !== "ทั้งหมด") {
            // Simple mapping - adjust based on your actual text in DB
            if (selectedType === "การนำเข้า") matchesType = item.type === "INCOME"
            else if (selectedType === "การฝากขาย") matchesType = item.type === "CONSIGNMENT"
            else matchesType = item.type === selectedType // Fallback
        }

        const matchesStatus = selectedStatus === "สถานะ" || selectedStatus === "ทั้งหมด" || item.status === selectedStatus

        return matchesSearch && matchesCategory && matchesType && matchesStatus
    })

    if (loading) return <div className="p-4 text-center">กำลังโหลดข้อมูล...</div>
    if (error) return <div className="p-4 text-center text-red-500">{error}</div>

    return (
        <div className="space-y-6">

            {/* ===== Filter / Search ===== */}
            <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2 border rounded-md px-3 py-2 w-64 bg-white transition-all focus-within:ring-2 ring-gray-200">
                    <Search size={16} className="text-gray-400" />
                    <input
                        placeholder="ค้นหา (ชื่อ, รหัส, ล็อต)"
                        className="outline-none text-sm w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select
                    className="border rounded-md px-3 py-2 text-sm bg-white"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option>หมวดหมู่</option>
                    <option>ทั้งหมด</option>
                    <option>กล้องดิจิตอล</option>
                    <option>เลนส์</option>
                    <option>ขาตั้งกล้อง</option>
                    <option>อุปกรณ์เสริม</option>
                    {/* Add more categories as present in your DB */}
                </select>

                <select
                    className="border rounded-md px-3 py-2 text-sm bg-white"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                >
                    <option>ตาราง</option>
                    <option>ทั้งหมด</option>
                    <option>การนำเข้า</option>
                    <option>การฝากขาย</option>
                    <option>การฝากซ่อม</option>
                    <option>การจำนำ</option>
                </select>

                <select
                    className="border rounded-md px-3 py-2 text-sm bg-white"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                >
                    <option>สถานะ</option>
                    <option>ทั้งหมด</option>
                    <option>พร้อม</option>
                    <option>ติดจอง</option>
                    <option>ซ่อม</option>
                    <option>ขายแล้ว</option>
                    <option>ยังไม่ขาย</option>
                </select>
            </div>

            {/* ===== Table ===== */}
            <div className="bg-white rounded-lg border overflow-x-auto shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 font-medium">
                        <tr>
                            <th className="p-3 text-left">สินค้า</th>
                            <th className="p-3 text-center">รหัส</th>
                            <th className="p-3 text-center">วันที่</th>
                            <th className="p-3 text-center">ล็อต</th>
                            <th className="p-3 text-center">สถานะสินค้า</th>
                            <th className="p-3 text-center">ราคาทุน</th>
                            <th className="p-3 text-center">ราคาขาย</th>
                            <th className="p-3"></th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item, index) => (
                                <tr key={`${item.id}-${index}`} className="hover:bg-gray-50 transition-colors">
                                    {/* Product */}
                                    <td className="p-3 flex gap-3 min-w-[250px]">
                                        <div className="w-12 h-12 relative flex-shrink-0 bg-gray-100 rounded-md overflow-hidden border">
                                            {item.imageUrl ? (
                                                <Image
                                                    src={item.imageUrl}
                                                    alt={item.productName}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-xs text-gray-400">No Img</div>
                                            )}
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <p className="font-medium text-gray-900 truncate max-w-[180px]" title={item.productName}>
                                                {item.productName}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {item.category} • ปี: {item.year}
                                            </p>
                                        </div>
                                    </td>

                                    <td className="text-center p-3 text-gray-600">
                                        {/* Display part of ID or a specific code if available */}
                                        {item.id.slice(0, 8)}...
                                    </td>
                                    <td className="text-center p-3 text-gray-600 whitespace-nowrap">{item.date}</td>
                                    <td className="text-center p-3 text-gray-600">{item.lot}</td>

                                    {/* Status */}
                                    <td className="text-center p-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium inline-block w-24 ${statusColor[item.status] || "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>

                                    <td className="text-center p-3 text-gray-700 font-medium">
                                        {item.confirmedPrice.toLocaleString()}
                                    </td>

                                    <td className="text-center p-3 text-blue-600 font-medium">
                                        {/* Placeholder for Selling Price as check schema or logic */}
                                        -
                                    </td>

                                    <td className="text-center p-3">
                                        <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                                            <MoreVertical size={16} className="text-gray-400" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="text-center py-8 text-gray-500">
                                    ไม่พบข้อมูลสินค้า
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination or Footer info could go here */}
            {filteredItems.length > 0 && (
                <div className="text-xs text-gray-400 text-right">
                    แสดงทั้งหมด {filteredItems.length} รายการ
                </div>
            )}
        </div>
    )
}
