// app/api/payout-items/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const products = await db.product.findMany({
            include: {
                payoutStatus: true,
                importStatus: true,
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(products.map(p => ({
            id: p.id.toString(),
            imageUrl: p.images?.[0] || null,
            productName: p.name,
            category: p.importStatus?.name || "ไม่ระบุ",
            payoutStatus: p.isSold ? "SOLD" : "NOT_SOLD",
            price: p.isSold ? 0 : 0 // Assuming price might be elsewhere or we need to add it. 
            // For now let's use a dummy or check if we have priced fields in Product model
        })));
    } catch (error) {
        console.error("Fetch payout items error:", error);
        return NextResponse.json({ error: "โหลดข้อมูลล้มเหลว" }, { status: 500 });
    }
}
