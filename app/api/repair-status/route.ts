// app/api/repair-status/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const statuses = ["REPAIRING", "REPAIRED", "RETURN_CUSTOMER"];

        // เราจะนับแยกตามสถานะ
        const counts = await Promise.all(
            statuses.map(async (status) => {
                const count = await db.consignmentItem.count({
                    where: {
                        repairStatus: {
                            equals: status,
                            mode: 'insensitive'
                        }
                    }
                });
                return { status, count };
            })
        );

        const labels: Record<string, string> = {
            REPAIRING: "🔧 กำลังซ่อม",
            REPAIRED: "✅ ซ่อมเสร็จสิ้น",
            RETURN_CUSTOMER: "↩️ ส่งคืนลูกค้า",
        };

        const result = counts.map(item => ({
            status: item.status,
            label: labels[item.status],
            count: item.count
        }));

        return NextResponse.json(result);
    } catch (error) {
        console.error("Repair status API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
