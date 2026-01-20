import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        // Delete related items and images first (or rely on cascading if set up, 
        // but Prisma default is usually to prevent deletion if there are relations)
        // Check schema.prisma for cascading: it doesn't specify 'onDelete: Cascade'

        await prisma.consignmentImage.deleteMany({
            where: { consignmentId: id },
        });

        await prisma.consignmentItem.deleteMany({
            where: { consignmentId: id },
        });

        await prisma.consignment.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete consignment error:", error);
        return NextResponse.json(
            { success: false, message: "Delete failed" },
            { status: 500 }
        );
    }
}
