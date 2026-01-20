// app/api/import-status/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const statuses = await db.importStatus.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(
    statuses.map((s) => ({
      id: s.id,
      name: s.name,
      count: s._count.products,
    }))
  );
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    if (!name) return NextResponse.json({ error: "กรุณาระบุชื่อสถานะ" }, { status: 400 });

    const newStatus = await db.importStatus.create({
      data: { name },
    });

    return NextResponse.json(newStatus);
  } catch (error) {
    console.error("Create import status error:", error);
    return NextResponse.json({ error: "สร้างสถานะไม่สำเร็จ" }, { status: 500 });
  }
}
