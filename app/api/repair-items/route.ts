// app/api/repair-items/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status"); // repaired | failed

    try {
        const items = await db.consignmentItem.findMany({
            where: {
                category: category || undefined,
                repairStatus: status ? {
                    equals: status,
                    mode: 'insensitive'
                } : undefined,
            },
            include: {
                consignment: {
                    select: {
                        consignorName: true,
                        lot: true,
                    },
                },
            },
            orderBy: {
                consignment: {
                    createdAt: "desc"
                }
            },
        });

        return NextResponse.json(items);
    } catch (error) {
        console.error("Error fetching repair items:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
