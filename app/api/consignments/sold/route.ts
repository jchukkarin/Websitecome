import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { saveImage } from "@/lib/saveimage";    

export async function POST(req: Request) {
  try {
    const { itemId, slipImage } = await req.json();

    if (!slipImage) {
      return NextResponse.json(
        { error: "Slip image required" },
        { status: 400 }
      );
    }

    const savedSlip = await saveImage(slipImage);

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