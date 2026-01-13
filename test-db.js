const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");

async function main() {
    console.log("Starting test...");
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    try {
        console.log("Attempting to find shop profile...");
        const profile = await prisma.shopProfile.findFirst({
            where: { id: "default" }
        });
        console.log("Profile found:", profile);

        if (!profile) {
            console.log("Creating shop profile...");
            const newProfile = await prisma.shopProfile.create({
                data: { id: "default" }
            });
            console.log("Profile created:", newProfile);
        }
    } catch (e) {
        console.error("ERROR:", e);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main();
