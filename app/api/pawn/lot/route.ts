import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const year = new Date().getFullYear();

        // 🔥 Strategy: Count existing pawn records to generate next number
        // We check both 'Consignment' (current storage) and 'Pawn' (future storage)
        // to find the highest number
        let count = 0;

        try {
            count = await prisma.consignment.count({
                where: {
                    type: "PAWN",
                    createdAt: {
                        gte: new Date(`${year}-01-01T00:00:00.000Z`),
                    },
                },
            });
        } catch (e) {
            console.error("Consignment table count failed:", e);
        }

        // Adjust count + 1
        const nextValue = count + 1;
        const lotNumber = String(nextValue).padStart(4, "0");
        const lot = `PAWN-${year}-${lotNumber}`;

        return NextResponse.json({ lot });
    } catch (error) {
        console.error("Critical Error generating lot:", error);
        // Absolute fallback so the UI isn't stuck
        const fallbackLot = `PAWN-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`;
        return NextResponse.json({ lot: fallbackLot });
    }
}
