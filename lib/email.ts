import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY || "re_123")

export async function sendEmail(
  to: string,
  subject: string,
  html: string
) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject,
    html,
  })
}

export function orderTemplate(message: string) {
  return `
    <div style="font-family:sans-serif">
      <h2>🔔 แจ้งเตือนจากระบบ</h2>
      <p>${message}</p>
      <hr/>
      <small>ขอบคุณที่ใช้บริการ</small>
    </div>
  `
}
