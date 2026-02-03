// app/api/import-status/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // We will aggregate data from ConsignmentItem
    // specifically for consignments of type 'INCOME' if we want Import Goods
    const items = await prisma.consignmentItem.findMany({
      include: {
        consignment: {
          select: { type: true }
        }
      }
    });

    // Filter to only include INCOME (Import) type items
    const importItems = items.filter(item => item.consignment.type === "INCOME");

    // Get unique categories
    const categoriesSet = new Set(importItems.map(item => item.category).filter(Boolean));
    const uniqueCategories = Array.from(categoriesSet);

    // Initial summary
    const summary = {
      ready: 0,
      reserved: 0,
      repair: 0,
      sold: 0
    };

    const processedCategories = uniqueCategories.map((catName, index) => {
      const catItems = importItems.filter(item => item.category === catName);

      const details = {
        ready: catItems.filter(item => item.status === "ready" || item.status === "พร้อม").length,
        reserved: catItems.filter(item => item.status === "reserved" || item.status === "ติดจอง").length,
        sold: catItems.filter(item => item.status === "sold" || item.status === "ขายแล้ว").length,
        repair: catItems.filter(item => item.status === "repair" || item.status === "ส่งซ่อม" || item.repairStatus === "REPAIRING").length
      };

      summary.ready += details.ready;
      summary.reserved += details.reserved;
      summary.sold += details.sold;
      summary.repair += details.repair;

      return {
        id: index + 1,
        name: catName,
        count: catItems.length,
        details
      };
    });

    return NextResponse.json({
      summary,
      categories: processedCategories
    });
  } catch (error) {
    console.error("Fetch status error:", error);
    return NextResponse.json({ error: "โหลดข้อมูลล้มเหลว" }, { status: 500 });
  }
}
