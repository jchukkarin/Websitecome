"use client"

import Image from "next/image"
import { MoreVertical, Search } from "lucide-react"

type Status =
    | "พร้อม"
    | "ซ่อม"
    | "ยังไม่ถึงกำหนด"
    | "ส่งคืนลูกค้า"

const statusColor: Record<Status, string> = {
    พร้อม: "bg-green-100 text-green-700",
    ซ่อม: "bg-red-100 text-red-700",
    ยังไม่ถึงกำหนด: "bg-orange-100 text-orange-700",
    ส่งคืนลูกค้า: "bg-emerald-100 text-emerald-700",
}

export default function DashboardHome() {
    return (
        <div className="space-y-6">

            {/* ===== Filter / Search ===== */}
            <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2 border rounded-md px-3 py-2 w-64 bg-white">
                    <Search size={16} className="text-gray-400" />
                    <input
                        placeholder="ค้นหา"
                        className="outline-none text-sm w-full"
                    />
                </div>

                <select className="border rounded-md px-3 py-2 text-sm">
                    <option>หมวดหมู่</option>
                    <option>ทั้งหมด</option>
                    <option>กล้อง</option>
                    <option>เลนส์</option>
                    <option>ขาตั้งกล้อง</option>
                    <option>แบต</option>
                    <option>ฟิลม์</option>
                    <option>สายคล้อง</option>
                </select>

                <select className="border rounded-md px-3 py-2 text-sm">
                    <option>ตาราง</option>
                    <option>ทั้งหมด</option>
                    <option>การนำเข้า</option>
                    <option>การฝากขาย</option>
                    <option>การฝากซ่อม</option>
                    <option>การจำนำ</option>
                </select>

                <select className="border rounded-md px-3 py-2 text-sm">
                    <option>สถานะ</option>
                    <option>พร้อม</option>
                    <option>ติดจอง</option>
                    <option>ซ่อม</option>
                    <option>ขายแล้ว</option>
                    <option>ยังไม่ขาย</option>
                    <option>ขายแล้ว</option>
                    <option>ซ่อมได้</option>
                    <option>ซ่อมไม่ได้</option>
                    <option>กำลังซ่อม</option>
                    <option>ซ่อมเสร็จสิ้น</option>
                </select>
            </div>

            {/* ===== Table ===== */}
            <div className="bg-white rounded-lg border overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="p-3 text-left">สินค้า</th>
                            <th className="p-3">รหัส</th>
                            <th className="p-3">วันที่</th>
                            <th className="p-3">ล็อต</th>
                            <th className="p-3">สถานะสินค้า</th>
                            <th className="p-3">ราคาทุน</th>
                            <th className="p-3">ราคาขาย</th>
                            <th className="p-3"></th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {mockData.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                {/* Product */}
                                <td className="p-3 flex gap-3">
                                    <Image
                                        src={item.image}
                                        alt=""
                                        width={48}
                                        height={48}
                                        className="rounded-md border"
                                    />
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-xs text-gray-500">
                                            หมวดหมู่: {item.category} • ปี: {item.year}
                                        </p>
                                    </div>
                                </td>

                                <td className="text-center">{item.code}</td>
                                <td className="text-center">{item.date}</td>
                                <td className="text-center">{item.lot}</td>

                                {/* Status */}
                                <td className="text-center">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[item.status]}`}
                                    >
                                        {item.status}
                                    </span>
                                </td>

                                <td className="text-center text-gray-700">
                                    {item.cost.toLocaleString()}
                                </td>

                                <td className="text-center text-blue-600 font-medium">
                                    {item.price ? item.price.toLocaleString() : "-"}
                                </td>

                                <td className="text-center">
                                    <MoreVertical className="mx-auto cursor-pointer text-gray-400" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

/* ===== Mock Data ===== */
const mockData = [
    {
        id: 1,
        name: "Canon EOS R",
        category: "กล้องดิจิตอล",
        year: 2021,
        code: "101",
        date: "27/11/2568",
        lot: "001",
        status: "ซ่อม" as Status,
        cost: 3500,
        price: 4200,
        image: "/camera.jpg",
    },
    {
        id: 2,
        name: "Nikon Z6",
        category: "กล้องดิจิตอล",
        year: 2020,
        code: "102",
        date: "27/11/2568",
        lot: "001",
        status: "พร้อม" as Status,
        cost: 1500,
        price: null,
        image: "/camera.jpg",
    },
]
