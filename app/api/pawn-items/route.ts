// app/api/pawn-items/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // active | due | extended | closed

    try {
        // Since we don't have a specific PawnItem model yet, we will mock the return based on ConsignmentItem but structured as requested.
        // In a real scenario, we would filter by:
        // where: { consignment: { status: { name: mappedName } } }

        // Mock data generator
        const mockItems = [
            { id: "P-001", productName: "Canon EOS R", customer: "นาย A", dueDate: "2026-01-10", balance: 15000, status: "due" },
            { id: "P-002", productName: "Sony A7III", customer: "นางสาว C", dueDate: "2026-02-15", balance: 18000, status: "active" },
            { id: "P-003", productName: "Nikon Z6", customer: "นาย D", dueDate: "2026-01-05", balance: 12000, status: "extended" },
            { id: "P-004", productName: "Fujifilm X-T4", customer: "นาง B", dueDate: "2026-01-12", balance: 8500, status: "due" },
            { id: "P-005", productName: "Leica Q2", customer: "คุณ E", dueDate: "2025-12-20", balance: 95000, status: "closed" },
        ];

        const filtered = mockItems.filter(item => item.status === status);

        // Sorting by dueDate
        filtered.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

        return NextResponse.json(filtered);

        /* Real Implementation Example references:
        const items = await db.consignment.findMany({
            where: {
                status: { name: status } // Map 'active' to 'ยังไม่ครบกำหนด' etc.
            },
            include: {
                items: true,
                user: true // or customer relation
            },
            orderBy: { date: 'asc' }
        });
        */
    } catch (error) {
        console.error("Pawn items fetch error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
