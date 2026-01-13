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
  });

  return NextResponse.json(
    statuses.map((s) => ({
      id: s.id,
      name: s.name,
      count: s._count.products,
    }))
  );
}
