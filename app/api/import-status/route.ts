// app/api/import-status/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Get global counts by status
    const allProducts = await db.product.findMany({
      select: { status: true, isSold: true }
    });

    const summary = {
      ready: allProducts.filter(p => (p.status === 'ready' || p.status === 'พร้อม') && !p.isSold).length,
      reserved: allProducts.filter(p => (p.status === 'reserved' || p.status === 'ติดจอง') && !p.isSold).length,
      repair: allProducts.filter(p => (p.status === 'repair' || p.status === 'ซ่อม') && !p.isSold).length,
      sold: allProducts.filter(p => p.status === 'sold' || p.status === 'ขายแล้ว' || p.isSold).length,
    };

    // Keep the categories link as well if needed
    const categories = await db.importStatus.findMany({
      include: {
        products: {
          select: { status: true, isSold: true }
        }
      },
      orderBy: { id: 'asc' }
    });

    const processedCategories = categories.map(s => ({
      id: s.id,
      name: s.name,
      count: s.products.length,
      details: {
        ready: s.products.filter(p => (p.status === 'ready' || p.status === 'พร้อม') && !p.isSold).length,
        reserved: s.products.filter(p => (p.status === 'reserved' || p.status === 'ติดจอง') && !p.isSold).length,
        repair: s.products.filter(p => (p.status === 'repair' || p.status === 'ซ่อม') && !p.isSold).length,
        sold: s.products.filter(p => p.status === 'sold' || p.status === 'ขายแล้ว' || p.isSold).length,
      }
    }));

    return NextResponse.json({
      summary,
      categories: processedCategories
    });
  } catch (error) {
    console.error("Fetch status error:", error);
    return NextResponse.json({ error: "โหลดข้อมูลล้มเหลว" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    if (!name) return NextResponse.json({ error: "กรุณาระบุชื่อสถานะ" }, { status: 400 });

    const newStatus = await db.importStatus.create({
      data: { name },
    });

    return NextResponse.json(newStatus);
  } catch (error) {
    console.error("Create import status error:", error);
    return NextResponse.json({ error: "สร้างสถานะไม่สำเร็จ" }, { status: 500 });
  }
}
