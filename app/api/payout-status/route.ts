// app/api/payout-status/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const statuses = await db.payoutStatus.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(statuses.map(s => ({
    id: s.id,
    name: s.name,
    count: s._count.products
  })));
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    if (!name) return NextResponse.json({ error: "กรุณาระบุชื่อสถานะ" }, { status: 400 });

    const newStatus = await db.payoutStatus.create({
      data: { name },
    });

    return NextResponse.json(newStatus);
  } catch (error) {
    console.error("Create payout status error:", error);
    return NextResponse.json({ error: "สร้างสถานะไม่สำเร็จ" }, { status: 500 });
  }
}
