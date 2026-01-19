import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

// ตรวจว่ารันบน Vercel หรือไม่
const isVercel = process.env.VERCEL === "1";

/**
 * saveImage
 * @param base64String string (data:image/xxx;base64,...)
 * @returns string (path หรือ base64 fallback)
 */
export async function saveImage(base64String: string): Promise<string> {
  // ถ้าไม่ใช่ base64 image ให้คืนค่าเดิม
  if (!base64String || !base64String.startsWith("data:image")) {
    return base64String;
  }

  // ⚠️ Vercel filesystem เขียนไม่ได้ → เก็บ base64 ไปเลย
  if (isVercel) {
    return base64String;
  }

  try {
    const matches = base64String.match(
      /^data:([A-Za-z-+/]+);base64,(.+)$/
    );

    if (!matches || matches.length !== 3) {
      throw new Error("Invalid base64 image format");
    }

    const mimeType = matches[1]; // image/png
    const base64Data = matches[2];

    const buffer = Buffer.from(base64Data, "base64");

    const extension = mimeType.split("/")[1].split("+")[0];
    const filename = `${crypto.randomUUID()}.${extension}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    // return path ที่ frontend เรียกได้
    return `/uploads/${filename}`;
  } catch (error) {
    console.error("saveImage error:", error);
    // fallback: เก็บ base64 เผื่อไม่พัง
    return base64String;
  }
}
