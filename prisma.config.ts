import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  // 👇 Prisma migrate dev ต้องการอันนี้
  datasource: {
    url: process.env.DATABASE_URL,
  },

  // 👇 โครงสร้างใหม่ (ใช้กับหลาย datasource)
  datasources: {
    db: {
      provider: "postgresql",
      url: process.env.DATABASE_URL,
    },
  },

  migrations: {
    path: "prisma/migrations",
  },
});
