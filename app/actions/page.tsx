// app/actions.ts (or inside page.tsx with 'use server')
'use server';
import { promises as fs } from 'fs';

export async function uploadFileAction(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) {
    return { success: false, message: 'No file provided' };
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  await fs.writeFile(`./public/uploads/${file.name}`, buffer);

  return { success: true, message: 'File uploaded via Server Action' };
}
