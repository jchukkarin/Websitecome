import { db } from "./lib/db";

async function checkData() {
    const products = await db.product.count();
    const categories = await db.importStatus.count();
    const statusCounts = await db.product.groupBy({
        by: ['status'],
        _count: { _all: true }
    });

    console.log("Products:", products);
    console.log("Categories:", categories);
    console.log("Status Counts:", JSON.stringify(statusCounts));
}

checkData().catch(console.error);
