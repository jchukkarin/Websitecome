// app/api/import-status/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        await db.importStatus.delete({
            where: { id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete import status error:", error);
        return NextResponse.json({ error: "ลบสถานะไม่สำเร็จ" }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        const { name } = await req.json();
        const updated = await db.importStatus.update({
            where: { id },
            data: { name },
        });
        return NextResponse.json(updated);
    } catch (error) {
        console.error("Update import status error:", error);
        return NextResponse.json({ error: "อัปเดตสถานะไม่สำเร็จ" }, { status: 500 });
    }
}
