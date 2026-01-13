import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const userId = cookies().get("userId")?.value;
  if (!userId) return NextResponse.json({}, { status: 401 });

  const user = await db.user.findUnique({
    where: { id: Number(userId) },
    select: { id: true, name: true, email: true },
  });

  return NextResponse.json(user);
}

export async function PUT(req: Request) {
  const userId = cookies().get("userId")?.value;
  if (!userId) return NextResponse.json({}, { status: 401 });

  const { name } = await req.json();

  await db.user.update({
    where: { id: Number(userId) },
    data: { name },
  });

  return NextResponse.json({ success: true });
}
