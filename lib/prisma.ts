import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    console.error("DATABASE_URL env missing");
}

const pool = new Pool({
    connectionString: databaseUrl ?? "",
    ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);


export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter: adapter, // ใช้ adapter ที่เราสร้างจาก pg pool
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });

if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = prisma;
