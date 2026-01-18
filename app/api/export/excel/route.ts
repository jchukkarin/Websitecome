import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { db } from "@/lib/db";

export async function GET() {
  // 1. ดึงข้อมูลจาก DB
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
      category: true,
      quantity: true,
      sellPrice: true,
      status: true,
    },
  });

  // 2. สร้าง Workbook
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Products");

  // 3. สร้าง Header
  sheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "ชื่อสินค้า", key: "name", width: 30 },
    { header: "หมวดหมู่", key: "category", width: 20 },
    { header: "จำนวน", key: "quantity", width: 10 },
    { header: "ราคาขาย", key: "sellPrice", width: 15 },
    { header: "สถานะ", key: "status", width: 15 },
  ];

  // 4. ใส่ข้อมูล
  products.forEach((item) => {
    sheet.addRow(item);
  });

  // 5. แปลงเป็น Buffer
  const buffer = await workbook.xlsx.writeBuffer();

  // 6. ส่งไฟล์ให้ Browser
  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=products.xlsx",
    },
  });
}
