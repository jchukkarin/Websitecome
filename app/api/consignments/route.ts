import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// No need to instantiate PrismaClient here

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            date,
            lot,
            consignorName,
            contactNumber,
            address,
            totalPrice,
            items
        } = body;

        const result = await db.$transaction(async (tx) => {
            const consignment = await tx.consignment.create({
                data: {
                    date: new Date(date),
                    lot,
                    consignorName,
                    contactNumber,
                    address,
                    totalPrice: parseFloat(totalPrice),
                    items: {
                        create: items.map((item: any) => ({
                            productName: item.productName,
                            category: item.category,
                            year: item.year,
                            status: item.status,
                            confirmedPrice: item.confirmedPrice ? parseFloat(item.confirmedPrice) : null,
                            salesChannel: item.salesChannel,
                            imageUrl: item.imageUrl,
                        })),
                    },
                },
                include: {
                    items: true,
                },
            });
            return consignment;
        });

        return NextResponse.json(result, { status: 201 });
    } catch (error: any) {
        console.error("Error creating consignment:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const consignments = await db.consignment.findMany({
            include: {
                items: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return NextResponse.json(consignments);
    } catch (error: any) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
