// app/api/consignment-status/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    const items = await db.consignmentItem.findMany({
        select: { status: true }
    });

    const counts: Record<string, number> = {};
    items.forEach(item => {
        counts[item.status] = (counts[item.status] || 0) + 1;
    });

    const statuses = Object.keys(counts).map((name, index) => ({
        id: index + 1,
        name,
        count: counts[name]
    }));

    return NextResponse.json(statuses);
}
