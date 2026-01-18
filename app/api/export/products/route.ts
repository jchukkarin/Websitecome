import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

/* ================= GET ================= */
export async function GET() {
  try {
    /* ===== AUTH ===== */
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    /* ===== QUERY ===== */
    const products = await db.product.findMany({
      include: {
        importStatus: true,
        payoutStatus: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    /* ===== TRANSFORM ===== */
    const rows = products.map((p) => ({
      "รหัสสินค้า": p.id,
      "ชื่อสินค้า": p.name,
      "สถานะนำเข้า": p.importStatus.name,
      "สถานะจ่ายเงิน": p.payoutStatus?.name ?? "-",
      "ขายแล้ว": p.isSold ? "ขายแล้ว" : "ยังไม่ขาย",
      "วันที่ขาย": p.soldAt
        ? p.soldAt.toLocaleDateString("th-TH")
        : "-",
      "วันที่สร้าง": p.createdAt.toLocaleDateString("th-TH"),
    }));

    /* ===== EXCEL ===== */
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    /* ===== RESPONSE ===== */
    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition":
          'attachment; filename="products.xlsx"',
      },
    });
  } catch (error) {
    console.error("EXPORT ERROR:", error);
    return NextResponse.json(
      { message: "Export failed" },
      { status: 500 }
    );
  }
}
