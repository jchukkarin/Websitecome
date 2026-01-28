import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';

// โหลดค่าจากไฟล์ .env
dotenv.config();

export default defineConfig({
    datasource: {
        // ใช้เครื่องหมาย ! เพื่อบอก TypeScript ว่าเรามั่นใจว่ามีค่านี้แน่นอน
        url: "postgresql://postgres.pghlwpcqyvpiyrvhiyyj:ARM-123-456@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres",
    },
});