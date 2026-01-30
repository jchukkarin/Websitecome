import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const consignment = await prisma.consignment.findUnique({
            where: { id },
            include: {
                items: true,
                images: true,
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });

        if (!consignment) {
            return NextResponse.json({ error: "Not Found" }, { status: 404 });
        }

        return NextResponse.json(consignment);
    } catch (error) {
        console.error("Get consignment error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();

        // Check permission
        const existing = await prisma.consignment.findUnique({
            where: { id },
            select: { userId: true }
        });

        if (!existing) {
            return NextResponse.json({ error: "Not Found" }, { status: 404 });
        }

        const user = session.user as any;
        if (user.role !== "MANAGER" && existing.userId !== user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const updated = await prisma.consignment.update({
            where: { id },
            data: {
                consignorName: body.consignorName,
                contactNumber: body.contactNumber,
                address: body.address,
                lot: body.lot,
                date: body.date ? new Date(body.date) : undefined,
                totalPrice: body.totalPrice
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Update consignment error:", error);
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

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
