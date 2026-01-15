import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ปรับ Path ให้ตรงตามที่คุณสร้างไฟล์ไว้

export async function GET() {
    try {
        // ดึง User คนแรกมาทดสอบ
        const user = await prisma.user.findFirst();

        if (!user) {
            return NextResponse.json({
                message: "ไม่พบข้อมูล user"
            }, { status: 404 });
        }

        return NextResponse.json({
            id: user.id,
            name: user.name,
            username: user.username || "",
            email: user.email,
            image: user.image || ""
        });
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}