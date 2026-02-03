// app/api/pawn-status/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const statuses = [
            { id: 1, key: "ACTIVE", name: "ยังไม่ครบกำหนด", code: "ACTIVE", icon: "mdi:progress-clock" },
            { id: 2, key: "DUE", name: "ครบกำหนด", code: "DUE", icon: "mdi:calendar-alert" },
            { id: 3, key: "EXTENDED", name: "ต่อยอด", code: "EXTENDED", icon: "mdi:calendar-refresh" },
            { id: 4, key: "CLOSED", name: "ปิดยอด", code: "CLOSED", icon: "mdi:check-circle" },
        ];

        const statusMap: Record<string, string[]> = {
            "ACTIVE": ["ACTIVE", "active", "ยังไม่ครบกำหนด"],
            "DUE": ["DUE", "due", "ครบกำหนด"],
            "EXTENDED": ["EXTENDED", "extended", "ต่อยอด"],
            "CLOSED": ["CLOSED", "closed", "redeemed", "ปิดยอด"],
        };

        const responseData = await Promise.all(statuses.map(async (s) => {
            const count = await db.consignmentItem.count({
                where: {
                    status: {
                        in: statusMap[s.key] || [s.key],
                        mode: 'insensitive'
                    }
                }
            });
            return {
                ...s,
                count
            };
        }));

        return NextResponse.json(responseData);
    } catch (error) {
        console.error("Pawn status fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch pawn status" }, { status: 500 });
    }
}
