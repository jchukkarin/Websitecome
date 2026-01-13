import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

const isVercel = process.env.VERCEL === "1";

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as Blob | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // IF ON VERCEL: Return Base64 Data URI
    if (isVercel) {
      const base64 = buffer.toString('base64');
      const mimeType = file.type || 'image/png';
      return NextResponse.json({
        success: true,
        name: (file as any).name || 'uploaded_image',
        url: `data:${mimeType};base64,${base64}`
      });
    }

    // IF ON LOCAL: Save to public/uploads
    const fileName = (file as any).name || `upload_${Date.now()}.png`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadDir, fileName);

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      name: fileName,
      url: `/uploads/${fileName}`
    });

  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
};
