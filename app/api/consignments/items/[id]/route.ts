import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const item = await prisma.consignmentItem.findUnique({
            where: { id },
            include: {
                consignment: {
                    include: {
                        user: true,
                        images: true
                    }
                }
            }
        });

        if (!item) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        // Return flattened structure similar to what the frontend expects
        const response = {
            ...item,
            lot: item.consignment.lot,
            date: item.consignment.date,
            consignorName: item.consignment.consignorName,
            user: item.consignment.user,
            images: item.consignment.images,
            displayImage: item.imageUrl || (item.consignment.images && item.consignment.images.length > 0 ? item.consignment.images[0].imageUrl : null)
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("GET item error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();

        // Basic validation
        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

        const updated = await prisma.consignmentItem.update({
            where: { id },
            data: {
                productName: body.productName,
                category: body.category,
                confirmedPrice: body.confirmedPrice ? Number(body.confirmedPrice) : undefined,
                year: body.year,
                status: body.status,
                repairStatus: body.repairStatus,
                imageUrl: body.imageUrl
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("PATCH item error:", error);
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}
