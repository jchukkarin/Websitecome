import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const prefix = searchParams.get("prefix") || "LOT";
        const year = new Date().getFullYear();

        try {
            // 💎 Attempt Primary Strategy: Transactional Counter
            const lot = await prisma.$transaction(async (tx) => {
                const counterRecord = await tx.lotCounter.upsert({
                    where: { year },
                    update: { counter: { increment: 1 } },
                    create: { year, counter: 1 },
                });

                const running = counterRecord.counter.toString().padStart(4, "0");
                return `${prefix}-${year}-${running}`;
            });
            return NextResponse.json({ lot });
        } catch (dbError) {
            console.warn("LotCounter table missing, using fallback count strategy:", dbError);

            // 🛡️ Fallback Strategy: Count existing records with the specific prefix
            const count = await prisma.consignment.count({
                where: {
                    lot: { startsWith: `${prefix}-${year}-` }
                }
            });

            const nextValue = count + 1;
            const running = String(nextValue).padStart(4, "0");
            const lot = `${prefix}-${year}-${running}`;

            return NextResponse.json({ lot });
        }
    } catch (error: any) {
        console.error("Critical LOT Generation failure:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}
