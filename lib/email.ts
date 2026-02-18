import { Resend } from "resend"

const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
  console.error("RESEND_API_KEY env missing");
}
const resend = new Resend(resendApiKey || "re_123");


export async function sendEmail(
  to: string,
  subject: string,
  html: string
) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM || "system@example.com",
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
