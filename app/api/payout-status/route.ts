// app/api/payout-status/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const statuses = await db.payoutStatus.findMany({
    include: {
      products: true,
    },
  });

  return NextResponse.json(statuses);
}
