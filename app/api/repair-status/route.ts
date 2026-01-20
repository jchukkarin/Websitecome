// app/api/repair-status/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// เราจะมัดรวมกันใน ConsignmentItem.status สำหรับ Repair
export async function GET() {
    const items = await db.consignmentItem.findMany({
        select: { status: true }
    });

    const counts: Record<string, number> = {};
    items.forEach(item => {
        counts[item.status] = (counts[item.status] || 0) + 1;
    });

    // เนื่องจากเราไม่มีตาราง Status แยกสำหรับ Repair ใน Prisma 
    // เราจะแสดงผลสถานะที่มีอยู่จริงในฐานข้อมูล
    const statuses = Object.keys(counts).map((name, index) => ({
        id: index + 1,
        name,
        count: counts[name]
    }));

    return NextResponse.json(statuses);
}
