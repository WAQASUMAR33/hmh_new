import { writeFile } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const data = await req.formData();
        const file = data.get('file');

        if (!file || typeof file === 'string') {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const MAX_SIZE_KB = 200;
        const sizeInKB = file.size / 1024;

        if (sizeInKB > MAX_SIZE_KB) {
            return NextResponse.json({ error: 'Image exceeds 200KB size limit.' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}-${file.name.replaceAll(' ', '-')}`;
        const uploadPath = path.join(process.cwd(), 'public', 'uploads');

        await writeFile(`${uploadPath}/${filename}`, buffer);

        return NextResponse.json({ url: `/uploads/${filename}` });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'File upload failed.' }, { status: 500 });
    }
}
