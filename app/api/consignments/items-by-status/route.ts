import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");

        if (!status) {
            return NextResponse.json({ error: "Status is required" }, { status: 400 });
        }

        // SELLABLE = ready
        // UNSELLABLE = not ready
        const items = await prisma.consignmentItem.findMany({
            where: {
                status: status === "SELLABLE" ? "ready" : { not: "ready" }
            },
            include: {
                consignment: {
                    select: {
                        date: true,
                        lot: true,
                        consignorName: true
                    }
                }
            },
            orderBy: {
                id: 'desc'
            }
        });

        // Flatten data for easy use in table
        const result = items.map(item => ({
            id: item.id,
            productName: item.productName,
            category: item.category,
            year: item.year,
            status: item.status,
            repairStatus: item.repairStatus,
            confirmedPrice: item.confirmedPrice,
            salesPrice: item.salesPrice,
            imageUrl: item.imageUrl,
            date: item.consignment.date,
            lot: item.consignment.lot,
            consignorName: item.consignment.consignorName
        }));

        return NextResponse.json(result);
    } catch (error) {
        console.error("Fetch items error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
