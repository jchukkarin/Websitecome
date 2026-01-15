import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { title, message } = await req.json()

  // หา user จาก session
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // 1️⃣ สร้าง notification และเก็บ result
  const notification = await prisma.notification.create({
    data: {
      userId: user.id,
      title,
      message,
      type: "SYSTEM",
    },
  })

  // 2️⃣ ส่ง email
  await sendEmail(
    user.email,
    title,
    `
      <h3>${title}</h3>
      <p>${message}</p>
      <hr />
      <small>หากไม่ใช่คุณ กรุณาติดต่อผู้ดูแลระบบ</small>
    `
  )

  // 3️⃣ อัปเดตสถานะการส่ง
  await prisma.notification.update({
    where: { id: notification.id },
    data: {
      isSent: true,
      sentAt: new Date(),
    },
  })

  return NextResponse.json({ success: true })
}
