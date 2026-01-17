import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/* =======================
   GET /api/me
======================= */
export async function GET() {
  const cookieStore = await cookies(); // ✅ ต้อง await
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return NextResponse.json({}, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return NextResponse.json(user);
}

/* =======================
   PUT /api/me
======================= */
export async function PUT(req: Request) {
  const cookieStore = await cookies(); // ✅ ต้อง await
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return NextResponse.json({}, { status: 401 });
  }

  const { name } = await req.json();

  await db.user.update({
    where: { id: userId },
    data: { name },
  });

  return NextResponse.json({ success: true });
}
