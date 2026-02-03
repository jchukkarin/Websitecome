// app/api/consignment-status/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    try {
        // Count items that are 'ready' or 'พร้อม' (Sellable)
        const sellableCount = await db.consignmentItem.count({
            where: {
                OR: [
                    { status: "ready" },
                    { status: "พร้อม" }
                ]
            }
        });

        const PAWN_STATUSES = [
            "ACTIVE", "DUE", "EXTENDED", "CLOSED",
            "active", "extended", "redeemed", "due", "closed",
            "ยังไม่ครบกำหนด", "ครบกำหนด", "ต่อยอด", "ปิดยอด"
        ];

        // Count items that are NOT 'ready' and NOT 'พร้อม' and NOT in pawn statuses
        const unsellableCount = await db.consignmentItem.count({
            where: {
                AND: [
                    { status: { notIn: ["ready", "พร้อม"] } },
                    { status: { notIn: PAWN_STATUSES } }
                ]
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
