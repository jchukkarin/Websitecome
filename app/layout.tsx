import "./globals.css";
import { Kanit } from "next/font/google";

// 1. ตั้งค่า Font Kanit ให้รองรับทั้งภาษาไทยและอังกฤษ
const kanit = Kanit({ 
  subsets: ["thai", "latin"], 
  weight: ["300", "400", "500", "600", "700"], // เพิ่มน้ำหนัก font ที่จำเป็น
  variable: "--font-kanit", // ใช้เป็น CSS Variable ได้
});

// 2. ตั้งค่า Metadata สำหรับ SEO
export const metadata = {
  title: "นายตัวน้อย",
  description: "Dashboard และระบบของนายตัวน้อย",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={kanit.className}>
      <head />
      {/* 3. ใส่ antialiased เพื่อให้ตัวอักษรคมชัดขึ้นในทุกเบราว์เซอร์ */}
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}