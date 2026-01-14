// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );

  // ลบ Cookie โดยการกำหนดให้หมดอายุทันที (เปลี่ยน 'token' เป็นชื่อคุกกี้ที่คุณใช้)
  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  return response;
}