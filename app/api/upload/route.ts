import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No image file provided.' },
        { status: 400 }
      );
    }

    // 1. Strict MIME type check
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only JPG, PNG, and WEBP images are allowed.' },
        { status: 400 }
      );
    }

    // 2. Strict file size check (max 2MB)
    if (file.size > MAX_FILE_SIZE) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      return NextResponse.json(
        { success: false, error: `File size (${sizeMb} MB) exceeds the 2MB limit.` },
        { status: 400 }
      );
    }

    // 3. Ensure public/uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // 4. Read file into buffer
    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // 5. Compress and optimize image using sharp
    // - Resize to max 600px width/height while maintaining aspect ratio
    // - Convert to WebP format at 82% quality (shrinks 2MB to ~30-60KB with crisp photo clarity)
    const compressedBuffer = await sharp(inputBuffer)
      .rotate() // auto-orient based on EXIF orientation if taken with phone
      .resize({
        width: 600,
        height: 750,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 82, effort: 4 })
      .toBuffer();

    // 6. Generate unique, safe filename with .webp extension
    const uniqueId = crypto.randomBytes(6).toString('hex');
    const filename = `visa_photo_${Date.now()}_${uniqueId}.webp`;
    const filePath = path.join(uploadsDir, filename);

    // 7. Write compressed image to disk
    await fs.promises.writeFile(filePath, compressedBuffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      message: 'Image uploaded and compressed successfully',
      url: publicUrl,
      originalSize: file.size,
      compressedSize: compressedBuffer.length,
    });
  } catch (error: any) {
    console.error('File upload & compression error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process image: ' + error.message },
      { status: 500 }
    );
  }
}
