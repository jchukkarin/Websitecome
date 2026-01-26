// app/api/consignment-status/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const items = await db.consignmentItem.findMany({
            select: { status: true }
        });

        const counts: Record<string, number> = {};
        items.forEach(item => {
            const s = item.status.toLowerCase();
            counts[s] = (counts[s] || 0) + 1;
        });

        // We will return the specific counts for the statuses the user wants
        // but the actual mapping will happen in the frontend or we can do it here.
        // Let's just return all found statuses and count them.

        const statuses = Object.keys(counts).map((name, index) => ({
            id: index + 1,
            name,
            count: counts[name]
        }));

        return NextResponse.json(statuses);
    } catch (error) {
        console.error("Consignment status fetch error:", error);
        return NextResponse.json({ error: "โหลดข้อมูลล้มเหลว" }, { status: 500 });
    }
}
