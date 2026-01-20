// app/api/pawn-status/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// สำหรับ Pawn เราจะทำเป็นสถานะที่มีการแยก Sold/Unsold
export async function GET() {
    // ม็อกข้อมูลเนื่องจาก Schema ยังไม่มีตาราง Pawn 
    // แต่เราจะทำ API ไว้เพื่อรองรับ UI
    return NextResponse.json([
        { id: 1, name: "ส่งดอกเบี้ย", sold: 5, unsold: 10 },
        { id: 2, name: "ขาดส่ง", sold: 2, unsold: 15 },
    ]);
}
