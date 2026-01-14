import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ปรับ Path ให้ตรงตามที่คุณสร้างไฟล์ไว้

export async function GET() {
    try {
        // ดึง User คนแรกมาทดสอบ
        const user = await prisma.user.findFirst();

        if (!user) {
            return NextResponse.json({
                name: "ไม่พบข้อมูล",
                username: "unknown",
                email: "-",
                image: ""
            });
        }

        return NextResponse.json({
            name: user.name,
            username: user.email.split('@')[0],
            email: user.email,
            image: ""
        });
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}