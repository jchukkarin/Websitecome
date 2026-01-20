// app/api/payout-status/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        await db.payoutStatus.delete({
            where: { id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete payout status error:", error);
        return NextResponse.json({ error: "ลบสถานะไม่สำเร็จ" }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const { name } = await req.json();
        const updated = await db.payoutStatus.update({
            where: { id },
            data: { name },
        });
        return NextResponse.json(updated);
    } catch (error) {
        console.error("Update payout status error:", error);
        return NextResponse.json({ error: "อัปเดตสถานะไม่สำเร็จ" }, { status: 500 });
    }
}
