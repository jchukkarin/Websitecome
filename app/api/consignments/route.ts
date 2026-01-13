import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

// Helper to check if running on Vercel
const isVercel = process.env.VERCEL === "1";

async function saveImage(base64String: string) {
    if (!base64String || !base64String.startsWith("data:image")) return base64String;

    // IF ON VERCEL: Return base64 directly (read-only filesystem)
    if (isVercel) {
        return base64String;
    }

    // IF ON LOCAL: Save to public/uploads
    try {
        const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) return base64String;

        const type = matches[1];
        const buffer = Buffer.from(matches[2], "base64");
        const extension = type.split("/")[1].split("+")[0];
        const filename = `${crypto.randomUUID()}.${extension}`;

        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await fs.mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, filename);
        await fs.writeFile(filePath, buffer);

        return `/uploads/${filename}`;
    } catch (error) {
        console.error("Error saving image locally:", error);
        return base64String; // Fallback to base64 if save fails
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const {
            date,
            lot,
            consignorName,
            contactNumber,
            address,
            totalPrice,
            images,
            items,
            type,
        } = body;

        // Process images based on environment
        const processedImagesUrls = await Promise.all(
            (images || []).map((img: string) => saveImage(img))
        );

        const processedItems = await Promise.all(
            (items || []).map(async (item: any) => ({
                ...item,
                imageUrl: item.imageUrl ? await saveImage(item.imageUrl) : null
            }))
        );

        const consignment = await prisma.consignment.create({
            data: {
                date: new Date(date),
                lot,
                consignorName,
                contactNumber,
                address,
                totalPrice: Number(totalPrice),
                type: type || "INCOME",

                images: {
                    create: processedImagesUrls.map((url: string) => ({
                        imageUrl: url,
                    })),
                },

                items: {
                    create: processedItems.map((item: any) => ({
                        productName: item.productName,
                        category: item.category,
                        year: item.year,
                        status: item.status,
                        confirmedPrice: Number(item.confirmedPrice),
                        salesChannel: item.salesChannel,
                        imageUrl: item.imageUrl,
                    })),
                },
            },
        });

        return NextResponse.json({ success: true, consignment });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Save failed" },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type");

        const where: any = {};
        if (type) {
            where.type = type;
        }

        const consignments = await prisma.consignment.findMany({
            where,
            include: {
                items: true,
                images: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return NextResponse.json(consignments);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
