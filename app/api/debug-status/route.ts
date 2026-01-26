import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const productsTotal = await db.product.count();
        const categoriesCount = await db.importStatus.count();
        const productStats = await db.product.groupBy({
            by: ['status'],
            _count: { _all: true }
        });
        const soldStatus = await db.product.groupBy({
            by: ['isSold'],
            _count: { _all: true }
        });

        const categories = await db.importStatus.findMany({
            include: {
                _count: { select: { products: true } }
            }
        });

        return NextResponse.json({
            productsTotal,
            categoriesCount,
            productStats,
            soldStatus,
            categories
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
