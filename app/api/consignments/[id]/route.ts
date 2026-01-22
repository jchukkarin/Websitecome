import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;

        // Fetch consignment to check ownership
        const consignment = await prisma.consignment.findUnique({
            where: { id },
            select: { userId: true }
        });

        if (!consignment) {
            return NextResponse.json({ error: "Not Found" }, { status: 404 });
        }

        const user = session.user as any;
        const isManager = user.role === "MANAGER";
        const isOwner = consignment.userId === user.id;

        if (!isManager && !isOwner) {
            return NextResponse.json({ error: "Forbidden: You don't have permission to delete this record." }, { status: 403 });
        }

        // Delete related items and images first
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
