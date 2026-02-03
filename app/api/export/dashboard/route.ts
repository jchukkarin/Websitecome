import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

// Status translation map
const statusTranslation: Record<string, string> = {
    "READY": "พร้อม",
    "READY_SALE": "พร้อมขาย",
    "RESERVED": "ติดจอง",
    "SOLD": "ขายแล้ว",
    "REPAIR": "ซ่อม",
    "RETURN_CUSTOMER": "ส่งคืนลูกค้า",
    "EXTENDED": "ขยายเวลา",
    "REPAIRING": "กำลังซ่อม",
    "REPAIRED": "ซ่อมเสร็จสิ้น",
    "NOT_REPAIR": "-",
    "COMPLETED": "สำเร็จ",
    "PENDING": "รอดำเนินการ",
    "REPAIR_DONE": "ซ่อมเสร็จสิ้น",
};

const typeTranslation: Record<string, string> = {
    "INCOME": "การนำเข้า",
    "CONSIGNMENT": "การฝากขาย",
    "REPAIR": "การฝากซ่อม",
    "PAWN": "การจำนำ",
};

/* ================= POST ================= */
export async function GET(req: NextRequest) {
    try {
        /* ===== AUTH ===== */
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = session.user as any;
        const isManager = user?.role === "MANAGER";

        /* ===== GET DATA ===== */
        let consignments = await db.consignment.findMany({
            include: {
                items: true,
                images: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // Filter for Employee (Limited view)
        if (user?.role === "EMPLOYEE") {
            consignments = consignments.filter(c => c.userId === user.id);
        }

        console.log(`📊 Generating Excel for ${consignments.length} consignments...`);

        /* ===== CREATE EXCEL WITH EXCELJS ===== */
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Dashboard", {
            properties: { defaultColWidth: 15 }
        });

        // Define columns
        worksheet.columns = [
            { header: "รหัสกำกับ", key: "id", width: 12 },
            { header: "ชื่อสินค้า", key: "productName", width: 30 },
            { header: "หมวดหมู่", key: "category", width: 15 },
            { header: "ปี", key: "year", width: 8 },
            { header: "วันที่บันทึก", key: "date", width: 15 },
            { header: "ล็อต", key: "lot", width: 10 },
            { header: "ประเภท", key: "type", width: 15 },
            { header: "สถานะสินค้า", key: "status", width: 15 },
            { header: "สถานะซ่อม", key: "repairStatus", width: 15 },
            { header: "สถานะการจอง", key: "reserveStatus", width: 15 },
            { header: "วันหมดจอง", key: "reserveEndDate", width: 15 },
            { header: "ราคาทุน", key: "confirmedPrice", width: 12 },
            { header: "ราคาขาย", key: "salesPrice", width: 12 },
            { header: "ช่องทางขาย", key: "salesChannel", width: 15 },
            { header: "ผู้บันทึก", key: "userName", width: 20 },
        ];

        // Style header row
        worksheet.getRow(1).font = { bold: true, size: 12 };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
        };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

        // Add data rows
        let rowCount = 0;
        consignments.forEach((c) => {
            c.items.forEach((item) => {
                const normalizedStatus = item.status?.toUpperCase() || "";
                const displayStatus = statusTranslation[normalizedStatus] || item.status;

                const normalizedRepairStatus = item.repairStatus?.toUpperCase() || "";
                const displayRepairStatus = item.repairStatus && item.repairStatus !== "NOT_REPAIR"
                    ? statusTranslation[normalizedRepairStatus] || item.repairStatus
                    : "-";

                const reserveStatus = item.isReserveOpen === "true" ? "ติดจอง" : "-";
                const reserveEndDate = item.reserveEndDate
                    ? new Date(item.reserveEndDate).toLocaleDateString("th-TH")
                    : "-";

                worksheet.addRow({
                    id: item.id.slice(0, 8),
                    productName: item.productName,
                    category: item.category,
                    year: item.year,
                    date: new Date(c.date).toLocaleDateString("th-TH", {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                    }),
                    lot: c.lot,
                    type: typeTranslation[c.type] || c.type,
                    status: displayStatus,
                    repairStatus: displayRepairStatus,
                    reserveStatus: reserveStatus,
                    reserveEndDate: reserveEndDate,
                    confirmedPrice: isManager || c.userId === user?.id ? item.confirmedPrice : "***",
                    salesPrice: item.salesPrice && item.salesPrice > 0 ? item.salesPrice : "-",
                    salesChannel: item.salesChannel || "-",
                    userName: c.user?.name || "-",
                });
                rowCount++;
            });
        });

        console.log(`✅ Added ${rowCount} rows to Excel`);

        /* ===== GENERATE BUFFER ===== */
        const buffer = await workbook.xlsx.writeBuffer();
        console.log(`✅ Excel file generated successfully (${buffer.byteLength} bytes)`);

        // 🔥 Convert to Uint8Array for better compatibility
        const uint8Array = new Uint8Array(buffer);

        /* ===== RESPONSE ===== */
        const filename = `dashboard_${new Date().toISOString().split('T')[0]}.xlsx`;

        // 🔥 Use native Response instead of NextResponse for file streaming
        return new Response(uint8Array, {
            status: 200,
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": `attachment; filename="${filename}"`,
                "Content-Length": uint8Array.length.toString(),
            },
        });
    } catch (error: any) {
        console.error("❌ EXPORT ERROR:", error);
        console.error("Error stack:", error.stack);
        return NextResponse.json(
            {
                success: false,
                message: "Export failed",
                error: error.message || String(error),
            },
            { status: 500 }
        );
    }
}
