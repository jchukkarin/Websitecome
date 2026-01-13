import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs'; // Use the promise-based fs

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as Blob | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    // Convert the file Blob to a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Define the destination path (save to public/uploads folder)
    const fileName = file.name;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadDir, fileName);

    // Ensure the uploads directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Write the file to the filesystem
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ success: true, name: fileName });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
};
