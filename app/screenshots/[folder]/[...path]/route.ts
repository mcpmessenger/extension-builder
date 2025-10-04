import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

export async function GET(
  request: NextRequest,
  { params }: { params: { folder: string; path: string[] } }
) {
  try {
    const { folder, path: imagePath } = params;
    const imageName = imagePath.join('/');
    
    // Check both local and Playwright directories
    const localPath = path.join(process.cwd(), 'public', 'screenshots', folder, imageName);
    const playwrightPath = path.join(process.cwd(), 'PlayWright', 'web', 'public', 'screenshots', folder, imageName);
    
    let filePath = localPath;
    
    // Prioritize Playwright directory if it exists
    if (fs.existsSync(playwrightPath)) {
      filePath = playwrightPath;
    } else if (!fs.existsSync(localPath)) {
      return new NextResponse('File not found', { status: 404 });
    }
    
    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(imageName).toLowerCase();
    
    let contentType = 'image/png';
    if (ext === '.jpg' || ext === '.jpeg') {
      contentType = 'image/jpeg';
    } else if (ext === '.gif') {
      contentType = 'image/gif';
    } else if (ext === '.webp') {
      contentType = 'image/webp';
    }
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // 1 year cache
      },
    });
  } catch (error) {
    console.error('Error serving screenshot:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

