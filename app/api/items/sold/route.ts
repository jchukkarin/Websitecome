import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {saveImage} from "@/lib/saveimage";

export async function POST(req: Request) {
    try {
        const { itemId, slipImage } = await req.json();

        const savedSlip = slipImage
            ? await saveImage(slipImage)
            : null;

        const item = await prisma.consignmentItem.update({
            where: { id: itemId },
            data: {
                status: "sold",
                slipImage: savedSlip,
                soldAt: new Date(),
            },
        });

        return NextResponse.json({ success: true, item });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false },
            { status: 500 }
        );
    }
}
