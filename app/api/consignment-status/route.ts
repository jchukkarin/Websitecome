// app/api/consignment-status/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    try {
        // Count items that are 'ready' (Sellable)
        const sellableCount = await db.consignmentItem.count({
            where: { status: "ready" }
        });

        // Count items that are NOT 'ready' (Unsellable/Others)
        const unsellableCount = await db.consignmentItem.count({
            where: {
                status: {
                    not: "ready"
                }
            }
        });

        const result = [
            { key: "SELLABLE", label: "ขายได้", count: sellableCount },
            { key: "UNSELLABLE", label: "ขายไม่ได้", count: unsellableCount },
        ];

        return NextResponse.json(result);
    } catch (error) {
        console.error("Consignment status fetch error:", error);
        return NextResponse.json({ error: "โหลดข้อมูลล้มเหลว" }, { status: 500 });
    }
}
