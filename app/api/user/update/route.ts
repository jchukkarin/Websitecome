import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, image } = body; // รับค่า image มาจาก Frontend

        

        const updatedUser = await prisma.user.update({
            where: { email: email },
            data: {
                name: name,
                image: image, // <--- ต้องส่งค่านี้ให้ Prisma บันทึกลง PostgreSQL
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json({ message: "Update failed" }, { status: 500 });
    }
}