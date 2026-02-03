// app/api/pawn-items/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // active | due | extended | closed

    try {
        const statusMap: Record<string, string[]> = {
            "ACTIVE": ["ACTIVE", "active", "ยังไม่ครบกำหนด"],
            "DUE": ["DUE", "due", "ครบกำหนด"],
            "EXTENDED": ["EXTENDED", "extended", "ต่อยอด"],
            "CLOSED": ["CLOSED", "closed", "redeemed", "ปิดยอด"],
        };

        const statuses = statusMap[status?.toUpperCase() || ""] || [status];

        const items = await db.consignmentItem.findMany({
            where: {
                status: {
                    in: statuses,
                    mode: 'insensitive'
                }
            },
            include: {
                consignment: {
                    select: {
                        consignorName: true,
                        date: true,
                        lot: true
                    }
                }
            },
            orderBy: {
                id: 'desc'
            }
        });

        // Map to PawnItem structure
        const result = items.map(item => ({
            id: item.id.slice(0, 8), // Simplified ID for Contract No
            productName: item.productName,
            customer: item.consignment.consignorName,
            dueDate: item.reserveEndDate || item.consignment.date.toISOString(),
            balance: item.confirmedPrice,
            status: item.status
        }));

        return NextResponse.json(result);
    } catch (error) {
        console.error("Pawn items fetch error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
