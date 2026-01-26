// app/api/pawn-status/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    // Return mock data for the 4 pawn statuses requested by the user
    // Since the actual pawn system is still under development in the database.
    return NextResponse.json([
        { id: 1, name: "ยังไม่ครบกำหนด", count: 0, code: "NOT_YET_DUE" },
        { id: 2, name: "ครบกำหนด", count: 0, code: "DUE" },
        { id: 3, name: "ต่อยอด", count: 0, code: "EXTEND" },
        { id: 4, name: "ปิดยอด", count: 0, code: "SETTLE" },
    ]);
}
