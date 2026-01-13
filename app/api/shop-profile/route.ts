import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    console.log("GET /api/shop-profile called");
    try {
        let profile = await prisma.shopProfile.findFirst({
            where: { id: "default" }
        });

        if (!profile) {
            console.log("No profile found, creating default...");
            profile = await prisma.shopProfile.create({
                data: { id: "default" }
            });
        }

        return NextResponse.json(profile);
    } catch (error: any) {
        console.error("GET ERPOR:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}

export async function POST(req: Request) {
    console.log("POST /api/shop-profile called");
    try {
        const body = await req.json();

        const profile = await prisma.shopProfile.upsert({
            where: { id: "default" },
            update: body,
            create: { ...body, id: "default" }
        });

        return NextResponse.json(profile);
    } catch (error: any) {
        console.error("POST ERROR:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
